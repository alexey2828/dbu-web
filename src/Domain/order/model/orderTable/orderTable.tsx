import React, {Dispatch, FC, SetStateAction, useEffect} from 'react';
import OrderTableItem from "./orderTableItem";
import {orderAPI} from "../../../../Infrastructure/services/OrderServices/OrderService";
import {OrderTableHeaders} from "../../const/OrderTableHeaders";
import {useCurrentItems} from "../../../../Infrastructure/hooks/useCurrentItems";
import Loader from "../../../../ui/Components/Loader/Loader";
import Table from "../../../../ui/Components/Table/table";
import {IOrder} from "../../const/IOrder";
import {CustomText, SIZE, WEIGHT} from "../../../../ui/Components/CustomText/CustomText";
import globalStyles from '../../../../global.module.scss'
import {useTranslation} from "react-i18next";

interface IOrderTable {
    orderState: IOrder[] | undefined,
    setOrderState: Dispatch<SetStateAction<IOrder[] | undefined >>
}

const OrderTable: FC<IOrderTable> = ({orderState, setOrderState}) => {

    const {data: orders, isSuccess, isLoading} = orderAPI.useFetchAllOrdersQuery('')
    const {currentOrder, setCurrentOrder} = useCurrentItems()
    const {t} = useTranslation()

    useEffect(() => {
        setOrderState(orders)
    }, [orders]);

    return (
        <div className={`${globalStyles.indent_top} ${globalStyles.container} h-[60vh]`}>
            <CustomText weight = {WEIGHT.bold} size = {SIZE.xl}>
                {t('order.orderList')}
            </CustomText>
            <div className='overflow-auto max-h-[55vh]'>
                {!isLoading ?
                    <Table>

                        <thead>
                            <tr>
                                {Object.values(OrderTableHeaders).map((columnName, index) => (
                                    <th key={index}>
                                        {t(columnName)}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {orderState && orderState.length > 0 && orderState?.map((item: any) => (
                                <OrderTableItem order={item}
                                                key={item.id}
                                                setCurrentOrder={setCurrentOrder}
                                                currentOrder={currentOrder}
                                                isSuccessOrder={isSuccess}
                                                isLoadingOrder={isLoading}
                                    />
                                ))
                            }
                        </tbody>
                    </Table> :
                <Loader/>
                }
            </div>
        </div>


    );
};

export default OrderTable;