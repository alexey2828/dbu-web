import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {recCommentAPI} from "../../../../../../Infrastructure/services/RecipeServices/recCommentService";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const RecCommentPostForm = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [putData, { isError, isSuccess }] = recCommentAPI.usePostRecCommentMutation();
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        await putData(data);
        closeModal(directoryModals.recComment);
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
            <ModalForm modalName={directoryModals.recComment} title={t('recComment.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('recComment.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{ required: t('errors.required') }}
                            type="text"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterName')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div className="col-span-2 gap-3 flex items-center justify-center mt-5">
                        <Button onClick={() => openModal(confirmModals.recCommentCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.recComment)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.recCommentCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default RecCommentPostForm;
