import { axiosInstance } from "../axiosInstance";

export const getArticlesApi = async ({ boardId, isLiked, page, size }) => {
    try {
        const response = await axiosInstance.get('/board/article', {
            params: {
                ...(boardId && { boardId }),
                ...(isLiked !== undefined && { isLiked }),
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 목록 조회 실패:', error);
        throw error;
    }
};
