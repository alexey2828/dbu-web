import React from 'react';
import {directoryModals} from "../../../../Infrastructure/const/modalNames";
import {driverAPI} from "../../../../Infrastructure/services/DriverServices/DriverService";
import DirectoryPage from "../../../../Pages/directoryPage/directoryPage";
import {DriverHeader} from "../../const/DriverHeader";
import DriverEditForm from "./DriverPostForm/DriverEditForm";
import {Roles} from "../../../../Infrastructure/const/roles";

const DriverDirectory = () => {


    const {data, isLoading} = driverAPI.useFetchAllDriverQuery('')
    const [deleteDriver, {isError}] = driverAPI.useDeleteDriverMutation()
    const [editDriver] = driverAPI.useEditDriverMutation()

    return (
        <DirectoryPage
            data={data}
            headers={DriverHeader}
            deleteItem={deleteDriver}
            modalName={directoryModals.driver}
            isLoading = {isLoading}
            editItem = {editDriver}
            EditForm = {DriverEditForm}
            allowedRoles={[Roles.SPEC_PREPARE_PRODUCTION, Roles.ADMIN]}

        />
    );
};

export default DriverDirectory;