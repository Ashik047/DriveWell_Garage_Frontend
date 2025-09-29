import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const reviewsApi = createApi({
    reducerPath: 'reviewsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Reviews'],
    endpoints: (builder) => ({
        getReviews: builder.query({
            query: () => '/reviews',
            // transformResponse: res => res.sort((a, b) => b.id - a.id), 
            providesTags: (result) =>
                result
                    ? [
                        { type: 'Reviews', id: 'LIST' },
                        ...result.map(({ id }) => ({ type: 'Reviews', id })),
                    ]
                    : [{ type: 'Reviews', id: 'LIST' }],
        }),
        addReviews: builder.mutation({
            query: (review) => ({
                url: '/reviews',
                method: 'POST',
                body: review
            }),
            invalidatesTags: [{ type: 'Reviews', id: "LIST" }]
        }),
        updateReviews: builder.mutation({
            query: (review) => ({
                url: `/reviews/${review.id}`,
                method: 'PUT',
                body: review
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Reviews", id }]
        }),
        deleteReviews: builder.mutation({
            query: ({ id }) => ({
                url: `/reviews/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Reviews", id },
                { type: "Reviews", id: "LIST" },
            ]
        }),
    })
})

export const {
    useGetReviewsQuery,
    useAddReviewsMutation,
    useUpdateReviewsMutation,
    useDeleteReviewsMutation
} = reviewsApi;