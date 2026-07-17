import type { Dayjs } from "dayjs";
import type { Resident } from "./resident.interface";
import type { Service } from "./service.interface";

export interface Booking {
    bookingId: string,
    residentId: string,
    resident?: Resident,
    serviceId: string,
    service?: Service,
    bookingDate: Dayjs,
    status: number,
}