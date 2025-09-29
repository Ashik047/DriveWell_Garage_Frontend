import React, { useEffect } from 'react'
import "./Login.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWrench } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { handleChange } from '../helpers/formHelper'
import TextField from '@mui/material/TextField';
import { WrenchIcon } from 'lucide-react'
import { loginApi, passwordResetApi, registerApi } from '../api/authApi'


const Auth = ({ hasAccount, forgotPassword }) => {
    const [rememberMe, setRememberMe] = useState(false);
    const [authDetails, setAuthDetails] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });
    const navigate = useNavigate();

    const handleNavigate = (route) => {
        setAuthDetails({
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
            phone: ""
        });
        navigate(route);
    };

    const handleLogin = async () => {
        /*  const {email,password} = authDetails;
         const result = await loginApi({email,password}); */
    };
    const handlePasswordReset = async () => {
        /* const {email,password,name,phone} = authDetails;
        const result = await registerApi({email,password,name,phone}); */
    };
    const handleRegister = async () => {
        /* const {email} = authDetails;
        const result = await passwordResetApi({email}); */
    };

    return (
        <main className='w-full min-h-screen px-4 xs:px-12 sm:px-4 py-8 grid place-content-center' id='Login'>
            <section className='bg-white sm:w-[500px] xs:w-[400px] w-[300px] px-6 py-8 rounded-lg text-center' >
                {/* style={hasAccount ? { marginTop: "80px" } : forgotPassword ? { marginTop: "100px" } : { marginTop: "20px" }} */}
                <WrenchIcon className='text-accent mx-auto mt-6' size={45} />
                {hasAccount ?
                    <>
                        <h2 className='font-bold text-3xl mt-4'>Log in to DriveWell Garage</h2>
                        <span className='text-dim-black'>or </span><button type="button" onClick={() => handleNavigate("/register")} className='text-accent cursor-pointer'>create a new account</button>
                    </> : forgotPassword ?
                        <>
                            <h2 className='font-bold text-3xl mt-4'>Forgot Your Password?</h2>
                            <span className='text-dim-black'>Back to </span><button type="button" onClick={() => handleNavigate("/login")} className='text-accent cursor-pointer'>Login Page</button>
                        </> :
                        <>
                            <h2 className='font-bold text-3xl mt-4'>Create a new account</h2>
                            <button type="button" onClick={() => handleNavigate("/login")} className='text-accent cursor-pointer'>Already have an account?</button>
                        </>
                }
                <form>
                    {!hasAccount && !forgotPassword && <TextField id="name" name='name' variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.name} label="Full Name" sx={{ mt: 3 }} required />}
                    <TextField id="email" name='email' variant="outlined" type="email" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.email} label="Email" sx={forgotPassword ? { mt: 6 } : { mt: 3 }} required autoSave={rememberMe} />
                    {!hasAccount && !forgotPassword && <TextField id="phone" name='phone' variant="outlined" type="tel" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.phone} label="Phone Number" sx={{ mt: 3 }} required />}
                    {!forgotPassword && <TextField id="password" name='password' variant="outlined" type="password" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.password} label="Password" sx={{ mt: 3 }} required />}
                    {!hasAccount && !forgotPassword && <TextField id="confirmPassword" name='confirmPassword' variant="outlined" type="password" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.confirmPassword} label="Confirm Password" sx={{ mt: 3 }} required />}
                    {hasAccount ?
                        <>
                            <button type="button" onClick={() => handleNavigate("/forgot")} className='text-accent cursor-pointer block ms-auto'>Forgot your password?</button>
                            <div>
                                <div className='mt-4 text-start'>
                                    <input type="checkbox" id='remember' name='remember' value={rememberMe} onChange={() => setRememberMe(prev => !prev)} />
                                    <label htmlFor="remember" className='ms-2'>Remember Me</label>
                                </div>
                            </div>
                            <button type='submit' className='mt-9 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer' onClick={handleLogin}>Log In</button>
                        </> : forgotPassword ?
                            <>
                                <p className='text-dim-black text-sm text-start mt-1'>A new temporary password will be sent to your mail.</p>
                                <button type='submit' className='mt-13 mb-4 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer' onClick={handlePasswordReset}>Reset Password</button>
                            </> :
                            <>
                                <button type='submit' className='mt-9 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer' onClick={handleRegister}>Register</button>
                            </>
                    }
                </form>
            </section>
        </main>
    )
}

export default Auth