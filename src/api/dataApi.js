export const getDataApi = async ({ axiosWithToken }) => {
    return await axiosWithToken.get("/data");
};