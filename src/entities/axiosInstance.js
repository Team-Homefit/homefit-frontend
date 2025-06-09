import axios from "axios";
import { signOut } from '@/shared/action/signOut';

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    (successResponse) => { return successResponse; },
    (error) => { 
        if (!error.response || !error.response.status) {
            return Promise.reject(error);
        }

        switch (error.response.status) {
            case 401:
                console.log("세션 만료");
                signOut();
                window.location.href = '/';
                
                return new Promise(() => {});
            default:
                Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export { axiosInstance }