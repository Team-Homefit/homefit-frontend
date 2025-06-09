import { axiosInstance } from "../axiosInstance";

export const deleteCommentApi = async (commentId) => {
  try {
    const response = await axiosInstance.delete(`/board/article/comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    throw error;
  }
};