import type { Incident } from './incident.interface';
import type { Contract } from './contract.interface';
import type { Resident } from './resident.interface';

export interface Apartment {
    apartmentId: string,
    floor: number,
    roomNumber: string,
    area: number,
    status: number,
    pictureUrl: string,
    rentPrice: number,
    buyPrice: number,
    residents?: Resident[],
    contracts?: Contract[],
    incidents?: Incident[]
}

export const apartmentDefaultValue: Apartment = {
    apartmentId: "",
    area: 0,
    buyPrice: 0,
    floor: 1,
    pictureUrl: "",
    rentPrice: 0,
    roomNumber: "",
    status: 0,
}