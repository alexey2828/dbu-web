import React, {Dispatch, FC, SetStateAction} from 'react';
import OrderFilterModal from "./orderFilterModal/orderFilterModal";
import {IOrder} from "../../const/IOrder";

interface IOrderModal {
    orderState: IOrder[] | undefined,
    setOrderState: Dispatch<SetStateAction<IOrder[] | undefined>>
}

const OrderModals: FC<IOrderModal> = ({orderState, setOrderState}) => {

    return (
        <OrderFilterModal orderState={orderState} setOrderState={setOrderState}/>
    );
};
export default OrderModals;