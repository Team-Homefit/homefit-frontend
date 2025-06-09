import { axiosInstance } from "../axiosInstance";

async function updatePasswordApi({ newPassword }) {
    const requestBody = {
      "newPassword": newPassword
    }

    try {
        const response = await axiosInstance.patch(
          "/member/password",
          requestBody
        );

        console.log("비밀번호 변경 API 결과: ", response);

        return response.data;
    } catch (error) {
      if (error.response.data.title === "기존 비밀번호와 동일합니다") {
        return 400;
      }
      return 0;
    }

}

export { updatePasswordApi };