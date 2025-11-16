import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SquarePen, Trash } from 'lucide-react'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { handleAdd, handleChange, handleCloseEditDetails, handleEditDetails } from '../helpers/formHelper';
import ModalBackground from "../components/ModalBackground"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { addStaffApi, deleteStaffApi, editStaffApi, getAllStaffsApi } from '../api/staffApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllBranchesApi } from '../api/branchApi'
import { toast, ToastContainer } from 'react-toastify'
import { Commet } from 'react-loading-indicators'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const DashboardStaffs = () => {
    const [modalStatus, setModalStatus] = useState(false);
    const [modalType, setModalType] = useState("");
    const [staffId, setStaffId] = useState("");
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);

    const [staffDetails, setStaffDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        branch: ""
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

    const { data: allBranches, isLoading: allBranchesLoading, isError: allBranchesIsError, error: allBranchesError } = useQuery({
        queryKey: ["Branch"],
        queryFn: () => getAllBranchesApi(["branchName"]),
        select: response => response?.data?.sort((a, b) => (a.branchName.toLowerCase().localeCompare(b.branchName.toLowerCase()))),
    }
    );

    const { data: allStaffs, isLoading: allStaffsLoading, isError: allStaffsIsError, error: allStaffsError } = useQuery({
        queryKey: ["Staff"],
        queryFn: () => getAllStaffsApi({ axiosWithToken }),
        select: response => response?.data?.sort((a, b) => (a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()))),
        enabled: !!auth?.accessToken
    }
    );

    const addStaffMutation = useMutation(addStaffApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(["Staff"]);
        }
    });

    const editStaffMutation = useMutation(editStaffApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(['Staff']);
        }
    });

    const deleteStaffMutation = useMutation(deleteStaffApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(['Staff']);
        }
    });

    const handleSaveStaff = async () => {
        setFormSubmitStatus(true);
        if (staffDetails.fullName && staffDetails.email && staffDetails.phone && staffDetails.role && staffDetails.branch) {
            try {
                if (modalType === "Add") {
                    const result = await addStaffMutation.mutateAsync({ axiosWithToken, reqBody: staffDetails });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                } else if (modalType === "Edit") {
                    const result = await editStaffMutation.mutateAsync({ axiosWithToken, reqBody: staffDetails, id: staffId });
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

    const handleEditStaff = (staff) => {
        setStaffId(staff._id);
        handleEditDetails(staff, staffDetails, setStaffDetails, setModalStatus, setModalType)
    };

    const handleCloseEditModal = () => {
        setStaffId("");
        handleCloseEditDetails(staffDetails, setStaffDetails, setModalStatus, setModalType, setFormSubmitStatus);
    };

    const handleStaffsDelete = async (id) => {
        try {
            const result = await deleteStaffMutation.mutateAsync({ axiosWithToken, id });
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.Message);
        }
    };

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>Staffs</h3>
                </div>
                {(auth?.role === "Manager") && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleAdd(setModalStatus, setModalType)}><FontAwesomeIcon icon={faPlus} />  Add&nbsp;Staff</button>}
            </div>
            {
                allStaffs?.length > 0 ?
                    <table className='table-auto border-separate border-spacing-3  w-full text-center mt-10 shadow-[5px_5px_10px_1px_#cdcdcd]'>
                        <thead>
                            <tr>
                                <th className='p-4'>Name</th>
                                <th className='p-4 hidden lg:block'>Email</th>
                                <th className='p-4'>Role</th>
                                <th className='p-4 hidden xs:block'>Branch</th>
                                {(auth?.role === "Manager") && <th className='p-4'></th>}
                            </tr>
                        </thead>
                        <tbody className='text-dim-black'>
                            {
                                allStaffs?.map((staff) => {
                                    return <tr key={staff._id} >
                                        <td className='p-4'>{staff.fullName}</td>
                                        <td className='p-4 hidden lg:block'>{staff.email}</td>
                                        <td className='p-4'>{staff.role}</td>
                                        <td className='p-4 hidden xs:block'>{staff.branch}</td>
                                        {(auth?.role === "Manager") && <td className='p-4'><button className='cursor-pointer' aria-label='Edit staff details' onClick={() => handleEditStaff(staff)}><SquarePen size={15} className='text-blue-700 me-1' /></button><button aria-label='Delete staff details' className='cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={deleteStaffMutation.isPending} onClick={() => handleStaffsDelete(staff._id)}><Trash size={15} className='text-red-600' /></button></td>}
                                    </tr>
                                })
                            }
                        </tbody>
                    </table> :
                    <>
                        <p className='mt-6 text-dim-black'>No staffs available yet.</p>
                        <img src="/empty.gif" alt="Empty" className='w-[300px] block mx-auto' />
                    </>
            }


            {/* modal */}
            {
                modalStatus &&
                <>
                    <ModalBackground zIndex={11} />

                    <div className="fixed bg-white top-[50%] left-[50%] transform -translate-[50%] z-20 px-6 py-10 text-left sm:w-[500px] xs:w-[400px] w-[300px] rounded-lg shadow-[5px_5px_10px_1px_gray]">
                        <div className="flex items-center justify-between">
                            <h5 className='font-bold text-2xl'>{modalType} Staff</h5>
                            <button className='hover:opacity-60 cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleCloseEditModal} disabled={addStaffMutation.isPending || editStaffMutation.isPending}><FontAwesomeIcon icon={faXmark} className='text-xl' /></button>
                        </div>
                        <hr className='text-dim mt-2' />
                        <form className='mt-10 flex flex-col max-h-[70vh] overflow-y-auto pt-4 pb-10 px-4'>
                            <TextField id="fullName" name='fullName' variant="outlined" type="text" className='w-full mt-8' label="Staff Name" onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.fullName} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.fullName) && "hidden" }}>Staff name is required</p>
                            <TextField id="email" name='email' label="Email" variant="outlined" type="email" className='w-full' onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.email} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.email) && "hidden" }}>Email is required</p>
                            <TextField id="phone" name='phone' label="Phone" variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setStaffDetails)} value={staffDetails.phone} />
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.phone) && "hidden" }}>Phone number is required</p>
                            <FormControl fullWidth >
                                <InputLabel id="role">Select Role</InputLabel>
                                <Select
                                    labelId="role"
                                    id="role"
                                    name='role'
                                    defaultValue={staffDetails.role}
                                    value={staffDetails.role}
                                    label="Select Role"
                                    onChange={(e) => handleChange(e, setStaffDetails)}>
                                    <MenuItem value="Staff">Staff</MenuItem>
                                    <MenuItem value="Manager">Manager</MenuItem>
                                </Select>
                            </FormControl>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.role) && "hidden" }}>Role is required</p>
                            <FormControl fullWidth >
                                <InputLabel id="branch">Select Branch</InputLabel>
                                <Select
                                    labelId="branch"
                                    id="branch"
                                    name='branch'
                                    defaultValue={staffDetails.branch}
                                    value={staffDetails.branch}
                                    label="Select Branch"
                                    onChange={(e) => handleChange(e, setStaffDetails)}>
                                    {
                                        allBranches?.map((branch => (
                                            <MenuItem value={branch.branchName}>{branch.branchName}</MenuItem>

                                        )))
                                    }
                                </Select>
                            </FormControl>
                            <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || staffDetails.branch) && "hidden" }}>Branch is required</p>
                            <div className='mt-8 text-right'>
                                <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleCloseEditModal} disabled={addStaffMutation.isPending || editStaffMutation.isPending}>Cancel</button>
                                <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleSaveStaff} disabled={addStaffMutation.isPending || editStaffMutation.isPending}>Save</button>
                            </div>
                        </form>

                    </div>
                </>
            }
            {(addStaffMutation.isPending || editStaffMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </section>
    )
}

export default DashboardStaffs