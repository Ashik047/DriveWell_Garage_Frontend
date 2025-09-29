import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const servicesApi = createApi({
    reducerPath: 'servicesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Services'],
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => '/services',
            // transformResponse: res => res.sort((a, b) => b.id - a.id), 
            providesTags: (result) =>
                result
                    ? [
                        { type: 'Services', id: 'LIST' },
                        ...result.map(({ id }) => ({ type: 'Services', id })),
                    ]
                    : [{ type: 'Services', id: 'LIST' }],
        }),
        addServices: builder.mutation({
            query: (service) => ({
                url: '/services',
                method: 'POST',
                body: service
            }),
            invalidatesTags: [{ type: 'Services', id: "LIST" }]
        }),
        updateServices: builder.mutation({
            query: (service) => ({
                url: `/services/${service.id}`,
                method: 'PUT',
                body: service
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Services", id }]
        }),
        deleteServices: builder.mutation({
            query: ({ id }) => ({
                url: `/services/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Services", id },
                { type: "Services", id: "LIST" },
            ]
        }),
    })
})

export const {
    useGetServicesQuery,
    useAddServicesMutation,
    useUpdateServicesMutation,
    useDeleteServicesMutation
} = servicesApi;