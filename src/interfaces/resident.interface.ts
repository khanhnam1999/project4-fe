import type { Account } from "./account.interface";
import type { Booking } from "./booking.interface";
import type { ContracResident } from "./contractResident.interface";
import type { Incident } from "./incident.interface";
import type { Payment } from "./payment.interface";

export interface Resident {
    residentId: string;
    accountId: string;
    account?: Account;
    contractResidents?: ContracResident[];
    payments?: Payment[];
    bookings?: Booking[];
    incidents?: Incident[];
    [key: string]: any;
}

export const residentDefault: Resident = {
    residentId: "",
    accountId: "",
};

export const convertResident = (item: Resident) => {
    return {
        ...item,
        fullName: item.account?.fullName,
        dateOfBirth: item.account?.dateOfBirth,
        addressDetail: item.account?.addressDetail,
        phoneNumber: item.account?.phoneNumber,
        email: item.account?.email,
        identityNumber: item.account?.identityNumber,
        gender: item.account?.gender,
    };
};
