import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IClassRecipe} from "../../../Domain/recipe/classRecipe/const/IClassRecipe";
import {ICar} from "../../../Domain/car/const/car";
import {prepareHeaders} from "../../const/api";

export const classRecipeAPI = createApi({
    reducerPath: 'ClassRecipeService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['classRecipe', 'deleteClassRecipe'],

    endpoints: (build) => ({
        fetchAllClassRecipe: build.query<IClassRecipe[], string>({
            query: (classRecipeId: any) => ({
                url: queries.getClassRecipe,
                params: {
                    id: classRecipeId
                }
            }),
            providesTags: result => ['classRecipe', 'deleteClassRecipe'],

        }),
        deleteClassRecipe: build.mutation<IClassRecipe[], string>({
            query: (body) => ({
                url: queries.deleteClassRecipe,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteClassRecipe']
        }),
        postClassRecipe: build.mutation<IClassRecipe[], string>({
            query: (body) => ({
                url: queries.postClassRecipe,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['classRecipe']
        }),
        editClassRecipe: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editMixture,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['classRecipe']
        }),

    }),
});
