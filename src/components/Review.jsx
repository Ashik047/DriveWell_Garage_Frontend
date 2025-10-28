import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Rating from '@mui/material/Rating';
import { SquarePen, Trash } from 'lucide-react';
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleEditDetails } from '../helpers/formHelper';

const Review = ({ feedback, role, deletePending, handleEditFeedback, handleFeedbackDelete, handleFeedbackPublishStatus, statusPending }) => {

    return (
        <div className="w-full shadow-[5px_5px_10px_1px_#cdcdcd] grid grid-cols-[50px_1fr_100px] p-4 gap-2">
            <img src={feedback?.user?.image?.url} className="grid place-content-center font-medium bg-blue-100 rounded-[50%] w-[40px] aspect-square" alt='Profile icon' />
            <div>
                <h5 className="font-semibold text-xl">{feedback?.user?.fullName}</h5>
                <div className='flex items-center gap-2'><Rating name="read-only" value={feedback?.rating} precision={0.5} readOnly size="small" /><span className='text-dim-black'>{feedback?.rating}</span></div>
                <p className='text-accent font-semibold text-sm'>{feedback?.service} - {feedback?.branch}</p>
                <p className='mt-3 text-sm'>{feedback?.review}</p>
                <br /><br />

            </div>
            <div className='text-dim-black text-sm flex flex-col justify-between'>
                <span className='text-right text-dim-black mt-2 me-2'>{feedback?.date}</span>

                <div className='flex justify-end gap-3'>
                    {role === "Customer" && <button className='text-sm cursor-pointer hover:opacity-75 text-blue-600 font-bold rounded-md flex items-center' aria-label='Edit review' onClick={() => handleEditFeedback?.(feedback)}><SquarePen size={15} className='me-1 inline' /></button>}
                    {(role === "Customer" || role === "Manager") && <button className='text-sm cursor-pointer hover:opacity-75 text-red-600 font-bold rounded-md flex items-center disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' aria-label='Delete review' onClick={() => handleFeedbackDelete?.(feedback._id)} disabled={deletePending}><Trash size={15} className='inline me-1' /></button>}
                </div>

                {(role === "Manager") &&
                    <div className='flex justify-end gap-2'>
                        <button className='cursor-pointer mb-2 hover:opacity-75 text-black font-bold px-4 py-1 rounded-md flex items-center disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' style={feedback?.status === true ? { backgroundColor: "#E5E7EB" } : { backgroundColor: "#BFDBFE" }} disabled={statusPending} onClick={() => handleFeedbackPublishStatus(feedback?._id)}>{feedback?.status === true ? "Hide" : "Publish"}</button>
                    </div>
                }
            </div>

        </div>
    )
}

export default Review