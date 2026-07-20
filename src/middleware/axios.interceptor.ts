import axios from "axios";
import { CookieService } from "../services/cookie.service";

const api = axios.create({
    baseURL: "https://localhost:44312/api",
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = CookieService.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401)) {
            const { status } = error.response;
            switch (status) {
                case 401:
                case 403:
                    window.location.href = "/403";
                    break;
            
                default:
                    // window.location.href = "/500";
                    break;
            }
        } else {
            // window.location.href = "/500";
        }
        return Promise.reject(error);
    },
);

export default api;
