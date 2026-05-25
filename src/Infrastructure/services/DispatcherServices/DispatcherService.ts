import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {queries} from "../../const/queries";
import {IDispatcher} from "../../../Domain/dispathcer/const/Dispatcher";
import {prepareHeaders} from "../../const/api";


export const dispatcherAPI = createApi({
    reducerPath: 'DispatcherService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['dispatcher', 'deleteDispatcher'],
    endpoints: (build) => ({
        fetchAllDispatcher: build.query<IDispatcher[], any>({
            query: ({code, id}: any) => ({
                url: queries.getDispatcher,
                params: {
                    code: code,
                    id: id

                }
            }),
            providesTags: result => ['dispatcher', 'deleteDispatcher'],
        }),
        postDispatcher: build.mutation<[], string>({
            query: (body) => ({
                url: queries.postDispatcher,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['dispatcher']
        }),
        deleteDispatcher: build.mutation<[], string>({
            query: (body) => ({
                    url: queries.deleteDispatcher,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteDispatcher']
        }),
        editDispatcher: build.mutation<IDispatcher[], string>({
            query: (body) => ({
                url: queries.editDispatcher,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['dispatcher']
        }),

    })
})

