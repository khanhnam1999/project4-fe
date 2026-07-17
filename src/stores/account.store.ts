import { message } from "ant-design-vue";
import type { Account } from "../interfaces/account.interface.ts";
import { CookieService } from "../services/cookie.service.ts";
import { defineStore } from "pinia";
import router from "../router/index.ts";
import api from "../middleware/axios.interceptor.ts";

export const useAccountStore = defineStore("account", {
    state: () => {
        return {
            account: {} as Account,
        };
    },
    getters: {},
    actions: {
        saveAccount(data: Account) {
            if (!data) this.loginErrorActions("Lỗi data trả về");

            CookieService.set("token", data.token || "");
            CookieService.set("accountId", data.accountId, 7);
        },
        getAccountDetail() {
            const id = CookieService.get("accountId");
            if (!id) router.push("/login");
            api.get(`/Accounts/${id}`)
                .then((res) => {
                    this.saveAccount(res.data);
                })
                .catch((err) => this.loginErrorActions(err));
        },
        loginErrorActions(err: any = "Lỗi đăng nhập") {
            message.error(err);
            router.push("/login");
        },
    },
});
