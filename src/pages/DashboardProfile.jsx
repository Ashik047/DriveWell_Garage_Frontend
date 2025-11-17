import TextField from '@mui/material/TextField'
import { handleChange, handleReset } from '../helpers/formHelper'
import { useState } from 'react';
import { useEffect } from 'react';
import { getUserDetailsApi, updateUserDetailsApi, updateUserPasswordApi } from '../api/userApi';
import useAxiosWithToken from '../hooks/useAxiosWithToken';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import { Commet } from 'react-loading-indicators';
import Loader from "../components/Loader"
import Error from "../components/Error"

const DashProfile = () => {
    const [editDetailsStatus, setEditDetailsStatus] = useState(false);
    const [editPasswordStatus, setEditPasswordStatus] = useState(false);
    const [prevImage, setPrevImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: "",
        image: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const queryClient = useQueryClient();
    const axiosWithToken = useAxiosWithToken();

    const { data: userDetails, isLoading: userDetailsLoading, isError: userDetailsIsError, error: userDetailsError } = useQuery({ queryKey: ['User'], queryFn: () => getUserDetailsApi({ axiosWithToken }) });

    const editUserDetailsMutation = useMutation(updateUserDetailsApi, {
        onSuccess: () => {
            queryClient.invalidateQueries(['User']);
        }
    });

    const editUserPasswordMutation = useMutation(updateUserPasswordApi);

    const dataReset = () => {
        Object.entries(userDetails.data).forEach(([key, value]) => {
            setProfileData(prev => ({ ...prev, [key]: value }));
        })
    };

    useEffect(() => {
        if (userDetails?.data) {
            dataReset();
        }
    }, [userDetails?.data]);

    const handleImageUplaod = (e) => {
        const image = e.target.files[0];
        if (profileData.image) {
            setPrevImage(profileData.image.filename);
        }
        setProfileData(prev => ({ ...prev, image }));
        const imageUrl = URL.createObjectURL(image);
        setImagePreview(imageUrl);
    };

    const handleCancelEditProfile = () => {
        setFormSubmitStatus(false);
        setImagePreview("");
        setPrevImage("");
        dataReset();
        setEditDetailsStatus(false);
    };

    const handleSaveEditProfile = async () => {
        setFormSubmitStatus(true);
        const { fullName, email, phone, address, image } = profileData;
        if (fullName && email && phone) {
            const emailRegex = /^[\w]+@[\w]+\.com+/g;
            if (!emailRegex.test(email)) {
                return toast.error("Invalid Email.");
            }
            try {
                if (imagePreview) {
                    const reqBody = new FormData();
                    for (let key in profileData) {
                        reqBody.append(key, profileData[key]);
                    }
                    reqBody.append("prevImage", prevImage);
                    const result = await editUserDetailsMutation.mutateAsync({ axiosWithToken, reqBody });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                } else {
                    const result = await editUserDetailsMutation.mutateAsync({ axiosWithToken, reqBody: profileData });
                    if (result.status === 200) {
                        toast.success(result.data.Message);
                    }
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
            }
            setFormSubmitStatus(false);
            setImagePreview("");
            setPrevImage("");
            dataReset();
            setEditDetailsStatus(false);
        }
    };

    const handleCancelEditPassword = () => {
        setFormSubmitStatus(false);
        handleReset(passwordData, setPasswordData);
        setEditPasswordStatus(false);
    };

    const handleSaveEditPassword = async () => {
        setFormSubmitStatus(true);
        const { currentPassword, newPassword, confirmPassword } = passwordData;
        if (currentPassword && newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                return toast.error("Passwords do not match.");
            }
            try {
                const result = await editUserPasswordMutation.mutateAsync({ axiosWithToken, reqBody: passwordData });
                if (result.status === 200) {
                    toast.success(result.data.Message);
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
            }
            setFormSubmitStatus(false);
            handleReset(passwordData, setPasswordData);
            setEditPasswordStatus(false);
        }
    };

    if (userDetailsLoading) {
        return (
            <Loader />
        )
    }
    if (userDetailsIsError) {
        return (
            <Error />
        )
    }

    return (
        <section className='mt-10' id='CustomerVehicle'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-2xl font-bold'>Profile Information
                    </h3>
                    <p className='mt-0.5 text-dim-black'>Personal details and account settings</p>
                </div>
                {!editDetailsStatus && !editPasswordStatus && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => setEditDetailsStatus(true)}>Edit&nbsp;Profile</button>}
            </div>
            {!editDetailsStatus && !editPasswordStatus && <>
                <img src={profileData.image.url} alt="Photo of the User" className='w-[100px] aspect-square rounded-[50%] object-contain cursor-pointer block mt-5' />
                <div className='grid grid-cols-2 text-lg text-dim-black gap-y-8 mt-4'>
                    <span className='font-bold'>Full Name:</span>
                    <span>{profileData.fullName}</span>
                    <span className='font-bold'>Email:</span>
                    <span>{profileData.email}</span>
                    <span className='font-bold'>Role:</span>
                    <span>{profileData.role}</span>
                    <span className='font-bold'>Phone Number:</span>
                    <span>{profileData.phone}</span>
                    <span className='font-bold'>Address:</span>
                    <span>{profileData.address}</span>
                </div></>}
            {!editDetailsStatus && !editPasswordStatus && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 mt-8' onClick={() => setEditPasswordStatus(true)}>Change&nbsp;Password</button>}
            {editDetailsStatus && <form>
                <input type="file" name='image' id='image' className='hidden' onChange={handleImageUplaod} />
                <label htmlFor="image">
                    <img src={imagePreview ? imagePreview : profileData.image.url} alt="Photo of the User" className='w-[100px] aspect-square rounded-[50%] object-contain cursor-pointer block mt-5' />
                </label>
                <TextField id="fullName" name='fullName' variant="outlined" label="Full Name" type="text" onChange={(e) => handleChange(e, setProfileData)} value={profileData.fullName} fullWidth sx={{ mt: 3 }} />
                <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || profileData.fullName) && "hidden" }}>Name is required</p>
                <TextField id="email" name='email' variant="outlined" label="Email" type="email" onChange={(e) => handleChange(e, setProfileData)} value={profileData.email} fullWidth sx={{ mt: 1.5 }} />
                <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || profileData.email) && "hidden" }}>Email is required</p>
                <TextField id="phone" name='phone' variant="outlined" label="Phone Number" type="text" onChange={(e) => handleChange(e, setProfileData)} value={profileData.phone} fullWidth sx={{ mt: 1.5 }} />
                <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || profileData.phone) && "hidden" }}>Phone Number is required</p>
                <TextField id="address" name='address' variant="outlined" label="Address" type="text" onChange={(e) => handleChange(e, setProfileData)} value={profileData.address} multiline rows={4} fullWidth sx={{ mt: 2 }} />
                <div className='mt-8 text-right'>
                    <button type='button' className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={editUserDetailsMutation.isPending} onClick={() => handleCancelEditProfile()}>Cancel</button>
                    <button type='button' className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={editUserDetailsMutation.isPending} onClick={() => handleSaveEditProfile()}>Save</button>
                </div>
            </form>}
            {editPasswordStatus && <form>
                <TextField id="currentPassword" name='currentPassword' variant="outlined" label="Current Password" type="password" onChange={(e) => handleChange(e, setPasswordData)} value={passwordData.currentPassword} fullWidth sx={{ mt: 3 }} />
                <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || passwordData.currentPassword) && "hidden" }}>Current Password is required</p>
                <TextField id="newPassword" name='newPassword' variant="outlined" label="New Password" type="password" onChange={(e) => handleChange(e, setPasswordData)} value={passwordData.newPassword} fullWidth sx={{ mt: 1.5 }} />
                <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || passwordData.newPassword) && "hidden" }}>New Password is required</p>
                <TextField id="confirmPassword" name='confirmPassword' variant="outlined" label="Confirm Password Number" type="password" onChange={(e) => handleChange(e, setPasswordData)} value={passwordData.confirmPassword} fullWidth sx={{ mt: 1.5 }} />
                <p className='text-red-700 text-sm ms-1 mb-2' style={{ visibility: (!formSubmitStatus || passwordData.confirmPassword) && "hidden" }}>Confirm Password is required</p>
                <div className='mt-8 text-right'>
                    <button type='button' disabled={editUserPasswordMutation.isPending} className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={() => handleCancelEditPassword()}>Cancel</button>
                    <button type='button' disabled={editUserPasswordMutation.isPending} className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={() => handleSaveEditPassword()}>Save</button>
                </div>
            </form>}
            {(editUserDetailsMutation.isPending || editUserPasswordMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>}

            <ToastContainer theme='light' autoClose={1500} position='top-center' />
        </section>
    )
}

export default DashProfile