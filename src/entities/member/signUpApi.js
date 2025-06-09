import { axiosInstance } from "../axiosInstance";

async function signUpApi({ password, nickname, gender, birthday, tel }) {
    const requestBody = {
      "password": password,
      "nickname": nickname,
      "gender": gender && gender !== 'none' ? gender : null,
      "birthday": birthday ? birthday : null,
      "tel": tel ? tel : null
    }

    try {
        const response = await axiosInstance.post(
          "/member/sign-up",
          requestBody
        );

        console.log("회원가입 API 결과: ", response);

        return response;
    } catch (error) {
        return false;
    }

}

export { signUpApi };