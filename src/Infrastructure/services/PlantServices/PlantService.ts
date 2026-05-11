import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IPlants} from "../../../Domain/plants/const/plants";
import {queries} from "../../const/queries";
import {IDriver} from "../../../Domain/driver/const/driver";
import {IBsu} from "../../../Domain/plants/bsu/const/bsu";
import {ICustomers} from "../../../Domain/ttn/customers/const/ICustomers";
import {prepareHeaders} from "../../const/api";


export const plantAPI = createApi({
    reducerPath: 'PlantsService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['plant', 'deletePlant'],

    endpoints: (build) => ({
        fetchAllPlants: build.query<IPlants[], string | number | undefined>({
            query: (id: any) => ({
                url: queries.getPlant,
                params: {
                    id: id
                }
            }),
            providesTags: result => ['plant', 'deletePlant'],

        }),
        postPlant: build.mutation<IPlants[], string>({
            query: (body) => ({
                url: queries.postPlant,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['plant']
        }),
        deletePlant: build.mutation<IPlants[], string>({
            query: (body) => ({
                url: queries.deletePlant,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deletePlant']
        }),
        editPlant: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editPlants,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['plant']
        }),

    })
})

