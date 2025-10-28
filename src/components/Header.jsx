import { faBars, faUser, faWrench, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { WrenchIcon } from 'lucide-react'
import { useContext } from 'react'
import { useState } from 'react'
import { Link } from "react-router-dom"
import AuthContext from '../context/AuthProvider'
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import { useQuery } from '@tanstack/react-query'
import { getUserProfilePicApi } from '../api/userApi'

const Header = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const axiosWithToken = useAxiosWithToken();

    const { data: profilePic, isLoading: profilePicLoading, isError: profilePicIsError, error: profilePicError } = useQuery({ queryKey: ['User'], queryFn: () => getUserProfilePicApi({ axiosWithToken }), retry: false, throwOnError: false });

    const { auth } = useContext(AuthContext);

    return (
        <header className='shadow-lg px-4 items-center py-5 relative'>
            <div className='flex justify-between items-center w-full'>
                <Link className='text-lg font-bold text-secondary' to={"/"}><WrenchIcon className='text-accent me-2 inline transform -translate-y-1' />DriveWell Garage</Link>
                <button className='block md:hidden cursor-pointer' onClick={() => setIsCollapsed(prev => !prev)}>{isCollapsed ? <FontAwesomeIcon className='text-2xl' icon={faBars} /> : <FontAwesomeIcon className='text-2xl' icon={faXmark} />}</button>
                <nav className='text-black hidden md:block' aria-label='Header-navigation'>
                    <ul className='flex gap-10 items-center'>
                        <li className='font-semibold hover:text-accent'><Link to={"/"}>Home</Link></li>
                        <li className='font-semibold hover:text-accent'><Link to={"/services"}>Services</Link></li>
                        <li className='font-semibold hover:text-accent'><Link to={"/reviews"}>Reviews</Link></li>
                        <li className='font-semibold hover:text-accent'><Link to={"/booking"}>Book Now</Link></li>
                        <li className='font-semibold hover:text-accent'><Link to={"/contact"}>Contact</Link></li>
                        {!auth.accessToken ? <li className='py-1 px-3 font-semibold bg-accent rounded-md hover:opacity-75 p'><Link to={"/login"}><FontAwesomeIcon icon={faUser} className='me-0.5' />Login</Link></li> :
                            <li className='h-[50px]'><Link to={"/dashboard"}>{<img className='w-[50px] aspect-square rounded-[50%]' src={profilePic?.data?.image?.url} alt='Profile picture' />}</Link></li>}
                        {/* <li><Link to={"worker-dashboard"} className='w-[50px] aspect-square bg-blue-100 rounded-[50%] px-2.5 py-2 me-4 hover:bg-blue-200'><FontAwesomeIcon className='' icon={faUser} /></Link></li> */}
                        {/* <li><Link to={"manager-dashboard"} className='w-[50px] aspect-square bg-blue-100 rounded-[50%] px-2.5 py-2 me-4 hover:bg-blue-200'><FontAwesomeIcon className='' icon={faUser} /></Link></li> */}
                        {/* use condition in the "to" attribute since the rest are the same */}
                    </ul>
                </nav>
            </div>
            {!isCollapsed && <nav className='text-black md:hidden' aria-label='Header-navigation'>
                <ul className='flex absolute w-full flex-col left-0 text-start z-50 top-[100%] pb-2 bg-primary shadow-lg ps-6'>
                    <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/"}>Home</Link></li>
                    <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/services"}>Services</Link></li>
                    <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/reviews"}>Reviews</Link></li>
                    <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/booking"}>Book Now</Link></li>
                    <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/contact"}>Contact</Link></li>
                    {!auth.accessToken ? <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/login"}>Login</Link></li> :
                        <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/dashboard"}>Dashboard</Link></li>}
                    {/* <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/worker-dashboard"}>Dashboard</Link></li> */}
                    {/* <li className='font-semibold py-2'><Link className='hover:text-accent' to={"/manager-dashboard"}>Dashboard</Link></li> */}
                </ul>
            </nav>}
        </header>
    )
}

export default Header