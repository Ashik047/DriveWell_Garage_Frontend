import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import {
    CalendarIcon,
    CarIcon,
    Clock4,
    MessageSquareIcon,
    Trash
} from 'lucide-react'
import { useState } from 'react';
import { workerNotes } from '../constants/workerNotes';
import ModalBackground from './ModalBackground';
import { format } from "date-fns";
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { Commet } from 'react-loading-indicators';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosWithToken from '../hooks/useAxiosWithToken';
import { deleteBookingApi, editBookingStatusApi } from '../api/bookingApi';


const BookingDetail = ({ bookingDetails }) => {
    const [detailsStatus, setDetailsStatus] = useState(false);
    const [activeTab, setActiveTab] = useState("bookingDetails")
    const [workingNotes, setWorkingNotes] = useState("");
    const [workingStatus, setWorkingStatus] = useState(bookingDetails?.status);

    const { auth } = useContext(AuthContext);

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();

    const editBookingStatusMutation = useMutation(editBookingStatusApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });

    const deleteBookingMutation = useMutation(deleteBookingApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });


    const handleSubmitNote = async () => {
        /* api */


        setWorkingNotes("");
    };
    const handleNoteClose = () => {
        setWorkingNotes("");
    };

    const handleNoteDelete = async () => {
        /* api */

    };

    const handleCancelBookingStatus = () => {
        setWorkingStatus(bookingDetails?.status);
    };

    const handleSaveBookingStatus = async () => {
        if (workingStatus === bookingDetails?.status) {
            return toast.info("Same status selected — no changes made.")
        }
        try {
            const result = await editBookingStatusMutation.mutateAsync({ axiosWithToken, reqBody: { status: workingStatus }, id: bookingDetails._id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };
    const handleBookingDelete = async () => {
        try {
            const result = await deleteBookingMutation.mutateAsync({ axiosWithToken, id: bookingDetails._id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };
    console.log(bookingDetails);


    return (
        <div className='w-full shadow-[5px_5px_10px_1px_#cdcdcd] p-6'>
            <div className='flex justify-between'>
                <div>
                    <h4 className='font-bold text-xl mt-3'>{bookingDetails?.service}</h4>
                    <p className='text-dim-black mt-3'><CarIcon size={15} className='inline me-2 transform -translate-y-1' />{bookingDetails?.vehicle.vehicleName}</p>
                    <p className='text-dim-black'><CalendarIcon size={15} className='inline me-2 transform -translate-y-1' />{format(bookingDetails?.date, 'dd MMM yyyy')}</p>
                </div>
                <div className='flex flex-col justify-start items-end'>
                    {((auth?.role === "Manager") || (auth?.role === "Customer")) && <button className='text-red-600 -mt-2 mb-4 block hover:opacity-60 cursor-pointer me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={deleteBookingMutation.isPending} onClick={handleBookingDelete}><Trash size={15} /></button>}
                    <div className={bookingDetails?.status === "Completed" ? "px-2 py-0.5 rounded-4xl bg-green-200 text-sm" : bookingDetails?.status === "Pending" ? "px-2 py-0.5 rounded-4xl bg-yellow-200 text-sm" : "px-2 py-0.5 rounded-4xl bg-blue-200 text-sm"}>{bookingDetails?.status}</div>
                </div>
            </div>
            <div className='flex gap-2 flex-col items-end'>
                <button className='text-accent cursor-pointer hover:opacity-75 font-bold' onClick={() => (setDetailsStatus(true))}>View Details</button>
            </div>



            {/* dark screen */}
            {detailsStatus && <ModalBackground zIndex={11} />}


            {/* detail modal */}
            {
                detailsStatus &&
                <div className="fixed bg-white top-[10%] left-[50%] transform -translate-x-[50%] z-20 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray] max-h-[80vh]">
                    <button className='hover:text-accent absolute -right-8 -top-8 cursor-pointer disabled:hover:text-dim-black disabled:text-dim-black disabled:cursor-not-allowed' disabled={editBookingStatusMutation.isPending} onClick={() => setDetailsStatus(false)}><FontAwesomeIcon icon={faXmark} className='text-xl' /></button>
                    {(auth?.role === "Manager" || auth?.role === "Staff") && <div className='w-full flex justify-between items center'>
                        <button disabled={editBookingStatusMutation.isPending} className='disabled:cursor-not-allowed w-full px-4 py-4 font-semibold rounded-tl-lg' style={activeTab === "bookingDetails" ? { color: "#F97316", backgroundColor: "white" } : { backgroundColor: "#D1D5DB", color: "black" }} onClick={() => setActiveTab("bookingDetails")}>Booking Details</button>
                        <button disabled={editBookingStatusMutation.isPending} className='disabled:cursor-not-allowed w-full px-4 py-4 font-semibold' style={activeTab === "notes" ? { color: "#F97316", backgroundColor: "white" } : { backgroundColor: "#D1D5DB", color: "black" }} onClick={() => setActiveTab("notes")}>Booking Details</button>
                        <button disabled={editBookingStatusMutation.isPending} className='disabled:cursor-not-allowed w-full px-4 py-4 font-semibold rounded-tr-lg' style={activeTab === "bookingStatus" ? { color: "#F97316", backgroundColor: "white" } : { backgroundColor: "#D1D5DB", color: "black" }} onClick={() => setActiveTab("bookingStatus")}>Booking Details</button>
                    </div>}
                    {activeTab === "bookingDetails" && <div className="px-4 pt-10 pb-15">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>Booking Details</h5>
                        </div>

                        <hr className='mt-3 text-dim-black opacity-30' />
                        <div className='flex items-center justify-between mt-5'>
                            <h6 className='font-bold text-xl'>{bookingDetails?.service}</h6>
                            <div className={bookingDetails?.status === "Completed" ? "px-2 py-0.5 rounded-4xl bg-green-200 text-sm" : bookingDetails?.status === "Pending" ? "px-2 py-0.5 rounded-4xl bg-yellow-200 text-sm" : "px-2 py-0.5 rounded-4xl bg-blue-200 text-sm"}>{bookingDetails?.status}</div>
                        </div>
                        <p className='mt-8 text-dim-black'><CalendarIcon size={15} className='inline me-2' />{format(bookingDetails?.date, 'dd MMM yyyy')}</p>
                        <p className='mt-2 text-dim-black'><CarIcon size={15} className='inline me-2' />{bookingDetails?.vehicle.vehicleName}</p>
                        <p className='font-medium mt-6'>Your Description</p>
                        <p className='text-dim-black'>{bookingDetails?.description ? bookingDetails?.description : "No description provided."}</p>
                    </div>}
                    {activeTab === "notes" && <div className="px-4 py-6">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>Notes</h5>
                        </div>

                        <hr className='mt-3 text-dim-black opacity-30 mb-10' />
                        <TextField id="workingNotes" name='workingNotes' variant="outlined" type="text" className='w-full mt-6' label="Notes" onChange={(e) => setWorkingNotes(e.target.value)} value={workingNotes} required />
                        <button type="button" className='px-4 py-2 mt-4 block ms-auto bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={handleSubmitNote}>Add Note</button>
                        <div className='flex flex-col gap-8 mt-10 max-h-[300px] overflow-y-scroll'>
                            {
                                workerNotes?.map((note) => (
                                    <div key={note.id} className='shadow-[5px_5px_10px_1px_#cdcdcd] p-8 flex justify-between gap-2'>
                                        <div>
                                            <p className='font-bold text-lg'><MessageSquareIcon size={16} className='inline me-2' /> {note.name}</p>
                                            <p className='text-sm text-dim-black mt-2'>{note.date} - {note.time}</p>
                                            <p className='mt-2 text-dim-black'>{note.note}</p>
                                        </div>
                                        <button className='cursor-pointer hover:opacity-75 text-red-600 mb-auto' onClick={handleNoteDelete}><Trash size={15} /></button>

                                    </div>
                                ))
                            }
                        </div>
                    </div>}
                    {activeTab === "bookingStatus" && <div className="px-4 pt-10 pb-15">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>Update Booking Status</h5>
                        </div>

                        <hr className='mt-3 text-dim-black opacity-30' />
                        <h6 className='mt-6 font-bold text-lg'>Current Status</h6>
                        <div className={bookingDetails?.status === "Completed" ? "px-2 w-fit mt-4 py-2 rounded-md bg-green-200 text-sm" : bookingDetails?.status === "Pending" ? "px-2 w-fit mt-4 py-2 rounded-md bg-yellow-200 text-sm" : "px-2 w-fit mt-4 py-2 rounded-md bg-blue-200 text-sm"}>{bookingDetails?.status}</div>
                        <h6 className='mt-6 font-bold text-lg'>New Status</h6>
                        <FormControl fullWidth >
                            <InputLabel id="status" required className='mt-4'>Select New Status</InputLabel>
                            <Select
                                labelId="status"
                                id="status"
                                name='status'
                                defaultValue={workingStatus}
                                value={workingStatus}
                                label="Select New Status"
                                onChange={(e) => setWorkingStatus(e.target.value)}
                                required
                                className='mt-4'
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                        <div className='mt-8 text-right'>
                            <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={editBookingStatusMutation.isPending} onClick={handleCancelBookingStatus}>Cancel</button>
                            <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={editBookingStatusMutation.isPending} onClick={handleSaveBookingStatus}>Save</button>
                        </div>
                    </div>}
                </div>
            }
            {(editBookingStatusMutation.isPending || deleteBookingMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </div>
    )
}

export default BookingDetail