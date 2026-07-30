export interface Service {
    serviceId: string;
    name: string;
    description: string;
    price: number;
    monthlyPrice: number;
}

export const serviceDefaultData = {
    name: "",
    description: "",
    price: 0,
    monthlyPrice: 0,
    serviceId: "",
};
