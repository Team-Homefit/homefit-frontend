import { axiosInstance } from "../axiosInstance";

export const askKnowledgeApi = async (question, isFirst) => {
  try {
    const response = await axiosInstance.post("/consult/knowledge", { message: question, isFirst: isFirst });
    return response.data;
  } catch (error) {
    console.error("부동산 질문 실패:", error);
    throw error;
  }
}