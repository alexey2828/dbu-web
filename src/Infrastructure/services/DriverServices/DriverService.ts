import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IDriver} from "../../../Domain/driver/const/driver";
import {queries} from "../../const/queries";
import {ICar} from "../../../Domain/car/const/car";
import {prepareHeaders} from "../../const/api";


export const driverAPI = createApi({
    reducerPath: 'DriverService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['driver', 'deleteDriver'],
    endpoints: (build) => ({
        fetchAllDriver: build.query<IDriver[], any>({
            query: (id: any) => ({
                url: queries.getDriver,
                params: {
                    id: id
                }
            }),
            providesTags: result => ['driver', 'deleteDriver'],
        }),
        postDriver: build.mutation<IDriver[], string>({
            query: (body) => ({
                url: queries.postDriver,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['driver']
        }),
        deleteDriver: build.mutation<IDriver[], string>({
            query: (body) => ({
                url: queries.deleteDriver,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteDriver']
        }),

        editDriver: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editDriver,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['driver']
        }),

    })
})

