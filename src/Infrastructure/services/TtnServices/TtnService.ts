import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ITtn} from "../../../Domain/ttn/ttn/const/ttn";
import {queries} from "../../const/queries";
import {ITtnState} from "../../../Domain/ttn/ttn/const/ttnState";
import {auth} from "../../const/auth";
import {prepareHeaders} from "../../const/api";


export const ttnAPI = createApi({
    reducerPath: 'ttnAPI',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['ttn', 'ttnStateEntities', 'putTtn'],

    endpoints: (build) => ({
        fetchAllTtn: build.query<ITtn[], string>({
            query: () => ({
                url: queries.getTtn
            }),
        }),
        postTtn: build.mutation<ITtn[], string>({
            query: (body) => ({
                url: queries.postTtn,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ttn']
        }),
        fetchTtnByOrderId: build.query<ITtn[], any>({
            query: (idOrder: string) => ({
                url: queries.getTtn,
                params: {
                    idOrder: idOrder
                }
            }),
            providesTags: result => ['ttn', 'ttnStateEntities', 'putTtn'],
        }),
        fetchStateEntities: build.query<any, string>({
            query: () => ({
                url: queries.getTtnStateEntities,
            }),
            providesTags: result => ['ttn', 'ttnStateEntities'],

        }),
        putStateEntities: build.mutation<{ state: number; id: number; }, string>({
            query: (body) => ({
                url: queries.putTtnStateEntities,
                method: 'PUT',
                body,

            }),
            invalidatesTags: ['ttnStateEntities']
        }),
        fetchTtnState: build.query<ITtnState[], any>({
            query: (currentTtnId: string | undefined | number) => ({
                url: 'ttnState.php',
                params: {
                    id: currentTtnId
                },
            }),
            providesTags: result => ['ttnStateEntities'],
        }),
        editTtnFields: build.mutation<any, string>({
            query: (body) => ({
                url: queries.editTtnFields,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['putTtn']
        }),
    })
})

