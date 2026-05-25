import React, {FC, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {recMobilityAPI} from "../../../../../../Infrastructure/services/RecipeServices/recMobilityService";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface RecMobilityEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const RecMobilityEditForm: FC<RecMobilityEditFormProps> = ({
                                                               modalName,
                                                               selectedItemId,
                                                               editItem
                                                           }) => {

    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();

    const {data: recMobility} = recMobilityAPI.useFetchAllRecMobilityQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {data: recMobilityData} = recMobilityAPI.useFetchAllRecMobilityQuery('');

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    useEffect(() => {
        if (recMobility && recMobility[0]) {
            reset({
                name: recMobility[0].name || '',
                code: recMobility[0].code || ''
            });
        }
    }, [recMobility, reset]);

    const handlePut = async (data: any) => {
        if (!recMobility) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // уникальность code только если изменён
        if (dirtyFields.code) {
            const existingCode = recMobilityData?.some(
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
            {recMobility &&
                <>
                    <ModalForm modalName={modalName} title={'Редагувати пластичнiсть'}>

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
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
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
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className="flex gap-3 items-center justify-center mt-5">
                                <Button onClick={() => openModal('recMobilityEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>

                    </ModalForm>

                    <SaveModal
                        nameModal={'recMobilityEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default RecMobilityEditForm;