import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {queries} from "../../const/queries";
import {IProductForReports} from "../../../Domain/product/const/product";
import {IReports} from "../../../Domain/reports/const/reports";
import {prepareHeaders} from "../../const/api";

export const reportsAPI = createApi({
    reducerPath: 'ReportsService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['reports'],
    endpoints: (build) => ({
        fetchAllProducts: build.query<IProductForReports[], string>({
            query: () => ({
                url: queries.getProduct,
            }),
        }),
        fetchAllCurrentLoopCalculate: build.query<IReports, any>({
            query: (data: any) => ({
                url: queries.getCurrentLoopCalculate,
                params: {
                    idTtn: data.idTtn,
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                    codePlant: data.idPlant,
                    car: data.car,
                    driver: data.driver,
                    order: data.order,
                    timeStartExact: data.timeStartExact,
                    bsuCode: data.bsuCode
                }
            }),
        }),
    }),
});