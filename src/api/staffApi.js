

export const getAllStaffsApi = async ({ axiosWithToken }) => {
    return await axiosWithToken.get("/staff");
};

export const addStaffApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.post("/staff", reqBody);
};

export const editStaffApi = async ({ axiosWithToken, reqBody, id }) => {
    return await axiosWithToken.patch(`/staff/${id}`, reqBody);
};
export const deleteStaffApi = async ({ axiosWithToken, id }) => {
    return await axiosWithToken.delete(`/staff/${id}`);
};