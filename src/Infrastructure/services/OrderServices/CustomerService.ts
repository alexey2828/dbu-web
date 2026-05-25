import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ICustomers} from "../../../Domain/ttn/customers/const/ICustomers";
import {queries} from "../../const/queries";
import {IDriver} from "../../../Domain/driver/const/driver";
import {prepareHeaders} from "../../const/api";


export const customerAPI = createApi({
    reducerPath: 'CustomerService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['customer', 'deleteCustomer'],

    endpoints: (build) => ({
        fetchAllCustomers: build.query<ICustomers[], any>({
            query: (id: any) => ({
                url: queries.getCustomer,
                params: {
                    id: id
                }
            }),
            providesTags: result => ['customer', 'deleteCustomer'],
        }),
        postCustomer: build.mutation<ICustomers[], string>({
            query: (body) => ({
                url: queries.postCustomer,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['customer']
        }),
        deleteCustomer: build.mutation<ICustomers[], any>({
            query: (body) => ({
                url: queries.deleteCustomer,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteCustomer']
        }),

        editCustomer: build.mutation<ICustomers[], string>({
            query: (body) => ({
                url: queries.editCustomer,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['customer']
        }),


    })
})

