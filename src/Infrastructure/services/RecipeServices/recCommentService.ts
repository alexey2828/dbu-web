import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {queries} from "../../const/queries";
import {IRecComment} from "../../../Domain/recipe/recComment/const/recComment";
import {prepareHeaders} from "../../const/api";

export const recCommentAPI = createApi({
    reducerPath: 'RecCommentService',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    tagTypes: ['recComment', 'deleteRecComment'],
    endpoints: (build) => ({
        fetchAllRecComment: build.query<IRecComment[], string>({
            query: (id) => ({
                url: queries.getRecComment,
                params: {
                    id
                }
            }),
            providesTags: result => ['recComment', 'deleteRecComment'],
        }),

        postRecComment: build.mutation<IRecComment[], string>({
            query: (body) => ({
                url: queries.postRecComment,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['recComment']
        }),

        deleteRecComment: build.mutation<IRecComment[], string>({
            query: (body) => ({
                url: queries.deleteRecComment,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['deleteRecComment']
        }),

        editRecComment: build.mutation<[], string>({
            query: (body) => ({
                url: queries.editRecComment,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['recComment']
        }),
    }),
});
