import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import { useForm } from "react-hook-form";
import { plantAPI } from "../../../../../Infrastructure/services/PlantServices/PlantService";
import TextArea from "../../../../../ui/Components/Textarea/TextArea";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import { confirmModals, directoryModals } from "../../../../../Infrastructure/const/modalNames";
import { useNotification } from "../../../../../Infrastructure/hooks/useNotification";
import { useModal } from "../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../global.module.scss';
import { CustomText } from "../../../../../ui/Components/CustomText/CustomText";

const PlantsPostForm = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [putData, { isError, isSuccess }] = plantAPI.usePostPlantMutation();
    const { data: plantsData } = plantAPI.useFetchAllPlantsQuery('');
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t("errors.general") });
        } else if (isSuccess) {
            notificationHandler({ type: 'success', message: t("errors.success") });
        }
    }, [isError, isSuccess, t]);

    const handlePut = async (data: any) => {
        const existingCode = plantsData?.some((item: any) => item.codePlant === data.codePlant);
        if (existingCode) {
            setError('codePlant', {
                type: 'manual',
                message: t("errors.codeExists"),
            });
            return true;
        }
        await putData(data);
        closeModal(directoryModals.plants);
    };

    return (
        <>
            <ModalForm modalName={directoryModals.plants} title={t("plants.create")}>
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
                        <CustomText isError={true}>{errors.codePlant?.message?.toString()}</CustomText>
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
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
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
                        <CustomText isError={true}>{errors.comment?.message?.toString()}</CustomText>
                    </div>

                    <div className={globalStyles.form_buttons_container}>
                        <Button onClick={() => openModal(confirmModals.plantsCreateConfirm)}>
                            {t("modals.save")}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.plants)}>
                            {t("modals.close")}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.plantsCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default PlantsPostForm;
