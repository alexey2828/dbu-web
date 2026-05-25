import React, {FC, useEffect} from 'react';
import { useTranslation } from "react-i18next";
import Button from "../../../../../../ui/Components/Button/Button";
import { bsuAPI } from "../../../../../../Infrastructure/services/PlantServices/BsuService";
import { useForm } from "react-hook-form";
import Input from "../../../../../../ui/Components/Input/Input";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import { plantAPI } from "../../../../../../Infrastructure/services/PlantServices/PlantService";
import Select from "../../../../../../ui/Components/Select/select";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import { useModal } from "../../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../../global.module.scss';
import { CustomText } from "../../../../../../ui/Components/CustomText/CustomText";
import { skipToken } from "@reduxjs/toolkit/query";

const status = [
    { status: "bsu.status.active", code: 1 },
    { status: "bsu.status.inactive", code: 0 }
];

interface BsuEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const BsuEditForm: FC<BsuEditFormProps> = ({ modalName, selectedItemId, editItem }) => {

    const { t } = useTranslation();
    const { openModal, closeModal } = useModal();

    const { data: bsu } = bsuAPI.useFetchAllBsuQuery(
        selectedItemId ? {id: selectedItemId} : skipToken
    );

    const { data: plants } = plantAPI.useFetchAllPlantsQuery('');

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        reset
    } = useForm();

    const handlePut = async (data: any) => {
        if (!bsu) return;

        const changedData: any = {
            id: selectedItemId,
            isWork: bsu[0].isWork ?? 1
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        await editItem(changedData);
        closeModal(modalName);
    };

    useEffect(() => {
        if (bsu && bsu[0]) {
            reset({
                codePlant: bsu[0].codePlant || '',
                name: bsu[0].name || '',
                code: bsu[0].code || '',
                vMixer: bsu[0].vMIxer || '',
                isWork: bsu[0].isWork ?? 1
            });
        }
    }, [bsu, reset]);

    return (
        <>
            {bsu && plants && (
                <>
                    <ModalForm modalName={modalName} title={'Редагувати БЗВ'} width={'w-[500px]'}>
                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="codePlant">{t("bsu.idPlant")}</label>
                                <Select
                                    selectOptions={plants}
                                    getOptionLabel={(plants) => plants.name}
                                    getOptionValue={(plants) => plants.codePlant}
                                    register={register}
                                    options={{ required: t("errors.required") }}
                                    name="codePlant"
                                    additionalStyles={globalStyles.input_width_full}
                                />
                                <CustomText isError={true}>
                                    {errors.codePlant?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="name">{t("bsu.name")}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{ required: t("errors.required") }}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t("placeholders.enterBsuName")}
                                />
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="code">{t("bsu.code")}</label>
                                <Input
                                    name="code"
                                    register={register}
                                    options={{ required: t("errors.required"), valueAsNumber: true }}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t("placeholders.enterBsuCode")}
                                />
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="vMixer">{t("bsu.vMixer")}</label>
                                <Input
                                    name="vMixer"
                                    register={register}
                                    options={{ required: t("errors.required"), valueAsNumber: true }}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t("placeholders.enterMixerVolume")}
                                />
                                <CustomText isError={true}>
                                    {errors.vMixer?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="isWork">{t("bsu.isWork")}</label>
                                <Select
                                    selectOptions={status}
                                    getOptionLabel={(status) => t(status.status)}
                                    getOptionValue={(status) => status.code}
                                    register={register}
                                    options={{ required: t("errors.required"), valueAsNumber: true }}
                                    name="isWork"
                                    additionalStyles={globalStyles.input_width_full}
                                />
                            </div>

                            <div className={globalStyles.form_buttons_container}>
                                <Button onClick={() => openModal('bsuEditConfirm')}>
                                    {t("modals.save")}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t("modals.close")}
                                </Button>
                            </div>

                        </form>
                    </ModalForm>

                    <SaveModal
                        nameModal={'bsuEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            )}
        </>
    );
};

export default BsuEditForm;