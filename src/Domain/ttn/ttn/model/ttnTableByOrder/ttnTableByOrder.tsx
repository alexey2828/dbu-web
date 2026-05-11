 import React, {FC} from 'react';
import TtnTableItemByOrder from "./ttnTableItemByOrder";
import {TtnHeaders} from "../../const/ttnHeaders";
import {ITtn} from "../../const/ttn";
import {useCurrentItems} from "../../../../../Infrastructure/hooks/useCurrentItems";
import Loader from '../../../../../ui/Components/Loader/Loader';
import Table from "../../../../../ui/Components/Table/table";
 import {useTranslation} from "react-i18next";

interface ITtnMainTable {

    isLoadingTtnState: boolean
    ttnByOrderId: ITtn[] | undefined
    isLoadingTtnByOrderId: boolean
}

const TtnTableByOrder:FC<ITtnMainTable> = ({isLoadingTtnState, ttnByOrderId, isLoadingTtnByOrderId}) => {

    const {currentTtn, setCurrentTtn} = useCurrentItems()
    const {t} = useTranslation()

    return (
        <div className = 'pt-3'>
            {ttnByOrderId && ttnByOrderId.length > 0 && (
                <div className={'overflow-auto max-h-[40vh]'}>
                    {!isLoadingTtnByOrderId ?
                        <Table>
                            <thead>
                                <tr>
                                    {Object.values(TtnHeaders).map((columnName, index) => (
                                        <th key={index}>
                                            {t(columnName)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                            {ttnByOrderId.map(item =>
                                    <TtnTableItemByOrder
                                        item={item}
                                        setCurrentTtn={setCurrentTtn}
                                        key={item.id}
                                        currentTtn={currentTtn}
                                        isLoading ={isLoadingTtnByOrderId}
                                        isLoadingTtnState = {isLoadingTtnState}
                                        />
                                )}
                            </tbody>
                        </Table> :
                    <Loader />
                    }
                </div>
                )}
        </div>
)
}
;

export default TtnTableByOrder;