import axios from "./axios";

export const registerApi = async (reqBody) => {
    return await axios.post("/register", reqBody);
}
export const loginApi = async (reqBody) => {
    return await axios.post("/login", reqBody);
}
export const passwordResetApi = async (reqBody) => {
    return await axios.post("/reset-password", reqBody);
}
export const userLogoutApi = async ({ axiosWithToken }) => {
    return await axiosWithToken.post("/logout");
}
export const refreshTokenApi = async () => {
    try {
        return await axios.post("/refresh-token");
    } catch (err) {
        if (err?.response?.status === 401) {
            return null;
        }
        return err;
    }
}
export const forgotPasswordApi = async (reqBody) => {
    return await axios.post("/forgot-password", reqBody);
}