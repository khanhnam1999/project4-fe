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

export const paymentMethodData = [
    { value: 0, label: "Tiền mặt" },
    { value: 1, label: "Chuyển khoản" },
    { value: 2, label: "Thẻ tín dụng" },
    { value: 3, label: "Ví điện tử" },
]