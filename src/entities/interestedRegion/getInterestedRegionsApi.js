import { axiosInstance } from "../axiosInstance";

async function getInterestedRegionsApi() {
    try {
        const response = await axiosInstance.get("/member/region");
        return response.data;
    } catch (error) {
        console.error("관심지역 목록 조회 실패:", error);
        throw error;
    }
}

export { getInterestedRegionsApi }; 