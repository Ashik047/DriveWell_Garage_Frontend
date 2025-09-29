import React from 'react'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SquarePen, Trash } from 'lucide-react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails, handleEditDetails } from '../helpers/formHelper';
import ModalBackground from "../components/ModalBackground"
import { allStaffDetails } from '../constants/staffDetails'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { branches } from '../constants/branches'
import { useEffect } from 'react'
import { addStaffsApi, deleteStaffsApi, getStaffsApi, updateStaffsApi } from '../api/staffApi'

const DashboardStaffs = ({ role }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    /*  const [allStaffDetails, setAllStaffDetails] = useState({
         staffName: "",
         email: "",
         role: "",
         branch: "",
         status: ""
     }); */

    const [staffDetails, setStaffDetails] = useState({
        /* add id for api calls */
        staffName: "",
        email: "",
        role: "",
        branch: "",
        status: ""
    });

    /*  useEffect(() => {
         (async function () {
             const apiData = await getStaffsApi();
             setAllStaffDetails(apiData);
         })();
     }, []); */

    const handleSaveStaff = async () => {
        /* api call */
        /* let result;
       if (modalType === "Edit") {
           result = await updateStaffsApi(feedbackDetails);
       } else if (modalType === "Add") {
           result = await addStaffsApi(feedbackDetails);
       } */

        handleCloseEditDetails(staffDetails, setStaffDetails, setModalStatus, setModalType);
    };

    const handleStaffsDelete = async () => {
        /* api call */
        // const result = await deleteStaffsApi(id);
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>Staffs</h3>
                </div>
                {(role === "manager") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} />  Add&nbsp;Staff</button>}
            </div>
            <table className='table-auto border-separate border-spacing-3  w-full text-center mt-10 shadow-[5px_5px_10px_1px_#cdcdcd]'>
                <thead>
                    <tr>
                        <th className='p-4'>Name</th>
                        <th className='p-4 hidden lg:block'>Email</th>
                        <th className='p-4'>Role</th>
                        <th className='p-4 hidden sm:block'>Branch</th>
                        <th className='p-4'>Status</th>
                        <th className='p-4'></th>
                    </tr>
                </thead>
                <tbody className='text-dim-black'>
                    {
                        allStaffDetails?.map((staff) => {
                            return <tr key={staff.id} >

                                <td className='p-4'>{staff.staffName}</td>
                                <td className='p-4 hidden lg:block'>{staff.email}</td>
                                <td className='p-4'>{staff.role}</td>
                                <td className='p-4 hidden sm:block'>{staff.branch}</td>
                                <td className='p-4 font-semibold' style={staff.status ? { color: "#16A34A" } : { color: "#DC2626" }}>{staff.status ? "Active" : "Inactive"}</td>
                                <td className='p-4'><button className='cursor-pointer' onClick={() => handleEditDetails(staff, staffDetails, setStaffDetails, setModalStatus, setModalType)}><SquarePen size={15} className='text-blue-700 me-1' /></button><button className='cursor-pointer'><Trash size={15} className='text-red-600' /></button></td>
                            </tr>
                        })
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
                            <button className='hover:opacity-60' onClick={() => handleCloseEditDetails(staffDetails, setStaffDetails, setModalStatus, setModalType)}><FontAwesomeIcon icon={faXmark} className='text-xl cursor-pointer' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col gap-6'>
                            <TextField id="staffName" name='staffName' variant="outlined" type="text" className='w-full mt-8' label="Staff Name" onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.staffName} required />
                            <TextField id="email" name='email' label="Email" variant="outlined" type="email" className='w-full' onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.email} required />
                            <FormControl fullWidth >
                                <InputLabel id="role" required className='mt-4'>Select Role</InputLabel>
                                <Select
                                    labelId="role"
                                    id="role"
                                    name='role'
                                    defaultValue={staffDetails.role}
                                    value={staffDetails.role}
                                    label="Select Role"
                                    onChange={(e) => handleChange(e, setStaffDetails)}
                                    required
                                    className='mt-4'
                                >
                                    <MenuItem value="Worker">Worker</MenuItem>
                                    <MenuItem value="Manager">Manager</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth >
                                <InputLabel id="branch" required className='mt-4'>Select Branch</InputLabel>
                                <Select
                                    labelId="branch"
                                    id="branch"
                                    name='branch'
                                    defaultValue={staffDetails.branch}
                                    value={staffDetails.branch}
                                    label="Select Branch"
                                    onChange={(e) => handleChange(e, setStaffDetails)}
                                    required
                                    className='mt-4'
                                >
                                    {
                                        branches?.features?.map((branch => (
                                            <MenuItem value={branch.data.name.split(" ")[0]}>{branch.data.name.split(" ")[0]}</MenuItem>

                                        )))
                                    }

                                </Select>
                            </FormControl>
                            <FormControl fullWidth >
                                <InputLabel id="status" required className='mt-4'>Select Status</InputLabel>
                                <Select
                                    labelId="status"
                                    id="status"
                                    name='status'
                                    defaultValue={staffDetails.status}
                                    value={staffDetails.status}
                                    label="Select Status"
                                    onChange={(e) => handleChange(e, setStaffDetails)}
                                    required
                                    className='mt-4'
                                >
                                    <MenuItem value={true}>Active</MenuItem>
                                    <MenuItem value={false}>Inactive</MenuItem>
                                </Select>
                            </FormControl>

                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={() => handleCloseEditDetails(staffDetails, setStaffDetails, setModalStatus, setModalType)}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={handleSaveStaff}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }
        </section>
    )
}

export default DashboardStaffs