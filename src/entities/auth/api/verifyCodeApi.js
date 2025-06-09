import { axiosInstance } from "../../axiosInstance";

async function verifyCodeApi({ username, code }) {
    const requestBody = {
        "username": username,
        "code": code
    }

    try {
        const response = await axiosInstance.post(
            "/auth/verify-code",
            requestBody
        );

        console.log("코드 검증 API 결과: ", response);

        return response;
    } catch (error) {
        return false;
    }

}

export { verifyCodeApi };