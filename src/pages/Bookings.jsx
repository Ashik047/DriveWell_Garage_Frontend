import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { handleChange, handleReset } from '../helpers/formHelper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAxiosWithToken from '../hooks/useAxiosWithToken';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllBranchesApi } from '../api/branchApi';
import { getAllServicesApi } from '../api/serviceApi';
import { getMyVehiclesApi } from '../api/vehicleApi';
import { addBookingApi, getUnavailableDatesApi } from '../api/bookingApi';
import { toast, ToastContainer } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { Commet } from 'react-loading-indicators';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Bookings = () => {

    const [formSubmitStatus, setFormSubmitStatus] = useState(false);
    const [bookingData, setBookingData] = useState({
        vehicle: "",
        service: "",
        date: "",
        branch: "",
        description: ""
    });

    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if (auth?.role && auth?.role !== "Customer") {
            navigate("/");
        }
    }, [auth?.role]);

    const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY;

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();

    const { data: allBranches, isLoading: allBranchesLoading, isError: allBranchesIsError, error: allBranchesError } = useQuery({
        queryKey: ["Branch"],
        queryFn: () => getAllBranchesApi(["branchName"]),
        select: response => response?.data?.sort((a, b) => (a.branchName.toLowerCase().localeCompare(b.branchName.toLowerCase()))),
    }
    );

    const { data: allServices, isLoading: allServicesLoading, isError: allServicesIsError, error: allServicesError } = useQuery({
        queryKey: ["Service"],
        queryFn: () => getAllServicesApi("serviceName"),
        select: response => response?.data?.sort((a, b) => (a.serviceName.toLowerCase().localeCompare(b.serviceName.toLowerCase()))),
    }
    );

    const { data: myVehicles, isLoading: myVehiclesLoading, isError: myVehiclesIsError, error: myVehiclesError } = useQuery({
        queryKey: ['Vehicle'],
        queryFn: () => getMyVehiclesApi({ axiosWithToken, type: "vehicle" }),
        select: response => response?.data?.sort((a, b) => (a.vehicle.toLowerCase().localeCompare(b.vehicle.toLowerCase()))),
        enabled: !!auth?.accessToken
    }
    );

    const { data: unavailableDates, isLoading: unavailableDatesLoading, isError: unavailableDatesIsError, error: unavailableDatesError } = useQuery({
        queryKey: ['Date', bookingData.branch.branchName, bookingData.service],
        queryFn: () => getUnavailableDatesApi({ axiosWithToken, branch: bookingData.branch.branchName, service: bookingData.service }),
        enabled: !!bookingData.service && !!bookingData.branch.branchName && !!auth?.accessToken
    }
    );

    const addBookingMutation = useMutation(addBookingApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });

    const isUnavailable = (date) => {
        if (unavailableDates) {
            const dateArray = unavailableDates?.data?.map(date => new Date(date).toISOString().split("T")[0])
            return dateArray?.includes(date);
        }
    };

    const handleBookingSubmit = async () => {
        setFormSubmitStatus(true);
        if (bookingData.vehicle && bookingData.service && bookingData.branch && bookingData.date) {
            try {
                const stripe = await loadStripe(STRIPE_KEY);
                const result = await addBookingMutation.mutateAsync({ axiosWithToken, reqBody: bookingData });
                const checkoutUrl = result?.data?.url;
                if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                } else {
                    toast.error("Something went wrong.");
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
            }
        }

    }

    const handleFormReset = () => {
        handleReset(bookingData, setBookingData);
        setFormSubmitStatus(false);
    };

    return (

        <>
            <Header />
            <main className="grow px-4 py-6 rounded-md">
                <h2 className="mt-4 text-center font-bold text-4xl">Book Your Service</h2>
                <p className="text-center text-lg mt-3 text-dim-black">Schedule an appointment with our expert mechanics</p>
                <form className="w-full shadow-[5px_5px_10px_1px_#cdcdcd] px-15 py-10 mt-8" onSubmit={handleBookingSubmit}>
                    <FormControl fullWidth>
                        <InputLabel id="vehicle">Select Your Vehicle</InputLabel>
                        <Select
                            labelId="vehicle"
                            id="vehicle"
                            name='vehicle'
                            value={bookingData.vehicle}
                            label="Select Your Vehicle"
                            onChange={(e) => handleChange(e, setBookingData)}>
                            {
                                myVehicles?.map((vehicle => (
                                    <MenuItem value={vehicle}>{vehicle.vehicle}</MenuItem>

                                )))
                            }
                        </Select>


                    </FormControl>
                    <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || bookingData.vehicle) && "hidden" }}>Vehicle is required</p>
                    <FormControl fullWidth >
                        <InputLabel id="branch">Select Branch</InputLabel>
                        <Select
                            labelId="branch"
                            id="branch"
                            name='branch'
                            defaultValue={bookingData.branch}
                            value={bookingData.branch}
                            label="Select Branch"
                            onChange={(e) => handleChange(e, setBookingData)}>
                            {
                                allBranches?.map((branch => (
                                    <MenuItem value={branch}>{branch.branchName}</MenuItem>

                                )))
                            }
                        </Select>
                    </FormControl>
                    <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || bookingData.branch) && "hidden" }}>Branch is required</p>
                    <FormControl fullWidth >
                        <InputLabel id="service">Select Service</InputLabel>
                        <Select
                            labelId="service"
                            id="service"
                            name='service'
                            defaultValue={bookingData.service}
                            value={bookingData.service}
                            label="Select Service"
                            onChange={(e) => handleChange(e, setBookingData)}>
                            {
                                allServices?.map((service => (
                                    <MenuItem value={service.serviceName}>{service.serviceName}</MenuItem>

                                )))
                            }
                        </Select>
                    </FormControl>
                    <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || bookingData.service) && "hidden" }}>Service is required</p>

                    <TextField id="date" name='date' variant="outlined" type="date" className='w-full' onChange={(e) => handleChange(e, setBookingData)} value={bookingData.date} />
                    <p className='text-red-700 text-sm ms-1 mb-2 absolute' style={{ visibility: !isUnavailable(bookingData.date) && "hidden" }}>This date is fully booked!</p>
                    <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || bookingData.date) && "hidden" }}>Date is required</p>

                    <TextField id="description" name='description' variant="outlined" label="Describe the issue" type="text" multiline onChange={(e) => handleChange(e, setBookingData)} value={bookingData.description} fullWidth sx={{ mt: 1 }} rows={4} />
                    <div className='flex gap-5 justify-center'>
                        <button type='button' className='mt-9 bg-red-700 text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={addBookingMutation.isPending} onClick={handleFormReset}>Reset</button>
                        <button type='button' className='mt-9 bg-green-700 text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={addBookingMutation.isPending || isUnavailable(bookingData.date)} onClick={handleBookingSubmit}>Book Appoinment</button>
                    </div>
                </form>
                <p className='mt-12 mb-6 text-center text-dim-black'>Need help? Contact us at <a href="tel:+919747991662" className='text-accent'>+91-9747991662</a></p>
            </main >
            {(addBookingMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
            <Footer />
        </>


    )
}

export default Bookings