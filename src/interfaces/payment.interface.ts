import type { Dayjs } from "dayjs";
import type { Resident } from "./resident.interface";

export interface Payment {
    paymentId: string,
    residentId: string,
    resident?: Resident,
    amount: number,
    paymentDate: Dayjs,
    paymentMethod: string,
    description: string,
}