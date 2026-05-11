import React, {useEffect} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import {useForm} from "react-hook-form";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {classRecipeAPI} from "../../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const MixturePostForm = () => {
    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {register, handleSubmit, setError, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = classRecipeAPI.usePostClassRecipeMutation();
    const {data: mixtureData} = classRecipeAPI.useFetchAllClassRecipeQuery('');
    const {openModal, closeModal} = useModal();

    useEffect(() => {
        if (isError) {
            notificationHandler({type: 'error', message: t('errors.general')});
        } else if (isSuccess) {
            notificationHandler({type: 'success', message: t('errors.success')});
        }
    }, [isError, isSuccess, t]);

    const handlePut = async (data: any) => {
        const existingCode = mixtureData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }
        await putData(data);
        closeModal(directoryModals.mixture);
    };

    return (
        <>
            <ModalForm modalName={directoryModals.mixture} title={t('mixture.title')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('mixture.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterMixtureName')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="code">{t('mixture.code')}</label>
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

                    <div>
                        <label htmlFor="shortName">{t('mixture.shortName')}</label>
                        <Input
                            name="shortName"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles="w-full"
                            placeholder={t('placeholders.enterShortName')}
                        />
                        <CustomText isError={true}>{errors.shortName?.message?.toString()}</CustomText>
                    </div>

                    <div className="flex gap-3 items-center justify-center mt-5">
                        <Button onClick={() => openModal(confirmModals.mixtureCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.mixture)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>
            <SaveModal
                nameModal={confirmModals.mixtureCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default MixturePostForm;
