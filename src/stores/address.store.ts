import { defineStore } from "pinia";
import api from "../middleware/axios.interceptor";
import { getCollection } from "../interfaces/base.interface";

interface Province {
    provinceId: string;
    provinceName: string;
    provinceNameEn: string;
}

interface Ward {
    wardId: string;
    wardName: string;
    wardNameEn: string;
    provinceId: string;
}

export const useAddressStore = defineStore("address", {
    state: () => {
        return {
            provinces: [] as Province[],
            wards: [] as Ward[],
        };
    },
    getters: {},
    actions: {
        getListApiProvinces() {
            api.get("/Provinces")
                .then((res: any) => (this.provinces = res.data))
                .catch((err) => console.log(err));
        },
        getListApiWards(selectedProvinceId: string) {
            api.post("/Wards/filter", {
                conditions: [{ key: "ProvinceId", guidValue: selectedProvinceId }],
            })
                .then((res: any) => { 
                    this.wards = getCollection<Ward>(res.data.results);
                })
                .catch((err) => console.log(err));
        },
    },
});
