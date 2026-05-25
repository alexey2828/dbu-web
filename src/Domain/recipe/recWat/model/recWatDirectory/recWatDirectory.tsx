import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {recWatAPI} from "../../../../../Infrastructure/services/RecipeServices/RecWatService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {RecWatHeader} from "../../const/recWatHeader";
import RecWatEditForm from "./recWatPostForm/RecWatEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const RecWatDirectory = () => {

    const {data, isLoading} = recWatAPI.useFetchAllRecWatQuery('')
    const [deleteRecWat, {isError}] = recWatAPI.useDeleteRecWatMutation()
    const [editRecWat] = recWatAPI.useEditRecWatMutation()

    return (
        <DirectoryPage
            data={data}
            headers={RecWatHeader}
            deleteItem={deleteRecWat}
            modalName={directoryModals.recWat}
            isLoading = {isLoading}
            editItem={editRecWat}
            EditForm={RecWatEditForm}
            allowedRoles={[Roles.CHIEF_TECHNOLOGIST, Roles.ADMIN]}

        />

    );
};

export default RecWatDirectory;