import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {prepareHeaders} from "../../const/api";

export const recipeAPI = createApi({
    reducerPath: 'RecipeService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['recipe', 'deleteRecipe'],

    endpoints: (build) => ({
        fetchAllRecipe: build.query<[], string>({
            query: (id) => ({
                url: queries.getRecipe,
                params: {
                    id
                }
            }),
            providesTags: result => ['recipe', 'deleteRecipe'],

        }),

        postRecipe: build.mutation<[], any>({
            query: (body:any) => ({
                url: queries.postRecipe,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recipe']
        }),

        postRecipeDescription: build.mutation<[], any>({
            query: (body:any) => ({
                url: 'create/createRecipeDescription.php',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recipe']
        }),

        deleteRecipe: build.mutation<[], string>({
            query: (body) => ({
                url: queries.deleteRecipe,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteRecipe']
        }),

        getRecipeDescription: build.query<[], string>({
            query: (codeRecipe) => ({
                url: 'recipeDescription.php',
                method: 'GET',
                params: {
                    codeRecipe
                }
            }),
            providesTags: result => ['recipe', 'deleteRecipe'],
        }),
        fetchAllRecipeState: build.query<[], string>({
            query: () => ({
                url: 'recipeState.php',
                method: 'GET',
            }),
        })
    }),
});
