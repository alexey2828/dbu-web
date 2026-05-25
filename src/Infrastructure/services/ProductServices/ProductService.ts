import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {IProductForReports} from "../../../Domain/product/const/product";
import {queries} from "../../const/queries";
import {ISliCem} from "../../../Domain/recipe/SilCem/const/SliCem";
import {prepareHeaders} from "../../const/api";

export const productAPI = createApi({
    reducerPath: 'ProductService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['product', 'deleteProduct'],

    endpoints: (build) => ({
        fetchAllProducts: build.query<IProductForReports[], string>({
            query: () => ({
                url: queries.getProduct,
            }),
            providesTags: result => ['product', 'deleteProduct'],
        }),
        postProduct: build.mutation<IProductForReports[], string>({
            query: (body) => ({
                url: queries.postProduct,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['product']
        }),
        deleteProduct: build.mutation<IProductForReports[], string>({
            query: (body) => ({
                url: queries.deleteProduct,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteProduct']
        }),
    }),
});
