import {useContext} from "react";
import {CurrentItemsContext} from "../contexts/currentItemsContext";

export const useCurrentItems = () => {
    const context = useContext(CurrentItemsContext)
    if(!context) {
        throw new Error('useCurrentItems must be used within a CurrentItemsProvider');
    }
    return context
}