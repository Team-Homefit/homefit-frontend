import { axiosInstance } from "../axiosInstance";

export const postNotificationApi = async (title, content) => {
  try {
    console.log("공지사항 등록 요청:", title, content);
    const response = await axiosInstance.post("/notification", {
      title: title,
      content: content,
    });
    console.log("공지사항 등록 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("공지사항 등록 실패:", error);
    throw error;
  }
};
