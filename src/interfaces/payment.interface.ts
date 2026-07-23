import type { Dayjs } from "dayjs";
import type { Resident } from "./resident.interface";
import dayjs from "dayjs";

export interface Payment {
    paymentId: string;
    residentId: string;
    resident?: Resident;
    title: string;
    amount: number;
    paymentDate?: Dayjs;
    paymentDeadline: Dayjs;
    paymentMethod?: number;
    paymentStatus: number;
    description: string;
}

export const paymentDefault: Payment = {
    paymentId: "",
    residentId: "",
    title: "",
    amount: 0,
    paymentDeadline: dayjs().hour(23).minute(59).second(59),
    description: "",
    paymentStatus: 0,
};

export const paymentMethodData = [
    { value: 0, label: "Tiền mặt" },
    { value: 1, label: "Chuyển khoản" },
    { value: 2, label: "Thẻ tín dụng" },
    { value: 3, label: "Ví điện tử" },
];

export const paymentStatusData = [
    { value: 0, label: "Chưa thanh toán", type: "info" },
    { value: 1, label: "Đã thanh toán", type: "success" },
    { value: 2, label: "Thanh toán muộn", type: "warning" },
    { value: 3, label: "Đã quá hạn", type: "error" },
]
