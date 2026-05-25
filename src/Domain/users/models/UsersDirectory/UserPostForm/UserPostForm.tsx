import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import globalStyles from "../../../../../global.module.scss";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {userAPI} from "../../../../../Infrastructure/services/UserService/UserService";
import Select from "../../../../../ui/Components/Select/select";
import PhoneSelect from "../../../../../ui/Components/Select/phoneSelect";

const DriverPostForm = () => {
    const {t} = useTranslation();
    const { notificationHandler } = useNotification();
    const {register, handleSubmit, formState: {errors}, control} = useForm();
    const [putData, {isError, isSuccess}] = userAPI.useRegisterUserMutation();
    const { openModal, closeModal } = useModal();
    const {data: rolesData} = userAPI.useGetUserRoleNameQuery('')

    const handlePut = async (data: any) => {
       /* const fullData = {
            ...data,
            phone: data.phone ? `+${data.phone}` : null
        };*/

        await putData(data);
        closeModal(directoryModals.user);

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
            <ModalForm modalName={directoryModals.user} title={t('Users.createUser')}>
                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="name">{t('Users.name')}</label>
                        <Input
                            name="name"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('Users.name')}
                        />
                        <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="codeRFID">{t('Users.login')}</label>
                        <Input
                            name="login"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="search"
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('Users.login')}
                        />
                        <CustomText isError={true}>{errors.login?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="comment">{t('Users.password')}</label>
                        <Input
                            name="password"
                            type="password"

                            register={register}
                            options={{required:  t('errors.required')}}
                            additionalStyles={globalStyles.input_width_full}
                            placeholder={t('Users.password')}
                        />
                        <CustomText isError={true}>{errors.comment?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="comment">{t('Users.role')}</label>
                        <Select
                            selectOptions={rolesData}
                            getOptionLabel={(rolesData: any) => rolesData.name}
                            getOptionValue={(rolesData: any) => rolesData.code}
                            register={register}
                            options={{required: t('errors.required')}}
                            name='role'
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.comment?.message?.toString()}</CustomText>
                    </div>
                    <div>
                        <label>{t('Users.phone')}</label>

                        <PhoneSelect
                            name="phone"
                            control={control}
                            error={errors.phone?.message?.toString()}
                        />
                    </div>

                    <div className={globalStyles.form_buttons_container}>
                        <Button onClick={() => openModal(confirmModals.userCreateConfirm)}>
                            {t('modals.save')}
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.user)}>
                            {t('modals.close')}
                        </Button>
                    </div>
                </form>
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.userCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default DriverPostForm;
