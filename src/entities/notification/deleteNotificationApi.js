import { axiosInstance } from "../axiosInstance";

export const deleteNotificationApi = async (id) => {
  try {
    const response = await axiosInstance.delete(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error("공지사항 삭제 실패:", error);
    throw error;
  }
};
