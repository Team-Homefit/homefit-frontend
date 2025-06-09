import { axiosInstance } from "../../axiosInstance";

async function issueCodeApi({ username, isSignUp }) {
    const requestBody = {
        username: username,
        isSignUp: isSignUp
    }

    try {
        const response = await axiosInstance.post(
            "/auth/code",
            requestBody
        );

        console.log("코드 발급 API 결과: ", response);

        return 200;
    } catch (error) {
      if (error.response?.data?.title === "이미 가입된 메일입니다") {
        return 400;
      }
      return false;
    }

}

export { issueCodeApi };