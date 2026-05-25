import React, {FC, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {driverAPI} from "../../../../../Infrastructure/services/DriverServices/DriverService";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import TextArea from "../../../../../ui/Components/Textarea/TextArea";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import globalStyles from "../../../../../global.module.scss";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface DriverEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const DriverEditForm: FC<DriverEditFormProps> = ({modalName, selectedItemId, editItem}) => {

    const {t} = useTranslation();
    const {openModal, closeModal} = useModal();

    const {data: driver} = driverAPI.useFetchAllDriverQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {
        register,
        handleSubmit,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    const handlePut = async (data: any) => {
        if (!driver) return;

        const changedData: any = {
            id: selectedItemId
        };

        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        await editItem(changedData);
        closeModal(modalName);
    };

    useEffect(() => {
        if (driver && driver[0]) {
            reset({
                name: driver[0].name || '',
                codeRFID: driver[0].codeRFID ?? '',
                comment: driver[0].comment || ''
            });
        }
    }, [driver, reset]);

    return (
        <>
            {driver &&
                <>
                    <ModalForm modalName={modalName} title={'Редагувати водiя'}>
                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="name">{t('driver.name')}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{required: t('errors.required')}}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t('placeholders.enterDriverName')}
                                />
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="codeRFID">{t('driver.codeRFID')}</label>
                                <Input
                                    name="codeRFID"
                                    register={register}
                                    options={{required: t('errors.required'), valueAsNumber: true}}
                                    type="number"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t('placeholders.enterRFID')}
                                />
                                <CustomText isError={true}>
                                    {errors.codeRFID?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="comment">{t('driver.comment')}</label>
                                <TextArea
                                    name="comment"
                                    register={register}
                                    options={{required: false}}
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t('placeholders.enterComment')}
                                />
                                <CustomText isError={true}>
                                    {errors.comment?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className={globalStyles.form_buttons_container}>
                                <Button onClick={() => openModal('driverEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>
                    </ModalForm>

                    <SaveModal
                        nameModal={'driverEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default DriverEditForm;