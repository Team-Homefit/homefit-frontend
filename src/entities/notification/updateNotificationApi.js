import { axiosInstance } from "../axiosInstance";

export const updateNotificationApi = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/notification`, data);
    return response.data;
  } catch (error) {
    console.error("공지사항 수정 실패:", error);
    throw error;
  }
};
