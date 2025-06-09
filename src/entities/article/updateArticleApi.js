import { axiosInstance } from "../axiosInstance";

export const updateArticleApi = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/board/${id}/article`, data);
    return response.data;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};
