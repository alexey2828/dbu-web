import React, {FC, useState, useEffect, Dispatch, SetStateAction} from 'react';
import { orderAPI } from "../../../../Infrastructure/services/OrderServices/OrderService";

import SelectStateManager from "../../../../ui/Components/Select/selectStateManager";
import {IOrder} from "../../const/IOrder";
import {useGetUser} from "../../../../Infrastructure/hooks/useGetUser";
import {Roles} from "../../../../Infrastructure/const/roles";

interface IStateManager {
    state: number;
    orderId: number,
    setCurrentOrder: Dispatch<SetStateAction<IOrder | undefined>>;
    order: IOrder|undefined;
    isSuccessOrder: boolean
    isLoadingOrder: boolean
}

const OrderStateManager: FC<IStateManager> = ({ state, orderId, setCurrentOrder, order, isSuccessOrder, isLoadingOrder }) => {

    const { data } = orderAPI.useFetchStateEntitiesQuery('');
    const [putState, {isError, isSuccess, isLoading}] = orderAPI.usePutStateEntitiesMutation()
    const user = useGetUser()

    const codeToNameMap = data?.reduce((acc: any, item: any) => {
        acc[item.code] = item.name;
        return acc;
    }, {} as { [key: string]: string });

    const [filteredData, setFilteredData] = useState<any>(null);

    useEffect(() => {
        if (data) {
            const item = data.find((item: any) => +item.code === state);
            setFilteredData(item || null);
        }
    }, [state, data]);

    const onChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newData = {
            state: +event.target.value,
            id: orderId,
        }
        // @ts-ignore
        await putState(newData)
        if (order) {
            setCurrentOrder({...order, state: +event.target.value})
        }
    }

    return (
        <div className = 'h-10 flex items-center justify-between'>
            {!isLoading && filteredData ?(
                <SelectStateManager
                    selectOptions={JSON.parse(filteredData.options)}
                    getOptionLabel={(option) => codeToNameMap[option.toString()] || option}
                    getOptionValue={(option: any) => option}
                    name='option'
                    additionalStyles={'w-44'}
                    defaultValue={filteredData.name}
                    handleOnChange={onChange}
                    disabled = {user?.user.role === Roles.GUEST}

                />
            ): (
                <div className={'items-center text-center justify-center'}>Loading...</div>
            )
                }
        </div>
    );
};

export default OrderStateManager;
