import { axiosInstance } from "../axiosInstance";

export const likeArticleApi = async (articleId) => {
  try {
    console.log("게시글 좋아요 요청:", articleId);
    const response = await axiosInstance.post(`/board/article/${articleId}/like`);
    console.log("게시글 좋아요 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("게시글 좋아요 실패:", error);
    throw error;
  }
};
