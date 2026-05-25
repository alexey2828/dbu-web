import React, {FC, useEffect} from 'react';
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { skipToken } from "@reduxjs/toolkit/query";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {silCemAPI} from "../../../../../../Infrastructure/services/PlantServices/SilCem";
import {bsuAPI} from "../../../../../../Infrastructure/services/PlantServices/BsuService";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import Select from "../../../../../../ui/Components/Select/select";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import Input from "../../../../../../ui/Components/Input/Input";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import Button from "../../../../../../ui/Components/Button/Button";

interface SilCemEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const SilCemEditForm: FC<SilCemEditFormProps> = ({ modalName, selectedItemId, editItem }) => {

    const { t } = useTranslation();
    const { openModal, closeModal } = useModal();

    const { data: silCem } = silCemAPI.useFetchAllSilCemQuery(
        selectedItemId ? {id: selectedItemId} : skipToken
    );

    const { data: silCemData } = silCemAPI.useFetchAllSilCemQuery('');
    const { data: bsu } = bsuAPI.useFetchAllBsuQuery('');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, dirtyFields },
        reset
    } = useForm();

    const handlePut = async (data: any) => {
        if (!silCem) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // проверяем уникальность ТОЛЬКО если code изменился
        if (dirtyFields.code) {
            const existingCode = silCemData?.some(
                (item: any) =>
                    item.code === data.code &&
                    item.id !== selectedItemId
            );

            if (existingCode) {
                setError('code', {
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
        if (silCem && silCem[0]) {
            reset({
                codeBSU: silCem[0].codeBSU || '',
                code: silCem[0].code || '',
                batcher: silCem[0].batcher || '',
                capacity: silCem[0].capacity ?? ''
            });
        }
    }, [silCem, reset]);

    return (
        <>
            {silCem && bsu && (
                <>
                    <ModalForm modalName={modalName} title={t("silCem.title")}>
                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="codeBSU">{t("silCem.idBSU")}</label>
                                <Select
                                    selectOptions={bsu}
                                    getOptionLabel={(bsu: any) => bsu.name}
                                    getOptionValue={(bsu) => bsu.code}
                                    register={register}
                                    options={{ required: t("errors.required"), valueAsNumber: true }}
                                    name="codeBSU"
                                    additionalStyles={'w-full'}
                                />
                                <CustomText isError={true}>
                                    {errors.codeBSU?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="code">{t("silCem.code")}</label>
                                <Input
                                    name="code"
                                    register={register}
                                    options={{ required: t("errors.required"), valueAsNumber: true }}
                                    type="search"
                                    additionalStyles={'w-full'}
                                    placeholder={t("placeholders.enterCode")}
                                />
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="batcher">{t("silCem.batcher")}</label>
                                <Input
                                    name="batcher"
                                    register={register}
                                    options={{ required: t("errors.required"), valueAsNumber: true }}
                                    type="search"
                                    additionalStyles={'w-full'}
                                    placeholder={t("placeholders.enterBatcher")}
                                />
                                <CustomText isError={true}>
                                    {errors.batcher?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="capacity">{t("silCem.capacity")}</label>
                                <Input
                                    name="capacity"
                                    register={register}
                                    options={{ required: false, valueAsNumber: true }}
                                    type="number"
                                    additionalStyles={'w-full'}
                                    placeholder={t("placeholders.enterCapacity")}
                                />
                                <CustomText isError={true}>
                                    {errors.capacity?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className={'gap-3 flex justify-center items-center mt-5'}>
                                <Button onClick={() => openModal('silCemEditConfirm')}>
                                    {t("modals.save")}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t("modals.close")}
                                </Button>
                            </div>

                        </form>
                    </ModalForm>

                    <SaveModal
                        nameModal={'silCemEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            )}
        </>
    );
};

export default SilCemEditForm;