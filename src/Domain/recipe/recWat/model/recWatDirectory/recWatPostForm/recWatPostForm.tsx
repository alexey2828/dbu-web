import React, {useEffect} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {recWatAPI} from "../../../../../../Infrastructure/services/RecipeServices/RecWatService";
import {useForm} from "react-hook-form";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const RecWatPostForm = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [putData, { isError, isSuccess }] = recWatAPI.usePostRecWatMutation();
    const { data: recWatData } = recWatAPI.useFetchAllRecWatQuery('');
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        const existingCode = recWatData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }

        await putData(data);
        closeModal(directoryModals.recWat);
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
            <ModalForm modalName={directoryModals.recWat} title={t('recWat.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('recWat.name')}</label>
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
                        <label htmlFor="code">{t('recWat.code')}</label>
                        <Input
                            name="code"
                            register={register}
                            options={{ required: t('errors.required') }}
                            type="search"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterCode')}
                        />
                    </div>
                    <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>

                    <div className="mt-5 gap-3 flex items-center justify-center">
                        <Button onClick={() => openModal(confirmModals.recWatCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button type="submit" onClick={() => closeModal(directoryModals.recWat)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.recWatCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default RecWatPostForm;
