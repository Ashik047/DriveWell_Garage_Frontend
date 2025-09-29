import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookingsApi = createApi({
    reducerPath: 'bookingsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        getBookings: builder.query({
            query: () => '/bookings',
            // transformResponse: res => res.sort((a, b) => b.id - a.id), 
            providesTags: (result) =>
                result
                    ? [
                        { type: 'Bookings', id: 'LIST' },
                        ...result.map(({ id }) => ({ type: 'Bookings', id })),
                    ]
                    : [{ type: 'Bookings', id: 'LIST' }],
        }),
        addBookings: builder.mutation({
            query: (booking) => ({
                url: '/bookings',
                method: 'POST',
                body: booking
            }),
            invalidatesTags: [{ type: 'Bookings', id: "LIST" }]
        }),
        updateBookings: builder.mutation({
            query: (booking) => ({
                url: `/bookings/${booking.id}`,
                method: 'PUT',
                body: booking
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Bookings", id }]
        }),
        deleteBookings: builder.mutation({
            query: ({ id }) => ({
                url: `/bookings/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Bookings", id },
                { type: "Bookings", id: "LIST" },
            ]
        }),
    })
})

export const {
    useGetBookingsQuery,
    useAddBookingsMutation,
    useUpdateBookingsMutation,
    useDeleteBookingsMutation
} = bookingsApi;