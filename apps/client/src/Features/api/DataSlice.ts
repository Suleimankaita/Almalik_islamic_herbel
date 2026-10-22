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
        Registration:builder.mutation({
            query:({Username,Password,FirstName,LastName,Role}):any=>({
                url:'/api/auth/Reg',
                method:'POST',
                body:{Username,Password,FirstName,LastName,Role}

            })
        }),
        RefreshToken:builder.mutation({
            query:()=>({
                url:'/api/auth/refresh',
                method:'POST'
            })
        }),
        GetUserSettings: builder.query({
            query: ({id}) => ({
                url: 'api/profile',
                method: 'GET',
            }),
            providesTags: (result): any =>
                result ? [{ type: 'USER' as const, id: 'CURRENT' }] : [{ type: 'USER' as const, id: 'CURRENT' }],
        }),
        UpdateUserSettings: builder.mutation({
            query: (body: any) => ({
                url: 'api/profile',
                method: 'PUT',
                body,
            }),
            invalidatesTags: [
                { type: 'USER' as const, id: 'CURRENT' },
                { type: 'Products' as const, id: 'LIST' },
            ],
        }),
        
        UpadateProfileImg: builder.mutation({
            query: (body: any) => ({
                url: 'api/profile',
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'USER' as const, id: 'CURRENT' }],
        }),

        ChangeUserPassword: builder.mutation({
            query: ({ newPassword }: { newPassword: string }) => ({
                url: 'api/profile/password',
                method: 'PUT',
                body: { newPassword },
            }),
        }),
        DeleteUserAccount: builder.mutation({
            query: () => ({
                url: 'api/profile',
                method: 'DELETE',
            }),
        }),
        DeleteProfileImg: builder.mutation({
            query: (token) => ({
                url: 'api/profile/img',
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }),
        }),
        GetAllProducts:builder.query({
            query:({token, filter = 'all', threshold}: { token?: string; filter?: string; threshold?: number })=>{
                const params = new URLSearchParams();
                if (filter) params.set('filter', filter);
                if (threshold !== undefined) params.set('threshold', String(threshold));

                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url:`/api/Product?${params.toString()}`,
                    method:'GET',
                    headers: Object.keys(headers).length ? headers : undefined
                };
            },
            providesTags: (result):any =>
                result?.products
                    ? [
                        ...result.products.map((product:any) => ({
                            type: "Products" as const,
                            id: product._id || product.id
                        })),
                        { type: "Products" as const, id: "LIST" }
                    ]
                    : [{ type: "Products" as const, id: "LIST" }]
        }),
        GetLowStockProducts: builder.query({
            query: () => ({
                url: '/api/Product/low-stock',
                method: 'GET',
            }),
            providesTags: (result): any =>
                result?.products
                    ? [
                        ...result.products.map((product: any) => ({
                            type: "Products" as const,
                            id: product._id || product.id,
                        })),
                        { type: "Products" as const, id: "LIST" },
                    ]
                    : [{ type: "Products" as const, id: "LIST" }],
        }),
        GetProduct: builder.query({
            query:({token,id}:{token?: string; id:string})=>{
                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url:`/api/Product/${id}`,
                    method:'GET',
                    headers: Object.keys(headers).length ? headers : undefined
                };
            },
            providesTags: (result, error, arg):any => [{ type: "Products" as const, id: arg.id }]
        }),
        GetAllUser: builder.query({
            query:({token,id}:{token?: string; id:string})=>{
                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url:`/api/AllUsers/`,
                    method:'GET',
                    headers: Object.keys(headers).length ? headers : undefined
                };
            },
            providesTags: (result, error, arg):any => [{ type: "Products" as const, id: arg.id }]
        }),
        UpdateProduct: builder.mutation({
            query:({token,id,product}:{token?: string; id:string; product:any})=>{
                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url:`/api/Product/${id}`,
                    method:'PUT',
                    body: product,
                    headers:{
                        authorization:`Bearer ${token}`
                    }
                };
            },
            invalidatesTags: (result, error, arg):any => [
                { type: "Products" as const, id: arg.id },
                { type: "Products" as const, id: "LIST" }
            ]
        }),
         CreateProduct: builder.mutation({
        query: ({ formData, token }) => ({
        url: `/api/Product`,
        method: "POST",
        body: formData,
        headers: {
        
            authorization:`Bearer ${token}`
        
        },
    }),

    invalidatesTags: [
        {
            type: "Products",
            id: "LIST",
        },
    ],
}),
        SetProductStatus: builder.mutation({
            query: ({ token, id, status }: { token?: string; id: string; status: 'Active' | 'Inactive' }) => {
                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url: `/api/Product/${id}/status`,
                    method: 'PATCH',
                    body: { Status: status },
                    headers: Object.keys(headers).length ? headers : undefined,
                };
            },
            invalidatesTags: (result, error, arg): any => [
                { type: "Products" as const, id: arg.id },
                { type: "Products" as const, id: "LIST" },
            ],
        }),
        CreateSale: builder.mutation({
            query: (body: any) => ({
                url: `/api/sales`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: "Products" as const, id: "LIST" }]
        }),
        DeleteProduct: builder.mutation({
            query:({token,id}:{token?: string; id:string})=>{
                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url:`/api/Product/${id}`,
                    method:'DELETE',
                    headers: Object.keys(headers).length ? headers : undefined
                };
            },
            invalidatesTags: [{ type: "Products" as const, id: "LIST" }]
        }),
        GetTransactions:builder.query({
            query:({token, page = 1, limit = 10, startDate, endDate, productName}:{token?: string; page?: number; limit?: number; startDate?: string; endDate?: string; productName?: string})=>{
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (startDate) params.set('startDate', startDate);
                if (endDate) params.set('endDate', endDate);
                if (productName) params.set('productName', productName);

                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url:`/api/transactions?${params.toString()}`,
                    method:'GET',
                    headers: Object.keys(headers).length ? headers : undefined
                };
            }
        }),
        GetTopSales:builder.query({
            query:({token, limit = 5, startDate, endDate})=>{
                const params = new URLSearchParams({ limit: String(limit) });

                if (startDate) params.set('startDate', startDate);
                if (endDate) params.set('endDate', endDate);

                const headers: Record<string, string> = {};
                if (token) headers.authorization = `Bearer ${token}`;

                return {
                    url:`/api/top-sales?${params.toString()}`,
                    method:'GET',
                    headers: Object.keys(headers).length ? headers : undefined
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
    useGetUserSettingsQuery,
    useUpdateUserSettingsMutation,
    useChangeUserPasswordMutation,
    useDeleteUserAccountMutation,
    useGetAllProductsQuery,
    useGetLowStockProductsQuery,
    useGetProductQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateProductMutation,
    useSetProductStatusMutation,
    useCreateSaleMutation,
    useGetTransactionsQuery,
    useGetTopSalesQuery,
    useGetAllUserQuery,
    useDeleteProfileImgMutation,
    useUpadateProfileImgMutation,
    useRegistrationMutation
} = DataSlice;


// Export Selectors
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = AppAdapter.getSelectors();


export default DataSlice;