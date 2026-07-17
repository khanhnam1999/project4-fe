import type { Apartment } from "./apartment.interface";
import type { Resident } from "./resident.interface";

export interface Incident {
    incidentId: string;
    apartmentId: string;
    apartment: Apartment;
    reportedBy: string; // residentId
    resident?: Resident;
    description: string;
    status: number;
    [key: string]: any;
}

export const incidentStatus = [
    { value: 0, label: "Sự cố mới" },
    { value: 1, label: "Đã tiếp nhận" },
    { value: 2, label: "Đã khắc phục" },
    { value: 3, label: "Hoàn thành" },
    { value: 4, label: "Tái phát sinh" },
    { value: 5, label: "Đã hủy" },
];
