import { useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { refreshTokenApi } from '../api/authApi';

const useRefreshToken = () => {
    const { setAuth } = useContext(AuthContext);

    const refreshTokenMutation = useMutation(refreshTokenApi);

    const refresh = async () => {
        try {
            const result = await refreshTokenMutation.mutateAsync();
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
