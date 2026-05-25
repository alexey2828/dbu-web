import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {recMobilityAPI} from "../../../../../../Infrastructure/services/RecipeServices/recMobilityService";
import Button from '../../../../../../ui/Components/Button/Button';
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../../ui/Components/Input/Input";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const RecMobilityPostForm = () => {
    const {t} = useTranslation();
    const { notificationHandler } = useNotification();
    const {register, handleSubmit, setError, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = recMobilityAPI.usePostRecMobilityMutation();
    const {data: recMobilityData} = recMobilityAPI.useFetchAllRecMobilityQuery('');
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        const existingCode = recMobilityData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }

        await putData(data);
        closeModal(directoryModals.recMobility);
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
            <ModalForm modalName={directoryModals.recMobility} title={t('recMobility.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('recMobility.name')}</label>
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
                        <label htmlFor="code">{t('recMobility.code')}</label>
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

                    <div className="flex gap-3 items-center justify-center mt-5">
                        <Button onClick={() => openModal(confirmModals.recMobilityCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.recMobility)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.recMobilityCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default RecMobilityPostForm;
