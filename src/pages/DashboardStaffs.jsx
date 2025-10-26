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
import { addStaffApi } from '../api/staffApi';
import { branches } from '../constants/branches'
import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllBranchesApi } from '../api/branchApi'
import { toast, ToastContainer } from 'react-toastify'
import { Commet } from 'react-loading-indicators'
import useAxiosWithToken from '../hooks/useAxiosWithToken'

const DashboardStaffs = ({ role }) => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);

    /*  const [allStaffDetails, setAllStaffDetails] = useState({
         staffName: "",
         email: "",
         role: "",
         branch: "",
         status: ""
     }); */

    const [staffDetails, setStaffDetails] = useState({
        /* add id for api calls */
        fullName: "",
        email: "",
        phone: "",
        role: "",
        branch: ""
    });

    /*  useEffect(() => {
         (async function () {
             const apiData = await getStaffsApi();
             setAllStaffDetails(apiData);
         })();
     }, []); */

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();
    const { data: allBranches, isLoading: allBranchesLoading, isError: allBranchesIsError, error: allBranchesError } = useQuery({
        queryKey: ["Branch"],
        queryFn: () => getAllBranchesApi(["branchName"]),
        select: response => response?.data?.sort((a, b) => (a.branchName.toLowerCase().localeCompare(b.branchName.toLowerCase()))),
    }
    );

    const addStaffMutation = useMutation(addStaffApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Staff"]);
        }
    });
    // console.log(allBranches);


    const handleSaveStaff = async () => {
        setFormSubmitStatus(true);
        if (staffDetails.fullName && staffDetails.email && staffDetails.phone && staffDetails.role && staffDetails.branch) {
            try {
                if (modalType === "Add") {
                    const result = await addStaffMutation.mutateAsync({ axiosWithToken, reqBody: staffDetails });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }

                } /* else if (modalType === "Edit") {
                    if (imagePreview) {
                        const reqBody = new FormData();
                        for (let key in staffDetails) {
                            reqBody.append(key, staffDetails[key]);
                        }
                        reqBody.append("prevImage", prevImage);
                        const result = await editBranchMutation.mutateAsync({ axiosWithToken, reqBody, id: branchId });
                        if (result.status === 200) {
                            toast.success(result.data.Message);
                        }
                    } else {
                        const result = await editBranchMutation.mutateAsync({ axiosWithToken, reqBody: staffDetails, id: branchId });
                        if (result.status === 200) {
                            toast.success(result.data.Message);
                        }
                    }
                } */
            } catch (err) {
                toast.error(err.response.data.Message);
            }
            handleCloseEditDetails(staffDetails, setStaffDetails, setModalStatus, setModalType, setFormSubmitStatus);
        }
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
                {(role === "Manager") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} />  Add&nbsp;Staff</button>}
            </div>
            <table className='table-auto border-separate border-spacing-3  w-full text-center mt-10 shadow-[5px_5px_10px_1px_#cdcdcd]'>
                <thead>
                    <tr>
                        <th className='p-4'>Name</th>
                        <th className='p-4 hidden lg:block'>Email</th>
                        <th className='p-4'>Role</th>
                        <th className='p-4 hidden sm:block'>Branch</th>
                        <th className='p-4'>Status</th>
                        {(role === "Manager") && <th className='p-4'></th>}
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
                                {(role === "Manager") && <td className='p-4'><button className='cursor-pointer' onClick={() => handleEditDetails(staff, staffDetails, setStaffDetails, setModalStatus, setModalType)}><SquarePen size={15} className='text-blue-700 me-1' /></button><button className='cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed'><Trash size={15} className='text-red-600' /></button></td>}
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
                            <h5 className='font-bold text-2xl'>{modalType} Staff</h5>
                            <button className='hover:opacity-60 cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={() => handleCloseEditDetails(staffDetails, setStaffDetails, setModalStatus, setModalType, setFormSubmitStatus)} disabled={addStaffMutation.isPending}><FontAwesomeIcon icon={faXmark} className='text-xl' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col h-[70vh] overflow-y-scroll pt-4 pb-10 px-4'>
                            <TextField id="fullName" name='fullName' variant="outlined" type="text" className='w-full mt-8' label="Staff Name" onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.fullName} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.fullName) && "hidden" }}>Staff name is required</p>
                            <TextField id="email" name='email' label="Email" variant="outlined" type="email" className='w-full' onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.email} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.email) && "hidden" }}>Email is required</p>
                            <TextField id="phone" name='phone' label="Phone" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.phone} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.phone) && "hidden" }}>Phone number is required</p>
                            <FormControl fullWidth >
                                <InputLabel id="role" className=''>Select Role</InputLabel>
                                <Select
                                    labelId="role"
                                    id="role"
                                    name='role'
                                    defaultValue={staffDetails.role}
                                    value={staffDetails.role}
                                    label="Select Role"
                                    onChange={(e) => handleChange(e, setStaffDetails)}
                                    className=''
                                >
                                    <MenuItem value="Staff">Staff</MenuItem>
                                    <MenuItem value="Manager">Manager</MenuItem>
                                </Select>
                            </FormControl>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.role) && "hidden" }}>Role is required</p>
                            <FormControl fullWidth >
                                <InputLabel id="branch" className=''>Select Branch</InputLabel>
                                <Select
                                    labelId="branch"
                                    id="branch"
                                    name='branch'
                                    defaultValue={staffDetails.branch}
                                    value={staffDetails.branch}
                                    label="Select Branch"
                                    onChange={(e) => handleChange(e, setStaffDetails)}
                                    className=''
                                >
                                    {
                                        allBranches?.map((branch => (
                                            <MenuItem value={branch.branchName}>{branch.branchName}</MenuItem>

                                        )))
                                    }

                                </Select>
                            </FormControl>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.branch) && "hidden" }}>Branch is required</p>
                            {/* {modalType === "Edit" && <FormControl fullWidth >
                                <InputLabel id="status" className=''>Select Status</InputLabel>
                                <Select
                                    labelId="status"
                                    id="status"
                                    name='status'
                                    defaultValue={staffDetails.status}
                                    value={staffDetails.status}
                                    label="Select Status"
                                    onChange={(e) => handleChange(e, setStaffDetails)}
                                    className=''
                                >
                                    <MenuItem value={true}>Active</MenuItem>
                                    <MenuItem value={false}>Inactive</MenuItem>
                                </Select>
                            </FormControl>} */}

                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={() => handleCloseEditDetails(staffDetails, setStaffDetails, setModalStatus, setModalType, setFormSubmitStatus)} disabled={addStaffMutation.isPending}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleSaveStaff} disabled={addStaffMutation.isPending}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }
            {(addStaffMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </section>
    )
}

export default DashboardStaffs