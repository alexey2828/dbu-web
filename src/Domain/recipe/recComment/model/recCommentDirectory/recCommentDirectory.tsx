import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {recCommentAPI} from "../../../../../Infrastructure/services/RecipeServices/recCommentService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {RecCommentHeader} from "../../const/recCommentHeader";
import RecCommentEditForm from "./recCommentPostForm/RecCommentEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const RecCommentDirectory = () => {

    const {data, isLoading} = recCommentAPI.useFetchAllRecCommentQuery('')
    const [deleteRecComment] = recCommentAPI.useDeleteRecCommentMutation()
    const [editRecComment] = recCommentAPI.useEditRecCommentMutation()
    return (
        <DirectoryPage
            data={data}
            headers={RecCommentHeader}
            deleteItem={deleteRecComment}
            modalName={directoryModals.recComment}
            isLoading = {isLoading}
            editItem={editRecComment}
            EditForm={RecCommentEditForm}
            allowedRoles={[Roles.CHIEF_TECHNOLOGIST, Roles.ADMIN]}

        />
    );
};

export default RecCommentDirectory;