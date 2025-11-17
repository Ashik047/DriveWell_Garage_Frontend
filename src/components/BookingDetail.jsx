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
    MessageSquareIcon,
    Trash,
    TrashIcon
} from 'lucide-react'
import { useState } from 'react';
import ModalBackground from './ModalBackground';
import { format } from "date-fns";
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { Commet } from 'react-loading-indicators';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosWithToken from '../hooks/useAxiosWithToken';
import { addBookingNotesApi, deleteBookingApi, deleteBookingNoteApi, editBookingStatusApi, payBillApi, updateBillPaymentStatusApi } from '../api/bookingApi';
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";

const BookingDetail = ({ bookingDetails }) => {
    const [detailsStatus, setDetailsStatus] = useState(false);
    const [noteSubmitStatus, setNoteSubmitStatus] = useState(false);
    const [activeTab, setActiveTab] = useState("bookingDetails")
    const [workingNotes, setWorkingNotes] = useState("");
    const [workingStatus, setWorkingStatus] = useState(bookingDetails?.status);
    const [billDetails, setBillDetials] = useState(bookingDetails?.bill);
    const [workingBill, setWorkingBill] = useState({
        repairName: "",
        repairCost: "",
    });

    const { auth } = useContext(AuthContext);

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();

    const editBookingStatusMutation = useMutation(editBookingStatusApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });

    const addBookingNotesMutation = useMutation(addBookingNotesApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });

    const deleteBookingNoteMutation = useMutation(deleteBookingNoteApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });

    const deleteBookingMutation = useMutation(deleteBookingApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });

    const updateBillPaymentStatusMutation = useMutation(updateBillPaymentStatusApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });

    const payBillMutation = useMutation(payBillApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Booking"]);
        }
    });


    const handleSubmitNote = async () => {
        setNoteSubmitStatus(true);
        if (workingNotes) {
            try {
                const result = await addBookingNotesMutation.mutateAsync({ axiosWithToken, reqBody: { note: workingNotes }, id: bookingDetails._id });
                if (result.status === 200) {
                    toast.success(result.data.Message);
                }
                setNoteSubmitStatus(false);
            } catch (err) {
                setNoteSubmitStatus(false);
                toast.error(err.response.data.Message);
            }
            setWorkingNotes("");
        }
    };

    const handleCloseModal = () => {
        setWorkingNotes("");
        setNoteSubmitStatus(false);
        setWorkingStatus(bookingDetails?.status);
        setDetailsStatus(false);
        setWorkingBill({
            repairName: "",
            repairCost: "",
        });
        setBillDetials(bookingDetails?.bill);
    };

    const handleNoteDelete = async (noteId) => {
        try {
            const result = await deleteBookingNoteMutation.mutateAsync({ axiosWithToken, id: bookingDetails._id, noteId });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
        setWorkingNotes("");
    };

    const handleCancelBookingStatus = () => {
        setWorkingStatus(bookingDetails?.status);
        setWorkingBill({
            repairName: "",
            repairCost: "",
        });
        setBillDetials(bookingDetails?.bill);
    };

    const handleSaveBookingStatus = async () => {
        if (workingStatus === bookingDetails?.status) {
            return toast.info("Same status selected — no changes made.")
        }
        try {
            const result = await editBookingStatusMutation.mutateAsync({ axiosWithToken, reqBody: { status: workingStatus, billDetails }, id: bookingDetails._id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            setWorkingStatus(bookingDetails?.status);
            toast.error(err.response.data.Message);
        }
        setWorkingNotes("");
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

    const handleSubmitBill = () => {
        setBillDetials(prev => ([...prev, {
            id: uuid(),
            repairName: workingBill.repairName,
            repairCost: workingBill.repairCost
        }]));
        setWorkingBill({
            repairName: "",
            repairCost: "",
        })
    };

    const handleDeleteBill = (id) => {
        setBillDetials(prev => prev.filter(bill => bill.id !== id));
    };

    let totalBill = 0;

    if (bookingDetails?.bill?.length > 0) {
        totalBill = bookingDetails?.bill?.map(item => item.repairCost)?.reduce((sum, cost) => sum + cost, 0);
    }

    const handleUpdatePaymentStatus = async () => {
        try {
            const result = await updateBillPaymentStatusMutation.mutateAsync({ axiosWithToken, id: bookingDetails._id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };

    const handlePayBill = async (req, res) => {
        try {
            const result = await payBillMutation.mutateAsync({ axiosWithToken, reqBody: { bookingDetails }, id: bookingDetails._id });
            const checkoutUrl = result?.data?.url;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                toast.error("Something went wrong.");
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };


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
                <div className="fixed bg-white top-[15%] left-[50%] transform -translate-x-[50%] z-12 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                    <button className='hover:text-accent absolute -right-8 -top-8 cursor-pointer disabled:hover:text-dim-black disabled:text-dim-black disabled:cursor-not-allowed' disabled={editBookingStatusMutation.isPending || addBookingNotesMutation.isPending || deleteBookingNoteMutation.isPending} onClick={handleCloseModal}><FontAwesomeIcon icon={faXmark} className='text-xl' /></button>
                    {(auth?.role === "Manager" || auth?.role === "Staff") && <div className='w-full flex justify-between items center'>
                        <button disabled={editBookingStatusMutation.isPending || addBookingNotesMutation.isPending || deleteBookingNoteMutation.isPending} className='disabled:cursor-not-allowed w-full px-4 py-4 font-semibold rounded-tl-lg' style={activeTab === "bookingDetails" ? { color: "#F97316", backgroundColor: "white" } : { backgroundColor: "#D1D5DB", color: "black" }} onClick={() => setActiveTab("bookingDetails")}>Booking Details</button>
                        <button disabled={editBookingStatusMutation.isPending || addBookingNotesMutation.isPending || deleteBookingNoteMutation.isPending} className='disabled:cursor-not-allowed w-full px-4 py-4 font-semibold' style={activeTab === "notes" ? { color: "#F97316", backgroundColor: "white" } : { backgroundColor: "#D1D5DB", color: "black" }} onClick={() => setActiveTab("notes")}>Booking Details</button>
                        <button disabled={editBookingStatusMutation.isPending || addBookingNotesMutation.isPending || deleteBookingNoteMutation.isPending} className='disabled:cursor-not-allowed w-full px-4 py-4 font-semibold rounded-tr-lg' style={activeTab === "bookingStatus" ? { color: "#F97316", backgroundColor: "white" } : { backgroundColor: "#D1D5DB", color: "black" }} onClick={() => setActiveTab("bookingStatus")}>Booking Details</button>
                    </div>}
                    {activeTab === "bookingDetails" && <div className="px-4 pt-10 pb-15 max-h-[60vh] overflow-y-auto">
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
                        {bookingDetails?.status === "Completed" &&
                            <p className='mt-6 text-dim-black text-lg'>Bill Total: <span className='font-semibold text-black'>${totalBill}</span></p>
                        }
                        {bookingDetails?.status === "Completed" && <>
                            <h6 className='mt-6 font-bold text-lg'>Billing Status</h6>
                            <div className='flex justify-between items-center'>
                                {bookingDetails?.billPayment ? <p className="px-2 w-fit mt-4 py-2 rounded-md bg-green-200 text-sm">Bill Paid</p> : <p className="px-2 w-fit mt-4 py-2 rounded-md bg-red-200 text-sm">Bill Due</p>}
                                {(!bookingDetails?.billPayment && auth?.role === "Customer") && <button onClick={handlePayBill} className='mt-4 me-6  font-semibold cursor-pointer text-dim-black hover:text-accent disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={payBillMutation.isPending}>Pay Bill</button>}
                                {(bookingDetails?.billPayment && auth?.role === "Customer") && <Link to={`/invoice/${bookingDetails?._id}`} className='mt-4 me-6 font-semibold cursor-pointer text-dim-black hover:text-accent'>Invoice</Link>}
                            </div></>
                        }
                    </div>}
                    {activeTab === "notes" && <div className="px-4 py-6 max-h-[60vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>Notes</h5>
                        </div>

                        <hr className='mt-3 text-dim-black opacity-30 mb-10' />
                        <TextField id="workingNotes" name='workingNotes' variant="outlined" type="text" className='w-full mt-6' label="Notes" onChange={(e) => setWorkingNotes(e.target.value)} value={workingNotes} />
                        <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!noteSubmitStatus || workingNotes) && "hidden" }}>Note is required</p>
                        <button type="button" className='px-4 py-2 mt-4 block ms-auto bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75  disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={addBookingNotesMutation.isPending || deleteBookingNoteMutation.isPending} onClick={handleSubmitNote}>Add Note</button>
                        <div className='flex flex-col gap-8 mt-10'>
                            {
                                [...bookingDetails?.notes || []].reverse().map((note) => (
                                    <div key={note._id} className='shadow-[5px_5px_10px_1px_#cdcdcd] p-8 flex justify-between gap-2'>
                                        <div>
                                            <p className='font-bold text-lg'><MessageSquareIcon size={16} className='inline me-2' /> {note.staffName}</p>
                                            <p className='text-sm text-dim-black mt-2'>{note.date}</p>
                                            <p className='mt-2 text-dim-black'>{note.note}</p>
                                        </div>
                                        <button className='cursor-pointer hover:opacity-75 text-red-600 mb-auto disabled:hover:text-dim-black disabled:text-dim-black disabled:cursor-not-allowed' disabled={deleteBookingNoteMutation.isPending} onClick={() => handleNoteDelete(note._id)}><Trash size={15} /></button>

                                    </div>
                                ))
                            }
                        </div>
                    </div>}
                    {activeTab === "bookingStatus" && <div className="px-4 pt-10 pb-15 max-h-[60vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>Update Booking Status</h5>
                        </div>

                        <hr className='mt-3 text-dim-black opacity-30' />
                        <h6 className='mt-6 font-bold text-lg'>Current Status</h6>
                        <div className={bookingDetails?.status === "Completed" ? "px-2 w-fit mt-4 py-2 rounded-md bg-green-200 text-sm" : bookingDetails?.status === "Pending" ? "px-2 w-fit mt-4 py-2 rounded-md bg-yellow-200 text-sm" : "px-2 w-fit mt-4 py-2 rounded-md bg-blue-200 text-sm"}>{bookingDetails?.status}</div>
                        {bookingDetails?.status !== "Completed" && <>
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
                        </>}
                        {
                            workingStatus === "Completed" &&
                            <>
                                <h6 className='mt-6 font-bold text-lg'>Billing Details</h6>
                                <ol className='mt-3 text-dim-black'>
                                    {billDetails.length > 0 ?
                                        billDetails.map(bill => (
                                            <li key={bill.id} className='mb-1 grid grid-cols-4 items-center pe-10'><span>{bill.repairName}</span><span>-</span><span>${bill.repairCost}</span>{bookingDetails?.status !== "Completed" && <button onClick={() => handleDeleteBill(bill.id)} className='ms-auto'><TrashIcon className='text-red-700 cursor-pointer' size={12} /></button>}</li>
                                        )) :
                                        <p className='text-dim-black mt-2'>No Data</p>
                                    }
                                </ol>
                                {bookingDetails?.status !== "Completed" && <>
                                    <div className='mt-15 flex gap-2 justify-between'>
                                        <TextField id="repairName" name='repairName' variant="outlined" type="text" className='w-[48%] mt-6' label="Repair Name" onChange={(e) => setWorkingBill(prev => ({ ...prev, repairName: e.target.value }))} value={workingBill.repairName} />
                                        <TextField id="repairCost" name='repairCost' variant="outlined" type="number" className='w-[48%] mt-6' label="Repair Cost" onChange={(e) => setWorkingBill(prev => ({ ...prev, repairCost: e.target.value }))} value={workingBill.repairCost} inputProps={{
                                            min: 0.01,
                                            step: 0.01
                                        }} />
                                    </div>
                                    <button type="button" className='px-4 py-2 mt-4 block ms-auto bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={!workingBill.repairName || !workingBill.repairCost} onClick={handleSubmitBill}>Add Bill</button>
                                </>}
                            </>
                        }
                        {bookingDetails?.status !== "Completed" && <div className='mt-8 text-right'>
                            <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={editBookingStatusMutation.isPending} onClick={handleCancelBookingStatus}>Cancel</button>
                            <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={editBookingStatusMutation.isPending || (billDetails.length === 0 && workingStatus === "Completed")} onClick={handleSaveBookingStatus}>Save</button>
                        </div>}
                        {bookingDetails?.status === "Completed" &&
                            <p className='mt-6 text-dim-black text-lg'>Bill Total: <span className='font-semibold text-black'>${totalBill}</span></p>
                        }
                        {bookingDetails?.status === "Completed" && <>
                            <h6 className='mt-6 font-bold text-lg'>Billing Status</h6>
                            <div className='flex justify-between items-center'>
                                {bookingDetails?.billPayment ? <p className="px-2 w-fit mt-4 py-2 rounded-md bg-green-200 text-sm">Bill Paid</p> : <p className="px-2 w-fit mt-4 py-2 rounded-md bg-red-200 text-sm">Bill Due</p>}
                                {!bookingDetails?.billPayment && <button onClick={handleUpdatePaymentStatus} className='mt-4 me-6 cursor-pointer font-semibold text-dim-black hover:text-accent disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={updateBillPaymentStatusMutation.isPending}>Mark Paid</button>}
                            </div></>
                        }
                    </div>}
                </div>
            }
            {(editBookingStatusMutation.isPending || deleteBookingMutation.isPending || addBookingNotesMutation.isPending || deleteBookingNoteMutation.isPending || updateBillPaymentStatusMutation.isPending || payBillMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </div>
    )
}

export default BookingDetail