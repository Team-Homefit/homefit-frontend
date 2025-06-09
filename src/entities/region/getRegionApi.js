import { axiosInstance } from "../axiosInstance";

async function getRegionApi() {
    try {
        const response = await axiosInstance.get("/region");

        console.log("지역 정보 조회 API 결과: ", response);

        return response.data;
    } catch (error) {
        return false;
    }

}

export { getRegionApi };