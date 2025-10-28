import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";


const PersistLogin = () => {
    const tokenRefresh = useRefreshToken();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleTokenRefresh = async () => {
            try {
                await tokenRefresh();
            } catch (err) {
                navigate("/login", { state: { from: location }, replace: true });
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