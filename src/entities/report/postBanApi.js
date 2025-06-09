import { axiosInstance } from "../axiosInstance";

async function postBanApi({ reporteeId, duration, reason }) {
    const requestBody = {
      "reporteeId": reporteeId,
      "duration": duration,
      "reason": reason
    }

    try {
        const response = await axiosInstance.post(
          "/report/ban",
          requestBody
        );

        console.log("사용자 정지 API 결과: ", response);

        return response;
    } catch (error) {
        console.log("사용자 정지 API 실패: ", error);
        return false;
    }

}

export { postBanApi };