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
        const status = error.response?.status;

        if (status === 401) {
            CookieService.remove("token");
            CookieService.remove("accountId");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        } else if (status === 403 && window.location.pathname !== "/403") {
            window.location.href = "/403";
        }

        return Promise.reject(error);
    },
);

export default api;
