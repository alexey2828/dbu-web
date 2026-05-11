import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IReportCurrentLoop} from "../../../Domain/product/reportCurrentLoop/const/reportCurrentLoop";
import {IProductForReports} from "../../../Domain/product/const/product";
import {prepareHeaders} from "../../const/api";

export const reportCurrentLoopAPI = createApi({
    reducerPath: 'ReportCurrentLoopService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['reportCurrentLoop', 'deleteReportCurrentLoop'],

    endpoints: (build) => ({
        fetchAllReportCurrentLoop: build.query<IReportCurrentLoop[], string>({
            query: () => ({
                url: queries.getReportCurrentLoop,
            }),
            providesTags: result => ['reportCurrentLoop', 'deleteReportCurrentLoop'],
        }),
        postReportCurrentLoop: build.mutation<IReportCurrentLoop[], string>({
            query: (body) => ({
                url: queries.postReportCurrentLoop,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['reportCurrentLoop']
        }),
        deleteReportCurrentLoop: build.mutation<IReportCurrentLoop[], string>({
            query: (body) => ({
                url: queries.deleteReportCurrentLoop,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteReportCurrentLoop']
        }),
    }),
});
