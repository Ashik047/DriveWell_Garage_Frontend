import { commonApi } from "./commonApi"
import { serverUrl } from "./serverURL"

export const registerApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/register`, reqBody);
}
export const loginApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/login`, reqBody);
}
export const passwordResetApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/login`, reqBody);
}