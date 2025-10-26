

export const addStaffApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.post("/staff", reqBody);
};