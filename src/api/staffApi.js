import { commonApi } from "./commonApi"
import { serverUrl } from "./serverURL"

export const getStaffsApi = async () => {
    return await commonApi("GET", `${serverUrl}/staffs`);
}
export const addStaffsApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/staffs`, reqBody);
}
export const updateStaffsApi = async (reqBody) => {
    return await commonApi("PUT", `${serverUrl}/staffs`, reqBody);
}
export const deleteStaffsApi = async ({ id }) => {
    return await commonApi("DELETE", `${serverUrl}/staffs`, id);
}