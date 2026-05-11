import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {queries} from "../../const/queries";
import {IProductForReports} from "../../../Domain/product/const/product";
import {IReports} from "../../../Domain/reports/const/reports";
import {prepareHeaders} from "../../const/api";

export const userAPI = createApi({
    reducerPath: 'UserService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        loginUser: build.mutation<any, any>({
            query: (body: any) => ({
                url: queries.loginUser,
                body,
                method: 'POST'
            }),
            invalidatesTags: ['user']

        }),


        registerUser: build.mutation<any, any>({
            query: (body: any) => ({
                url: queries.registerUser,
                body,
                method: 'POST'
            }),
            invalidatesTags: ['user']

        }),

        getUserRoleName: build.query<any, any>({
            query: (code:any) => ({
                url: queries.getRoleName,
                method: 'GET',
                params: {
                    code
                },
                providesTags: (result:any) => ['user'],

            }),


        }),
        deleteUser: build.mutation<any, any>({
            query: (body) => ({
                url: queries.deleteUser,
                method: 'DELETE',
                body

            }),
            invalidatesTags: ['user']


        }),

        getUsers: build.query<any, any>({
            query: (id: any) => ({
                url: queries.getUsers,
                method: 'GET',
                params: {
                    id
                }
            }),
            providesTags: result => ['user'],
        }),

        editUser: build.mutation<any, any>({
            query: (body: any) => ({
                url: queries.editUser,
                body,
                method: 'PUT'
            }),
            invalidatesTags: ['user']

        }),

    }),
});