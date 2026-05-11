import React, {FC, useEffect} from 'react';
import {useForm} from "react-hook-form";
import Button from "../../../../../ui/Components/Button/Button";
import Input from "../../../../../ui/Components/Input/Input";
import {carAPI} from "../../../../../Infrastructure/services/CarServices/CarService";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../global.module.scss';
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {skipToken} from "@reduxjs/toolkit/query";

interface CarEditFormProps {
    modalName: string;
    selectedItemId: any;
    editItem: any;
}

const CarEditForm: FC<CarEditFormProps> = ({modalName, selectedItemId, editItem}) => {

    const {t} = useTranslation();
    const {openModal, closeModal} = useModal();

    const {data: car} = carAPI.useFetchAllCarQuery(
        selectedItemId ? selectedItemId : skipToken
    );

    const {
        register,
        handleSubmit,
        formState: {errors, dirtyFields},
        reset
    } = useForm();

    const handlePut = async (data: any) => {
        if (!car) return;

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
        if (car && car[0]) {
            reset({
                name: car[0].name || '',
                codeRFID: car[0].codeRFID ?? '',
                maxV: car[0].maxV ?? ''
            });
        }
    }, [car, reset]);

    return (
        <>
            {car &&
                <>
                    <ModalForm modalName={modalName} title={t('car.edit')}>
                        <form onSubmit={handleSubmit(handlePut)}>

                            <div>
                                <label htmlFor="name">{t('car.name')}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{required: t('errors.required')}}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t('placeholders.enterCarNumber')}
                                />
                                <CustomText isError={true}>
                                    {errors.name?.message?.toString()}
                                </CustomText>
                            </div>

                            <div>
                                <label htmlFor="codeRFID">{t('car.codeRFID')}</label>
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
                                <label htmlFor="maxV">{t('car.maxVolume')}</label>
                                <Input
                                    name="maxV"
                                    register={register}
                                    options={{required: t('errors.required'), valueAsNumber: true}}
                                    type="number"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t('placeholders.enterMaxVolume')}
                                />
                                <CustomText isError={true}>
                                    {errors.maxV?.message?.toString()}
                                </CustomText>
                            </div>

                            <div className={globalStyles.form_buttons_container}>
                                <Button onClick={() => openModal('carEditConfirm')}>
                                    {t('modals.save')}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t('modals.close')}
                                </Button>
                            </div>

                        </form>
                    </ModalForm>

                    <SaveModal
                        nameModal={'carEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>
            }
        </>
    );
};

export default CarEditForm;