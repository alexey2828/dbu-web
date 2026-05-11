import React, {useState} from 'react';
import OrderTable from "../../Domain/order/model/orderTable/orderTable";
import SubOrder from "../../Domain/order/model/subOrder/subOrder";
import OrderPanelTool from "../../Domain/order/model/orderPanelTool/orderPanelTool";
import OrderModals from "../../Domain/order/model/orderModals/orderModals";
import {IOrder} from "../../Domain/order/const/IOrder";

const OrdersPage = () => {

    const [orderState, setOrderState] = useState<IOrder[] | undefined>()

    return (
        <div>
            <OrderModals setOrderState = {setOrderState} orderState = {orderState} />
            <OrderPanelTool />
            <OrderTable setOrderState = {setOrderState} orderState = {orderState} />
            <SubOrder />
        </div>
    );
};

export default OrdersPage;