import React, {FC, PropsWithChildren, useState} from "react";
import {ITtn} from "../../Domain/ttn/ttn/const/ttn";
import {IOrder} from "../../Domain/order/const/IOrder";
import { CurrentItemsContext } from "../contexts/currentItemsContext";

export const CurrentItemsProvider:FC<PropsWithChildren> = ({children}) => {

    const [currentTtn, setCurrentTtn] = useState<ITtn | undefined>()
    const [currentOrder, setCurrentOrder] = useState<IOrder | undefined>(undefined)
    const [currentRecipeName, setCurrentRecipeName] = useState<string>("")

    return (
        <CurrentItemsContext.Provider
            value={{ currentTtn, setCurrentTtn, currentOrder, setCurrentOrder, currentRecipeName, setCurrentRecipeName }}
        >
            {children}
        </CurrentItemsContext.Provider>
    );
};