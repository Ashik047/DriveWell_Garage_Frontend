import React from 'react'
// import { bookingData } from '../constants/BookingData'
import BookingDetail from '../components/BookingDetail'
import { useState } from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import { getBookingApi } from '../api/bookingApi'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const DashBookings = () => {

    const [activeStatus, setActiveStatus] = useState("In Progress");
    const { auth } = useContext(AuthContext);

    const axiosWithToken = useAxiosWithToken();

    const { data: bookingData, isLoading: bookingDataLoading, isError: bookingDataIsError, error: bookingDataError } = useQuery({
        queryKey: ['Booking'],
        queryFn: () => getBookingApi({ axiosWithToken }),
        select: response => response?.data?.sort((a, b) => (a.date - b.date)),
        enabled: !!auth?.accessToken
    }
    );

    return (
        <section className='mt-10'>
            <div className='flex justify-between'>
                <h3 className='text-2xl font-bold'>{(auth?.role === "Customer") && <span>Your </span>}Bookings</h3>
                <FormControl className='w-[150px]'>
                    <select
                        className='border rounded-md px-4 py-1.5'
                        id="status"
                        name='status'
                        value={activeStatus}
                        onChange={(e) => setActiveStatus(e.target.value)}>
                        <option className='rounded-t-md' value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </FormControl>
            </div>

            <div className='flex flex-col gap-8 mt-8'>
                {
                    bookingData?.filter(booking => booking.status === activeStatus)?.length > 0 ?
                        bookingData?.filter(booking => booking.status === activeStatus)?.map((booking) => (
                            <BookingDetail key={booking?._id} bookingDetails={booking} />
                        )) :
                        <>
                            <p className='-mt-1 text-dim-black'>{`No bookings with status "${activeStatus}" available yet.`}</p>
                            <img src="/empty.gif" alt="Empty" className='w-[300px] block mx-auto' />
                        </>
                }
            </div>
        </section>
    )
}

export default DashBookings