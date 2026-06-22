import axios from "axios";
import { CookieService } from "../services/cookie.service";
import { message } from "ant-design-vue";

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
        if (error.response && error.response.status === 401) {
            // Ví dụ: chuyển hướng sang trang login
            // accountStore.loginErrorActions();
            message.error("Lỗi đăng nhập");
        } else {
            message.error("Lỗi hệ thống");
        }
        message.loading("Đang chuyển về trang đăng nhập", 20, () => {
            window.location.href = "/login";
        });
        return Promise.reject(error);
    },
);

export default api;
