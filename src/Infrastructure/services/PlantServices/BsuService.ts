import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBsu } from '../../../Domain/plants/bsu/const/bsu';
import {queries} from "../../const/queries";
import {ICustomers} from "../../../Domain/ttn/customers/const/ICustomers";
import {prepareHeaders} from "../../const/api";

export const bsuAPI = createApi({
    reducerPath: 'BsuService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['bsu', 'deleteBsu', 'editBsu'],
    endpoints: (build) => ({
        fetchAllBsu: build.query<IBsu[], any>({
            query: ({codePlant, id}: any) => ({
                url: queries.getBsu,
                params: {
                    codePlant: codePlant,
                    id: id
                }
            }),
            providesTags: result => ['bsu', 'deleteBsu', 'editBsu'],
        }),

        postBsu: build.mutation<IBsu[], string>({
            query: (body) => ({
                url: queries.postBsu,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['bsu']
        }),
        deleteBsu: build.mutation<IBsu[], any>({
            query: (body) => ({
                url: queries.deleteBsu,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteBsu']
        }),
        editBsu: build.mutation({
            query: (body: any) => ({
                url: queries.editBsu,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['editBsu']
        }),
    }),
});
