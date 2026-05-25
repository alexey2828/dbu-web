import React, {useState} from 'react';
import {directoryModals} from "../../../../Infrastructure/const/modalNames";
import {plantAPI} from "../../../../Infrastructure/services/PlantServices/PlantService";
import {PlantsHeader} from "../../const/PlantsHeader";
import SaveModal from "../../../../ui/Components/Modal/SaveModal";
import PanelTool from "../../../../ui/Components/PanelTools/panelTool";
import Button from "../../../../ui/Components/Button/Button";
import Table from "../../../../ui/Components/Table/table";
import {bsuAPI} from "../../../../Infrastructure/services/PlantServices/BsuService";
import {BsuHeader} from "../../bsu/const/BsuHeader";
import {silCemAPI} from "../../../../Infrastructure/services/PlantServices/SilCem";
import {SilCemHeader} from "../../../recipe/SilCem/const/SilCemHeader";
import {v4} from "uuid";
import {useModal} from "../../../../Infrastructure/hooks/useModal";
import Select from "../../../../ui/Components/Select/select";
import Loader from "../../../../ui/Components/Loader/Loader";
import s from '../../const/plants.module.scss'
import globalStyles from '../../../../global.module.scss'
import {CustomText, POSITION, SIZE} from "../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {useGetUser} from "../../../../Infrastructure/hooks/useGetUser";
import {Roles} from "../../../../Infrastructure/const/roles";
import PlantsEditForm from "./PlantsPostForm/PlantsEditForm";
import BsuEditForm from "../../bsu/model/BsuDirectory/BsuPostModal/BsuEditForm";
import SilCemEditForm from "../../../recipe/SilCem/model/SilCemDirectory/SilCemPostForm/SilCemEditForm";

const status = [{status: 'В работе', code: 1}, {status: 'Не в работе', code: 0}]

