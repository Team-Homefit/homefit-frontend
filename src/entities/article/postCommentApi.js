import { axiosInstance } from "../axiosInstance";

export const postCommentApi = async (articleId, content, parentCommentId = null) => {
  try {
    console.log("댓글 등록 요청:", articleId, content);
    const response = await axiosInstance.post(`/board/article/comment`, {
      articleId: articleId,
      content: content,
      ...(parentCommentId && { parentCommentId: parentCommentId })
    });
    console.log("댓글 등록 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("댓글 등록 실패:", error);
    throw error;
  }
};
