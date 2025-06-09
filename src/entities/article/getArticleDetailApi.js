import { axiosInstance } from "../axiosInstance";

export const getArticleDetailApi = async (id) => {
  try {
    const response = await axiosInstance.get(`/board/article/${id}`);
    return response.data;
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    throw error;
  }
};
