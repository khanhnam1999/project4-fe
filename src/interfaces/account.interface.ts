import dayjs, { Dayjs } from "dayjs";

export interface Account {
    accountId: string,
    fullName: string,
    phoneNumber: string,
    email: string,
    dateOfBirth: Dayjs | null,
    gender: number,
    identityNumber: string,
    identityIssuedDate: Dayjs | null,
    identityIssuedPlace: string,
    provinceId: string,
    wardId: string,
    addressDetail: string,
    password?: string,
    token?: string,
    role: number,
}

export const genderOptions = [
    { value: 0, label: "Nam" },
    { value: 1, label: "Nữ" },
    { value: 2, label: "Khác" },
]

export const accountDefault: Account = {
    fullName: "",
    email: "",
    gender: 0,
    phoneNumber: "",
    dateOfBirth: null as dayjs.Dayjs | null,
    identityNumber: "",
    identityIssuedDate: null,
    identityIssuedPlace: "",
    provinceId: "",
    wardId: "",
    addressDetail: "",
    accountId: "",
    role: 0,
}