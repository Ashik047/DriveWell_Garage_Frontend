import { useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthProvider';

const useRefreshToken = () => {
    const { setAuth } = useContext(AuthContext);

    const refresh = async () => {
        try {
            const result = await axios.get('/refresh-token', {
                withCredentials: true
            });
            const { role, accessToken } = result.data;
            setAuth({ role, accessToken });
            return result.data;

        } catch (err) {
            return Promise.reject(err);
        }
    }
    return refresh;
};

export default useRefreshToken;
