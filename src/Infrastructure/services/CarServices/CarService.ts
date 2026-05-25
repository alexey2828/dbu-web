import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ICar} from "../../../Domain/car/const/car";
import {queries} from "../../const/queries";
import {prepareHeaders} from "../../const/api";


export const carAPI = createApi({
    reducerPath: 'CarService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['car', 'deleteCar'],

    endpoints: (build) => ({
        fetchAllCar: build.query<ICar[], any>({
            query: (id) => ({
                url: queries.getCar,
                params: {
                    id: id
                }
            }),
            providesTags: result => ['car', 'deleteCar'],
        }),
        postCar: build.mutation<ICar[], string>({
            query: (body) => ({
                url: queries.postCar,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['car']
        }),
        deleteCar: build.mutation<ICar[], string>({
            query: (body) => ({
                url: queries.deleteCar,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteCar']
        }),
        editCar: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editCar,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['car']
        }),
    })
})

