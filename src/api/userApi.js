
export const getUserDetailsApi = async ({ axiosWithToken }) => {
    return await axiosWithToken.get("/user/self");
};
export const updateUserDetailsApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.patch("/user/self", reqBody);
};
export const updateUserPasswordApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.patch("/user/self/secret", reqBody);
};