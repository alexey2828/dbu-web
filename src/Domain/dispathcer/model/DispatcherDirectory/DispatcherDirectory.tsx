import React from 'react';
import {directoryModals} from "../../../../Infrastructure/const/modalNames";
import {dispatcherAPI} from "../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import DirectoryPage from "../../../../Pages/directoryPage/directoryPage";
import {DispatcherHeader} from "../../const/DispatcherHeader";
import DispatcherEditForm from "./DispatcherPostForm/DispatcherEditForm";
import {Roles} from "../../../../Infrastructure/const/roles";

const DispatcherDirectory = () => {

    const {data, isLoading} = dispatcherAPI.useFetchAllDispatcherQuery('')
    const [deleteDispatcher, {isError}] = dispatcherAPI.useDeleteDispatcherMutation()
    const [editDispatcher] = dispatcherAPI.useEditDispatcherMutation()

    return (
        <DirectoryPage data={data}
                       headers={DispatcherHeader}
                       deleteItem={deleteDispatcher}
                       modalName={directoryModals.dispatcher}
                       isLoading = {isLoading}
                       editItem={editDispatcher}
                       EditForm={DispatcherEditForm}
                       allowedRoles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN]}
        />

    );
};

export default DispatcherDirectory;