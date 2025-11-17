import axios from 'axios';
const BASE_URL = 'https://drivewell-garage-backend.onrender.com';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});
export const axiosWithToken = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});