import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { userCars } from '../constants/userCars'
import { SquarePen, Trash } from 'lucide-react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails, handleEditDetails } from '../helpers/formHelper';
import ModalBackground from '../components/ModalBackground'

const CustomerVehicle = ({ role }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");

    const [vehicleDetails, setVehicleDetails] = useState({
        customer: "",
        car: "",
        plate: "",
        year: ""
    });

    const handleSaveVehicle = () => {
        /* api call */

        handleCloseEditDetails(vehicleDetails, setVehicleDetails, setModalStatus, setModalType);
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>{(role === "customer") && <span>My </span>}Vehicles</h3>
                    {(role === "customer") && <p className='mt-0.5 text-dim-black'>Manage your registered vehicles</p>}
                </div>
                {(role === "customer") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} />Add&nbsp;Vehicle</button>}
            </div>
            <table className='table-auto border-separate border-spacing-3  w-full text-center mt-10 shadow-[5px_5px_10px_1px_#cdcdcd]'>
                <thead>
                    <tr>
                        <th className='p-4'>Vehicle</th>
                        {(role !== "customer") && <th className='p-4'>Owner</th>}
                        <th className='p-4'>Year</th>
                        <th className='p-4 hidden md:block'>License Plate</th>
                        {(role === "customer" /* || role === "manager" */) && <th className='p-4'></th>}
                    </tr>
                </thead>
                <tbody className='text-dim-black'>
                    {/* (role === "customer") ? */
                        userCars?.filter(car => car.customer === "John Alex")?.map((car) => {
                            return <tr key={car.id}>
                                <td className='p-4'>{car.car}</td>
                                {(role !== "customer") && <td className='p-4'>{car.customer}</td>}
                                <td className='p-4'>{car.year}</td>
                                <td className='p-4 hidden md:block'>{car.plate}</td>
                                {(role === "customer" /* || role === "manager" */) && <td className='p-4'><button className='cursor-pointer' onClick={() => handleEditDetails(car, vehicleDetails, setVehicleDetails, setModalStatus, setModalType)}><SquarePen size={15} className='text-blue-700 me-1' /></button><button className='cursor-pointer'><Trash size={15} className='text-red-600' /></button></td>}
                            </tr>
                        })
                        /* :
                        userCars?.map((car) => {
                            return <tr key={car.id}>
                                <td className='p-4'>{car.car}</td>
                                {(role !== "customer") && <td className='p-4'>{car.customer}</td>}
                                <td className='p-4'>{car.year}</td>
                                <td className='p-4 hidden md:block'>{car.plate}</td>
                                {(role === "customer" || role === "manager") && <td className='p-4'><button className='cursor-pointer' onClick={() => handleEditDetails(car, vehicleDetails, setVehicleDetails, setModalStatus, setModalType)}><SquarePen size={15} className='text-blue-700 me-1' /></button><button className='cursor-pointer'><Trash size={15} className='text-red-600' /></button></td>}
                            </tr>
                        }) */
                    }
                </tbody>
            </table>




            {/* modal */}
            {
                modalStatus &&
                <>
                    <ModalBackground />

                    <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>{modalType} Vehicle</h5>
                            <button className='hover:opacity-60' onClick={() => handleCloseEditDetails(vehicleDetails, setVehicleDetails, setModalStatus, setModalType)}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col gap-6'>
                            <TextField id="customer" name='customer' variant="outlined" type="text" className='w-full mt-8' label="Customer" onChange={(e) => handleChange(e, setVehicleDetails)} value={vehicleDetails.customer} required />
                            <TextField id="car" name='car' label="Car" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setVehicleDetails)} value={vehicleDetails.car} required />
                            <TextField id="plate" name='plate' label="Plate" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setVehicleDetails)} value={vehicleDetails.plate} required />
                            <TextField id="year" name='year' label="Year" variant="outlined" type="number" className='w-full' onChange={(e) => handleChange(e, setVehicleDetails)} value={vehicleDetails.year} required inputProps={{
                                min: 1900,
                                step: 1
                            }} />
                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={() => handleCloseEditDetails(vehicleDetails, setVehicleDetails, setModalStatus, setModalType)}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={handleSaveVehicle}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }
        </section>
    )
}

export default CustomerVehicle