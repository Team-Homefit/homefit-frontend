import { axiosInstance } from "../axiosInstance";

export const unlikeArticleApi = async (articleId) => {
  try {
    console.log("게시글 좋아요 취소 요청:", articleId);
    const response = await axiosInstance.delete(`/board/article/${articleId}/like`);
    console.log("게시글 좋아요 취소 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("게시글 좋아요 취소 실패:", error);
    throw error;
  }
};
