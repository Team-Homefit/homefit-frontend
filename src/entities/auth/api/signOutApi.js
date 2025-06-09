import { axiosInstance } from "../../axiosInstance";

async function signOutApi() {
    try {
        const response = await axiosInstance.post(
          "/auth/sign-out",
        );

        console.log("로그아웃 API 결과: ", response);

        return response;
    } catch (error) {
        return false;
    }

}

export { signOutApi };