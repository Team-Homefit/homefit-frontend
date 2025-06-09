import { axiosInstance } from "../axiosInstance";

async function getHouseDetailApi(aptSequence) {
    try {
        const response = await axiosInstance.get(`/house/${aptSequence}`);

        console.log("아파트 조회 결과: ", response);

        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { getHouseDetailApi };