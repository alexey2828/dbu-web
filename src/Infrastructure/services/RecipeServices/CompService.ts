import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IComp} from "../../../Domain/recipe/comp/const/comp";
import {prepareHeaders} from "../../const/api";

export const compAPI = createApi({
    reducerPath: 'CompService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['comp', 'deleteComp'],

    endpoints: (build) => ({
        fetchAllComp: build.query<IComp[], any>({
            query: ({typeCode, id}: any) => ({
                url: queries.getComp,
                params: {
                    typeCode: typeCode,
                    id
                }
            }),
            providesTags: result => ['comp', 'deleteComp'],

        }),
        postComp: build.mutation<IComp[], string>({
            query: (body) => ({
                url: queries.postComp,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['comp']
        }),

        deleteComp: build.mutation<IComp[], any>({
            query: (body) => ({
                url: queries.deleteComp,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteComp']
        }),
        editComp: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editComp,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['comp']
        }),
    }),
});
