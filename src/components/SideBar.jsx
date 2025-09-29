import { faRightFromBracket, faWrench, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { sidebarTabs } from "../constants/sidebarTabs";
import { useEffect, useState } from "react";
import {
    WrenchIcon,
    UserIcon,
    CalendarIcon,
    MapIcon,
    CarIcon,
    StarIcon,
    UsersIcon
} from 'lucide-react'
import { useNavigate } from "react-router-dom";

const SideBar = ({ pathName, role, setSidebarStatus }) => {
    let activeSidebarTabs;
    if (role === "manager") {
        activeSidebarTabs = sidebarTabs;
    } else if (role === "worker") {
        activeSidebarTabs = sidebarTabs.filter(tab => (tab.id === "bookings" || tab.id === "customers" || tab.id === "vehicles" || tab.id === "services" || tab.id === "branches" || tab.id === "feedbacks" || tab.id === "profile"));
    } else if (role === "customer") {
        activeSidebarTabs = sidebarTabs.filter(tab => (tab.id === "bookings" || tab.id === "vehicles" || tab.id === "feedbacks" || tab.id === "profile"));
    }
    const [activeTab, setActiveTab] = useState(pathName);
    useEffect(() => {
        setActiveTab(pathName);
    }, [pathName])


    const navigate = useNavigate();
    const handleTabChange = (clickedTab) => {
        setActiveTab(clickedTab.id);
        navigate(`/${role}-dashboard${clickedTab.link}`);
    };
    const handleLogout = () => {
        /* logout Logic*/
        navigate("/");
    }

    return (
        <aside className="w-[300px] bg-white shadow-[5px_5px_10px_1px_#cdcdcd] fixed top-0 left-0 h-screen z-8">
            <button className="ms-auto block hover:opacity-60 text-lg mt-6 me-2 cursor-pointer md:hidden" onClick={() => setSidebarStatus(false)}><FontAwesomeIcon icon={faXmark} /></button>
            <div className="flex px-4 pt-4 md:pt-10 items-center">
                <WrenchIcon size={32} strokeWidth={2} className="me-2 transform -translate-y-5 text-accent" />
                <h1 className="text-2xl font-bold mb-10"> DriveWell Garage</h1>
            </div>

            {
                activeSidebarTabs.map((tab) => {
                    return <button key={tab.name} className="text-black block font-medium text-xl p-4 cursor-pointer w-full text-left" style={activeTab === tab.id ? { backgroundColor: "#DBEAFE", color: "#F97316", borderLeft: "3px solid #F97316" } : {}} onClick={() => handleTabChange(tab)}>
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


            <button onClick={handleLogout} className="text-red-600 font-semibold text-2xl cursor-pointer mt-10 ms-10">Logout <FontAwesomeIcon icon={faRightFromBracket} /></button>
        </aside>
    )
}

export default SideBar