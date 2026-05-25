import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IRecComp} from "../../../Domain/recipe/recComp/const/recComp";
import {prepareHeaders} from "../../const/api";

export const recCompAPI = createApi({
    reducerPath: 'RecCompService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['recComp', 'deleteRecComp'],
    endpoints: (build) => ({
        fetchAllRecComp: build.query<IRecComp[], string>({
            query: () => ({
                url: queries.getRecComp,
            }),
            providesTags: result => ['recComp', 'deleteRecComp'],
        }),

        postRecComp: build.mutation<IRecComp[], string>({
            query: (body) => ({
                url: queries.postRecComp,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recComp']
        }),

        deleteRecComp: build.mutation<IRecComp[], string>({
            query: (body) => ({
                url: queries.deleteRecComp,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteRecComp']
        }),
    }),
});
