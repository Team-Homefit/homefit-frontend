import { axiosInstance } from "../axiosInstance";

async function updateMemberApi({ nickname, gender, birthday, tel }) {
    const requestBody = {
      "nickname": nickname,
      "gender": gender && gender !== 'none' ? gender : null,
      "birthday": birthday ? birthday : null,
      "tel": tel ? tel : null
    }

    try {
        const response = await axiosInstance.patch(
          "/member",
          requestBody
        );

        console.log("사용자 정보 변경 API 결과: ", response);

        return response.data;
    } catch (error) {
        return false;
    }

}

export { updateMemberApi };