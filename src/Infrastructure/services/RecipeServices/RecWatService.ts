import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IRecWat} from "../../../Domain/recipe/recWat/const/recWat";
import {prepareHeaders} from "../../const/api";

export const recWatAPI = createApi({
    reducerPath: 'RecWatService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['recWat', 'deleteRecWat'],

    endpoints: (build) => ({
        fetchAllRecWat: build.query<IRecWat[], string>({
            query: (id) => ({
                url: queries.getRecWat,
                params: {
                    id
                }
            }),
            providesTags: result => ['recWat', 'deleteRecWat'],
        }),
        postRecWat: build.mutation<IRecWat[], string>({
            query: (body) => ({
                url: queries.postRecWat,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recWat']
        }),
        deleteRecWat: build.mutation<IRecWat[], string>({
            query: (body) => ({
                url: queries.deleteRecWat,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteRecWat']
        }),

        editRecWat: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editRecWat,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['recWat']
        }),
    }),
});
