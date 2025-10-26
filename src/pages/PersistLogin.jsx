import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";


const PersistLogin = () => {
    const tokenRefresh = useRefreshToken();
    useEffect(() => {
        const handleTokenRefresh = async () => {
            try {
                await tokenRefresh();
            } catch (err) {
                console.log("You are not currently logged in.");
            }
        };
        handleTokenRefresh();
    }, []);
    return (
        <>
            <Outlet />
        </>
    )
}

export default PersistLogin