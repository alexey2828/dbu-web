import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {dispatcherAPI} from "../../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import globalStyles from '../../../../../global.module.scss';
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const DispatcherPostForm = () => {
    const {t} = useTranslation();
    const { notificationHandler } = useNotification();
    const {register, handleSubmit, setError, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = dispatcherAPI.usePostDispatcherMutation();
    const {data: dispatcherData} = dispatcherAPI.useFetchAllDispatcherQuery('');
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t('errors.general') });
        } else if (isSuccess ) {
            notificationHandler({ type: 'success', message: t('errors.success') });
        }
    }, [isError, isSuccess, t]);

    const handlePut = async (data: any) => {
        const existingCode = dispatcherData && dispatcherData.length > 0 && dispatcherData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }

        await putData(data);
        closeModal(directoryModals.dispatcher);
    };

    return (
        <>
            <ModalForm modalName={directoryModals.dispatcher} title={t('dispatcher.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('dispatcher.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterName')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="code">{t('dispatcher.code')}</label>
                        <Input
                            name="code"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="number"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterCode')}
                        />
                        <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
                    </div>

                    <div className={globalStyles.form_buttons_container}>
                        <Button onClick={() => {openModal(confirmModals.dispatcherCreateConfirm)}}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.dispatcher)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>
            <SaveModal
                nameModal={confirmModals.dispatcherCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default DispatcherPostForm;
