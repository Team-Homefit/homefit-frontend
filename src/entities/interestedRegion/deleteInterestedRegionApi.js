import { axiosInstance } from "../axiosInstance";

async function deleteInterestedRegionApi(sggCodes) {
    try {
        const response = await axiosInstance.delete("/member/region", { 
            data: { sggCodes: [sggCodes] } 
        });
        return response.data;
    } catch (error) {
        console.error("관심지역 삭제 실패:", error);
        throw error;
    }
}

export { deleteInterestedRegionApi }; 