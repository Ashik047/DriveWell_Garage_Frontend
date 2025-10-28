
export const getMyVehiclesApi = async ({ axiosWithToken, type = "" }) => {
    const params = new URLSearchParams();
    if (type) {
        params.append("type", type);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return await axiosWithToken.get(`/vehicle${query}`);
};

export const addVehicleApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.post("/vehicle", reqBody);
};

export const editVehicleApi = async ({ axiosWithToken, reqBody, id }) => {
    return await axiosWithToken.patch(`/vehicle/${id}`, reqBody);
};

export const deleteVehicleApi = async ({ axiosWithToken, id }) => {
    return await axiosWithToken.delete(`/vehicle/${id}`);
};