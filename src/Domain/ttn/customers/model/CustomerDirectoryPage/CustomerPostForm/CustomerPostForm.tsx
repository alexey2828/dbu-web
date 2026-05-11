import React, {useEffect} from 'react';
import Button from '../../../../../../ui/Components/Button/Button';
import {customerAPI} from "../../../../../../Infrastructure/services/OrderServices/CustomerService";
import Input from "../../../../../../ui/Components/Input/Input";
import {useForm} from "react-hook-form";
import TextArea from "../../../../../../ui/Components/Textarea/TextArea";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import globalStyles from '../../../../../../global.module.scss';
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const CustomerPostForm = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();

    const {register, handleSubmit, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = customerAPI.usePostCustomerMutation();
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (isError ) {
            notificationHandler({ type: 'error', message: t("errors.general") });
        } else if (isSuccess ) {
            notificationHandler({ type: 'success', message: t("errors.success") });
        }
    }, [isError, isSuccess, t]);

    const handlePut = async (data: any) => {
        await putData(data);
        closeModal(directoryModals.customer);
    };

    return (
        <>
            <ModalForm modalName={directoryModals.customer} title={t("customer.title")}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t("customer.name")}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{ required: t("errors.required") }}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t("placeholders.enterName")}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="address">{t("customer.address")}</label>
                        <Input
                            name="address"
                            register={register}
                            options={{ required: t("errors.required") }}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t("placeholders.enterAddress")}
                        />
                        <CustomText isError={true}>{errors.address?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="comment">{t("customer.comment")}</label>
                        <TextArea
                            name="comment"
                            register={register}
                            options={{ required: t("errors.required") }}
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t("placeholders.enterComment")}
                        />
                        <CustomText isError={true}>{errors.comment?.message?.toString()}</CustomText>
                    </div>

                    <div className={`${globalStyles.form_buttons_container}`}>
                        <Button onClick={() => openModal(confirmModals.customerCreateConfirm)}>
                            {t("modals.save")}
                        </Button>
                        <Button type="button" onClick={() => closeModal(directoryModals.customer)}>
                            {t("modals.close")}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.customerCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default CustomerPostForm;
