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
    { value: 1, label: "Thuê" },
];
