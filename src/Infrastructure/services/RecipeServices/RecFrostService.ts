import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IRecFrost} from "../../../Domain/recipe/recFrost/const/recFrost";
import {prepareHeaders} from "../../const/api";

export const recFrostAPI = createApi({
    reducerPath: 'RecFrostService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['recFrost', 'deleteRecFrost'],

    endpoints: (build) => ({
        fetchAllRecFrost: build.query<IRecFrost[], string>({
            query: (id) => ({
                url: queries.getRecFrost,
                params: {
                    id
                }
            }),
            providesTags: result => ['recFrost', 'deleteRecFrost'],

        }),

        postRecFrost: build.mutation<IRecFrost[], string>({
            query: (body) => ({
                url: queries.postRecFrost,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recFrost']
        }),

        deleteRecFrost: build.mutation<IRecFrost[], string>({
            query: (body) => ({
                url: queries.deleteRecFrost,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteRecFrost']
        }),
        editRecFrost: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editRecFrost,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['recFrost']
        }),
    }),
});
