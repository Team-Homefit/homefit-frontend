import { axiosInstance } from "../axiosInstance";

async function getReportsApi() {
    try {
        const response = await axiosInstance.get("/report");

        console.log("신고 조회 API 결과: ", response);

        return response.data;
    } catch (error) {
        console.log("신고 조회 실패: ", error);
        return false;
    }

}

export { getReportsApi };