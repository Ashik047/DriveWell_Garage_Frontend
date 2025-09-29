import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const branchesApi = createApi({
    reducerPath: 'branchesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Branches'],
    endpoints: (builder) => ({
        getBranches: builder.query({
            query: () => '/branches',
            // transformResponse: res => res.sort((a, b) => b.id - a.id), 
            providesTags: (result) =>
                result
                    ? [
                        { type: 'Branches', id: 'LIST' },
                        ...result.map(({ id }) => ({ type: 'Branches', id })),
                    ]
                    : [{ type: 'Branches', id: 'LIST' }],
        }),
        addBranches: builder.mutation({
            query: (branch) => ({
                url: '/branches',
                method: 'POST',
                body: branch
            }),
            invalidatesTags: [{ type: 'Branches', id: "LIST" }]
        }),
        updateBranches: builder.mutation({
            query: (branch) => ({
                url: `/branches/${branch.id}`,
                method: 'PUT',
                body: branch
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Branches", id }]
        }),
        deleteBranches: builder.mutation({
            query: ({ id }) => ({
                url: `/branches/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Branches", id },
                { type: "Branches", id: "LIST" },
            ]
        }),
    })
})

export const {
    useGetBranchesQuery,
    useAddBranchesMutation,
    useUpdateBranchesMutation,
    useDeleteBranchesMutation
} = branchesApi;