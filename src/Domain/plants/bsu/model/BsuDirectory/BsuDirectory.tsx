import React, {useState} from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {bsuAPI} from "../../../../../Infrastructure/services/PlantServices/BsuService";
import {BsuHeader} from "../../const/BsuHeader";
import Button from "../../../../../ui/Components/Button/Button";
import PanelTool from "../../../../../ui/Components/PanelTools/panelTool";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import Table from "../../../../../ui/Components/Table/table";

const BsuDirectory = () => {

    const {data} = bsuAPI.useFetchAllBsuQuery('')
    const [deleteBsu, {isError}] = bsuAPI.useDeleteBsuMutation()

    const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
    const {openModal, closeModal } = useModal();
    const nameOfDeleteModal = directoryModals.bsu + 'deleteItem'

    const confirmDelete = () => {
        if (selectedItemId && deleteBsu) {
            deleteBsu({id: selectedItemId});
        }
        closeModal(nameOfDeleteModal);
    }
    return (
        <div className={'overflow-y-hidden'}>
            <SaveModal nameModal={nameOfDeleteModal} handleSubmit={confirmDelete}/>

            <PanelTool>
                <div className={'w-[98%] mx-auto flex gap-2'}>
                    <Button onClick={() => openModal(directoryModals.bsu)}>Создать</Button>
                    <Button onClick={() => openModal(nameOfDeleteModal)} disabled={!selectedItemId}>Удалить</Button>
                </div>
            </PanelTool>

            <div className={'overflow-y-hidden'}>
                <div className='mt-5 flex justify-center max-w-[98vw] mx-auto max-h-[75vh]'>
                    <div className={'overflow-auto'}>
                        <Table>
                            <thead className="text-xs text-gray-700 uppercase bg-gray-300 sticky top-0">
                            <tr>
                                {Object.values(BsuHeader).map((columnName, index) => (
                                    <th key={index} scope="col" className="px-6 py-3">
                                        {columnName}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {data && data.length > 0 && data.map(item => (
                                <tr className={`border-b ${selectedItemId === item.id && 'bg-[#FEFFCF]'}`}
                                    onClick={() => setSelectedItemId(item.id)}
                                >
                                    <td className={'px-6 py-1'}>{item.codePlant}</td>
                                    <td className={'px-6 py-1'}>{item.code}</td>
                                    <td className={'px-6 py-1'}>{item.name}</td>
                                    <td className={'px-6 py-1'}>{item.vMIxer}</td>
                                    <td className={'px-6 py-1'}>{item.isWork === 0 ?
                                        <p className={'text-red-700'}>Не в работе</p> :
                                        <p className={'text-green-700'}>В работе</p>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>

                </div>
            </div>

        </div>
    )
};

/*{Object.values(item).slice(1).map((columnName, index) => (
    <td key={index} className={`px-6 py-1`}>
        {String(columnName)}
    </td>
))}*/

export default BsuDirectory;



