import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {recMobilityAPI} from "../../../../../Infrastructure/services/RecipeServices/recMobilityService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {RecMobilityHeader} from "../../const/recMobilityHeader";
import RecMobilityEditForm from "./recMobilityPostForm/recMobilityEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const RecMobilityDirectory = () => {

    const {data, isLoading} = recMobilityAPI.useFetchAllRecMobilityQuery('')
    const [deleteRecMobility, {isError}] = recMobilityAPI.useDeleteRecMobilityMutation()
    const [editRecMobility] = recMobilityAPI.useEditRecMobilityMutation()

    return (
        <DirectoryPage
            data={data}
            headers={RecMobilityHeader}
            deleteItem={deleteRecMobility}
            modalName={directoryModals.recMobility}
            isLoading = {isLoading}
            editItem={editRecMobility}
            EditForm={RecMobilityEditForm}
            allowedRoles={[Roles.CHIEF_TECHNOLOGIST, Roles.ADMIN]}

        />

    );
};

export default RecMobilityDirectory;