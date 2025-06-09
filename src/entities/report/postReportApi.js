import { axiosInstance } from "../axiosInstance";

async function postReportApi({ sourceId, sourceType }) {
    const requestBody = {
      targetSourceId: sourceId,
      type: sourceType,
    }

    try {
        const response = await axiosInstance.post(
          "/report",
          requestBody
        );

        console.log("사용자 신고 요청 API 결과: ", response);

        return response;
    } catch (error) {
      console.log("사용자 신고 요청 API 실패: ", error);
      
      if (error.response.data.title === '하루 내에 신고한 내역이 있습니다') {
        return 'ALREADY_REPORT';
      }

      return false;
    }

}

export { postReportApi };