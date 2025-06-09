import { axiosInstance } from "../axiosInstance";

export const getHouseAreasApi = async (aptSequence) => {
  try {
    console.log("면적 정보 조회 요청");
    const response = await axiosInstance.get(`/house/${aptSequence}/area`);
    console.log("면적 정보 조회 API 결과: ", response);

    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}
