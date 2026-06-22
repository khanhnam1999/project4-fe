import dayjs, { Dayjs } from "dayjs";

export interface Account {
    accountId: string,
    fullName: string,
    phoneNumber: string,
    email: string,
    dateOfBirth: Dayjs | null,
    username: string,
    password?: string,
    confirmPassword?: string,
    token?: string,
    role: number,
}

export const accountDefault = {
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: null as dayjs.Dayjs | null,
    accountId: "",
    role: 0,
}