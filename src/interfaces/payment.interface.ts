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
    paymentType: string;
    transactionId?: string;
    referenceCode?: string
    [key: string]: any;
}

export const paymentDefault: Payment = {
    paymentId: "",
    residentId: "",
    title: "",
    amount: 0,
    paymentDeadline: dayjs().hour(23).minute(59).second(59),
    description: "",
    paymentStatus: 0,
    paymentType: ""
};

export const paymentMethodData = [
    { value: 0, label: "Tiền mặt" },
    { value: 1, label: "Chuyển khoản" },
    { value: 2, label: "Thẻ tín dụng" },
    { value: 3, label: "Ví điện tử" },
];

export const paymentStatusData = [
    { value: 0, label: "Chưa thanh toán", type: "info" },
    { value: 1, label: "Đã chuyển khoản", type: "warning" },
    { value: 2, label: "Đã trả tiền mặt", type: "warning" },
    { value: 3, label: "Đã thanh toán", type: "success" },
    { value: 4, label: "Quá hạn", type: "error" },
    { value: 3, label: "Đã hủy", type: "error" },
];