import React, {FC, useEffect} from 'react';
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {customerAPI} from "../../../../../../Infrastructure/services/OrderServices/CustomerService";
import {skipToken} from "@reduxjs/toolkit/query";
import {useForm} from "react-hook-form";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import Input from "../../../../../../ui/Components/Input/Input";
import globalStyles from "../../../../../../global.module.scss";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import Button from "../../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {useTranslation} from "react-i18next";
import TextArea from "../../../../../../ui/Components/Textarea/TextArea";

interface CustomerEditProps {
    modalName: string;
    selectedItemId: any;
    editItem: any
}

const CustomerEditForm:FC<CustomerEditProps> = ({modalName, selectedItemId, editItem}) => {

    const {data: customer} = customerAPI.useFetchAllCustomersQuery(selectedItemId ? selectedItemId : skipToken)
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
        if (!customer) return;

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
        if (customer && customer[0]) {
            reset({
                name: customer[0].name || '',
                address: customer[0].address || '',
                comment: customer[0].comment || ''
            });
        }
    }, [customer, reset]);

    return (
        <>
            {customer &&
                <>
                    <ModalForm modalName = {modalName} title = 'Редагувати замовника'>
                        <form onSubmit={handleSubmit(handlePut)}>
                            <div>
                                <label htmlFor="name">{t("customer.name")}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{ required: false}}
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
                                    options={{ required: false}}
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
                                    options={{ required: false}}
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t("placeholders.enterComment")}

                                />
                                <CustomText isError={true}>{errors.comment?.message?.toString()}</CustomText>
                            </div>

                            <div className={`${globalStyles.form_buttons_container}`}>
                                <Button onClick={() => openModal('customerEditConfirm')}>
                                    {t("modals.save")}
                                </Button>
                                <Button type="button" onClick={() => closeModal(modalName)}>
                                    {t("modals.close")}
                                </Button>
                            </div>
                        </form>
                    </ModalForm>
                    <SaveModal
                        nameModal={'customerEditConfirm'}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>


            }

        </>

    );
};

export default CustomerEditForm;