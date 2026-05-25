import React, {useState} from 'react';
import TableDirectory from "./TableDirectory/TableDirectory";
import PanelTool from "../../ui/Components/PanelTools/panelTool";
import SaveModal from "../../ui/Components/Modal/SaveModal";
import {useModal} from "../../Infrastructure/hooks/useModal";
import Loader from "../../ui/Components/Loader/Loader";
import Button from "../../ui/Components/Button/Button";
import { useTranslation } from "react-i18next";
import {useGetUser} from "../../Infrastructure/hooks/useGetUser";
import {Roles} from "../../Infrastructure/const/roles";
import { tKey } from "../../Infrastructure/i18n/tKey";

interface ITableDirectoryItem {
    id: string | number; // Assuming id can be string or number. Adjust if necessary.
}

interface IEditFormProps {
    modalName: string
    selectedItemId: string | number | null
    editItem: any
}
interface IDirectoryPage<T> {
    data: T[] | undefined,
    headers: object,
    deleteItem?: any
    modalName: string
    isLoading?: boolean
    EditForm: React.ComponentType<IEditFormProps>
    editItem: any;

    allowedRoles?: (string | number)[]

}
const DirectoryPage = <T extends ITableDirectoryItem>({data, headers, deleteItem, modalName, isLoading, EditForm, editItem, allowedRoles}: IDirectoryPage<T>) => {

    const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
    const {openModal, closeModal } = useModal();
    const nameOfDeleteModal = modalName + 'deleteItem'
    const nameOfEditModal = modalName + 'editItem'

    const confirmDelete = () => {
        if (selectedItemId && deleteItem) {
            deleteItem({id: selectedItemId});
        }
        closeModal(nameOfDeleteModal);
    }

    const {t} = useTranslation();
    const user = useGetUser()

    const hasAccess =
        !allowedRoles ||
        (user && allowedRoles.includes(user.user.role));


    return (
        <div className={'overflow-y-hidden'}>
            <SaveModal nameModal={nameOfDeleteModal} handleSubmit={confirmDelete}/>
            {hasAccess &&
                <PanelTool>
                    <div className={'w-[98%] mx-auto flex gap-2 min-h-6'}>

                            <>
                                <Button onClick={() => openModal(modalName)}>
                                    {tKey(t, 'modals.create')}
                                </Button>

                                <Button
                                    onClick={() => openModal(nameOfDeleteModal)}
                                    disabled={!selectedItemId}
                                >
                                    {tKey(t, 'modals.delete')}
                                </Button>

                                <Button
                                    onClick={() => openModal(nameOfEditModal)}
                                    disabled={!selectedItemId}
                                >
                                    {tKey(t, 'modals.edit')}
                                </Button>
                            </>


                    </div>
                </PanelTool>
            }

            <div className={'overflow-y-hidden'}>
                {!isLoading ?
                    <TableDirectory data={data}
                                    headers={headers}
                                    setSelectedItemId={setSelectedItemId}
                                    selectedItemId = {selectedItemId}
                    /> :
                    <Loader />
                }

            </div>

            <EditForm
                modalName = {nameOfEditModal}
                selectedItemId = {selectedItemId}
                editItem = {editItem}
            />

        </div>
    );
};

export default DirectoryPage;