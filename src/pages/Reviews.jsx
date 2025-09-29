import { useState } from 'react'
import Rating from '@mui/material/Rating';
import { reviews as serviceReviews } from "../constants/serviceReviews"
import Review from '../components/Review';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetReviewsQuery } from '../redux/slices/reviewsApi';

const Reviews = () => {

    // const { data:reviewsDetails, error: reviewsError, isLoading: reviewsLoading, refetch } = useGetReviewsQuery(); 

    const reviews = useMemo(() => serviceReviews, []);

    const [avgRating, setAvgRatings] = useState(0);
    useEffect(() => {
        if (reviews?.length) {
            const totalRating = reviews.map(review => review.rating).reduce((sum, rating) => (sum + rating));
            const averageRating = Math.floor(totalRating / reviews.length * 10) / 10;
            setAvgRatings(averageRating);
        }
    }, [reviews])

    return (
        <main className="grow px-4 py-6">
            <h2 className="mt-4 text-center font-bold text-4xl">Customer Reviews</h2>
            <p className="text-center text-lg mt-3 text-dim-black">See what our customers are saying about their experience with DriveWell Garage</p>
            <div className='flex justify-center gap-2 mt-6'>
                <Rating name="read-only" value={avgRating} precision={0.5} readOnly />
                <p className='font-semibold'><span>{avgRating}</span> out of 5</p>
                {
                    reviews?.length ?
                        <p className='text-dim-black'>Based on <span>{reviews?.length}</span> reviews</p> :
                        <p className='text-dim-black'>No reviews available</p>
                }
            </div>
            <div className='flex flex-col gap-8'>
                {
                    reviews?.filter((review) => review.publish === true)?.map(review => (
                        <Review key={review.id} review={review} role="viewer" />
                    ))
                }

            </div>
            <div className="bg-box mt-8 rounded-md shadow flex-col flex md:flex-row h-[200px] justify-center md:justify-start md:items-center px-10 py-6 gap-8">
                <div className="text-white">
                    <h4 className="font-bold text-xl">Happy with our service?</h4>
                    <p className="text-dim mt-2">Book an appointment today and experience our quality service firsthand.</p>
                </div>
                <div className="md:ms-auto me-10"><Link to={"/booking"} className="bg-white rounded-md px-6 py-3 my-auto hover:opacity-75" href=" tel:+919747991662">Book&nbsp;Now</Link></div>
            </div>

        </main>
    )
}

export default Reviews