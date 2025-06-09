import { axiosInstance } from "../axiosInstance";

async function getHouseDealsApi(condition) {
    try {

        if (condition.size == null) condition.size = 8;
        if (condition.page == null) condition.page = 1;

        console.log("거래 내역 조회 요청");

        const response = await axiosInstance.get(`/house/deal${formatQueryString(condition)}`);

        console.log("거래 내역 조회 API 결과: ", response);

        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const formatQueryString = (condition) => {
  const queryParams = Object.keys(condition)
    .map(key => {
        const value = condition[key];
        if (value == null || value === '') {
            return null;
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean); 

  return queryParams.length > 0 ? '?' + queryParams.join('&') : '';
}

export { getHouseDealsApi };