const PlantsDirectory = () => {

    const {data, isLoading: isLoadingPlants} = plantAPI.useFetchAllPlantsQuery('');

    const [deletePlant] = plantAPI.useDeletePlantMutation();
    const [deleteBsu] = bsuAPI.useDeleteBsuMutation()
    const [deleteSilCem] = silCemAPI.useDeleteSilCemMutation()
    const [triggerBsu, {data: bsu, isLoading: isLoadingBsu}] = bsuAPI.useLazyFetchAllBsuQuery();
    const [triggerSilCem, {data: silCem, isLoading: isLoadingSilCem}] = silCemAPI.useLazyFetchAllSilCemQuery();
    const [editBsu] = bsuAPI.useEditBsuMutation()
    const [editSilCem] = silCemAPI.useEditSilCemMutation()
    const {openModal, closeModal} = useModal()
    const {t} = useTranslation()
    const [editPlant] = plantAPI.useEditPlantMutation()

    const user = useGetUser()
    const refactoredSilCem = silCem && silCem.length && silCem?.map(item => ({
        ...item,
        capacity: item.capacity === null ? '' : item.capacity,
    }))

    const [selectedItems, setSelectedItems] = useState({
        plantId: null,
        bsuId: null,
        silCemId: null,
    });

    const confirmDelete = (deleteItem: any, selectedItemId: any, nameOfSaveModal: any) => {
        if (selectedItemId && deleteItem) {
            deleteItem({id: selectedItemId});
        }
        closeModal(nameOfSaveModal + 'deleteItem');
    };

    const setSelectedItemId = (key: string, id: number | string | null) => {
        setSelectedItems((prevState) => ({
            ...prevState,
            [key]: id,
        }));
    };
    const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>, code: any) => {
        const data = {code: code, isWork: e.currentTarget.value}
        editBsu(data)
    }

    return (
        <div className="overflow-y-hidden">
            <SaveModal nameModal={directoryModals.plants + 'deleteItem'}
                       handleSubmit={() => {
                           confirmDelete(deletePlant, selectedItems.plantId, directoryModals.plants)
                       }}
            />
            <SaveModal nameModal={directoryModals.bsu + 'deleteItem'}
                       handleSubmit={() => confirmDelete(deleteBsu, selectedItems.bsuId, directoryModals.bsu)}
            />
            <SaveModal nameModal={directoryModals.silCem + 'deleteItem'}
                       handleSubmit={() => confirmDelete(deleteSilCem, selectedItems.silCemId, directoryModals.silCem)}
            />

            <PlantsEditForm modalName = {directoryModals.plants + 'editItem'}
                            selectedItemId={selectedItems.plantId}
                            editItem={editPlant}
            />

            <BsuEditForm
                modalName={directoryModals.bsu + 'editItem'}
                selectedItemId={selectedItems.bsuId}
                editItem={editBsu}
            />
            <SilCemEditForm
                modalName={directoryModals.silCem + 'editItem'}
                selectedItemId={selectedItems.silCemId}
                editItem={editSilCem}
            />

            {user && (user.user.role === Roles.SPEC_PREPARE_PRODUCTION || user.user.role === Roles.ADMIN) &&
                <PanelTool>
                    <div className={`${globalStyles.container} grid grid-cols-3 justify-items-center`}>
                        <div className="flex gap-2">
                            <Button onClick={() => openModal(directoryModals.plants)}>{t('modals.create')}</Button>
                            <Button onClick={() => openModal(directoryModals.plants + 'deleteItem')}
                                    disabled={!selectedItems.plantId}>{t('modals.delete')}</Button>
                            <Button onClick={() => openModal(directoryModals.plants + 'editItem')}
                                    disabled={!selectedItems.plantId}>{t('modals.edit')}</Button>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => openModal(directoryModals.bsu)}>{t('modals.create')}</Button>
                            <Button onClick={() => openModal(directoryModals.bsu + 'deleteItem')}
                                    disabled={!selectedItems.bsuId}>{t('modals.delete')}</Button>
                            <Button onClick={() => openModal(directoryModals.bsu + 'editItem')}
                                    disabled={!selectedItems.bsuId}>{t('modals.edit')}</Button>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => openModal(directoryModals.silCem)}>{t('modals.create')}</Button>
                            <Button onClick={() => openModal(directoryModals.silCem + 'deleteItem')}
                                    disabled={!selectedItems.silCemId}>{t('modals.delete')}</Button>
                            <Button onClick={() => openModal(directoryModals.silCem + 'editItem')}
                                    disabled={!selectedItems.silCemId}>{t('modals.edit')}</Button>
                        </div>
                    </div>
                </PanelTool>
            }


            <div className={`${globalStyles.container} ${globalStyles.indent_top} gap-4 flex justify-center`}>
                <div className="max-h-[75vh] overflow-auto w-full">
                    <CustomText position={POSITION.center} size={SIZE.xl}>
                        {t('plantsDirectory.plants')}
                    </CustomText>
                    {!isLoadingPlants ?
                        <Table>
                            <thead>
                                <tr>
                                    {Object.values(PlantsHeader).map((columnName) => (
                                        <th key={v4()}>
                                            {t(columnName)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                            {data && data.length > 0 && data.map(item => (
                                <tr className={`border-b ${selectedItems.plantId === item.id && 'bg-[#FEFFCF]'}`}
                                    onClick={() => {
                                        setSelectedItemId('plantId', item.id);
                                            triggerBsu({codePlant: item.codePlant});
                                            triggerSilCem(undefined, undefined);
                                            setSelectedItemId('silCemId', null);
                                            setSelectedItemId('bsuId', null);
                                        }}
                                        key={v4()}
                                    >
                                        {Object.values(item).slice(1).map((columnName, index) => (
                                            <td key={columnName}>
                                                {String(columnName)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table> :
                        <Loader/>
                    }
                </div>

                <div className="max-h-[75vh] overflow-auto w-full">
                    <CustomText position={POSITION.center} size={SIZE.xl}>
                        {t('plantsDirectory.bsu')}

                    </CustomText>
                    {!isLoadingBsu ?
                        <Table>

                            <thead>
                                <tr>
                                    {Object.values(BsuHeader).slice(1).map((columnName, index) => (
                                        <th key={v4()}>
                                            {t(columnName)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                            {bsu && bsu.length > 0 && bsu.map(item => (
                                <tr className={`border-b ${selectedItems.bsuId === item.id && 'bg-[#FEFFCF]'}`}
                                    onClick={(e) => {
                                        setSelectedItemId('bsuId', item.id);
                                            triggerSilCem({codeBSU: item.code});
                                            setSelectedItemId('silCemId', null);
                                        }}
                                        key={v4()}
                                    >
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.vMIxer}</td>
                                        <td>
                                            <Select
                                                selectOptions={status}
                                                getOptionLabel={(status) => status.status}
                                                getOptionValue={(status) => status.code}
                                                name='isWork'
                                                handleOnClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                handleOnChange={(e) => onChangeStatus(e, item.code)}
                                                defaultValue={item.isWork}
                                                additionalStyles={item.isWork === 0 ? s.dontWork : s.work}
                                            />
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </Table> :
                        <Loader/>
                    }
                </div>

                <div className="max-h-[75vh] overflow-auto w-full">
                    <CustomText position={POSITION.center} size={SIZE.xl}>
                        {t('plantsDirectory.silos')}

                    </CustomText>
                    {!isLoadingSilCem ?
                        <Table>

                            <thead>
                                <tr>
                                    {Object.values(SilCemHeader).slice(1).map((columnName, index) => (
                                        <th key={columnName}>
                                            {t(columnName)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                            {refactoredSilCem && refactoredSilCem.length > 0 && refactoredSilCem.map(item => (
                                <tr className={`border-b ${selectedItems.silCemId === item.id && 'bg-[#FEFFCF]'}`}
                                    onClick={() => setSelectedItemId('silCemId', item.id)}
                                        key={v4()}
                                    >
                                        {Object.values(item).slice(2).map((columnName, index) => (
                                            <td key={v4()}>
                                                {String(columnName)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table> :
                        <Loader/>
                    }
                </div>
            </div>
        </div>
    );
};

export default PlantsDirectory;
