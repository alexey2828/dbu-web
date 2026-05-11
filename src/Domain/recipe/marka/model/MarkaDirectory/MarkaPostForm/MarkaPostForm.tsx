import React, {useEffect} from 'react';
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useForm} from "react-hook-form";
import {markaAPI} from "../../../../../../Infrastructure/services/RecipeServices/MarkaService";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const MarkaPostForm = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { data: markaData } = markaAPI.useFetchAllMarkaQuery('');
    const [putData, { isError, isSuccess }] = markaAPI.usePostMarkaMutation();
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        const existingCode = markaData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }
        await putData(data);
        closeModal(directoryModals.marka);
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
            <ModalForm modalName={directoryModals.marka} title={t('marka.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('marka.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{ required: t('errors.required') }}
                            type="search"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterName')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="code">{t('marka.code')}</label>
                        <Input
                            name="code"
                            register={register}
                            options={{ required: t('errors.required') }}
                            type="search"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterCode')}
                        />
                        <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
                    </div>

                    <div className="flex gap-3 items-center justify-center mt-5">
                        <Button onClick={() => openModal(confirmModals.markaCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.marka)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.markaCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default MarkaPostForm;
