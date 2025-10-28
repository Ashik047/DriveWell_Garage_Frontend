
export const getUserDetailsApi = async ({ axiosWithToken }) => {
    return await axiosWithToken.get("/user/self");
};

export const getUserProfilePicApi = async ({ axiosWithToken }) => {
    try {
        return await axiosWithToken.get("/user/profile-pic");
    } catch (err) {
        if (err?.response?.status === 401) {
            return null;
        }
        return err;
    }
};

export const updateUserDetailsApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.patch("/user/self", reqBody);
};

export const updateUserPasswordApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.patch("/user/self/secret", reqBody);
};