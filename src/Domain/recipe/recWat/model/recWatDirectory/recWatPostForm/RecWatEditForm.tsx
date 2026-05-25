import React, {FC, useEffect} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {recWatAPI} from "../../../../../../Infrastructure/services/RecipeServices/RecWatService";
import {useForm} from "react-hook-form";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface RecWatEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const RecWatEditForm: FC<RecWatEditFormProps> = ({
                                                     modalName,
                                                     selectedItemId,
                                                     editItem
                                                 }) => {

    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();

    const {data: recWat} = recWatAPI.useFetchAllRecWatQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {data: recWatData} = recWatAPI.useFetchAllRecWatQuery('');

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    useEffect(() => {
        if (recWat && recWat[0]) {
            reset({
                name: recWat[0].name || '',
                code: recWat[0].code || ''
            });
        }
    }, [recWat, reset]);

    const handlePut = async (data: any) => {
        if (!recWat) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        // проверка уникальности code только если изменён
        if (dirtyFields.code) {
            const existingCode = recWatData?.some(
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
            {recWat &&
                <>
                    <ModalForm modalName={modalName} title={'Редагувати водонепроникнiсть'}>

                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="name">{t('recWat.name')}</label>
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
                                <label htmlFor="code">{t('recWat.code')}</label>
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
                                <Button onClick={() => openModal('recWatEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>

                    </ModalForm>

                    <SaveModal
                        nameModal={'recWatEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default RecWatEditForm;