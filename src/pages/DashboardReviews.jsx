import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StarIcon } from 'lucide-react'
import React from 'react'
import { reviews } from '../constants/serviceReviews'
import Review from "../components/Review"
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails } from '../helpers/formHelper';
import Rating from '@mui/material/Rating'
import ModalBackground from '../components/ModalBackground'



const DashReviews = ({ role }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");

    const [feedbackDetails, setFeedbackDetails] = useState({
        name: "",
        review: "",
        rating: "",
        service: "",
        center: ""
    });


    const handleSaveFeedback = () => {
        /* api call */
        handleCloseEditDetails(feedbackDetails, setFeedbackDetails, setModalStatus, setModalType);
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'><span className={(role === "customer") ? "" : "hidden"}>My </span>Feedbacks</h3>
                    {(role === "customer") && <p className='mt-0.5 text-dim-black'>Rate and review your service experiences</p>}
                </div>
                {(role === "customer") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><StarIcon size={15} className='inline' /> Add&nbsp;Review</button>}
            </div>
            <div className='flex flex-col gap-8 mt-8'>
                {(role === "customer") ?
                    reviews?.filter(review => (review.name === "John Alex"))?.map((review) => (
                        <Review key={review.id} review={review} role={role} feedbackDetails={feedbackDetails} setFeedbackDetails={setFeedbackDetails} setModalStatus={setModalStatus} setModalType={setModalType} />
                    )) :
                    reviews?.map((review) => (
                        <Review key={review.id} review={review} role={role} />
                    ))
                }
            </div>



            {/* modal */}
            {
                modalStatus &&
                <>
                    <ModalBackground />

                    <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>{modalType} Feedback</h5>
                            <button className='hover:opacity-60' onClick={() => handleCloseEditDetails(feedbackDetails, setFeedbackDetails, setModalStatus, setModalType)}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col gap-6'>
                            <TextField id="name" name='name' variant="outlined" type="text" className='w-full mt-8' label="Name" onChange={(e) => handleChange(e, setFeedbackDetails)} value={feedbackDetails.name} required />
                            {/* <TextField id="rating" name='rating' label="Rating" variant="outlined" type="number" className='w-full' onChange={(e) => handleChange(e, setFeedbackDetails)} value={feedbackDetails.rating} required /> */}
                            <div className='flex gap-2 my-2 ms-2'>
                                <p>Rating:</p>
                                <Rating name="rating" value={feedbackDetails.rating} precision={0.5} id="rating" onChange={(e) => handleChange(e, setFeedbackDetails)} />
                            </div>
                            <TextField id="service" name='service' label="Service" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setFeedbackDetails)} value={feedbackDetails.service} required />
                            <TextField id="center" name='center' label="Center" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setFeedbackDetails)} value={feedbackDetails.center} required />
                            <TextField id="review" name='review' label="review" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setFeedbackDetails)} multiline rows={4} value={feedbackDetails.review} required />
                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={() => handleCloseEditDetails(feedbackDetails, setFeedbackDetails, setModalStatus, setModalType)}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={handleSaveFeedback}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }

        </section>
    )
}

export default DashReviews