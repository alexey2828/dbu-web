import React, {FC, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {recCommentAPI} from "../../../../../../Infrastructure/services/RecipeServices/recCommentService";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface RecCommentEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const RecCommentEditForm: FC<RecCommentEditFormProps> = ({
                                                             modalName,
                                                             selectedItemId,
                                                             editItem
                                                         }) => {

    const {t} = useTranslation();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();

    const {data: recComment} = recCommentAPI.useFetchAllRecCommentQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {
        register,
        handleSubmit,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    useEffect(() => {
        if (recComment && recComment[0]) {
            reset({
                name: recComment[0].name || ''
            });
        }
    }, [recComment, reset]);

    const handlePut = async (data: any) => {
        if (!recComment) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        await editItem(changedData);
        closeModal(modalName);
    };

    return (
        <>
            {recComment &&
                <>
                    <ModalForm modalName={modalName} title={t('recComment.edit')}>

                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="name">{t('recComment.name')}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{required: t('errors.required')}}
                                    type="text"
                                    additionalStyles="w-full"
                                    placeholder={t('placeholders.enterName')}
                                />
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className="flex gap-3 items-center justify-center mt-5">
                                <Button onClick={() => openModal('recCommentEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>

                    </ModalForm>

                    <SaveModal
                        nameModal={'recCommentEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default RecCommentEditForm;
