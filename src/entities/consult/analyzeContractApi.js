import { axiosInstance } from "../axiosInstance";

export const analyzeContractApi = async (question, isFirst, contractFile) => {
  try {
    const formData = new FormData();
    formData.append('message', question);
    formData.append('isFirst', isFirst);
    formData.append('contractFile', contractFile);

    const response = await axiosInstance.post("/consult/analyze", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("계약서 분석 실패:", error);
    throw error;
  }
};
