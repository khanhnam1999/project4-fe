export interface Notification {
    notificationId: string;
    title: string;
    description: string;
    receiveEnum: number;
    residentId? :string;
    paymentId?: string;
    status?: number;
}

export const notificationStatus = [
    { value: 0, label: "Đã đọc" },
    { value: 1, label: "Chưa đọc" },
]