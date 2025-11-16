import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SquarePen, Trash } from 'lucide-react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails, handleEditDetails } from '../helpers/formHelper';
import ModalBackground from '../components/ModalBackground'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import { addVehicleApi, deleteVehicleApi, editVehicleApi, getMyVehiclesApi } from '../api/vehicleApi'
import { Commet } from 'react-loading-indicators'
import { toast, ToastContainer } from 'react-toastify'
import AuthContext from '../context/AuthProvider'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const CustomerVehicle = () => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);

    const [vehicleDetails, setVehicleDetails] = useState({
        vehicle: "",
        plate: "",
        year: ""
    });

    const { auth } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.role && auth?.role !== "Customer") {
            navigate("/");
        }
    }, [auth?.role]);

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();

    const { data: myVehicles, isLoading: myVehiclesLoading, isError: myVehiclesIsError, error: myVehiclesError } = useQuery({
        queryKey: ['Vehicle'],
        queryFn: () => getMyVehiclesApi({ axiosWithToken }),
        select: response => response?.data?.sort((a, b) => (a.vehicle.toLowerCase().localeCompare(b.vehicle.toLowerCase()))),
        enabled: !!auth?.accessToken
    }
    );

    const addVehicleMutation = useMutation(addVehicleApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Vehicle"]);
        }
    });

    const editVehicleMutation = useMutation(editVehicleApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Vehicle"]);
        }
    });

    const deleteVehicleMutation = useMutation(deleteVehicleApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Vehicle"]);
        }
    });

    const handleSaveVehicle = async () => {
        setFormSubmitStatus(true);
        const { vehicle, year, plate } = vehicleDetails;
        if (vehicle && year && plate) {
            const plateRegex = /^[A-Z]{2}\s?\d?[1-9]\s?[A-Z][A-Z]?\s?\d{4}/g;
            if (!plateRegex.test(plate)) {
                return toast.error("Invalid License Plate.");
            }
            try {
                if (modalType === "Add") {
                    const result = await addVehicleMutation.mutateAsync({ axiosWithToken, reqBody: { vehicle, year, plate } });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                } else if (modalType === "Edit") {
                    const result = await editVehicleMutation.mutateAsync({ axiosWithToken, reqBody: { vehicle, year, plate }, id: vehicleId });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
            }
            handleCloseEditModal();
        }
    };

    const handleVehicleDelete = async (id) => {
        try {
            const result = await deleteVehicleMutation.mutateAsync({ axiosWithToken, id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.Message);
        }
    };

    const handleEditFeedback = (vehicle) => {
        setVehicleId(vehicle._id);
        handleEditDetails(vehicle, vehicleDetails, setVehicleDetails, setModalStatus, setModalType);
    };

    const handleCloseEditModal = () => {
        setVehicleId("");
        handleCloseEditDetails(vehicleDetails, setVehicleDetails, setModalStatus, setModalType, setFormSubmitStatus);
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'><span>My </span>Vehicles</h3>
                    <p className='mt-0.5 text-dim-black'>Manage your registered vehicles</p>
                </div>
                <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} />Add&nbsp;Vehicle</button>
            </div>
            <table className='table-auto border-separate border-spacing-3  w-full text-center mt-10 shadow-[5px_5px_10px_1px_#cdcdcd]'>
                <thead>
                    <tr>
                        <th className='p-4'>S. No.</th>
                        <th className='p-4'>Vehicle</th>
                        <th className='p-4'>Year</th>
                        <th className='p-4 hidden md:block'>License Plate</th>
                        <th className='p-4'></th>
                    </tr>
                </thead>
                <tbody className='text-dim-black'>
                    {
                        myVehicles?.map((vehicle, index) => {
                            return <tr key={vehicle?._id}>
                                <td className='p-4'>{index + 1}</td>
                                <td className='p-4'>{vehicle?.vehicle}</td>
                                <td className='p-4'>{vehicle?.year}</td>
                                <td className='p-4 hidden md:block'>{vehicle?.plate}</td>
                                <td className='p-4'><button type='button' aria-label='Edit vehicle' className='cursor-pointer' onClick={() => handleEditFeedback(vehicle)}><SquarePen size={15} className='text-blue-700 me-1' /></button><button type='button' aria-label='Delete vehicle' className='cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={() => handleVehicleDelete(vehicle._id)} disabled={deleteVehicleMutation.isPending}><Trash size={15} className='text-red-600' /></button></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>


            {/* modal */}
            {
                modalStatus &&
                <>
                    <ModalBackground zIndex={11} />

                    <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>{modalType} Vehicle</h5>
                            <button className='hover:opacity-60 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed cursor-pointer' disabled={addVehicleMutation.isPending || editVehicleMutation.isPending} onClick={handleCloseEditModal}><FontAwesomeIcon icon={faXmark} className='text-xl' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col gap-1 max-h-[70vh] overflow-y-auto pt-4 pb-10 px-4'>
                            <TextField id="vehicle" name='vehicle' label="Vehicle Name" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setVehicleDetails)} value={vehicleDetails.vehicle} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || vehicleDetails.vehicle) && "hidden" }}>Vehicle name is required</p>
                            <TextField id="plate" name='plate' label="License Plate" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setVehicleDetails)} value={vehicleDetails.plate} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || vehicleDetails.plate) && "hidden" }}>License plate is required</p>
                            <TextField id="year" name='year' label="Model Year" variant="outlined" type="number" className='w-full' onChange={(e) => handleChange(e, setVehicleDetails)} value={vehicleDetails.year} inputProps={{
                                min: 1900,
                                step: 1
                            }} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || vehicleDetails.year) && "hidden" }}>Model year is required</p>
                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={addVehicleMutation.isPending || editVehicleMutation.isPending} onClick={handleCloseEditModal}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={addVehicleMutation.isPending || editVehicleMutation.isPending} onClick={handleSaveVehicle}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }
            {(addVehicleMutation.isPending || editVehicleMutation.isPending || deleteVehicleMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </section>
    )
}

export default CustomerVehicle