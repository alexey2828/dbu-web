import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IRecStrength} from "../../../Domain/recipe/recStrength/const/recStrength";
import {IRecMobility} from "../../../Domain/recipe/recMobility/const/recMobility";
import {prepareHeaders} from "../../const/api";

export const recStrengthAPI = createApi({
    reducerPath: 'RecStrengthService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['recStrength', 'deleteRecStrength'],

    endpoints: (build) => ({
        fetchAllRecStrength: build.query<IRecStrength[], string>({
            query: (id) => ({
                url: queries.getRecStrength,
                params: {
                    id
                }
            }),
            providesTags: result => ['recStrength', 'deleteRecStrength'],

        }),
        postRecStrength: build.mutation<IRecStrength[], string>({
            query: (body) => ({
                url: queries.postRecStrength,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recStrength']
        }),

        deleteRecStrength: build.mutation<IRecStrength[], string>({
            query: (body) => ({
                url: queries.deleteRecStrength,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteRecStrength']
        }),
        editRecStrength: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editRecStrength,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['recStrength']
        }),
    }),
});
