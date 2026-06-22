export interface Service {
    serviceId: string;
    name: string;
    description: string;
    price: number;
}

export const serviceDefaultData = {
    name: "",
    description: "",
    price: 0,
    serviceId: "",
};
