import type { Contract } from "./contract.interface";
import type { Resident } from "./resident.interface";

export interface ContracResident {
    contractId: string;
    contract?: Contract;
    residentId: string;
    resident?: Resident;
    residentType: number;
}

export const contracResidentDefault: ContracResident = {
    contractId: "",
    residentId: "",
    residentType: 1,
};

export const residentTypeData = [
    { value: 0, label: "Chủ hộ", disabled: true },
    { value: 1, label: "Vợ/Chồng", disabled: false },
    { value: 2, label: "Con cái", disabled: false },
    { value: 3, label: "Người thuê", disabled: false },
];

export const getResidentTypeLabel = (value: number) => {
    const result = residentTypeData.find((i) => i.value === value);
    return result ? result.label : "";
};
