import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IRecMobility} from "../../../Domain/recipe/recMobility/const/recMobility";
import {IRecFrost} from "../../../Domain/recipe/recFrost/const/recFrost";
import {prepareHeaders} from "../../const/api";

export const recMobilityAPI = createApi({
    reducerPath: 'RecMobilityService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['recMobility', 'deleteRecMobility'],

    endpoints: (build) => ({
        fetchAllRecMobility: build.query<IRecMobility[], string>({
            query: (id) => ({
                url: queries.getRecMobility,
                params: {
                    id: id
                }
            }),
            providesTags: result => ['recMobility', 'deleteRecMobility'],
        }),

        postRecMobility: build.mutation<IRecMobility[], string>({
            query: (body) => ({
                url: queries.postRecMobility,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recMobility']
        }),

        deleteRecMobility: build.mutation<IRecMobility[], string>({
            query: (body) => ({
                url: queries.deleteRecMobility,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteRecMobility']
        }),
        editRecMobility: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editRecMobility,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['recMobility']
        }),
    }),
});
