import React, {FC, useEffect} from 'react';
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useForm} from "react-hook-form";
import {markaAPI} from "../../../../../../Infrastructure/services/RecipeServices/MarkaService";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface MarkaEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const MarkaEditForm: FC<MarkaEditFormProps> = ({
                                                   modalName,
                                                   selectedItemId,
                                                   editItem
                                               }) => {

    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();

    const {data: marka} = markaAPI.useFetchAllMarkaQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {data: markaData} = markaAPI.useFetchAllMarkaQuery('');

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    useEffect(() => {
        if (marka && marka[0]) {
            reset({
                name: marka[0].name || '',
                code: marka[0].code || ''
            });
        }
    }, [marka, reset]);

    const handlePut = async (data: any) => {
        if (!marka) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // уникальность code только если изменён
        if (dirtyFields.code) {
            const existingCode = markaData?.some(
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
            {marka &&
                <>
                    <ModalForm modalName={modalName} title={'Редагувати марку'}>

                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="name">{t('marka.name')}</label>
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
                                <label htmlFor="code">{t('marka.code')}</label>
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

                            <div className="flex gap-3 items-center justify-center mt-5">
                                <Button onClick={() => openModal('markaEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>

                    </ModalForm>

                    <SaveModal
                        nameModal={'markaEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default MarkaEditForm;