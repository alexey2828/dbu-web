import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ITtnState} from "../../../Domain/ttn/ttn/const/ttnState";
import {queries} from "../../const/queries";
import {prepareHeaders} from "../../const/api";


export const ttnStateAPI = createApi({
    reducerPath: 'ttnStateAPI',
    baseQuery: fetchBaseQuery({baseUrl: queries.baseUrl,
        prepareHeaders: prepareHeaders
    }),
    endpoints: (build) => ({
        fetchTtnState: build.query<ITtnState[], any>({
            query: (currentTtnId: string) => ({
                url: 'ttnState.php',
                params: {
                    id: currentTtnId
                }
            })
        })
    })
})

