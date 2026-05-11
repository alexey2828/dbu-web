import React, {FC, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {recStrengthAPI} from "../../../../../../Infrastructure/services/RecipeServices/RecStrengthService";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from '../../../../../../ui/Components/CustomText/CustomText';
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface RecStrengthEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const RecStrengthEditForm: FC<RecStrengthEditFormProps> = ({
                                                               modalName,
                                                               selectedItemId,
                                                               editItem
                                                           }) => {

    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();

    const {data: recStrength} = recStrengthAPI.useFetchAllRecStrengthQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {data: recStrengthData} = recStrengthAPI.useFetchAllRecStrengthQuery('');

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    useEffect(() => {
        if (recStrength && recStrength[0]) {
            reset({
                name: recStrength[0].name || '',
                code: recStrength[0].code || ''
            });
        }
    }, [recStrength, reset]);

    const handlePut = async (data: any) => {
        if (!recStrength) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // уникальность code только если изменён
        if (dirtyFields.code) {
            const existingCode = recStrengthData?.some(
                (item: any) =>
                    item.id !== selectedItemId
            );

            if (existingCode) {
                setError('code', {
                    type: 'manual',
                    message: t('errors.codeExists'),
                });
                return;
            }
        }

        await editItem(changedData);
        closeModal(modalName);
    };

    return (
        <>
            {recStrength &&
                <>
                    <ModalForm modalName={modalName} title={t('recStrength.edit')}>

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
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
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
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className="mt-5 gap-3 flex items-center justify-center">
                                <Button onClick={() => openModal('recStrengthEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>

                    </ModalForm>

                    <SaveModal
                        nameModal={'recStrengthEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default RecStrengthEditForm;