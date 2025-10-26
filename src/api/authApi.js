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