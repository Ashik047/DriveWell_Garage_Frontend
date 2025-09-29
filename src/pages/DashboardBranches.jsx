import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { branches } from '../constants/branches'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleCloseEditDetails, handleEditDetails, handleChange } from '../helpers/formHelper'
import ModalBackground from '../components/ModalBackground'

const DashboardBranches = ({ role }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    const [branchDetails, setBranchDetails] = useState({
        name: "",
        location: "",
        phone: ""
    });

    const handleSaveBranch = () => {
        /* api call */
        handleCloseEditDetails(branchDetails, setBranchDetails, setModalStatus, setModalType);
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>Branch Locations</h3>
                </div>
                {(role === "manager") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} /> Add&nbsp;Branch</button>}
            </div>
            <div className='flex flex-col w-full gap-8 mt-8'>
                {
                    branches?.features?.map((branch) => (
                        <div key={branch.data.id} className='w-full shadow-[5px_5px_10px_1px_#cdcdcd] p-8 text-dim-black'>
                            <h5 className='font-bold text-lg text-black mb-3'>{branch.data.name}</h5>
                            <p>{branch.data.location}</p>
                            <p>{branch.data.phone}</p>
                            <p className='mt-3'>Staff: {branch.data.staff}</p>
                            {(role === "manager") && <button className='text-accent hover:opacity-75 font-bold mt-4 cursor-pointer block ms-auto' onClick={() => handleEditDetails(branch.data, branchDetails, setBranchDetails, setModalStatus, setModalType)}>Edit</button>}
                        </div>
                    ))
                }
            </div>


            {/* modal*/}
            {(modalStatus) && <>
                <ModalBackground />

                <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                    <div className="flex items-center justify-between">
                        <h5 className='font-bold text-2xl'>{modalType} Branch</h5>
                        <button className='hover:opacity-60' onClick={() => handleCloseEditDetails(branchDetails, setBranchDetails, setModalStatus, setModalType)}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                    </div>
                    <hr className='text-dim mt-2' />
                    <form className='mt-10 flex flex-col gap-6'>
                        <TextField id="name" name='name' variant="outlined" type="text" className='w-full mt-8' label="Branch Name" onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.name} required />
                        <TextField id="location" name='location' label="Location" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.location} required />
                        <TextField id="phone" name='phone' label="Phone Number" variant="outlined" type="tel" className='w-full' onChange={(e) => handleChange(e, setBranchDetails)} value={branchDetails.phone} required />
                        <div className='mt-8 text-right'>
                            <button className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={() => handleCloseEditDetails(branchDetails, setBranchDetails, setModalStatus, setModalType)}>Cancel</button>
                            <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={handleSaveBranch}>Save</button>
                        </div>
                    </form>

                </div>
            </>
            }

        </section>
    )
}

export default DashboardBranches