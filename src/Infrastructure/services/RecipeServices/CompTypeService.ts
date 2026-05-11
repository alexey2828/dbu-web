import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {ICompType} from "../../../Domain/recipe/compType/const/compType";
import {prepareHeaders} from "../../const/api";

export const compTypeAPI = createApi({
    reducerPath: 'CompTypeService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['compType', 'deleteCompType'],

    endpoints: (build) => ({
        fetchAllCompType: build.query<ICompType[], string>({
            query: (id) => ({
                url: queries.getCompType,
                params: {
                    id
                }
            }),
            providesTags: result => ['compType', 'deleteCompType'],

        }),
        postCompType: build.mutation<ICompType[], string>({
            query: (body) => ({
                url: queries.postCompType,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['compType']
        }),

        deleteCompType: build.mutation<ICompType[], any>({
            query: (body) => ({
                url: queries.deleteCompType,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteCompType']
        }),
        editCompType: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editCompType,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['compType']
        }),
    }),
});
