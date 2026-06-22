import Cookies from "js-cookie";

export const CookieService = {
    set(key: string, value: string, days: number = 1) {
        Cookies.set(key, value, { expires: days });
    },
    get(key: string): string | undefined {
        return Cookies.get(key);
    },
    remove(key: string) {
        Cookies.remove(key);
    },
};
