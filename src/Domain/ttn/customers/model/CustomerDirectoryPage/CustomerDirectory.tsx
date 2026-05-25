import React from 'react';

import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {customerAPI} from "../../../../../Infrastructure/services/OrderServices/CustomerService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {CustomerHeader} from "../../const/CustomerHeader";
import CustomerEditForm from "./CustomerPostForm/CustomerEditForm";
import {Roles} from "../../../../../Infrastructure/const/roles";

const CustomerDirectory = () => {

    const {data, isLoading} = customerAPI.useFetchAllCustomersQuery('')
    const [deleteCustomer, {isError}] = customerAPI.useDeleteCustomerMutation()
    const [editCustomer] = customerAPI.useEditCustomerMutation()

    return (
        <DirectoryPage
            data={data}
            headers={CustomerHeader}
            deleteItem={deleteCustomer}
            modalName={directoryModals.customer}
            isLoading = {isLoading}
            EditForm = {CustomerEditForm}
            editItem={editCustomer}
            allowedRoles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN]}

        />
    );
};

export default CustomerDirectory;