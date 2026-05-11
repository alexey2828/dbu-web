import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {ISliCem} from "../../../Domain/recipe/SilCem/const/SliCem";
import {IPlants} from "../../../Domain/plants/const/plants";
import {ICustomers} from "../../../Domain/ttn/customers/const/ICustomers";
import {prepareHeaders} from "../../const/api";

export const silCemAPI = createApi({
    reducerPath: 'SilCemService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['silCem', 'deleteSilCem'],

    endpoints: (build) => ({
        fetchAllSilCem: build.query<ISliCem[], any>({
            query: ({id, codeBSU}: any) => ({
                url: queries.getSilCem,
                params: {
                    codeBSU: codeBSU,
                    id: id
                }
            }),
            providesTags: result => ['silCem', 'deleteSilCem'],

        }),
        postSilCem: build.mutation<ISliCem[], string>({
            query: (body) => ({
                url: queries.postSilCem,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['silCem']
        }),
        deleteSilCem: build.mutation<ISliCem[], string>({
            query: (body) => ({
                url: queries.deleteSilCem,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteSilCem']
        }),
        editSilCem: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editSilCem,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['silCem']
        }),
    }),
});
