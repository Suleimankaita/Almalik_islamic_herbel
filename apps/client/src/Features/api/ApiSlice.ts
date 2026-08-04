import {
    fetchBaseQuery,
    createApi
} from "@reduxjs/toolkit/query/react";

import { Mutex } from "async-mutex";
import { setToken, SetUserDetails } from "../AppSlice";


// Mutex for preventing multiple refresh calls
const mutex = new Mutex();


// Base Query
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URI,

    credentials: "include",

    prepareHeaders: (headers, { getState }) => {

        const state = getState() as {
            auth?: {
                Token?: string;
            }
        };


        const token = state.auth?.Token;


        if(token){
            headers.set(
                "authorization",
                `Bearer ${token}`
            );
        }


        return headers;
    }
});



// Custom Error Type
interface ErrorResponse {
    message?: string;
}


// Base Query With Refresh Token
const baseQueryWithReauth = async (
    args: string | any,
    api: any,
    extraOptions: object
) => {


    await mutex.waitForUnlock();


    let result = await baseQuery(
        args,
        api,
        extraOptions
    );



    if(result.error?.status === 401){


        if(!mutex.isLocked()){


            const release = await mutex.acquire();


            try {


                const refreshResult = await baseQuery(
                    {
                        url: "/Auth/refresh",
                        method: "POST"
                    },
                    api,
                    extraOptions
                );



                if(refreshResult.data){


                    api.dispatch(
                        setToken(refreshResult.data)
                    );


                    result = await baseQuery(
                        args,
                        api,
                        extraOptions
                    );


                }else{


                    const errorData =
                        refreshResult.error as any;


                    const message =
                        (errorData.data as ErrorResponse)?.message;



                    if(
                        errorData.status === 401 &&
                        message === "Refresh token missing"
                    ){

                        api.dispatch(
                            setToken(null)
                        );


                        api.dispatch(
                            SetUserDetails(null)
                        );


                        if(window.location.pathname !== "/"){
                            window.location.href="/";
                        }

                    }

                }



            } finally {

                release();

            }



        }else{


            await mutex.waitForUnlock();


            result = await baseQuery(
                args,
                api,
                extraOptions
            );

        }

    }



    if(result.error?.status === 403){


        const errorData =
            result.error as FetchBaseQueryError;


        const message =
            (errorData.data as ErrorResponse)?.message;



        if(message === "Invalid refresh token"){


            api.dispatch(
                setToken(null)
            );


            api.dispatch(
                SetUserDetails(null)
            );


            await baseQuery(
                {
                    url:"/Auth/ForceLogout",
                    method:"POST"
                },
                api,
                extraOptions
            );


            window.location.href="/";

        }

    }



    return result;
};





 const apiSlice = createApi({

    reducerPath:"api",


    baseQuery:baseQueryWithReauth,


    tagTypes:[
        "POST",
        "USER",
        "SystemConfig",
        "Shareholders",
        "Integrations",
        "Nodes",
        "Dashboard"
    ],



    endpoints:(builder)=>({


        refresh:builder.mutation<
            unknown,
            void
        >({

            query:()=>({

                url:"/Auth/refresh",

                method:"POST"

            })

        })


    })

});



export const {
    useRefreshMutation

} = apiSlice;

export default apiSlice