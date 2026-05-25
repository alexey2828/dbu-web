import React, {FC, useEffect} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import {useForm} from "react-hook-form";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {classRecipeAPI} from "../../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface MixtureEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const MixtureEditForm: FC<MixtureEditFormProps> = ({modalName, selectedItemId, editItem}) => {

    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();

    const {data: mixture} = classRecipeAPI.useFetchAllClassRecipeQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {data: mixtureData} = classRecipeAPI.useFetchAllClassRecipeQuery('');

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    useEffect(() => {
        if (mixture && mixture[0]) {
            reset({
                name: mixture[0].name || '',
                code: mixture[0].code || '',
                shortName: mixture[0].shortName || ''
            });
        }
    }, [mixture, reset]);

    const handlePut = async (data: any) => {
        if (!mixture) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // проверка уникальности code только если он изменился
        if (dirtyFields.code) {
            const existingCode = mixtureData?.some(
                (item: any) =>
                    item.code === data.code &&
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
            {mixture &&
                <>
                    <ModalForm modalName={modalName} title={'Редагувати вид сумiшей'}>

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
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
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
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
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
                                <CustomText isError={true}>
                                    {errors.shortName?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className="flex gap-3 items-center justify-center mt-5">
                                <Button onClick={() => openModal('mixtureEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>

                    </ModalForm>

                    <SaveModal
                        nameModal={'mixtureEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default MixtureEditForm;