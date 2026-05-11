import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Button from "../../../../../../ui/Components/Button/Button";
import { bsuAPI } from "../../../../../../Infrastructure/services/PlantServices/BsuService";
import { useForm } from "react-hook-form";
import Input from "../../../../../../ui/Components/Input/Input";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import { plantAPI } from "../../../../../../Infrastructure/services/PlantServices/PlantService";
import { confirmModals, directoryModals } from "../../../../../../Infrastructure/const/modalNames";
import Select from "../../../../../../ui/Components/Select/select";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import { useNotification } from "../../../../../../Infrastructure/hooks/useNotification";
import { useModal } from "../../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../../global.module.scss';
import { CustomText } from "../../../../../../ui/Components/CustomText/CustomText";

const status = [
    { status: "bsu.status.active", code: 1 },
    { status: "bsu.status.inactive", code: 0 }
];

const BsuPostModal = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [putData, { isError, isSuccess }] = bsuAPI.usePostBsuMutation();
    const { data: plants } = plantAPI.useFetchAllPlantsQuery('');
    const { openModal, closeModal } = useModal();



    const handlePut = async (data: any) => {
        await putData(data);
        closeModal(directoryModals.bsu);
    };

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t("errors.general") });
        } else if (isSuccess) {
            notificationHandler({ type: 'success', message: t("errors.success") });
        }
    }, [isError, isSuccess, t]);

    return (
        <>
            <ModalForm modalName={directoryModals.bsu} title={t("bsu.create")} width={'w-[500px]'}>
                {plants && (
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
                            <CustomText isError={true}>{errors.codePlant?.message?.toString()}</CustomText>
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
                            <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
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
                            <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
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
                            <CustomText isError={true}>{errors.vMixer?.message?.toString()}</CustomText>
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
                            <Button onClick={() => openModal(confirmModals.bsuCreateConfirm)}>
                                {t("modals.save")}
                            </Button>
                            <Button onClick={() => closeModal(directoryModals.bsu)}>
                                {t("modals.close")}
                            </Button>
                        </div>
                    </form>
                )}
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.bsuCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default BsuPostModal;
