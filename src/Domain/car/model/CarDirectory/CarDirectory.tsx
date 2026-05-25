import React from 'react';
import {directoryModals} from "../../../../Infrastructure/const/modalNames";
import {carAPI} from "../../../../Infrastructure/services/CarServices/CarService";
import DirectoryPage from "../../../../Pages/directoryPage/directoryPage";
import {CarHeader} from "../../const/CarHeader";
import CarEditForm from "./CarPostForm/CarEditForm";
import {Roles} from "../../../../Infrastructure/const/roles";
const CarDirectory = () => {

    const {data, isLoading} = carAPI.useFetchAllCarQuery('')
    const [deleteCar, {isError}] = carAPI.useDeleteCarMutation()
    const [editCar] = carAPI.useEditCarMutation()


    return (
        <DirectoryPage
            data={data}
            headers={CarHeader}
            deleteItem={deleteCar}
            modalName={directoryModals.car}
            isLoading = {isLoading}
            editItem = {editCar}
            EditForm={CarEditForm}
            allowedRoles={[Roles.SPEC_PREPARE_PRODUCTION, Roles.ADMIN]}
        />
    );
};

export default CarDirectory;