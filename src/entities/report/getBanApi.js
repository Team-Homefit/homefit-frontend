import { axiosInstance } from "../axiosInstance";

async function getBanApi() {
    try {
        const response = await axiosInstance.get("/report/ban");

        console.log("정지 조회 API 결과: ", response);

        return response.data;
    } catch (error) {
        console.log("정지 조회 실패: ", error);
        return false;
    }

}

export { getBanApi };