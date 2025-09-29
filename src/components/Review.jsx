import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Rating from '@mui/material/Rating';
import { SquarePen, Trash } from 'lucide-react';
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleEditDetails } from '../helpers/formHelper';

const Review = ({ review, role, feedbackDetails, setFeedbackDetails, setModalStatus, setModalType }) => {

    return (
        <div className="w-full shadow-[5px_5px_10px_1px_#cdcdcd] grid grid-cols-[50px_1fr_100px] p-4 gap-2">
            <div className="grid place-content-center font-medium bg-blue-100 rounded-[50%] w-[40px] aspect-square">{review.name.substr(0, 1)}</div>
            <div>
                <h5 className="font-semibold text-xl">{review.name}</h5>
                <div className='flex items-center gap-2'><Rating name="read-only" value={review.rating} precision={0.5} readOnly size="small" /><span className='text-dim-black'>{review.rating}</span></div>
                <p className='text-accent font-semibold text-sm'>{review.service} - {review.center}</p>
                <p className='mt-3 text-sm'>{review.review}</p>
                {/* {(!customer && !manager && !worker) &&
                    <button className='text-dim-black mt-3 text-sm hover:opacity-75 cursor-pointer'><FontAwesomeIcon icon={faThumbsUp} /> helpful &#40;{review.likes}&#41;</button>} */}
                <br /><br />

            </div>
            <div className='text-dim-black text-sm flex flex-col justify-between'>
                <span>{review.date}</span>
                {(role === "customer") &&
                    <div className='flex justify-end gap-2'>
                        <button className='cursor-pointer bg-blue-600 hover:opacity-75 text-white font-bold px-4 py-1 rounded-md flex items-center' onClick={() => handleEditDetails(review, feedbackDetails, setFeedbackDetails, setModalStatus, setModalType)}><SquarePen size={15} className='me-1 inline' /> Edit</button><button className='cursor-pointer bg-red-600 hover:opacity-75 text-white font-bold px-4 py-1 rounded-md flex items-center'><Trash size={15} className='inline me-2' /> Delete</button>
                    </div>
                }
                {(role === "manager") &&
                    <div className='flex justify-end gap-2'>
                        <button className='cursor-pointer me-2 mb-2 hover:opacity-75 text-black font-bold px-4 py-1 rounded-md flex items-center' style={review.publish === true ? { backgroundColor: "#E5E7EB" } : { backgroundColor: "#BFDBFE" }} >{review.publish === true ? "Hide" : "Publish"}</button>
                    </div>
                }
            </div>

        </div>
    )
}

export default Review