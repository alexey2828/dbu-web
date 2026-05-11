import React, {useEffect} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useForm} from "react-hook-form";
import {recFrostAPI} from "../../../../../../Infrastructure/services/RecipeServices/RecFrostService";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const RecFrostPostForm = () => {
    const {t} = useTranslation();
    const { notificationHandler } = useNotification();
    const {register, handleSubmit, setError, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = recFrostAPI.usePostRecFrostMutation();
    const {data: recFrostData} = recFrostAPI.useFetchAllRecFrostQuery('');
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        const existingCode = recFrostData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }

        await putData(data);
        closeModal(directoryModals.recFrost);
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
            <ModalForm modalName={directoryModals.recFrost} title={t('recFrost.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('recFrost.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterName')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="code">{t('recFrost.code')}</label>
                        <Input
                            name="code"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterCode')}
                        />
                        <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
                    </div>

                    <div className="flex items-center justify-center mt-5 gap-2">
                        <Button onClick={() => openModal(confirmModals.recFrostCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.recFrost)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.recFrostCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default RecFrostPostForm;
