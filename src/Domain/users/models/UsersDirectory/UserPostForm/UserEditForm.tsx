import React, {FC, useEffect} from 'react';
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import Input from "../../../../../ui/Components/Input/Input";
import globalStyles from "../../../../../global.module.scss";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import Select from "../../../../../ui/Components/Select/select";
import PhoneSelect from "../../../../../ui/Components/Select/phoneSelect";
import Button from "../../../../../ui/Components/Button/Button";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {userAPI} from "../../../../../Infrastructure/services/UserService/UserService";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {skipToken} from "@reduxjs/toolkit/query";

interface UserEditFormProps {
    selectedItemId: any;
}

const UserEditForm: FC<UserEditFormProps> = ({selectedItemId}) => {

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        control,
        reset
    } = useForm();

    const {t} = useTranslation();
    const {closeModal, openModal} = useModal();
    const [editUser] = userAPI.useEditUserMutation()

    const {data: rolesData} = userAPI.useGetUserRoleNameQuery('')
    const {data: users} = userAPI.useGetUsersQuery(selectedItemId ? selectedItemId : skipToken);

    useEffect(() => {
        if (users && users[0]) {
            reset({
                name: users[0].name || '',
                login: users[0].login || '',
                role: users[0].role || '',
                phone: users[0].phone || ''
            });
        }
    }, [users, reset]);
    const handlePut = async (data: any) => {
        if (!users) return;

        const changedData: any = {
            id: users[0].id // всегда добавляем id
        };


        // берём только изменённые поля
        Object.keys(dirtyFields).forEach((key) => {
            changedData[key] = data[key];
        });

        await editUser(changedData);
        closeModal(directoryModals.userEdit);
    };

    return (
        <>
            {users && (
                <>
                    <ModalForm modalName={directoryModals.userEdit} title={t('Users.editUser')}>
                        <form onSubmit={handleSubmit(handlePut)}>
                            <div>
                                <label htmlFor="name">{t('Users.name')}</label>
                                <Input
                                    name="name"
                                    register={register}
                                    options={{required: false}}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t('Users.name')}
                                    defaultValue={users && users[0]?.name}
                                />
                                <CustomText isError={true}>{errors.name?.message?.toString()}</CustomText>
                            </div>

                            <div>
                                <label htmlFor="codeRFID">{t('Users.login')}</label>
                                <Input
                                    name="login"
                                    register={register}
                                    options={{required: false}}
                                    type="search"
                                    additionalStyles={globalStyles.input_width_full}
                                    placeholder={t('Users.login')}
                                    defaultValue={users && users[0]?.login}

                                />
                                <CustomText isError={true}>{errors.login?.message?.toString()}</CustomText>
                            </div>

                            <div>
                                <label htmlFor="comment">{t('Users.password')}</label>
                                <Input
                                    name="password"
                                    type="password"

                                    register={register}
                                    options={{required: false}}
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
                                    options={{required: false}}
                                    name='role'
                                    additionalStyles={'w-full'}
                                    defaultValue={users && users[0]?.role}

                                />
                                <CustomText isError={true}>{errors.comment?.message?.toString()}</CustomText>
                            </div>
                            <div>
                                <label>{t('Users.phone')}</label>

                                <PhoneSelect
                                    name="phone"
                                    control={control}
                                    error={errors.phone?.message?.toString()}
                                    defaultValue={users && users[0]?.phone}
                                />
                            </div>

                            <div className={globalStyles.form_buttons_container}>
                                <Button onClick={() => openModal(confirmModals.userEditConfirm)}>
                                    {t('modals.save')}
                                </Button>
                                <Button onClick={() => closeModal(directoryModals.userEdit)}>
                                    {t('modals.close')}
                                </Button>
                            </div>
                        </form>
                    </ModalForm>
                    <SaveModal
                        nameModal={confirmModals.userEditConfirm}
                        handleSubmit={handleSubmit((data) => handlePut(data))}
                        error={errors}
                    />
                </>


            )}


        </>


    );
};

export default UserEditForm;