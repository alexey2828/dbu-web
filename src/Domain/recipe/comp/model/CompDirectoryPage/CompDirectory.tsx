import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { directoryModals } from "../../../../../Infrastructure/const/modalNames";
import { compAPI } from "../../../../../Infrastructure/services/RecipeServices/CompService";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import PanelTool from "../../../../../ui/Components/PanelTools/panelTool";
import Button from "../../../../../ui/Components/Button/Button";
import Table from "../../../../../ui/Components/Table/table";
import { v4 } from "uuid";
import { useModal } from "../../../../../Infrastructure/hooks/useModal";
import { compTypeAPI } from "../../../../../Infrastructure/services/RecipeServices/CompTypeService";
import { CompTypeHeaders } from "../../../compType/const/CompTypeHeaders";
import { CompHeaders } from "../../const/CompHeaders";
import Loader from "../../../../../ui/Components/Loader/Loader";
import {Roles} from "../../../../../Infrastructure/const/roles";
import {useGetUser} from "../../../../../Infrastructure/hooks/useGetUser";
import CompEditForm from "./CompPostModal/CompEditForm";
import CompTypeEditForm from "../../../compType/model/CompTypePostModal/CompTypeEditForm";

const CompDirectory = () => {
    const { t } = useTranslation();

    const [trigger, { data: comp, isLoading: isLoadingComp }] = compAPI.useLazyFetchAllCompQuery();
    const { data: compType, isLoading: isLoadingCompType } = compTypeAPI.useFetchAllCompTypeQuery('');
    const [deleteComp] = compAPI.useDeleteCompMutation();
    const [deleteCompType] = compTypeAPI.useDeleteCompTypeMutation();
    const { openModal, closeModal } = useModal();
    const [editComp] = compAPI.useEditCompMutation()
    const [editCompType] = compTypeAPI.useEditCompTypeMutation()

    const user = useGetUser()
    const [selectedItems, setSelectedItems] = useState({
        compId: null,
        compTypeId: null,
    });

    const confirmDelete = (deleteItem: any, selectedItemId: any, nameOfSaveModal: any) => {
        if (selectedItemId && deleteItem) {
            deleteItem({ id: selectedItemId });
        }
        closeModal(nameOfSaveModal + 'deleteItem');
    };

    const setSelectedItemId = (key: string, id: number | string | null) => {
        setSelectedItems((prevState) => ({
            ...prevState,
            [key]: id,
        }));
    };

    return (
        <>
            <div className="overflow-y-hidden">
                <SaveModal
                    nameModal={directoryModals.compType + 'deleteItem'}
                    handleSubmit={() => confirmDelete(deleteCompType, selectedItems.compTypeId, directoryModals.compType)}
                />
                <SaveModal
                    nameModal={directoryModals.comp + 'deleteItem'}
                    handleSubmit={() => confirmDelete(deleteComp, selectedItems.compId, directoryModals.comp)}
                />

                <CompEditForm editItem={editComp} modalName={directoryModals.comp + 'editItem'} selectedItemId={selectedItems.compId} />
                <CompTypeEditForm editItem={editCompType} modalName={directoryModals.compType + 'editItem'} selectedItemId={selectedItems.compTypeId} />


                {user && (user.user.role == Roles.CHIEF_TECHNOLOGIST || user.user.role === Roles.ADMIN) &&
                    <PanelTool>
                        <div className="w-[98%] mx-auto grid grid-cols-2 items-center justify-items-center justify-between">
                            <div className="flex gap-2">
                                <Button onClick={() => openModal(directoryModals.compType)}>{t('modals.create')}</Button>
                                <Button onClick={() => openModal(directoryModals.compType + 'deleteItem')}
                                        disabled={!selectedItems.compTypeId}>{t('modals.delete')}</Button>
                                <Button onClick={() => openModal(directoryModals.compType + 'editItem')}
                                        disabled={!selectedItems.compTypeId}>{t('modals.edit')}</Button>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => openModal(directoryModals.comp)}>{t('modals.create')}</Button>
                                <Button onClick={() => openModal(directoryModals.comp + 'deleteItem')}
                                        disabled={!selectedItems.compId}>{t('modals.delete')}</Button>
                                <Button onClick={() => openModal(directoryModals.comp + 'editItem')}
                                        disabled={!selectedItems.compId}>{t('modals.edit')}</Button>
                            </div>
                        </div>
                    </PanelTool>
                }


                <div className="w-[98%] mx-auto flex mt-5 gap-4 justify-center">
                    <div className="max-h-[75vh] overflow-auto w-full">
                        <p className={'text-center text-xl'}>{t('compDirectory.componentTypes')}</p>
                        {!isLoadingCompType ?
                            <Table>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-300 sticky top-0">
                                <tr>
                                    {Object.values(CompTypeHeaders).map((columnName) => (
                                        <th key={v4()} scope="col" className="px-6 py-3">
                                            {t(columnName)}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {compType && compType.length > 0 && compType.map(item => (
                                    <tr className={`border-b ${selectedItems.compTypeId === item.id ? 'bg-[#FEFFCF]' : ''}`}
                                        onClick={() => {
                                            setSelectedItemId('compTypeId', item.id);
                                            trigger({typeCode: item.code});
                                        }}
                                        key={v4()}
                                    >
                                        {Object.values(item).slice(1).map((columnName) => (
                                            <td key={v4()} className="px-6 py-1">
                                                {String(columnName)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            : <Loader />}
                    </div>

                    <div className="max-h-[75vh] overflow-auto w-full">
                        <p className={'text-center text-xl'}>{t('compDirectory.components')}</p>
                        {!isLoadingComp ?
                            <Table>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-300 sticky top-0">
                                <tr>
                                    {Object.values(CompHeaders).slice(0, 1).concat(Object.values(CompHeaders).slice(2)).map((columnName) => (
                                        <th key={v4()} scope="col" className="px-6 py-3">
                                            {t(columnName)}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {comp && comp.length > 0 && comp.map((item: any) => (
                                    <tr className={`border-b ${selectedItems.compId === item.id ? 'bg-[#FEFFCF]' : ''}`}
                                        onClick={() => setSelectedItemId('compId', item.id)}
                                        key={v4()}
                                    >
                                        {Object.values(item).slice(1, 2).concat(Object.values(item).slice(3)).map((columnName) => (
                                            <td key={v4()} className="px-6 py-1">
                                                {String(columnName)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            : <Loader />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompDirectory;
