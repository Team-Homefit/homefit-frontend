import { axiosInstance } from "../axiosInstance";

async function addInterestedRegionApi(sggCode) {
    try {
        const response = await axiosInstance.post("/member/region", { sggCodes: [sggCode] });
        return response.data;
    } catch (error) {
        console.error("관심지역 추가 실패:", error);
        throw error;
    }
}

export { addInterestedRegionApi };
