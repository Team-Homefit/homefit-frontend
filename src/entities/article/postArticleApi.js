import { axiosInstance } from "../axiosInstance";

export const postArticleApi = async (title, content, boardId) => {
  try {
    console.log("게시글 등록 요청:", boardId, title, content);
    const response = await axiosInstance.post(`/board/${boardId}/article`, {
      title: title,
      content: content,
    });
    console.log("게시글 등록 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("게시글 등록 실패:", error);
    throw error;
  }
};
