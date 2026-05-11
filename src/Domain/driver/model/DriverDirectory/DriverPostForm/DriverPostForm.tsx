import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {driverAPI} from "../../../../../Infrastructure/services/DriverServices/DriverService";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import TextArea from "../../../../../ui/Components/Textarea/TextArea";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import globalStyles from "../../../../../global.module.scss";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const DriverPostForm = () => {
    const {t} = useTranslation();
    const { notificationHandler } = useNotification();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = driverAPI.usePostDriverMutation();
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        await putData(data);
        closeModal(directoryModals.driver);
    };

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t('errors.general') });
        } else if (isSuccess) {
            notificationHandler({ type: 'success', message: t('errors.success') });
        }
    }, [isError, isSuccess, t]);

    return (
        <>
            <ModalForm modalName={directoryModals.driver} title={t('driver.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('driver.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterDriverName')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="codeRFID">{t('driver.codeRFID')}</label>
                        <Input
                            name="codeRFID"
                            register={register}
                            options={{required: t('errors.required'), valueAsNumber: true}}
                            type="number"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterRFID')}
                        />
                        <CustomText isError={true}>{errors.codeRFID?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="comment">{t('driver.comment')}</label>
                        <TextArea
                            name="comment"
                            register={register}
                            options={{required: false}}
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterComment')}
                        />
                        <CustomText isError={true}>{errors.comment?.message?.toString()}</CustomText>
                    </div>

                    <div className={globalStyles.form_buttons_container}>
                        <Button onClick={() => openModal(confirmModals.driverCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.driver)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.driverCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default DriverPostForm;
