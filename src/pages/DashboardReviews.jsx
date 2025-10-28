import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StarIcon } from 'lucide-react'
import Review from "../components/Review"
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails, handleEditDetails } from '../helpers/formHelper';
import Rating from '@mui/material/Rating'
import ModalBackground from '../components/ModalBackground'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import { getAllBranchesApi } from '../api/branchApi'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { getAllServicesApi } from '../api/serviceApi'
import { Commet } from 'react-loading-indicators'
import { toast, ToastContainer } from 'react-toastify'
import { addFeedbackApi, deleteFeedbackApi, editFeedbackApi, editFeedbackStatusApi, getFeedbacksApi } from '../api/feedbackApi'
import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'

const DashReviews = () => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    const [feedbackId, setFeedbackId] = useState("");
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);
    const [feedbackDetails, setFeedbackDetails] = useState({
        review: "",
        rating: "",
        service: "",
        branch: ""
    });

    const { auth } = useContext(AuthContext);

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

    const { data: allFeedbacks, isLoading: allFeedbacksLoading, isError: allFeedbacksIsError, error: allFeedbacksError } = useQuery({
        queryKey: ['Feedback'],
        queryFn: () => getFeedbacksApi({ axiosWithToken }),
        select: response => response?.data?.sort((a, b) => (b.date - a.date)),
    }
    );

    const addFeedbackMutation = useMutation(addFeedbackApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Feedback"]);
        }
    });

    const editFeedbackMutation = useMutation(editFeedbackApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Feedback"]);
        }
    });

    const editFeedbackStatusMutation = useMutation(editFeedbackStatusApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Feedback"]);
        }
    });

    const deleteFeedbackMutation = useMutation(deleteFeedbackApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(['Feedback']);
        }
    });

    const handleSaveFeedback = async () => {
        setFormSubmitStatus(true);
        if (feedbackDetails.rating && feedbackDetails.review && feedbackDetails.branch && feedbackDetails.service) {
            try {
                if (modalType === "Add") {
                    const result = await addFeedbackMutation.mutateAsync({ axiosWithToken, reqBody: feedbackDetails });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                } else if (modalType === "Edit") {
                    const result = await editFeedbackMutation.mutateAsync({ axiosWithToken, reqBody: feedbackDetails, id: feedbackId });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                }
            } catch (err) {
                toast.error(err.response.data.Message);
            }
            handleCloseEditModal();
        }
    };

    const handleFeedbackDelete = async (id) => {
        try {
            const result = await deleteFeedbackMutation.mutateAsync({ axiosWithToken, id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };

    const handleFeedbackPublishStatus = async (id) => {
        try {
            await editFeedbackStatusMutation.mutateAsync({ axiosWithToken, id });
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };

    const handleEditFeedback = (review) => {
        setFeedbackId(review._id);
        handleEditDetails(review, feedbackDetails, setFeedbackDetails, setModalStatus, setModalType);
    };

    const handleCloseEditModal = () => {
        setFeedbackId("");
        handleCloseEditDetails(feedbackDetails, setFeedbackDetails, setModalStatus, setModalType, setFormSubmitStatus);
    };


    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'><span className={(auth?.role === "Customer") ? "" : "hidden"}>My </span>Feedbacks</h3>
                    {(auth?.role === "Customer") && <p className='mt-0.5 text-dim-black'>Rate and review your service experiences</p>}
                </div>
                {(auth?.role === "Customer") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><StarIcon size={15} className='inline' /> Add&nbsp;Review</button>}
            </div>
            <div className='flex flex-col gap-8 mt-8'>
                {
                    allFeedbacks?.map((feedback) => (
                        <Review key={feedback?._id} feedback={feedback} role={auth?.role} deletePending={deleteFeedbackMutation.isPending} handleEditFeedback={handleEditFeedback} handleFeedbackDelete={handleFeedbackDelete} handleFeedbackPublishStatus={handleFeedbackPublishStatus} statusPending={editFeedbackStatusMutation.isPending} />
                    ))
                }
            </div>


            {/* modal */}
            {
                modalStatus &&
                <>
                    <ModalBackground zIndex={11} />

                    <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>{modalType} Feedback</h5>
                            <button className='hover:opacity-60 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleCloseEditModal} disabled={addFeedbackMutation.isPending || editFeedbackMutation.isPending}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col gap-1 max-h-[70vh] overflow-y-auto pt-4 pb-10 px-4'>
                            <div className='flex gap-2 my-2 ms-2'>
                                <p>Rating:</p>
                                <Rating name="rating" value={feedbackDetails.rating} precision={0.5} id="rating" onChange={(e) => handleChange(e, setFeedbackDetails)} />
                            </div>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || feedbackDetails.rating) && "hidden" }}>Rating is required</p>
                            <FormControl fullWidth >
                                <InputLabel id="branch">Select Branch</InputLabel>
                                <Select
                                    labelId="branch"
                                    id="branch"
                                    name='branch'
                                    defaultValue={feedbackDetails.branch}
                                    value={feedbackDetails.branch}
                                    label="Select Branch"
                                    onChange={(e) => handleChange(e, setFeedbackDetails)}>
                                    {
                                        allBranches?.map((branch => (
                                            <MenuItem value={branch.branchName}>{branch.branchName}</MenuItem>

                                        )))
                                    }
                                </Select>
                            </FormControl>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || feedbackDetails.branch) && "hidden" }}>Branch is required</p>
                            <FormControl fullWidth >
                                <InputLabel id="service">Select Service</InputLabel>
                                <Select
                                    labelId="service"
                                    id="service"
                                    name='service'
                                    defaultValue={feedbackDetails.service}
                                    value={feedbackDetails.service}
                                    label="Select Service"
                                    onChange={(e) => handleChange(e, setFeedbackDetails)}>
                                    {
                                        allServices?.map((service => (
                                            <MenuItem value={service.serviceName}>{service.serviceName}</MenuItem>

                                        )))
                                    }
                                </Select>
                            </FormControl>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || feedbackDetails.service) && "hidden" }}>Service is required</p>
                            <TextField id="review" name='review' label="review" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setFeedbackDetails)} multiline rows={4} value={feedbackDetails.review} required />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || feedbackDetails.review) && "hidden" }}>Review is required</p>
                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={addFeedbackMutation.isPending || editFeedbackMutation.isPending} onClick={handleCloseEditModal}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={addFeedbackMutation.isPending || editFeedbackMutation.isPending} onClick={handleSaveFeedback}>Save</button>
                            </div>
                        </form>
                    </div>
                </>
            }
            {(addFeedbackMutation.isPending || editFeedbackMutation.isPending || editFeedbackStatusMutation.isPending || deleteFeedbackMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </section>
    )
}

export default DashReviews