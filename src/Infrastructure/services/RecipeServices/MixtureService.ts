import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {IMixture} from "../../../Domain/recipe/mixture/const/mixture";
import {queries} from "../../const/queries";
import {prepareHeaders} from "../../const/api";

export const mixtureAPI = createApi({
    reducerPath: 'MixtureService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['mixture', 'deleteMixture'],

    endpoints: (build) => ({
        fetchAllMixture: build.query<IMixture[], string>({
            query: ({id}: any) => ({
                url: queries.getMixture,
                params: {
                    id: id
                }
            }),
            providesTags: result => ['mixture', 'deleteMixture'],
        }),
        postMixture: build.mutation<IMixture[], string>({
            query: (body) => ({
                url: queries.postMixture,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['mixture']
        }),
        deleteMixture: build.mutation<IMixture[], string>({
            query: (body) => ({
                url: queries.deleteMixture,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteMixture']
        }),

    }),
});
