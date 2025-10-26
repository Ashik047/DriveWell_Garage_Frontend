import React from 'react'
import useRefreshToken from '../hooks/useRefreshToken';
import { useEffect } from 'react';
import axios from '../api/axios';

const Trail = () => {
    const tokenRefresh = useRefreshToken();
    useEffect(() => {
        const handleTokenRefresh = async () => {
            const result = await axios.get("/trial", {
                withCredentials: true
            });
            console.log(result);
        };
        handleTokenRefresh();
    }, []);
    return (
        <div>Trail</div>
    )
}

export default Trail