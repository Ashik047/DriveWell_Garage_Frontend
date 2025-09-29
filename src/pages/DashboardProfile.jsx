import TextField from '@mui/material/TextField'
import React from 'react'
import { handleChange, handleReset } from '../helpers/formHelper'
import { useState } from 'react';
import { useEffect } from 'react';
import { userDetails } from '../constants/userDetails';

const DashProfile = () => {
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const dataReset = () => {
        Object.entries(profileData).forEach(([key, value]) => {
            setProfileData(prev => ({ ...prev, [key]: userDetails[key] }));
        })
    };

    useEffect(() => {
        dataReset();
    }, [userDetails]);

    const handleCancelEditProfile = () => {
        dataReset();
        setEditDetailsStatus(false);
    };
    const handleSaveEditProfile = () => {
        /* api */
        dataReset();
        setEditDetailsStatus(false);
    };
    const handleCancelEditPassword = () => {
        handleReset(passwordData, setPasswordData);
        setEditPasswordStatus(false);
    };
    const handleSaveEditPassword = () => {
        /* api */
        handleReset(passwordData, setPasswordData);
        setEditPasswordStatus(false);
    };

    const [editDetailsStatus, setEditDetailsStatus] = useState(false);
    const [editPasswordStatus, setEditPasswordStatus] = useState(false);
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
            {!editDetailsStatus && !editPasswordStatus && <div className='grid grid-cols-2 text-lg text-dim-black gap-y-8 mt-10'>
                <span className='font-bold'>Full Name:</span>
                <span>{profileData.fullName}</span>
                <span className='font-bold'>Email:</span>
                <span>{profileData.email}</span>
                <span className='font-bold'>Role:</span>
                <span>Customer</span>
                <span className='font-bold'>Phone Number:</span>
                <span>{profileData.phone}</span>
                <span className='font-bold'>Address:</span>
                <span>{profileData.address}</span>
            </div>}
            {!editDetailsStatus && !editPasswordStatus && <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75 mt-8' onClick={() => setEditPasswordStatus(true)}>Change&nbsp;Password</button>}
            {editDetailsStatus && <form>
                <TextField id="fullName" name='fullName' variant="outlined" label="Full Name" type="text" onChange={(e) => handleChange(e, setProfileData)} value={profileData.fullName} fullWidth sx={{ mt: 3 }} required />
                <TextField id="email" name='email' variant="outlined" label="Email" type="email" onChange={(e) => handleChange(e, setProfileData)} value={profileData.email} fullWidth sx={{ mt: 3 }} required />
                <TextField id="phone" name='phone' variant="outlined" label="Phone Number" type="tel" onChange={(e) => handleChange(e, setProfileData)} value={profileData.phone} fullWidth sx={{ mt: 3 }} required />
                <TextField id="address" name='address' variant="outlined" label="Address" type="text" onChange={(e) => handleChange(e, setProfileData)} value={profileData.address} multiline rows={4} fullWidth sx={{ mt: 3 }} required />
                <div className='mt-8 text-right'>
                    <button className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={() => handleCancelEditProfile()}>Cancel</button>
                    <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleSaveEditProfile()}>Save</button>
                </div>
            </form>}
            {editPasswordStatus && <form>
                <TextField id="currentPassword" name='currentPassword' variant="outlined" label="Current Password" type="password" onChange={(e) => handleChange(e, setPasswordData)} value={passwordData.currentPassword} fullWidth sx={{ mt: 3 }} required />
                <TextField id="newPassword" name='newPassword' variant="outlined" label="New Password" type="password" onChange={(e) => handleChange(e, setPasswordData)} value={passwordData.newPassword} fullWidth sx={{ mt: 3 }} required />
                <TextField id="confirmPassword" name='confirmPassword' variant="outlined" label="Confirm Password Number" type="password" onChange={(e) => handleChange(e, setPasswordData)} value={passwordData.confirmPassword} fullWidth sx={{ mt: 3 }} required />
                <div className='mt-8 text-right'>
                    <button className='px-4 py-2 bg-white cursor-pointer text-black border font-bold rounded-md hover:opacity-60 me-2' onClick={() => handleCancelEditPassword()}>Cancel</button>
                    <button className='px-4 py-2 bg-accent cursor-pointer text-white font-bold rounded-md hover:opacity-75' onClick={() => handleSaveEditPassword()}>Save</button>
                </div>
            </form>}


        </section>
    )
}

export default DashProfile