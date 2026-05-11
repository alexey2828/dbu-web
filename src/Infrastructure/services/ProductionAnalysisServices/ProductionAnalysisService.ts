import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {prepareHeaders} from "../../const/api";

export const productionAnalysisAPI = createApi({
    reducerPath: 'productionAnalysisService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['productionAnalysis'],

    endpoints: (build) => ({
        fetchGraphAnalysis: build.query<any, string>({
            query: ({timeStart, timeEnd, step, bsuCode}: any) => ({
                url: queries.graphAnalysis,
                params: {
                    timeStart,
                    timeEnd,
                    step,
                    bsuCode
                }
            }),
            providesTags: result => ['productionAnalysis'],

        }),
    }),
});
