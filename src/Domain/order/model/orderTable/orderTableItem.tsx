import React, {Dispatch, FC, SetStateAction} from 'react';
import {IOrder} from "../../const/IOrder";
import {useNavigate} from "react-router-dom";
import OrderStateManager from "../orderStateManager/OrderStateManager";
import {getOrderStateColor} from "../../../../Infrastructure/functions/getStateColorClass";
import {customerAPI} from "../../../../Infrastructure/services/OrderServices/CustomerService";
import {plantAPI} from "../../../../Infrastructure/services/PlantServices/PlantService";
import {dispatcherAPI} from "../../../../Infrastructure/services/DispatcherServices/DispatcherService";

interface IOrderTableItem {
    order: IOrder
    setCurrentOrder: Dispatch<SetStateAction<any>>
    currentOrder: IOrder | undefined
    isSuccessOrder: boolean
    isLoadingOrder: boolean
}

const OrderTableItem: FC<IOrderTableItem> = ({order, setCurrentOrder, currentOrder, isSuccessOrder, isLoadingOrder}) => {
    const handleOnClick = () => {
        setCurrentOrder(order)
    }

    const {data: customer} = customerAPI.useFetchAllCustomersQuery(order.idCustomer)
    const {data: plant} = plantAPI.useFetchAllPlantsQuery(order.idPlant)
    const {data: dispatcherData} = dispatcherAPI.useFetchAllDispatcherQuery(order.dispatcher)

    const isSelected = order.id === currentOrder?.id;

    return (
        <tr className={`${isSelected ? 
            '!border-y-2 !border-x-2 !border-black' : 
            'border-t-2 border-x-2 border-transparent '}  
            ${getOrderStateColor(order.state)} `}
            onClick={handleOnClick}
        >
            <td>{customer && customer[0]?.name}</td>
            <td>{order.number}</td>
            <td>{dispatcherData && dispatcherData[0].name}</td>
            <td>{order.dateCreate}</td>
            <td>{order.nameRecipe}</td>
            <td>{order.vOrder}</td>
            <td>
                <OrderStateManager state={order?.state} orderId={order?.id} setCurrentOrder = {setCurrentOrder} order = {order} isSuccessOrder = {isSuccessOrder} isLoadingOrder = {isLoadingOrder}/>
            </td>
            <td>{plant && plant[0]?.name}</td>
        </tr>
    )
};

export default OrderTableItem;