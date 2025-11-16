import React, { useContext, useMemo } from 'react'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import { useQuery } from '@tanstack/react-query';
import { getDataApi } from '../api/dataApi';
import { Calendar1Icon, CarIcon, StoreIcon, UsersIcon, WrenchIcon } from 'lucide-react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import AuthContext from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const getBookingCount = (bookings) => {
    return useMemo(() => {
        if (!bookings?.length) return [];

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Get the previous 4 months (excluding current)
        const months = [];
        for (let i = 4; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            months.push({
                name: date.toLocaleString("default", { month: "short" }), // e.g. "Jul"
                month: date.getMonth(),
                year: date.getFullYear(),
            });
        }

        // Initialize data structure
        const data = months.map((m) => ({
            name: m.name,
            count: 0
        }));

        // Calculate totals
        bookings.forEach((booking) => {
            const date = new Date(booking.date);
            const month = date.getMonth();
            const year = date.getFullYear();

            const match = months.find((m) => m.month === month && m.year === year);
            if (match) {
                const target = data.find((d) => d.name === match.name);
                target.count++;
            }
        });

        return data;
    }, [bookings]);
};

const DashboardHome = () => {

    const { auth } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.role && auth?.role !== "Manager") {
            navigate("/");
        }
    }, [auth?.role]);

    const axiosWithToken = useAxiosWithToken();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["Data"],
        queryFn: () => getDataApi({ axiosWithToken })
    });
    console.log(data);

    const bookingCountDetails = getBookingCount(data?.data?.bookings);

    return (
        <main>
            <section className='grid sm:grid-cols-3 grid-cols-2 gap-20 mt-25'>
                <div className='text-center'>
                    <Calendar1Icon size={40} className="inline me-2 transform translate-x-1 text-accent" />
                    <p className='mt-4 text-4xl font-semibold'>{data?.data?.noOfBookings}</p>
                    <p className='mt-4 text-dim-black text-2xl'>Total Bookings</p>
                </div>
                <div className='text-center'>
                    <UsersIcon size={40} className="inline me-2 transform translate-x-1 text-accent" />
                    <p className='mt-4 text-4xl font-semibold'>{data?.data?.noOfCustomers}</p>
                    <p className='mt-4 text-dim-black text-2xl'>Total Customers</p>
                </div>
                <div className='text-center'>
                    <CarIcon size={40} className="inline me-2 transform translate-x-1 text-accent" />
                    <p className='mt-4 text-4xl font-semibold'>{data?.data?.noOfVehicles}</p>
                    <p className='mt-4 text-dim-black text-2xl'>Total Vehicles</p>
                </div>
                <div className='text-center'>
                    <UsersIcon size={40} className="inline me-2 transform translate-x-1 text-accent" />
                    <p className='mt-4 text-4xl font-semibold'>{data?.data?.noOfStaff}</p>
                    <p className='mt-4 text-dim-black text-2xl'>Total Staff</p>
                </div>
                <div className='text-center'>
                    <WrenchIcon size={40} className="inline me-2 transform translate-x-1 text-accent" />
                    <p className='mt-4 text-4xl font-semibold'>{data?.data?.noOfServices}</p>
                    <p className='mt-4 text-dim-black text-2xl'>Total Services</p>
                </div>
                <div className='text-center'>
                    <StoreIcon size={40} className="inline me-2 transform translate-x-1 text-accent" />
                    <p className='mt-4 text-4xl font-semibold'>{data?.data?.noOfBranches}</p>
                    <p className='mt-4 text-dim-black text-2xl'>Total Branches</p>
                </div>
            </section>
            <section className='w-full sm:w-[80%] lg:w-[50%] aspect-3/2 mx-auto mt-30'>
                <h2 className='text-center text-4xl font-semibold mb-20'>Booking Overview (Last 5 Months)</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart responsive data={bookingCountDetails}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis width="auto" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#15803D" isAnimationActive={true} barSize={100} />
                    </BarChart>
                </ResponsiveContainer>
            </section>

        </main>
    )
}

export default DashboardHome