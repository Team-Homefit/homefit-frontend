import { axiosInstance } from "../axiosInstance";

async function postApologyApi({ banId }) {
    const requestBody = {
      "banId": banId
    }

    try {
        const response = await axiosInstance.post(
          "/report/ban/apology",
          requestBody
        );

        console.log("커뮤니티 가이드라인 동의서 제출 API 결과: ", response);

        return response;
    } catch (error) {
        console.log("커뮤니티 가이드라인 동의서 제출 API 실패: ", error);
        return false;
    }
}

export { postApologyApi };