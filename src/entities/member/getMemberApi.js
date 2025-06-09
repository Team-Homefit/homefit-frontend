import { axiosInstance } from "../axiosInstance";

async function getMemberApi({ memberId }) {
	try {
        const response = await axiosInstance.get(`/member/${memberId}`);

        console.log("사용자 정보 조회 API 결과: ", response);

        return response.data;
    } catch (error) {
        return false;
    }

}

export { getMemberApi };