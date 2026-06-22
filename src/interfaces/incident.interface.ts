import type { Apartment } from "./apartment.interface";
import type { Resident } from "./resident.interface";

export interface Incident {
    incidentId: string,
    apartmentId: string,
    apartment: Apartment,
    reportedBy: string, // residentId
    resident?: Resident,
    description: string,
    status: string,
}