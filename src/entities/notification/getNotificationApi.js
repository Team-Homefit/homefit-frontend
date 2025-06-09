import { axiosInstance } from "../axiosInstance";

export const getNotificationApi = async (page, size) => {
    try {
        const response = await axiosInstance.get("/notification", {
            params: {
                page: page,
                size: size
            }
        });
        console.log("공지사항 조회 결과:", response.data);
        return response.data;
    } catch (error) {
        console.error("공지사항 조회 실패:", error);
        throw error;
    }
};