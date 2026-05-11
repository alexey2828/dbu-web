import React, {FC} from 'react';
import {ITtnState} from "../../const/ttnState";
import OrderStateManager from "../../../../order/model/orderStateManager/OrderStateManager";

interface ITtnStateTableItem {
    item: ITtnState
}

const TtnStateTableItem: FC<ITtnStateTableItem> = ({item}) => {
    return (
        <tr className={``}>
            <td className="px-6 py-1 border-x-2 border-gray-400">{item?.state}</td>
            <td className="px-6 py-1 border-x-2 border-gray-400">{item?.date}</td>
        </tr>
    );
};

export default TtnStateTableItem;