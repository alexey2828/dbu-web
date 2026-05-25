import React, {FC, useEffect} from 'react';
import { useTranslation } from "react-i18next";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import { useForm } from "react-hook-form";
import { plantAPI } from "../../../../../Infrastructure/services/PlantServices/PlantService";
import TextArea from "../../../../../ui/Components/Textarea/TextArea";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import { useModal } from "../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../global.module.scss';
import { CustomText } from "../../../../../ui/Components/CustomText/CustomText";
import { skipToken } from "@reduxjs/toolkit/query";

interface PlantsEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const PlantsEditForm: FC<PlantsEditFormProps> = ({ modalName, selectedItemId, editItem }) => {

    const { t } = useTranslation();

    const { data: plant } = plantAPI.useFetchAllPlantsQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        reset,
        setError
    } = useForm();

    const { openModal, closeModal } = useModal();

    const { data: plantsData } = plantAPI.useFetchAllPlantsQuery('');

    const handlePut = async (data: any) => {
        if (!plant) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // проверка уникальности только если код изменился
        if (dirtyFields.codePlant) {
            const existingCode = plantsData?.some(
                (item: any) =>
                    item.codePlant === data.codePlant &&
                    item.id !== selectedItemId
            );

            if (existingCode) {
                setError('codePlant', {
                    type: 'manual',
                    message: t("errors.codeExists"),
                });
                return;
            }
        }

        await editItem(changedData);
        closeModal(modalName);
    };

    useEffect(() => {
        if (plant && plant[0]) {
            reset({
                codePlant: plant[0].codePlant || '',
                name: plant[0].name || '',
                comment: plant[0].comment || ''
            });
        }
    }, [plant, reset]);

    return (
        <>
            {plant &&
                <>
                    <ModalForm modalName={modalName} title={'Редагувати цех'}>
                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="codePlant">{t("plants.code")}</label>
                                <Input
                                    name="codePlant"
                                    register={register}
                                    options={{ required: t("errors.required") }}
                                    type="text"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t("placeholders.enterPlantCode")}
                                />
                                <CustomText isError={true}>
                                    {errors.codePlant?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="name">{t("plants.name")}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{ required: t("errors.required") }}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t("placeholders.enterPlantName")}
                                />
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="comment">{t("plants.comment")}</label>
                                <TextArea
                                    name="comment"
                                    register={register}
                                    options={{ required: false }}
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t("placeholders.enterComment")}
                                />
                                <CustomText isError={true}>
                                    {errors.comment?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className={globalStyles.form_buttons_container}>
                                <Button onClick={() => openModal('plantsEditConfirm')}>
                                    {t("modals.save")}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t("modals.close")}
                                </Button>
                            </div>

                        </form>
                    </ModalForm>

                    <SaveModal
                        nameModal={'plantsEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default PlantsEditForm;