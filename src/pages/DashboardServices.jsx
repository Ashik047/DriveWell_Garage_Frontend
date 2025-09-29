import React from 'react'
import { services } from '../constants/carServices'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SquarePen, Trash } from 'lucide-react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails, handleEditDetails } from '../helpers/formHelper';
import ModalBackground from "../components/ModalBackground"
import { useAddServicesMutation, useDeleteServicesMutation, useUpdateServicesMutation } from '../redux/slices/servicesApi'

const DashboardServices = ({ role }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");

    // const [addServicesDataApi] = useAddServicesMutation();
    // const [editServicesDataApi] = useUpdateServicesMutation();
    // const [deleteServicesDataApi] = useDeleteServicesMutation();

    const [serviceDetails, setServiceDetails] = useState({
        // add id later in this and all similar for updating using id in backend
        name: "",
        icon: "",
        description: "",
        price: ""
    });
    const handleSaveService = async () => {
        /* api call */
        /* let result;
        if (modalType === "Edit") {
            result = await editServicesDataApi(serviceDetails);
        } else if (modalType === "Add") {
            result = await addServicesDataApi(serviceDetails);
        } */

        handleCloseEditDetails(serviceDetails, setServiceDetails, setModalStatus, setModalType);
    };

    const handleServicesDelete = async () => {
        /* api call */
        // const result = await deleteServicesDataApi();
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>Service Management</h3>
                </div>
                {(role === "manager") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} />  Add&nbsp;Services</button>}
            </div>
            <table className='table-auto border-separate border-spacing-3  w-full text-center mt-10 shadow-[5px_5px_10px_1px_#cdcdcd]'>
                <thead>
                    <tr>

                        <th className='p-4 text-left'>Service</th>
                        <th className='p-4 hidden md:block text-left'>Description</th>
                        <th className='p-4'>Price</th>
                        {(role === "manager") && <td className='p-4'></td>}

                    </tr>
                </thead>
                <tbody className='text-dim-black'>
                    {
                        services?.map((service) => {
                            return <tr key={service.id} className='text-left'>

                                <td className='p-4'>{service.name}</td>
                                <td className='p-4 hidden md:block'>{service.description}</td>
                                <td className='p-4 text-center text-red-600'>${service.price}</td>
                                {(role === "manager") && <td className='p-4'><button className='cursor-pointer' onClick={() => handleEditDetails(service, serviceDetails, setServiceDetails, setModalStatus, setModalType)}><SquarePen size={15} className='text-blue-700 me-1' /></button><button className='cursor-pointer' onClick={handleServicesDelete}><Trash size={15} className='text-red-600' /></button></td>}
                            </tr>
                        })
                    }
                </tbody>
            </table>


            {/* modal */}
            {modalStatus &&
                <>
                    <ModalBackground />

                    <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>{modalType} Services</h5>
                            <button className='hover:opacity-60' onClick={() => handleCloseEditDetails(serviceDetails, setServiceDetails, setModalStatus, setModalType)}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col gap-6'>
                            <TextField id="name" name='name' variant="outlined" type="text" className='w-full mt-8' label="Name" onChange={(e) => handleChange(e, setServiceDetails)} value={serviceDetails.name} required />
                            {/* <TextField id="icon" name='icon' label="Icon" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setServiceDetails)} value={serviceDetails.icon} required /> */}
                            <TextField id="price" name='price' label="Price" variant="outlined" type="number" className='w-full' onChange={(e) => handleChange(e, setServiceDetails)} value={serviceDetails.price} required inputProps={{
                                min: 0,
                                step: 0.01
                            }} />
                            <TextField id="description" name='description' label="Description" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setServiceDetails)} value={serviceDetails.description} required multiline rows={4} />
                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={() => handleCloseEditDetails(serviceDetails, setServiceDetails, setModalStatus, setModalType)}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={handleSaveService}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }
        </section>
    )
}

export default DashboardServices