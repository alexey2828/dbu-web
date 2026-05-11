import React, {useEffect} from 'react';
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import {useForm} from "react-hook-form";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {compTypeAPI} from "../../../../../Infrastructure/services/RecipeServices/CompTypeService";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const CompTypePostModal = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { data: compTypeData } = compTypeAPI.useFetchAllCompTypeQuery('');
    const [putData, { isError, isSuccess }] = compTypeAPI.usePostCompTypeMutation();
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t('errors.general') });
        } else if (isSuccess) {
            notificationHandler({ type: 'success', message: t('errors.success') });
        }
    }, [isError, isSuccess, t]);

    const handlePut = async (data: any) => {
        const existingCode = compTypeData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }
        await putData(data);
        closeModal(directoryModals.compType);
    };

    return (
        <>
            <ModalForm modalName={directoryModals.compType} title={t('compType.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('compType.name')}</label>
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
                        <label htmlFor="code">{t('compType.code')}</label>
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

                    <div className="gap-3 flex items-center justify-center mt-5">
                        <Button onClick={() => openModal(confirmModals.compTypeCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.compType)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.compTypeCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default CompTypePostModal;
