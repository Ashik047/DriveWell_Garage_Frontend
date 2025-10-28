import axios from "./axios";

export const getAllFeedbacksApi = async () => {
    return await axios.get(`/feedback/guest`);
};

export const getFeedbacksApi = async ({ axiosWithToken }) => {
    return await axiosWithToken.get('/feedback');
};

export const addFeedbackApi = async ({ axiosWithToken, reqBody }) => {
    return await axiosWithToken.post("/feedback", reqBody);
};

export const editFeedbackApi = async ({ axiosWithToken, reqBody, id }) => {
    return await axiosWithToken.patch(`/feedback/${id}`, reqBody);
};

export const editFeedbackStatusApi = async ({ axiosWithToken, id }) => {
    return await axiosWithToken.patch(`/feedback/status/${id}`);
};

export const deleteFeedbackApi = async ({ axiosWithToken, id }) => {
    return await axiosWithToken.delete(`/feedback/${id}`);
};