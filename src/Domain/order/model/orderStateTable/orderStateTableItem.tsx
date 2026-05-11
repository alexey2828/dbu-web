import React, {FC} from 'react';
import {IOrderState} from "../../const/IOrder";

export interface IOrderStateTableItem {
    item: IOrderState
}

const OrderStateTableItem:FC<IOrderStateTableItem> = ({item}) => {


    return (
        <tr className={`border-b`}>
            <td className="px-6 py-1 border-x-2 border-gray-400">{item?.state}</td>
            <td className="px-6 py-1  border-x-2 border-gray-400">{item?.date}</td>
        </tr>
    );
};

export default OrderStateTableItem;