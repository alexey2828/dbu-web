import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {recCompAPI} from "../../../../../Infrastructure/services/RecipeServices/RecCompService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {RecCompHeader} from "../../const/recCompHeader";

const RecCompDirectory = () => {

    const {data, isLoading} = recCompAPI.useFetchAllRecCompQuery('')
    const [deleteRecComp, {isError}] = recCompAPI.useDeleteRecCompMutation()

    return (
        /*<DirectoryPage data={data} headers={RecCompHeader} deleteItem={deleteRecComp} modalName={directoryModals.recComp} isLoading = {isLoading}/>*/
        <></>
    );
};

export default RecCompDirectory;