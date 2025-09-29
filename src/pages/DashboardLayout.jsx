import { Outlet, useLocation } from "react-router-dom"
import SideBar from "../components/SideBar"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"

const DashboardLayout = ({ role }) => {
    const location = useLocation();
    const [pathName, setPathName] = useState("");
    const [sidebarStatus, setSidebarStatus] = useState("");
    const [isMdUp, setIsMdUp] = useState(false);
    useEffect(() => {
        const pathArray = (location.pathname.split("/"));
        setPathName(pathArray[2]);
        // Tailwind `md` breakpoint = 768px
        const mediaQuery = window.matchMedia("(min-width: 768px)");

        // Set initial value
        setIsMdUp(mediaQuery.matches);

        // Listener for changes
        const handler = (e) => setIsMdUp(e.matches);
        mediaQuery.addEventListener("change", handler);

        // Cleanup
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return (
        <div className="grow relative">
            <button className='block md:hidden cursor-pointer absolute top-10 left-2' onClick={() => setSidebarStatus(prev => !prev)}>{!sidebarStatus ? <FontAwesomeIcon className='text-3xl' icon={faBars} /> : <FontAwesomeIcon className='text-3xl' icon={faXmark} />}</button>
            {(sidebarStatus || isMdUp) && <SideBar pathName={pathName} role={role} setSidebarStatus={setSidebarStatus} />}
            <main className="p-8  ms-10 md:ms-[300px]">
                <h2 className="text-4xl font-bold">Dashboard</h2>
                <p className="text-dim-black mt-2">Welcome back,</p>
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout