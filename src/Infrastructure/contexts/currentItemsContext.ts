import React, {createContext, SetStateAction} from 'react';
import {ITtn} from "../../Domain/ttn/ttn/const/ttn";
import {IOrder} from "../../Domain/order/const/IOrder";

interface CurrentItemsContextType {
    currentTtn: ITtn | undefined;
    setCurrentTtn: React.Dispatch<React.SetStateAction<ITtn | undefined>>;
    currentOrder: IOrder | undefined;
    setCurrentOrder: React.Dispatch<React.SetStateAction<IOrder | undefined>>;
    currentRecipeName: string;
    setCurrentRecipeName: React.Dispatch<SetStateAction<string>>;
}

export const CurrentItemsContext = createContext<CurrentItemsContextType | undefined>(undefined);



