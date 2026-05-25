import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IReportWeightManual} from "../../../Domain/product/reportWeightManual/const/reportWeightManual";
import {IReportCurrentLoop} from "../../../Domain/product/reportCurrentLoop/const/reportCurrentLoop";
import {prepareHeaders} from "../../const/api";

export const reportWeightManualAPI = createApi({
    reducerPath: 'ReportsWeightManualService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['reportWeightManual', 'deleteReportWeightManual'],

    endpoints: (build) => ({
        fetchAllReportWeightManual: build.query<IReportWeightManual[], string>({
            query: () => ({
                url: queries.getReportWeightManual,
            }),
            providesTags: result => ['reportWeightManual', 'deleteReportWeightManual'],
        }),

        postReportWeightManual: build.mutation<IReportWeightManual[], string>({
            query: (body) => ({
                url: queries.postReportWeightManual,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['reportWeightManual']
        }),
        deleteReportWeightManual: build.mutation<IReportWeightManual[], string>({
            query: (body) => ({
                url: queries.deleteReportWeightManual,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteReportWeightManual']
        }),
    }),
});
