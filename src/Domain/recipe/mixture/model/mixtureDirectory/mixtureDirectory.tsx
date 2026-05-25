import React, {useContext, useState} from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {mixtureAPI} from "../../../../../Infrastructure/services/RecipeServices/MixtureService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {mixtureHeader} from "../../const/mixtureHeader";
import {classRecipeAPI} from "../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import {ClassRecipeHeader} from "../../../classRecipe/const/ClassRecipeHeader";
import ClassRecipeEditForm from "./MixturePostForm/ClassRecipeEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const MixtureDirectory = () => {

    const {data, isLoading} = classRecipeAPI.useFetchAllClassRecipeQuery('')
    const [deleteClassRecipe, {isError}] = classRecipeAPI.useDeleteClassRecipeMutation()
    const [editClassRecipe] = classRecipeAPI.useEditClassRecipeMutation()

    return (
        <DirectoryPage
            data={data}
            headers={ClassRecipeHeader}
            deleteItem={deleteClassRecipe}
            modalName={directoryModals.mixture}
            isLoading = {isLoading}
            editItem = {editClassRecipe}
            EditForm={ClassRecipeEditForm}
            allowedRoles={[Roles.CHIEF_TECHNOLOGIST, Roles.ADMIN]}

        />

    );
};

export default MixtureDirectory;