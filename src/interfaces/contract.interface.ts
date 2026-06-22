import type { Dayjs } from 'dayjs';
import type { Apartment } from './apartment.interface';
import type { Resident } from "./resident.interface";

export interface Contract {
    contractId: string,
    residentId: string,
    resident?: Resident,
    apartmentId: string,
    apartment: Apartment,
    startDate: Dayjs,
    endDate: Dayjs,
    type: string,
}