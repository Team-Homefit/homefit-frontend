import { axiosInstance } from "../axiosInstance";

export const getShopsNearHouseApi = async ({ latitude, longitude}) => {
  try {
    const response = await axiosInstance.get(`/region/shop?latitude=${latitude}&longitude=${longitude}`);

    console.log("상권 정보 조회 API 결과: ", response);

    return response.data;
  } catch (error) {
    console.log("상권 정보 조회 실패: ", error);
    return false;
  }
}
