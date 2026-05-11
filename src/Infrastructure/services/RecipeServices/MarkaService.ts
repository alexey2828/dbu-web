import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IMarka} from "../../../Domain/recipe/marka/const/marka";
import {prepareHeaders} from "../../const/api";

export const markaAPI = createApi({
    reducerPath: 'MarkaService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['marka', 'deleteMarka'],

    endpoints: (build) => ({
        fetchAllMarka: build.query<IMarka[], string>({
            query: (id) => ({
                url: queries.getMarka,
                params: {
                    id
                }
            }),
            providesTags: result => ['marka', 'deleteMarka'],

        }),

        postMarka: build.mutation<IMarka[], string>({
            query: (body) => ({
                url: queries.postMarka,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['marka']
        }),

        deleteMarka: build.mutation<IMarka[], string>({
            query: (body) => ({
                url: queries.deleteMarka,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteMarka']
        }),
        editMarka: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editMarka,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['marka']
        }),
    }),
});
