import axios from "./axios";

export const getAllServicesApi = async () => {
    return await axios.get("/service");
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