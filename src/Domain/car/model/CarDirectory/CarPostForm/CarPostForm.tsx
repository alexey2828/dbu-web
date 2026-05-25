import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import Button from "../../../../../ui/Components/Button/Button";
import Input from "../../../../../ui/Components/Input/Input";
import {carAPI} from "../../../../../Infrastructure/services/CarServices/CarService";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import globalStyles from '../../../../../global.module.scss';
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const CarPostForm = () => {
    const {t} = useTranslation();
    const { notificationHandler } = useNotification();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = carAPI.usePostCarMutation();
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        await putData(data);
        closeModal(directoryModals.car);
    };

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t('errors.general') });
        } else if (isSuccess) {
            notificationHandler({ type: 'success', message: t('errors.success') });
        }
    }, [isError, isSuccess, t]);

    return (
        <>
            <ModalForm modalName={directoryModals.car} title={"Редагувати машину"}>
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
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
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
                        <CustomText isError={true}>{errors.codeRFID?.message?.toString()}</CustomText>
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
                        <CustomText isError={true}>{errors.maxV?.message?.toString()}</CustomText>
                    </div>

                    <div className={globalStyles.form_buttons_container}>
                        <Button onClick={() => openModal(confirmModals.carCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.car)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.carCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default CarPostForm;
