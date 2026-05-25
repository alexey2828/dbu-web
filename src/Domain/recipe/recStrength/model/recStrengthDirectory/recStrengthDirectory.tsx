import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {recStrengthAPI} from "../../../../../Infrastructure/services/RecipeServices/RecStrengthService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {RecStrengthHeader} from "../../const/recStrengthHeader";
import RecStrengthEditForm from "./recStrengthPostForm/recStrengthEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const RecStrengthDirectory = () => {

    const {data, isLoading} = recStrengthAPI.useFetchAllRecStrengthQuery('')
    const [deleteRecStrength, {isError}] = recStrengthAPI.useDeleteRecStrengthMutation()
    const [editRecStrength] = recStrengthAPI.useEditRecStrengthMutation()

    return (
        <DirectoryPage
            data={data}
            headers={RecStrengthHeader}
            deleteItem={deleteRecStrength}
            modalName={directoryModals.recStrength}
            isLoading = {isLoading}
            editItem={editRecStrength}
            EditForm={RecStrengthEditForm}
            allowedRoles={[Roles.CHIEF_TECHNOLOGIST, Roles.ADMIN]}
        />
    );
};

export default RecStrengthDirectory;