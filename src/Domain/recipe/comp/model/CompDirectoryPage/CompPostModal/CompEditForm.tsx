import React, {FC, useEffect, useState} from 'react';
import {compAPI} from '../../../../../../Infrastructure/services/RecipeServices/CompService';
import {useForm} from 'react-hook-form';
import Input from '../../../../../../ui/Components/Input/Input';
import Button from '../../../../../../ui/Components/Button/Button';
import Select from '../../../../../../ui/Components/Select/select';
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import ModalForm from '../../../../../../ui/Components/Modal/ModalForm';
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../../global.module.scss'
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {compTypeAPI} from "../../../../../../Infrastructure/services/RecipeServices/CompTypeService";
import {skipToken} from "@reduxjs/toolkit/query";

interface CompEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const CompEditForm: FC<CompEditFormProps> = ({modalName, selectedItemId, editItem}) => {

    const {t} = useTranslation();
    const {openModal, closeModal} = useModal();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, dirtyFields}
    } = useForm();

    const {data: comp} = compAPI.useFetchAllCompQuery(
        selectedItemId ? {id: selectedItemId} : skipToken
    );

    const {data: compTypeData} = compTypeAPI.useFetchAllCompTypeQuery('');

    const [selectedFilter, setSelectedFilter] = useState<string>('');

    // 🔹 заполняем форму
    useEffect(() => {
        if (comp && comp[0]) {
            reset({
                name: comp[0].name || '',
                code: comp[0].code || '',
                typeCode: comp[0].typeCode || ''
            });

            setSelectedFilter(comp[0].code || '');
        }
    }, [comp, reset]);

    // 🔹 синхронизация select → code
    useEffect(() => {
        setValue('code', selectedFilter);
    }, [selectedFilter, setValue]);

    const handleOnChange = (e: any) => {
        setSelectedFilter(e.target.value);
    };

    const handlePut = async (data: any) => {
        if (!comp) return;

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
            {comp && (
                <>
                    <ModalForm modalName={modalName} title={t('comp.edit')}>

                        <label>{t('comp.componentTypes')}</label>
                        <Select
                            selectOptions={compTypeData}
                            name="filters"
                            getOptionLabel={(item) => item.name}
                            getOptionValue={(item) => item.code}
                            additionalStyles="mb-5"
                            handleOnChange={handleOnChange}
                        />

                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label>{t('comp.name')}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{required: false}}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                />
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label>{t('comp.code')}</label>
                                <Input
                                    name="code"
                                    register={register}
                                    options={{required: false}}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                />
                                <CustomText isError={true}>
                                    {errors.code?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label>{t('comp.typeCode')}</label>
                                <Input
                                    name="typeCode"
                                    register={register}
                                    options={{required: false, valueAsNumber: true}}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                />
                                <CustomText isError={true}>
                                    {errors.typeCode?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className={globalStyles.form_buttons_container}>
                                <Button onClick={() => openModal('compEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>
                    </ModalForm>

                    <SaveModal
                        nameModal={'compEditConfirm'}
                        handleSubmit={handleSubmit(handlePut)}
                        error={errors}
                    />
                </>
            )}
        </>
    );
};

export default CompEditForm;