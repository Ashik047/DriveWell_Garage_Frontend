import { commonApi } from "./commonApi"
import { serverUrl } from "./serverURL"

export const getUsersApi = async () => {
    return await commonApi("GET", `${serverUrl}/users`);
}
export const updateUsersApi = async (reqBody) => {
    return await commonApi("PUT", `${serverUrl}/users`, reqBody);
}
