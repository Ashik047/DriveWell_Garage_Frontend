import { axiosWithToken } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAxiosWithToken = () => {
    const refresh = useRefreshToken();
    const { auth } = useContext(AuthContext);

    useEffect(() => {

        const requestIntercept = axiosWithToken.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosWithToken.interceptors.response.use(
            response => response,
            async (error) => {
                try {
                    const prevRequest = error?.config;
                    if ((error?.response?.status === 401) && !prevRequest?.sent) {
                        prevRequest.sent = true;
                        const { accessToken } = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                        return axiosWithToken(prevRequest);
                    }
                } catch (err) {
                    if (err?.response?.status === 401) {
                        return Promise.resolve({ data: null });
                    }
                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosWithToken.interceptors.request.eject(requestIntercept);
            axiosWithToken.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosWithToken;
}

export default useAxiosWithToken;