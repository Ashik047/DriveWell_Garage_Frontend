import React from 'react'
import { services } from '../constants/carServices'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SquarePen, Trash } from 'lucide-react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails, handleEditDetails } from '../helpers/formHelper';
import ModalBackground from "../components/ModalBackground"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import { addServiceApi, deleteServiceApi, editServiceApi, getAllServicesApi } from '../api/serviceApi'
import { Commet } from 'react-loading-indicators'
import { toast, ToastContainer } from 'react-toastify'
import Service from '../components/Service'
// import { useAddServicesMutation, useDeleteServicesMutation, useGetServicesQuery, useUpdateServicesMutation } from '../redux/slices/servicesApi'

const DashboardServices = ({ role }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    const [prevImage, setPrevImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);

    // const { data:servicesDetails, error: servicesError, isLoading: servicesLoading } = useGetServicesQuery(); 
    // const [addServicesDataApi] = useAddServicesMutation();
    // const [editServicesDataApi] = useUpdateServicesMutation();
    // const [deleteServicesDataApi] = useDeleteServicesMutation();

    const [serviceDetails, setServiceDetails] = useState({
        serviceName: "",
        image: "",
        description: "",
        price: ""
    });

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();

    const { data: allServices, isLoading: allServicesLoading, isError: allServicesIsError, error: allServicesError } = useQuery(['Service'], getAllServicesApi, {
        select: response => response?.data?.sort((a, b) => (b._id - a._id)),
    }
    );

    const addServiceMuation = useMutation(addServiceApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Service"]);
        }
    });

    const editServiceMutation = useMutation(editServiceApi, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['Service']);
        }
    });

    const deleteServiceMutation = useMutation(deleteServiceApi, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['Service']);
        }
    });

    const handleImageUplaod = (e) => {
        const image = e.target.files[0];
        if (serviceDetails.image) {
            setPrevImage(serviceDetails.image.filename);
        }
        setServiceDetails(prev => ({ ...prev, image }));
        const imageUrl = URL.createObjectURL(image);
        setImagePreview(imageUrl);
    }


    const handleSaveService = async () => {
        setFormSubmitStatus(true);
        if (serviceDetails.serviceName && serviceDetails.description && serviceDetails.price && serviceDetails.image) {
            try {
                if (modalType === "Add") {
                    const reqBody = new FormData();
                    for (let key in serviceDetails) {
                        reqBody.append(key, serviceDetails[key]);
                    }
                    const result = await addServiceMuation.mutateAsync({ axiosWithToken, reqBody });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                } else if (modalType === "Edit") {
                    if (imagePreview) {
                        const reqBody = new FormData();
                        for (let key in serviceDetails) {
                            reqBody.append(key, serviceDetails[key]);
                        }
                        reqBody.append("prevImage", prevImage);
                        const result = await editServiceMutation.mutateAsync({ axiosWithToken, reqBody, id: serviceId });
                        if (result.status === 200) {
                            toast.success(result.data.Message);
                        }
                    } else {
                        const result = await editServiceMutation.mutateAsync({ axiosWithToken, reqBody: serviceDetails, id: serviceId });
                        if (result.status === 200) {
                            toast.success(result.data.Message);
                        }
                    }
                }
            } catch (err) {
                toast.error(err.response.data.Message);
            }
            setImagePreview("");
            setPrevImage("");
            handleCloseEditDetails(serviceDetails, setServiceDetails, setModalStatus, setModalType, setFormSubmitStatus);
        }
    };

    const handleEditService = (service) => {
        setServiceId(service._id);
        handleEditDetails(service, serviceDetails, setServiceDetails, setModalStatus, setModalType);
    };

    const handleServicesDelete = async (id) => {
        try {
            const result = await deleteServiceMutation.mutateAsync({ axiosWithToken, id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };

    const handleCloseEditModal = () => {
        setImagePreview("");
        setPrevImage("");
        handleCloseEditDetails(serviceDetails, setServiceDetails, setModalStatus, setModalType, setFormSubmitStatus)
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>Service Management</h3>
                </div>
                {(role === "Manager") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} />  Add&nbsp;Services</button>}
            </div>
            <div className="mt-13 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 ">
                {
                    allServices?.map(service => {
                        return <div key={service._id} className="shadow-[5px_5px_10px_1px_#cdcdcd] p-6">
                            <img src={service.image.url} alt={service.serviceName} className="w-full aspect-3/2 object-cover object-center" />
                            <h3 className="font-bold text-xl mt-4">{service.serviceName}</h3>
                            <p className="text-dim-black text-sm mt-2">{service.description}</p>
                            <p className="text-accent font-medium mt-4">Starting at $<span>{service.price}</span></p>
                            {(role === "Manager") && <div className='p-4 text-right'><button aria-label="Edit-Service" className='cursor-pointer' onClick={() => handleEditService(service)}><SquarePen size={17} className='text-blue-700 me-3' /></button><button aria-label="Delete-Service" className='cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={deleteServiceMutation.isPending} onClick={() => handleServicesDelete(service._id)}><Trash size={17} className='text-red-600' /></button></div>}
                        </div>
                    })
                }
            </div>


            {/* modal */}
            {modalStatus &&
                <>
                    <ModalBackground zIndex={11} />

                    <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-11 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>{modalType} Services</h5>
                            <button className='hover:opacity-60 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed cursor-pointer' onClick={handleCloseEditModal} disabled={addServiceMuation.isPending || editServiceMutation.isPending}><FontAwesomeIcon icon={faXmark} className='text-xl' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col gap-1 h-[70vh] overflow-y-scroll pt-4 pb-10 px-4'>
                            <TextField id="serviceName" name='serviceName' variant="outlined" type="text" className='w-full mt-8' label="Name" onChange={(e) => handleChange(e, setServiceDetails)} value={serviceDetails.serviceName} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || serviceDetails.serviceName) && "hidden" }}>Serive name is required</p>
                            <TextField id="price" name='price' label="Starting Price" variant="outlined" type="number" className='w-full' onChange={(e) => handleChange(e, setServiceDetails)} value={serviceDetails.price} inputProps={{
                                min: 0,
                                step: 0.01
                            }} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || serviceDetails.price) && "hidden" }}>Starting price is required</p>
                            <TextField id="description" name='description' label="Description" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setServiceDetails)} value={serviceDetails.description} multiline rows={4} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || serviceDetails.description) && "hidden" }}>Service description is required</p>
                            <input type="file" name='image' id='image' className='hidden' onChange={handleImageUplaod} />
                            <label htmlFor="image">
                                <img src={imagePreview ? imagePreview : serviceDetails.image ? serviceDetails.image.url : "/imageUpload.png"} alt="Photo of the service" className='w-[280px] aspect-3/2 object-contain cursor-pointer block mx-auto mt-5' />
                            </label>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || serviceDetails.image) && "hidden" }}>Service Photo is required</p>
                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleCloseEditModal} disabled={addServiceMuation.isPending || editServiceMutation.isPending}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleSaveService} disabled={addServiceMuation.isPending || editServiceMutation.isPending}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }
            {(addServiceMuation.isPending || editServiceMutation.isPending || deleteServiceMutation.isPending) &&
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </section>
    )
}

export default DashboardServices