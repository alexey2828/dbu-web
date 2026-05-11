import React, {useEffect, useState} from 'react';
import {compAPI} from '../../../../../../Infrastructure/services/RecipeServices/CompService';
import {useForm} from 'react-hook-form';
import Input from '../../../../../../ui/Components/Input/Input';
import Button from '../../../../../../ui/Components/Button/Button';
import Select from '../../../../../../ui/Components/Select/select';
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import ModalForm from '../../../../../../ui/Components/Modal/ModalForm';
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../../global.module.scss'
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {compTypeAPI} from "../../../../../../Infrastructure/services/RecipeServices/CompTypeService";


const CompPostModal = () => {

    const { t } = useTranslation();


    const filterOptions = [
        { id: 0, name: '', code: '' },
        { id: '1', name: t('compFilters.water'), code: '100' },
        { id: '2', name: t('compFilters.chemicals'), code: '200' },
        { id: '3', name: t('compFilters.aggregate'), code: '300' },
        { id: '4', name: t('compFilters.cement'), code: '400' },
    ];

    const {notificationHandler} = useNotification();

    const {register, handleSubmit, setValue, setError, formState: {errors}} = useForm();
    const {data: compData} = compAPI.useFetchAllCompQuery('');
    const {data: compTypeData} = compTypeAPI.useFetchAllCompTypeQuery('');
    const [putData, {isError, isSuccess}] = compAPI.usePostCompMutation();
    const [selectedFilter, setSelectedFilter] = useState<string>('');
    const {openModal, closeModal} = useModal();

    useEffect(() => {
        if (isError) {
            notificationHandler({type: 'error', message: t('errors.general')});
        } else if (isSuccess) {
            notificationHandler({type: 'success', message: t('errors.success')});
        }
    }, [isError, isSuccess, t]);

    useEffect(() => {
        setValue('code', selectedFilter);
    }, [selectedFilter, setValue]);

    const handlePut = async (data: any) => {
        const existingCode = compData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t('errors.codeExists'),
            });
            return true;
        }
        await putData(data);
        closeModal(directoryModals.comp);
    };

    const handleOnChange = (e: any) => {
        setSelectedFilter(e.target.value);
    };

    return (
        <>
            <ModalForm modalName={directoryModals.comp} title={t('comp.title')}>
                <label htmlFor="">{t('comp.componentTypes')}</label>
                <Select
                    selectOptions={compTypeData}
                    name="filters"
                    getOptionLabel={(filter) => filter.name}
                    getOptionValue={(filter) => filter.code}
                    additionalStyles="mb-5"
                    handleOnChange={handleOnChange}
                />
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('comp.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterName')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="code">{t('comp.code')}</label>
                        <Input
                            name="code"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterCode')}
                        />
                        <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="typeCode">{t('comp.typeCode')}</label>
                        <Input
                            name="typeCode"
                            register={register}
                            options={{required: t('errors.required'), valueAsNumber: true}}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('placeholders.enterTypeCode')}
                        />
                        <CustomText isError={true}>{errors.typeCode?.message?.toString()}</CustomText>
                    </div>

                    <div className={globalStyles.form_buttons_container}>
                        <Button onClick={() => openModal(confirmModals.compCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.comp)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>
            <SaveModal
                nameModal={confirmModals.compCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default CompPostModal;
