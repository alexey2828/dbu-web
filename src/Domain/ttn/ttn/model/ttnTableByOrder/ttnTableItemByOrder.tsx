import React, {Dispatch, FC, SetStateAction} from 'react';
import {ITtn} from "../../const/ttn";
import TtnStateManager from "../ttnStateManager/ttnStateManager";
import {getOrderStateColor, getTtnStateColor} from "../../../../../Infrastructure/functions/getStateColorClass";
import {plantAPI} from "../../../../../Infrastructure/services/PlantServices/PlantService";
import {carAPI} from "../../../../../Infrastructure/services/CarServices/CarService";
import {dispatcherAPI} from "../../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import {driverAPI} from "../../../../../Infrastructure/services/DriverServices/DriverService";


interface iTtnMainTableItem {
    setCurrentTtn: Dispatch<SetStateAction<ITtn | undefined>>
    item: ITtn | undefined,
    currentTtn: ITtn | undefined,
    isLoading: boolean
    isLoadingTtnState: boolean
}
const TtnTableItemByOrder:FC<iTtnMainTableItem> = ({ item, setCurrentTtn, currentTtn, isLoading, isLoadingTtnState}) => {

    const handleOnClick = () => {
        item && setCurrentTtn(item);
    }

    const {data: plantData} = plantAPI.useFetchAllPlantsQuery(item?.idPlant)
    const {data: carData} = carAPI.useFetchAllCarQuery(item?.car)
    const {data: dispatcherData} = dispatcherAPI.useFetchAllDispatcherQuery(item?.dispatcher)
    const {data: driverData} = driverAPI.useFetchAllDriverQuery(item?.driver)
    const isSelected = currentTtn?.id === item?.id;

    return (
        <tr
            className={`${isSelected ? 'border-y-2 border-x-2 border-black' : 'border-t-2 border-x-2 border-transparent'} 
                      ${item?.isPause ? 'bg-[#FEFFCF]' : getTtnStateColor(item?.state)}`}
            onClick={handleOnClick}
        >
            <td>{item?.id}</td>
            <td>{carData && carData[0]?.name || item?.car}</td>
            <td>{item?.date}</td>

            <td>{dispatcherData && dispatcherData[0]?.name || item?.dispatcher}</td>

            <td>{driverData && driverData[0]?.name || item?.driver}</td>
            <td>{item?.finishAdress}</td>
            <td>{item?.finishDate}</td>
            <td>{plantData && plantData[0]?.name || item?.idPlant}</td>
            <td>
                <TtnStateManager
                    state={item?.state}
                    ttnId={item?.id}
                    item = {item}
                    isLoadingTtn = {isLoading}
                    isLoadingTtnState = {isLoadingTtnState}
                    currentTtn = {currentTtn}
                />
            </td>

            <td>{item?.vProduct}</td>
        </tr>
    );
};

export default TtnTableItemByOrder;