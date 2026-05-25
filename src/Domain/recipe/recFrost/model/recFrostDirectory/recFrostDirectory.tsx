import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {recFrostAPI} from "../../../../../Infrastructure/services/RecipeServices/RecFrostService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {RecFrostHeader} from "../../const/recFrostHeader";
import RecFrostEditForm from "./recFrostPostForm/recFrostEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const RecFrostDirectory = () => {

    const {data, isLoading} = recFrostAPI.useFetchAllRecFrostQuery('')
    const [deleteRecFrost, {isError}] = recFrostAPI.useDeleteRecFrostMutation()
    const [editRecFrost] = recFrostAPI.useEditRecFrostMutation()

    return (
        <DirectoryPage
            data={data}
            headers={RecFrostHeader}
            deleteItem={deleteRecFrost}
            modalName={directoryModals.recFrost}
            isLoading = {isLoading}
            EditForm={RecFrostEditForm}
            editItem={editRecFrost}
            allowedRoles={[Roles.CHIEF_TECHNOLOGIST, Roles.ADMIN]}

        />

    );
};

export default RecFrostDirectory;