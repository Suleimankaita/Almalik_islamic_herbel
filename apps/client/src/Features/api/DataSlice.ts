import ApiSlice from "./ApiSlice";
import {
    createEntityAdapter,
} from "@reduxjs/toolkit";


// User Type
interface User {
    _id: string;
    name: string;
    email: string;
}


// Create Entity Adapter
const AppAdapter = createEntityAdapter({
    selectId: (user) => user._id
});


// Initial State
const initialState = AppAdapter.getInitialState();


// API Slice
const DataSlice = ApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        GetAllData: builder.query({
            
            query: () => "AllUsers",

            transformResponse: (responseData: User[]) => {
                return AppAdapter.setAll(
                    initialState,
                    responseData
                );
            },


            providesTags: (result):any=>
                result?.ids
                    ? [
                        ...result.ids.map((id) => ({
                            type: "Users" as const,
                            id
                        })),
                        {
                            type: "Users" as const,
                            id: "LIST"
                        }
                    ]
                    : [
                        {
                            type: "Users" as const,
                            id: "LIST"
                        }
                    ]
        }),
        Login:builder.mutation({
            query:({Username,Password}):any=>({
                url:'/api/auth/Login',
                method:'POST',
                body:{Username,Password}

            })
        }),
        RefreshToken:builder.mutation({
            query:()=>({
                url:'/api/auth/refresh',
                method:'POST'
            })
        }),
        GetAllProducts:builder.query({
            query:({token})=>({
                url:'/api/Product',
                method:'GET',
                headers:{
                    authorization:`Bearer ${token}`
                }
            })
        }),
        GetTransactions:builder.query({
            query:({token, page = 1, limit = 10, startDate, endDate})=>{
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (startDate) params.set('startDate', startDate);
                if (endDate) params.set('endDate', endDate);

                return {
                    url:`/api/transactions?${params.toString()}`,
                    method:'GET',
                    headers:{
                        authorization:`Bearer ${token}`
                    }
                };
            }
        }),
        GetTopSales:builder.query({
            query:({token, limit = 5, startDate, endDate})=>{
                const params = new URLSearchParams({ limit: String(limit) });

                if (startDate) params.set('startDate', startDate);
                if (endDate) params.set('endDate', endDate);

                return {
                    url:`/api/top-sales?${params.toString()}`,
                    method:'GET',
                    headers:{
                        authorization:`Bearer ${token}`
                    }
                };
            }
        }),
    })
});


// Export Hooks
export const {
    useGetAllDataQuery,
    useLoginMutation,
    useRefreshTokenMutation,
    useGetAllProductsQuery,
    useGetTransactionsQuery,
    useGetTopSalesQuery,
} = DataSlice;


// Export Selectors
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = AppAdapter.getSelectors();


export default DataSlice;