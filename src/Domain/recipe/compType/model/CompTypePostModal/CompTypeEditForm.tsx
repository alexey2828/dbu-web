import React, {FC, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {compTypeAPI} from "../../../../../Infrastructure/services/RecipeServices/CompTypeService";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface CompTypeEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const CompTypeEditForm: FC<CompTypeEditFormProps> = ({
                                                         modalName,
                                                         selectedItemId,
                                                         editItem
                                                     }) => {

    const {t} = useTranslation();
    const {openModal, closeModal} = useModal();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, dirtyFields}
    } = useForm();

    const {data: compType} = compTypeAPI.useFetchAllCompTypeQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    // 🔹 заполняем форму
    useEffect(() => {
        if (compType && compType[0]) {
            reset({
                name: compType[0].name || '',
                code: compType[0].code || ''
            });
        }
    }, [compType, reset]);

    const handlePut = async (data: any) => {
        if (!compType) return;

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
            {compType && (
                <>
                    <ModalForm modalName={modalName} title={t('compType.title')}>
                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label>{t('compType.name')}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{required: false}}
                                    type="search"
                                    additionalStyles="w-full"
                                />
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label>{t('compType.code')}</label>
                                <Input
                                    name="code"
                                    register={register}
                                    options={{required: false}}
                                    type="search"
                                    additionalStyles="w-full"
                                />
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className="gap-3 flex items-center justify-center mt-5">
                                <Button onClick={() => openModal('compTypeEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>
                    </ModalForm>

                    <SaveModal
                        nameModal={'compTypeEditConfirm'}
                        handleSubmit={handleSubmit(handlePut)}
                        error={errors}
                    />
                </>
            )}
        </>
    );
};

export default CompTypeEditForm;