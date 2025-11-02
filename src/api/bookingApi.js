export const getBookingApi = async ({ axiosWithToken }) => {
    return await axiosWithToken.get('/booking');
};

export const addBookingApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.post("/booking", reqBody);
};

export const editBookingStatusApi = async ({ axiosWithToken, reqBody, id }) => {
    return await axiosWithToken.patch(`/booking/${id}`, reqBody);
};

export const deleteBookingApi = async ({ axiosWithToken, id }) => {
    return await axiosWithToken.delete(`/booking/${id}`);
};

export const getUnavailableDatesApi = async ({ axiosWithToken, branch, service }) => {
    return await axiosWithToken.get(`/booking/unavailable?branch=${branch}&service=${service}`);
};