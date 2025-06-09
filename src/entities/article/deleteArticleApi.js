import { axiosInstance } from "../axiosInstance";

export const deleteArticleApi = async (articleId) => {
  try {
    const response = await axiosInstance.delete(`/board/article/${articleId}`);
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
};
