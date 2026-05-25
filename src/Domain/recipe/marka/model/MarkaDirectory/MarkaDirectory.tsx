import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {markaAPI} from "../../../../../Infrastructure/services/RecipeServices/MarkaService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {MarkaHeader} from "../../const/MarkaHeader";
import MarkaEditForm from "./MarkaPostForm/MarkaEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const MarkaDirectory = () => {

    const {data, isLoading} = markaAPI.useFetchAllMarkaQuery('')
    const [deleteMarka, {isError}] = markaAPI.useDeleteMarkaMutation()
    const [editMarka] = markaAPI.useEditMarkaMutation()

    return (
        <DirectoryPage
            data={data}
            headers={MarkaHeader}
            deleteItem={deleteMarka}
            modalName={directoryModals.marka}
            isLoading = {isLoading}
            editItem={editMarka}
            EditForm={MarkaEditForm}
            allowedRoles={[Roles.CHIEF_TECHNOLOGIST, Roles.ADMIN]}

        />

    );
};

export default MarkaDirectory;