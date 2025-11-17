import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleCloseEditDetails, handleEditDetails, handleChange } from '../helpers/formHelper'
import ModalBackground from '../components/ModalBackground'
import { SquarePen, Trash } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addBranchApi, deleteBranchApi, editBranchApi, getAllBranchesApi } from '../api/branchApi'
import { toast, ToastContainer } from 'react-toastify'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import { Commet } from "react-loading-indicators";
import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from "../components/Loader"
import Error from "../components/Error"

const DashboardBranches = () => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    const [branchId, setBranchId] = useState("");
    const [prevImage, setPrevImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);
    const [branchDetails, setBranchDetails] = useState({
        branchName: "",
        location: "",
        phone: "",
        longitude: "",
        latitude: "",
        image: ""
    });

    const { auth } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.role && auth?.role === "Customer") {
            navigate("/");
        }
    }, [auth?.role]);

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();

    const { data: allBranchesData, isLoading: allBranchesLoading, isError: allBranchesIsError, error: allBranchesError } = useQuery({
        queryKey: ['Branch'],
        queryFn: () => getAllBranchesApi(),
        select: response => response?.data?.sort((a, b) => (b._id - a._id)),
    }
    );

    const [allBranches, setAllBranches] = useState([]);
    const [filter, setFilter] = useState("");
    useEffect(() => {
        if (allBranchesData?.length > 0) {
            setAllBranches(allBranchesData?.filter(branch => branch.branchName.toLowerCase().includes(filter.toLocaleLowerCase())));
        }
    }, [allBranchesData, filter]);

    const addBranchMutation = useMutation(addBranchApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Branch"]);
        }
    });

    const editBranchMutation = useMutation(editBranchApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(['Branch']);
        }
    });

    const deleteBranchMutation = useMutation(deleteBranchApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(['Branch']);
        }
    });

    const handleImageUplaod = (e) => {
        const image = e.target.files[0];
        if (branchDetails.image) {
            setPrevImage(branchDetails.image.filename);
        }
        setBranchDetails(prev => ({ ...prev, image }));
        const imageUrl = URL.createObjectURL(image);
        setImagePreview(imageUrl);
    };

    const handleSaveBranch = async () => {
        setFormSubmitStatus(true);
        if (branchDetails.branchName && branchDetails.location && branchDetails.phone && branchDetails.image && branchDetails.longitude && branchDetails.latitude) {
            try {
                if (modalType === "Add") {
                    const reqBody = new FormData();
                    for (let key in branchDetails) {
                        reqBody.append(key, branchDetails[key]);
                    }
                    const result = await addBranchMutation.mutateAsync({ axiosWithToken, reqBody });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }

                } else if (modalType === "Edit") {
                    if (imagePreview) {
                        const reqBody = new FormData();
                        for (let key in branchDetails) {
                            reqBody.append(key, branchDetails[key]);
                        }
                        reqBody.append("prevImage", prevImage);
                        const result = await editBranchMutation.mutateAsync({ axiosWithToken, reqBody, id: branchId });
                        if (result.status === 200) {
                            toast.success(result.data.Message);
                        }
                    } else {
                        const result = await editBranchMutation.mutateAsync({ axiosWithToken, reqBody: branchDetails, id: branchId });
                        if (result.status === 200) {
                            toast.success(result.data.Message);
                        }
                    }
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
            }
            handleCloseEditModal();
        }
    };


    const handleEditBranch = (branch) => {
        setBranchId(branch._id);
        handleEditDetails(branch, branchDetails, setBranchDetails, setModalStatus, setModalType);
    };

    const handleBranchesDelete = async (id) => {
        try {
            const result = await deleteBranchMutation.mutateAsync({ axiosWithToken, id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.Message);
        }
    };

    const handleCloseEditModal = () => {
        setBranchId("");
        setImagePreview("");
        setPrevImage("");
        handleCloseEditDetails(branchDetails, setBranchDetails, setModalStatus, setModalType, setFormSubmitStatus);
    };

    if (allBranchesLoading) {
        return (
            <Loader />
        )
    }
    if (allBranchesIsError) {
        return (
            <Error />
        )
    }

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>Branch Locations</h3>
                </div>
                {(auth?.role === "Manager") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} /> Add&nbsp;Branch</button>}
            </div>
            <div className='mt-6'>
                <input type="text" onChange={(e) => setFilter(e.target.value)} value={filter} className='px-4 py-2 rounded-lg border border-dim w-[200px]' placeholder='Search by Name' />
            </div>
            <div className='flex flex-col w-full gap-8 mt-8'>
                {
                    allBranches?.length > 0 ?
                        allBranches?.map((branch) => (
                            <div key={branch._id} className='w-full shadow-[5px_5px_10px_1px_#cdcdcd] p-8 text-dim-black flex gap-4 flex-col sm:flex-row'>
                                <img src={branch?.image?.url} alt={`${branch?.branchName} branch photo`} className='block w-full sm:w-[200px] aspect-3/2 object-cover object-center' />
                                <div className='flex flex-col w-full'>
                                    <div className='flex justify-between'>
                                        <h5 className='font-bold text-lg text-black mb-3'>{branch?.branchName}</h5>
                                        {auth?.role === "Manager" && <button className='disabled:opacity-50 disabled:hover:opacity-50 cursor-pointer disabled:cursor-not-allowed' onClick={() => handleBranchesDelete(branch?._id)} disabled={deleteBranchMutation.isPending} aria-label='Delete branch'><Trash size={15} className='text-red-600' /></button>}
                                    </div>
                                    <p>{branch?.location}</p>
                                    <p>{branch?.phone}</p>
                                    <p className='mt-3'>Staff: {branch?.staffs?.length}</p>
                                    {(auth?.role === "Manager") && <button className='cursor-pointer hover:opacity-75 text-blue-600 font-bold rounded-md flex items-center ms-auto text-sm' aria-label='Edit branch' onClick={() => handleEditBranch(branch)}><SquarePen size={15} className='inline' /></button>}
                                </div>
                            </div>
                        )) :
                        <>
                            <p className='-mt-3 text-dim-black'>No branches available yet.</p>
                            <img src="/empty.gif" alt="Empty" className='w-[300px] block mx-auto' />
                        </>
                }
            </div>


            {/* modal*/}
            {(modalStatus) && <>
                <ModalBackground zIndex={11} />
                <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-11 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                    <div className="flex items-center justify-between">
                        <h5 className='font-bold text-2xl'>{modalType} Branch</h5>
                        <button className='hover:opacity-60 disabled:opacity-50 disabled:hover:opacity-50 cursor-pointer disabled:cursor-not-allowed' onClick={handleCloseEditModal} disabled={addBranchMutation.isPending || editBranchMutation.isPending}><FontAwesomeIcon icon={faXmark} className='text-xl' /></button>
                    </div>
                    <hr className='text-dim mt-2' />
                    <form className='mt-10 flex flex-col gap-1 max-h-[70vh] overflow-y-auto pt-4 pb-10 px-4'>
                        <TextField id="branchName" name='branchName' variant="outlined" type="text" className='w-full mt-8' label="Branch Name" onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.branchName} />
                        <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || branchDetails.branchName) && "hidden" }}>Branch Name is required</p>
                        <TextField id="location" name='location' label="Location" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.location} />
                        <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || branchDetails.location) && "hidden" }}>Location is required</p>
                        <TextField id="phone" name='phone' label="Phone Number" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.phone} />
                        <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || branchDetails.phone) && "hidden" }}>Phone Number is required</p>
                        <TextField id="longitude" name='longitude' label="Longitude" variant="outlined" type="number" className='w-full' onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.longitude} />
                        <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || branchDetails.longitude) && "hidden" }}>Longitude  is required</p>
                        <TextField id="latitude" name='latitude' label="Latitude" variant="outlined" type="number" className='w-full' onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.latitude} />
                        <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || branchDetails.latitude) && "hidden" }}>Latitude is required</p>
                        <input type="file" name='image' id='image' className='hidden' onChange={handleImageUplaod} />
                        <label htmlFor="image">
                            <img src={imagePreview ? imagePreview : branchDetails.image ? branchDetails.image.url : "/imageUpload.png"} alt="Photo of the branch" className='w-[280px] aspect-3/2 object-contain cursor-pointer block mx-auto mt-5' />
                        </label>
                        <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || branchDetails.image) && "hidden" }}>Branch Photo is required</p>
                        <div className='mt-8 text-right'>
                            <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleCloseEditModal} disabled={addBranchMutation.isPending || editBranchMutation.isPending}>Cancel</button>
                            <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleSaveBranch} disabled={addBranchMutation.isPending || editBranchMutation.isPending}>Save</button>
                        </div>
                    </form>

                </div>
            </>
            }
            {(addBranchMutation.isPending || editBranchMutation.isPending || deleteBranchMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </section>
    )
}

export default DashboardBranches