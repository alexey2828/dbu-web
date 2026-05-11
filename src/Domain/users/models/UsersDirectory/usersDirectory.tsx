import React, {useState} from 'react';
import DirectoryPage from "../../../../Pages/directoryPage/directoryPage";
import {directoryModals} from "../../../../Infrastructure/const/modalNames";
import {userAPI} from "../../../../Infrastructure/services/UserService/UserService";
import {UserHeader} from "../../const/UserHeader";
import PanelTool from "../../../../ui/Components/PanelTools/panelTool";
import SaveModal from "../../../../ui/Components/Modal/SaveModal";
import {useGetUser} from "../../../../Infrastructure/hooks/useGetUser";
import {useTranslation} from "react-i18next";
import {Roles} from "../../../../Infrastructure/const/roles";
import Button from "../../../../ui/Components/Button/Button";
import {tKey} from "../../../../Infrastructure/i18n/tKey";
import TableDirectory from "../../../../Pages/directoryPage/TableDirectory/TableDirectory";
import Loader from "../../../../ui/Components/Loader/Loader";
import {useModal} from "../../../../Infrastructure/hooks/useModal";
import UserEditForm from "./UserPostForm/UserEditForm";

const UsersDirectory = () => {
    const {data, isLoading} = userAPI.useGetUsersQuery('')
    const {data: roles} = userAPI.useGetUserRoleNameQuery('')
    const [deleteUser, {isError}] = userAPI.useDeleteUserMutation()


    const formattedData = data?.map((user: any) => {
        const role = roles?.find((r: any) => r.code === user.role)

        return {
            ...user,
            role: role ? role.name : user.role
        }
    })

    const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
    const {openModal, closeModal } = useModal();
    const nameOfDeleteModal = directoryModals.user + 'deleteItem'
    const nameOfEditModal = directoryModals.userEdit

    const confirmDelete = () => {
        if (selectedItemId && deleteUser) {
            deleteUser({id: selectedItemId});
        }
        closeModal(nameOfDeleteModal);
    }

    const confirmEdit = () => {
        if (selectedItemId && deleteUser) {
            deleteUser({id: selectedItemId});
        }
        closeModal(nameOfDeleteModal);
    }

    const {t} = useTranslation();
    const user = useGetUser()
    console.log(user)


    return (
        <div className={'overflow-y-hidden'}>
            <SaveModal nameModal={nameOfDeleteModal} handleSubmit={confirmDelete}/>

            <PanelTool>
                <div className={'w-[98%] mx-auto flex gap-2 min-h-6'}>
                    {user && user.user.role !== Roles.GUEST &&
                        <>
                            <Button onClick={() => openModal(directoryModals.user)}>{tKey(t, 'modals.create')}</Button>
                            <Button onClick={() => openModal(nameOfDeleteModal)} disabled={!selectedItemId}>{tKey(t, 'modals.delete')}</Button>

                            <Button onClick={() => openModal(directoryModals.userEdit)} disabled={!selectedItemId}>{tKey(t, 'modals.edit')}</Button>
                        </>

                    }

                </div>
            </PanelTool>

            <div className={'overflow-y-hidden'}>
                {!isLoading ?
                    <TableDirectory data={formattedData}
                                    headers={UserHeader}
                                    setSelectedItemId={setSelectedItemId}
                                    selectedItemId = {selectedItemId}
                    /> :
                    <Loader />
                }

            </div>
            <UserEditForm selectedItemId = {selectedItemId}/>
        </div>
    );
};

export default UsersDirectory;