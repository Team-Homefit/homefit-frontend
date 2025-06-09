import { axiosInstance } from "../axiosInstance";

export const getSpecificHouseDealsApi = async (aptSequence, condition = {}) => {
  try {
    console.log("거래 내역 조회 요청");
    const response = await axiosInstance.get(`/house/${aptSequence}/deal${formatQueryString(condition)}`);
    console.log("거래 내역 조회 API 결과: ", response);

    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const formatQueryString = (condition) => {
  const queryParams = Object.keys(condition)
    .map((key) => {
      const value = condition[key];
      if (value == null || value === "") {
        return null;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean);

  return queryParams.length > 0 ? "?" + queryParams.join("&") : "";
};
