import type { Booking } from "./booking.interface";
import type { Contract } from "./contract.interface";
import type { Incident } from "./incident.interface";
import type { Payment } from "./payment.interface";

export interface Resident {
    ResidentId: string,
    AccountId: string,
    ApartmentId: string,
    contract?: Contract,
    payment?: Payment,
    booking?: Booking,
    incident?: Incident,
}