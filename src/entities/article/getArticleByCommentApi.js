import { axiosInstance } from "../axiosInstance";

export const getArticleByCommentApi = async (id) => {
  try {
    const response = await axiosInstance.get(`/board/article/detail?commentId=${id}`);
    return response.data;
  } catch (error) {
    console.error("댓글로 게시글 조회 실패:", error);
    throw error;
  }
};
