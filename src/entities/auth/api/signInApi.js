import { axiosInstance } from "../../axiosInstance";

async function signInApi({ username, password }) {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
        const response = await axiosInstance.post(
            "/auth/sign-in",
            params
        );

        console.log("로그인 API 결과: ", response);

        return response.data;
    } catch (error) {
        return false;
    }
}

export { signInApi };