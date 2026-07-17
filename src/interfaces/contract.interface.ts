import type { Dayjs } from "dayjs";
import type { Apartment } from "./apartment.interface";
import dayjs from "dayjs";
import type { ContracResident } from "./contractResident.interface";

export interface Contract {
    contractId: string;
    apartmentId: string;
    apartment?: Apartment;
    startDate: Dayjs;
    endDate?: Dayjs;
    contractResidents?: {
        $id: number;
        $values: ContracResident[];
    };
    type: number;
    initialPayment?: number;
    loanAmount?: number;
    installmentMonnth?: number;
}

export const contractDefault: Contract = {
    contractId: "",
    apartmentId: "",
    startDate: dayjs(),
    endDate: dayjs(),
    type: 0,
};

export const contractTypeEnum = [
    { value: 0, label: "Mua trả thẳng" },
    { value: 1, label: "Mua trả góp" },
    { value: 2, label: "Thuê" },
];

export const installmentMonnthList = [
    { value: 240, label: "20 năm" },
    { value: 300, label: "25 năm" },
    { value: 360, label: "30 năm" },
    { value: 420, label: "35 năm" },
];
