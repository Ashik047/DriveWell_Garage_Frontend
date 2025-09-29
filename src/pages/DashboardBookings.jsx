import React from 'react'
import { bookingData } from '../constants/BookingData'
import BookingDetail from '../components/BookingDetail'
import { useState } from 'react'
import { useGetBookingsQuery } from '../redux/slices/bookingsApi'

const DashBookings = ({ role }) => {

    // const { data:bookingsDetails, error: bookingsError, isLoading: bookingsLoading, refetch: bookingsRefetch } = useGetBookingsQuery(); 

    return (
        <section className='mt-10'>
            <h3 className='text-2xl font-bold'>{(role === "customer") && <span>Your </span>}Bookings</h3>
            {(role === "customer") ? <div className='flex flex-col gap-8 mt-8'>
                {
                    bookingData?.filter(booking => (booking.customerName === "John Alex"))?.map((booking) => (
                        <BookingDetail key={booking.id} bookingDetails={booking} role={role} />
                    ))
                }
            </div> :
                <div className='flex flex-col gap-8 mt-8'>
                    {
                        bookingData?.map((booking) => (
                            <BookingDetail key={booking.id} bookingDetails={booking} role={role} />
                        ))
                    }
                </div>
            }
        </section>
    )
}

export default DashBookings