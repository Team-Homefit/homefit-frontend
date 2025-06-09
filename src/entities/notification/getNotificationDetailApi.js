import { axiosInstance } from "../axiosInstance";

export const getNotificationDetailApi = async (id) => {
  try {
    const response = await axiosInstance.get(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error("공지사항 상세 조회 실패:", error);
    throw error;
  }
};
