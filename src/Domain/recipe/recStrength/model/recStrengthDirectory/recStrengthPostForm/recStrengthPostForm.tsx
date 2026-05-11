import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {recStrengthAPI} from "../../../../../../Infrastructure/services/RecipeServices/RecStrengthService";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import { CustomText } from '../../../../../../ui/Components/CustomText/CustomText';
import {useTranslation} from "react-i18next";

const RecStrengthPostForm = () => {
    const {t} = useTranslation();
    const { notificationHandler } = useNotification();
    const {register, handleSubmit, setError, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = recStrengthAPI.usePostRecStrengthMutation();
    const {data: recStrengthData} = recStrengthAPI.useFetchAllRecStrengthQuery('');
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t('errors.general') });
        } else if (isSuccess) {
            notificationHandler({ type: 'success', message: t('errors.success') });
        }
    }, [isError, isSuccess, t]);

    const handlePut = async (data: any) => {
        const existingCode = recStrengthData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }
        await putData(data);
        closeModal(directoryModals.recStrength);
    };

    return (
        <>
            <ModalForm modalName={directoryModals.recStrength} title={t('recStrength.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('recStrength.name')}</label>
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
                        <label htmlFor="code">{t('recStrength.code')}</label>
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

                    <div className="mt-5 gap-3 flex items-center justify-center">
                        <Button onClick={() => openModal(confirmModals.recStrengthCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.recStrength)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.recStrengthCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default RecStrengthPostForm;
