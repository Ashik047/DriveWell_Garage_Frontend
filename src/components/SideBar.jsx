import { faRightFromBracket, faWrench, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { sidebarTabs } from "../constants/sidebarTabs";
import { useContext, useEffect, useState } from "react";
import useAxiosWithToken from '../hooks/useAxiosWithToken'
import {
    WrenchIcon,
    UserIcon,
    CalendarIcon,
    MapIcon,
    CarIcon,
    StarIcon,
    UsersIcon,
    ChartBarIcon
} from 'lucide-react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { userLogoutApi } from '../api/authApi';
import { useMutation } from '@tanstack/react-query';
import { Commet } from "react-loading-indicators";

const SideBar = ({ setSidebarStatus }) => {

    let activeSidebarTabs;
    const location = useLocation();

    const { auth, setAuth } = useContext(AuthContext);

    const axiosWithToken = useAxiosWithToken();

    const userLogoutMutation = useMutation({
        mutationFn: () => userLogoutApi({ axiosWithToken })
    });

    if (auth?.role === "Manager") {
        activeSidebarTabs = sidebarTabs.filter(tab => (tab.id !== "vehicles"));
    } else if (auth?.role === "Staff") {
        activeSidebarTabs = sidebarTabs.filter(tab => (tab.id === "bookings" || tab.id === "services" || tab.id === "branches" || tab.id === "feedbacks" || tab.id === "profile"));
    } else if (auth?.role === "Customer") {
        activeSidebarTabs = sidebarTabs.filter(tab => (tab.id === "bookings" || tab.id === "vehicles" || tab.id === "feedbacks" || tab.id === "profile"));
    }
    const [activeTab, setActiveTab] = useState("bookings");

    useEffect(() => {
        const path = location.pathname.split("/")[2] || "bookings";
        setActiveTab(path);
    }, []);


    const navigate = useNavigate();
    const handleTabChange = (clickedTab) => {
        setActiveTab(clickedTab.id);
        navigate(`/dashboard${clickedTab.link}`);
    };

    const handleLogout = async () => {
        try {
            const result = await userLogoutMutation.mutateAsync();
            if (result.status === 200) {
                toast.success(result.data.Message);
            }
            setTimeout(() => {
                setAuth({});
                navigate("/");
            }, 1500);
        } catch (err) {
            toast.error(err?.response?.data?.Message);
        }
    }

    return (
        <aside className="w-[300px] bg-white shadow-[5px_5px_10px_1px_#cdcdcd] fixed top-0 left-0 h-screen z-8">
            <button className="ms-auto block hover:opacity-60 text-lg mt-6 me-2 cursor-pointer md:hidden" onClick={() => setSidebarStatus(false)}><FontAwesomeIcon icon={faXmark} /></button>
            <Link to={"/"}>
                <div className="flex px-4 pt-4 md:pt-10 items-center">
                    <WrenchIcon size={32} strokeWidth={2} className="me-2 transform -translate-y-5 text-accent" />
                    <h1 className="text-2xl font-bold mb-10"> DriveWell Garage</h1>
                </div>
            </Link>

            {
                activeSidebarTabs?.map((tab) => {
                    return <button key={tab.name} className="text-black block font-medium text-xl p-4 cursor-pointer w-full text-left" style={activeTab === tab.id ? { backgroundColor: "#DBEAFE", color: "#F97316", borderLeft: "3px solid #F97316" } : {}} onClick={() => handleTabChange(tab)}>
                        {tab.name === "Overview" && <ChartBarIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Bookings" && <CalendarIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Customers" && <UserIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Staffs" && <UsersIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Vehicles" && <CarIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Services" && <WrenchIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Branches" && <MapIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Feedbacks" && <StarIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name === "Profile" && <UserIcon size={28} className="inline me-2 transform -translate-y-1" />}
                        {tab.name}
                    </button>
                })
            }


            <button onClick={handleLogout} className="text-red-600 font-semibold text-2xl cursor-pointer mt-10 ms-10 disabled:opacity-50 disabled:hover:opacity-50 disabled:cursor-not-allowed" disabled={userLogoutMutation.isPending}>Logout <FontAwesomeIcon icon={faRightFromBracket} /></button>
            {(userLogoutMutation.isPending) && <>
                <div className='fixed left-[50%] top-[50%] transform -translate-[50%] z-14'><Commet color="#F97316" size="medium" text="" textColor="" /></div>
            </>
            }
            <ToastContainer theme="light" position="top-center" autoClose={1500} />
        </aside>
    )
}

export default SideBar