import React, {FC, useEffect} from 'react';
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {useForm} from "react-hook-form";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {useTranslation} from "react-i18next";
import {customerAPI} from "../../../../../Infrastructure/services/OrderServices/CustomerService";
import {skipToken} from "@reduxjs/toolkit/query";
import {dispatcherAPI} from "../../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import Input from "../../../../../ui/Components/Input/Input";
import globalStyles from "../../../../../global.module.scss";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import TextArea from "../../../../../ui/Components/Textarea/TextArea";
import Button from "../../../../../ui/Components/Button/Button";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";

interface Props {
    modalName: string;
    selectedItemId: any;
    editItem: any
}

const DispatcherEditForm: FC<Props> = ({modalName, selectedItemId, editItem}) => {

    const {data: dispatcher} = dispatcherAPI.useFetchAllDispatcherQuery(selectedItemId ? {id: selectedItemId} : skipToken)


    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        control,
        reset
    } = useForm();

    const {closeModal, openModal} = useModal();
    const {t} = useTranslation();

    const handlePut = async (data: any) => {
        if (!dispatcher) return;

        const changedData: any = {
            id: selectedItemId // всегда добавляем id
        };

        // берём только изменённые поля
        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        await editItem(changedData);
        closeModal(modalName);
    };

    useEffect(() => {
        if (dispatcher && dispatcher[0]) {
            reset({
                name: dispatcher[0].name || '',
                code: dispatcher[0].code || '',
            });
        }
    }, [dispatcher, reset]);

    return (
        <>
            <>
                <ModalForm modalName={modalName} title = 'Редагувати диспетчера'>
                    <form onSubmit={handleSubmit(handlePut)}>
                        <div>
                            <label htmlFor="name">{t('dispatcher.name')}</label>
                            <Input
                                name="name"
                                register={register}
                                options={{required: false}}
                                type="search"
                                additionalStyles={globalStyles.input_width_full}
                                placeholder={t('placeholders.enterName')}
                            />
                            <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                        </div>

                        <div>
                            <label htmlFor="code">{t('dispatcher.code')}</label>
                            <Input
                                name="code"
                                register={register}
                                options={{required: false}}
                                type="number"
                                additionalStyles={globalStyles.input_width_full}
                                placeholder={t('placeholders.enterCode')}
                            />
                            <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
                        </div>

                        <div className={`${globalStyles.form_buttons_container}`}>
                            <Button onClick={() => openModal('confirmEditModal')}>
                                {t("modals.save")}
                            </Button>
                            <Button type="button" onClick={() => closeModal(modalName)}>
                                {t("modals.close")}
                            </Button>
                        </div>
                    </form>
                </ModalForm>

                <SaveModal
                    nameModal={'confirmEditModal'}
                    handleSubmit={handleSubmit((data) => handlePut(data))}
                    error={errors}
                />
            </>

        </>
    );
};

export default DispatcherEditForm;