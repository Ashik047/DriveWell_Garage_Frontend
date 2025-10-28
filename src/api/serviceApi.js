import axios from "./axios";

export const getAllServicesApi = async (type = "") => {
    const params = new URLSearchParams();
    if (type) {
        params.append("type", type);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return await axios.get(`/service${query}`);
};

export const addServiceApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.post("/service", reqBody);
};

export const editServiceApi = async ({ axiosWithToken, reqBody, id }) => {
    return await axiosWithToken.patch(`/service/${id}`, reqBody);
};

export const deleteServiceApi = async ({ axiosWithToken, id }) => {
    return await axiosWithToken.delete(`/service/${id}`);
};