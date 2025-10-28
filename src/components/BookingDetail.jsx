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


const BookingDetail = ({ bookingDetails, role }) => {
    const [detailsStatus, setDetailsStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);
    const [notesStatus, setNotesStatus] = useState(false);
    const [workingNotes, setWorkingNotes] = useState("");
    const [workingStatus, setWorkingStatus] = useState(bookingDetails.status);


    const handleSubmitNote = async () => {
        /* api */


        setWorkingNotes("");
    };
    const handleNoteClose = () => {
        setWorkingNotes("");
        setNotesStatus(false)
    };
    const handleNoteDelete = async () => {
        /* api */

    };
    const handleCancelBookingStatus = () => {
        setWorkingStatus(bookingDetails.status);
        setUpdateStatus(false);
    };
    const handleSaveBookingStatus = async () => {
        /* api */

        setWorkingStatus(bookingDetails.status);    /* not needed in final code */
        setUpdateStatus(false);
    };
    const handleBookingDelete = async () => {
        /* api */

    };

    return (
        <div className='w-full shadow-[5px_5px_10px_1px_#cdcdcd] p-6'>
            <div className='flex justify-between'>
                <div>
                    <h4 className='font-bold text-xl mt-3'>{bookingDetails.service}</h4>
                    <p className='text-dim-black mt-3'><CarIcon size={15} className='inline me-2 transform -translate-y-1' />{bookingDetails.car}</p>
                    <p className='text-dim-black'><CalendarIcon size={15} className='inline me-2 transform -translate-y-1' />{bookingDetails.date}-{bookingDetails.time}</p>
                </div>
                <div className='flex flex-col justify-start items-end'>
                    {(role === "manager") && (bookingDetails.status === "Completed") && <button className='text-red-600 -mt-2 mb-3 hover:opacity-60 cursor-pointer me-2' onClick={handleBookingDelete}><Trash size={15} /></button>}
                    <div className={bookingDetails.status === "Completed" ? "px-2 py-0.5 rounded-4xl bg-green-200 text-sm" : bookingDetails.status === "Pending" ? "px-2 py-0.5 rounded-4xl bg-yellow-200 text-sm" : "px-2 py-0.5 rounded-4xl bg-blue-200 text-sm"}>{bookingDetails.status}</div>
                </div>
            </div>
            <div className='flex gap-2 flex-col items-end'>
                <button className='text-accent cursor-pointer hover:opacity-75 font-bold' onClick={() => (setDetailsStatus(true))}>View Details</button>
                {(role !== 'customer') && <>
                    <button className='text-accent cursor-pointer hover:opacity-75 font-bold' onClick={() => (setNotesStatus(true))}>View Notes</button>
                    <button className='text-accent cursor-pointer hover:opacity-75 font-bold' onClick={() => (setUpdateStatus(true))}>Update Status</button>
                </>}
            </div>



            {/* dark screen */}
            {(detailsStatus || notesStatus || updateStatus) && <ModalBackground />}


            {/* detail modal */}
            {
                detailsStatus &&
                <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                    <div className="flex items-center justify-between">
                        <h5 className='font-bold text-2xl'>Booking Details</h5>
                        <button className='hover:opacity-60' onClick={() => setDetailsStatus(false)}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                    </div>

                    <hr className='mt-3 text-dim-black opacity-30' />
                    <div className='flex items-center justify-between mt-5'>
                        <h6 className='font-bold text-xl'>{bookingDetails.service}</h6>
                        <div className={bookingDetails.status === "Completed" ? "px-2 py-0.5 rounded-4xl bg-green-200 text-sm" : bookingDetails.status === "Pending" ? "px-2 py-0.5 rounded-4xl bg-yellow-200 text-sm" : "px-2 py-0.5 rounded-4xl bg-blue-200 text-sm"}>{bookingDetails.status}</div>
                    </div>
                    <p className='mt-8 text-dim-black'><CalendarIcon size={15} className='inline me-2' />{bookingDetails.date}</p>
                    <p className='mt-2 text-dim-black'><Clock4 size={15} className='inline me-2' />{bookingDetails.time}</p>
                    <p className='mt-2 text-dim-black'><CarIcon size={15} className='inline me-2' />{bookingDetails.car}</p>
                    <p className='font-medium mt-6'>Your Description</p>
                    <p className='text-dim-black'>{bookingDetails.description}</p>
                </div>
            }



            {/* notes modal */}
            {
                notesStatus &&
                <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                    <div className="flex items-center justify-between">
                        <h5 className='font-bold text-2xl'>Notes</h5>
                        <button type="button" className='hover:opacity-60' onClick={handleNoteClose}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
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
                </div>
            }



            {/* update modal */}
            {
                updateStatus &&
                <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                    <div className="flex items-center justify-between">
                        <h5 className='font-bold text-2xl'>Update Booking Status</h5>
                        <button className='hover:opacity-60' onClick={() => setUpdateStatus(false)}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                    </div>

                    <hr className='mt-3 text-dim-black opacity-30' />
                    <h6 className='mt-6 font-bold text-lg'>Current Status</h6>
                    <div className={bookingDetails.status === "Completed" ? "px-2 w-fit mt-4 py-2 rounded-md bg-green-200 text-sm" : bookingDetails.status === "Pending" ? "px-2 w-fit mt-4 py-2 rounded-md bg-yellow-200 text-sm" : "px-2 w-fit mt-4 py-2 rounded-md bg-blue-200 text-sm"}>{bookingDetails.status}</div>
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
                            <MenuItem value="Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <div className='mt-8 text-right'>
                        <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={handleCancelBookingStatus}>Cancel</button>
                        <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={handleSaveBookingStatus}>Save</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default BookingDetail