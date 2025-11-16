import "./Login.css"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { handleChange } from '../helpers/formHelper'
import TextField from '@mui/material/TextField';
import { WrenchIcon } from 'lucide-react'
import { forgotPasswordApi, loginApi, passwordResetApi, registerApi } from '../api/authApi'
import { ToastContainer, toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Commet } from "react-loading-indicators";


const Auth = ({ hasAccount, forgotPassword }) => {
    const [rememberMe, setRememberMe] = useState(false);
    const [authDetails, setAuthDetails] = useState({
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const registerMutation = useMutation(registerApi);
    const loginMutation = useMutation(loginApi);
    const forgotPasswordMutation = useMutation(forgotPasswordApi);

    const handleFormReset = () => {
        setAuthDetails({
            email: "",
            fullName: "",
            password: "",
            confirmPassword: "",
            phone: ""
        });
    };

    const handleNavigate = (route) => {
        handleFormReset();
        setFormSubmitStatus(false);
        navigate(route);
    };

    const handleLogin = async () => {
        setFormSubmitStatus(true);
        const { email, password } = authDetails;
        if (email && password) {
            try {
                const result = await loginMutation.mutateAsync({ email, password });
                if (result.status === 200) {
                    toast.success(result.data.Message);
                    handleFormReset();
                    setFormSubmitStatus(false);
                    setTimeout(() => {
                        navigate(from, { replace: true });
                    }, 1500);
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
            }
        }
    };

    const handlePasswordReset = async () => {
        setFormSubmitStatus(true);
        const { email } = authDetails;
        if (email) {
            try {
                const result = await forgotPasswordMutation.mutateAsync({ email });
                if (result.status === 200) {
                    toast.success(result.data.Message);
                    handleFormReset();
                    setFormSubmitStatus(false);
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
                handleFormReset();
                setFormSubmitStatus(false);
            }
        }
    };

    const handleRegister = async () => {
        setFormSubmitStatus(true);
        const { fullName, email, password, confirmPassword, phone } = authDetails;
        if (fullName && email && password && confirmPassword && phone) {
            const emailRegex = /^[\w]+@[\w]+\.com+/g;
            if (!emailRegex.test(email)) {
                return toast.error("Invalid Email.");
            }
            if (password !== confirmPassword) {
                return toast.error("Passwords do not match.");
            }
            try {
                const result = await registerMutation.mutateAsync({ fullName, email, password, confirmPassword, phone });
                if (result.status === 200) {
                    toast.success(result.data.Message);
                    handleFormReset();
                    setFormSubmitStatus(false);
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
                }
            } catch (err) {
                toast.error(err?.response?.data?.Message);
                handleFormReset();
                setFormSubmitStatus(false);
            }
        }
    };

    return (
        <main className='w-full min-h-screen px-4 xs:px-12 sm:px-4 py-8 grid place-content-center' id='Login'>
            <section className='bg-white sm:w-[500px] xs:w-[400px] w-[300px] px-6 py-8 rounded-lg text-center relative' >
                <Link to={"/"} className="absolute left-0 top-0 pt-10 ps-5"><FontAwesomeIcon icon={faArrowLeft} className="text-xl" /></Link>
                {/* style={hasAccount ? { marginTop: "80px" } : forgotPassword ? { marginTop: "100px" } : { marginTop: "20px" }} */}
                <WrenchIcon className='text-accent mx-auto mt-6' size={45} />
                {hasAccount ?
                    <>
                        <h2 className='font-bold text-3xl mt-4'>Log in to DriveWell Garage</h2>
                        <span className='text-dim-black'>or </span><button type="button" disabled={loginMutation.isPending} onClick={() => handleNavigate("/register")} className='text-accent cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed'>create a new account</button>
                    </> : forgotPassword ?
                        <>
                            <h2 className='font-bold text-3xl mt-4'>Forgot Your Password?</h2>
                            <span className='text-dim-black'>Back to </span><button type="button" disabled={forgotPasswordMutation.isPending} onClick={() => handleNavigate("/login")} className='text-accent cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed'>Login Page</button>
                        </> :
                        <>
                            <h2 className='font-bold text-3xl mt-4'>Create a new account</h2>
                            <button type="button" onClick={() => handleNavigate("/login")} disabled={registerMutation.isPending} className='text-accent cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed'>Already have an account?</button>
                        </>
                }
                <form className='text-left' autoComplete="off">
                    {!hasAccount && !forgotPassword && <>
                        <TextField autoComplete="off" id="fullName" name='fullName' variant="outlined" type="text" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.fullName} label="Full Name" sx={{ mt: 3 }} />
                        <p className='text-red-700 text-sm ms-1' style={{ visibility: (!formSubmitStatus || authDetails.fullName) && "hidden" }}>Name is required</p>
                    </>
                    }
                    <TextField autoComplete="email" id="email" name='email' variant="outlined" type="email" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.email} label="Email" sx={forgotPassword ? { mt: 6 } : { mt: 1.5 }} autoSave={rememberMe.toString()} />
                    <p className='text-red-700 text-sm ms-1' style={{ visibility: (!formSubmitStatus || authDetails.email) && "hidden" }}>Email is required</p>
                    {!hasAccount && !forgotPassword && <>
                        <TextField autoComplete="off" id="phone" name='phone' variant="outlined" type="tel" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.phone} label="Phone Number" sx={{ mt: 1.5 }} />
                        <p className='text-red-700 text-sm ms-1' style={{ visibility: (!formSubmitStatus || authDetails.phone) && "hidden" }}>Phone Number is required</p>
                    </>
                    }
                    {!forgotPassword && <>
                        <TextField autoComplete="new-password" id="password" name='password' variant="outlined" type="password" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.password} label="Password" sx={{ mt: 1.5 }} />
                        <p className='text-red-700 text-sm ms-1' style={{ visibility: (!formSubmitStatus || authDetails.password) && "hidden" }}>Password is required</p>
                    </>
                    }
                    {!hasAccount && !forgotPassword && <>
                        <TextField autoComplete="new-password" id="confirmPassword" name='confirmPassword' variant="outlined" type="password" className='w-full' onChange={(e) => handleChange(e, setAuthDetails)} value={authDetails.confirmPassword} label="Confirm Password" sx={{ mt: 1.5 }} />
                        <p className='text-red-700 text-sm ms-1' style={{ visibility: (!formSubmitStatus || authDetails.confirmPassword) && "hidden" }}>Confirm Password is required</p>
                    </>}
                    {hasAccount ?
                        <>
                            <button type="button" onClick={() => handleNavigate("/forgot")} disabled={loginMutation.isPending} className='text-accent cursor-pointer block ms-auto disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed'>Forgot your password?</button>
                            {/* <div>
                                <div className='mt-4 text-start'>
                                    <input type="checkbox" id='remember' name='remember' value={rememberMe} onChange={() => setRememberMe(prev => !prev)} />
                                    <label htmlFor="remember" className='ms-2'>Remember Me</label>
                                </div>
                            </div> */}
                            <button type='button' disabled={loginMutation.isPending} className='mt-9 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleLogin}>Log In</button>
                        </> : forgotPassword ?
                            <>
                                <p className='text-dim-black text-sm text-start mt-1'>A new temporary password will be sent to your mail.</p>
                                <button type='button' className='mt-13 mb-4 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' disabled={forgotPasswordMutation.isPending} onClick={handlePasswordReset}>Reset Password</button>
                            </> :
                            <>
                                <button type='button' disabled={registerMutation.isPending} className='mt-9 bg-accent text-white font-semibold rounded-md hover:opacity-75 px-6 w-full py-3 cursor-pointer disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed' onClick={handleRegister}>Register</button>
                            </>
                    }
                </form>
            </section>
            {(loginMutation.isPending || registerMutation.isPending || forgotPasswordMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer position="top-center" autoClose={1500} theme='light' />
        </main>

    )
}

export default Auth