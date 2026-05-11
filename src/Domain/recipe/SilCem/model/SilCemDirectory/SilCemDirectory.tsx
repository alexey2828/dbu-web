import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {silCemAPI} from "../../../../../Infrastructure/services/PlantServices/SilCem";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {SilCemHeader} from "../../const/SilCemHeader";

const SilCemDirectory = () => {

    const {data, isLoading} = silCemAPI.useFetchAllSilCemQuery('')
    const [deleteSilCem, {isError}] = silCemAPI.useDeleteSilCemMutation()

    const refactoredData = data?.map(item => ({
        ...item,
        capacity: item.capacity === null ? '' : item.capacity,
    }))

    return (
        /*<DirectoryPage data={refactoredData} headers={SilCemHeader} deleteItem={deleteSilCem} modalName={directoryModals.silCem} isLoading = {isLoading}/>*/
        <></>
    );
};

export default SilCemDirectory;