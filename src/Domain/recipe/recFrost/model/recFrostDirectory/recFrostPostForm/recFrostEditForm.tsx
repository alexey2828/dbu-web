import React, {FC, useEffect} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useForm} from "react-hook-form";
import {recFrostAPI} from "../../../../../../Infrastructure/services/RecipeServices/RecFrostService";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface RecFrostEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const RecFrostEditForm: FC<RecFrostEditFormProps> = ({
                                                         modalName,
                                                         selectedItemId,
                                                         editItem
                                                     }) => {

    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();

    const {data: recFrost} = recFrostAPI.useFetchAllRecFrostQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {data: recFrostData} = recFrostAPI.useFetchAllRecFrostQuery('');

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    useEffect(() => {
        if (recFrost && recFrost[0]) {
            reset({
                name: recFrost[0].name || '',
                code: recFrost[0].code || ''
            });
        }
    }, [recFrost, reset]);

    const handlePut = async (data: any) => {
        if (!recFrost) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // проверка уникальности code только если изменён
        if (dirtyFields.code) {
            const existingCode = recFrostData?.some(
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
            {recFrost &&
                <>
                    <ModalForm modalName={modalName} title={'Редагувати морозостiйкiсть'}>

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
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
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
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className="flex items-center justify-center mt-5 gap-2">
                                <Button onClick={() => openModal('recFrostEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>

                    </ModalForm>

                    <SaveModal
                        nameModal={'recFrostEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default RecFrostEditForm;