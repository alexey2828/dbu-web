import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IOrder, IOrderState} from "../../../Domain/order/const/IOrder";
import {IOrderStateEntities} from "../../../Domain/order/const/IOrderStateEntities";
import {queries} from "../../const/queries";
import {prepareHeaders} from "../../const/api";


export const orderAPI = createApi({
    reducerPath: 'OrderService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['order', 'postOrder', 'editOrder', 'editOrderState'],
    endpoints: (build) => ({
        fetchAllOrders: build.query<IOrder[], any>({
            query: (data: any) => ({
                url: queries.getOrders,
                params: {
                    id: data.id,
                    idCustomer: data.idCustomer,
                    idPlant: data.idPlant,
                    dispatcher: data.dispatcher,
                    nameRecipe: data.nameRecipe,
                    dateStart: data.dateStart,
                    dateFinish: data.dateFinish
                },
                auth: {
                    username: process.env.REACT_APP_USERNAME,
                    password:  process.env.REACT_APP_PASSWORD
                }
            }),
            providesTags: result => ['order', 'postOrder', 'editOrder', 'editOrderState'],

        }),
        fetchOrderById: build.query<IOrder[], any>({
            query: (id: any) => ({
                url: queries.getOrders,
                params: {
                    id: id
                }
            }),
            providesTags: result => ['order', 'postOrder', 'editOrderState', 'editOrder'],

        }),
        postOrders: build.mutation<IOrder[], string>({
            query: (body) => ({
                url: queries.postOrder,
                method: 'POST',
                body,

            }),
            invalidatesTags: ['postOrder']

        }),
        fetchAllOrderState: build.query<IOrderState[], string>({
            query: (orderId: string | number) => ({
                url: queries.getOrdersState,
                params: {
                    id: orderId
                }
            }),
            providesTags: result => ['order', 'postOrder', 'editOrder', 'editOrderState'],

        }),
        fetchStateEntities: build.query<IOrderStateEntities[] , string>({
            query: () => ({
                url: queries.getOrdersStateEntities,
            }),
            providesTags: result => ['order', 'postOrder', 'editOrder','editOrderState'],

        }),
        putStateEntities: build.mutation<{ state: number; orderId: number; }, string>({
            query: (body) => ({
                url: queries.putOrdersStateEntities,
                method: 'PUT',
                body,

            }),
            invalidatesTags: ['order', 'editOrderState']
        }),

        editOrderFields: build.mutation<any, string>({
            query: (body) => ({
                url: queries.editOrderFields,
                method: 'PUT',
                body,

            }),
            invalidatesTags: ['editOrder']
        }),
    })
})

