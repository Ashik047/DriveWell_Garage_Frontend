import axios from "./axios";

export const getAllBranchesApi = async (fields = []) => {
    const params = new URLSearchParams();
    if (fields.length) {
        params.append("fields", fields.join(","));
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return await axios.get(`/branch${query}`);
};

export const addBranchApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.post("/branch", reqBody);
};

export const editBranchApi = async ({ axiosWithToken, reqBody, id }) => {
    return await axiosWithToken.patch(`/branch/${id}`, reqBody);
};

export const deleteBranchApi = async ({ axiosWithToken, id }) => {
    return await axiosWithToken.delete(`/branch/${id}`);
};