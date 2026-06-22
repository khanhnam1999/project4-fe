<template>
    <a-card title="ĐĂNG NHẬP" style="width: 400px">
        <a-form
            :model="formState"
            name="basic"
            layout="vertical"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <a-form-item
                label="Tài khoản"
                name="username"
                :rules="[
                    { required: true, message: 'Vui lòng nhập tài khoản' },
                ]"
            >
                <a-input v-model:value="formState.username" />
            </a-form-item>

            <a-form-item
                label="Mật khẩu"
                name="password"
                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]"
            >
                <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a-form-item
                label="Tên quản lý"
                name="fullName"
                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]"
            >
                <a-input v-model:value="formState.fullName" />
            </a-form-item>

            <a-form-item
                label="Email"
                name="email"
                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]"
            >
                <a-input v-model:value="formState.email" />
            </a-form-item>

            <a-form-item
                label="Số điện thoại"
                name="phoneNumber"
                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]"
            >
                <a-input v-model:value="formState.phoneNumber" />
            </a-form-item>

            <a-form-item
                label="Ngày sinh"
                name="dateOfBirth"
                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]"
            >
                <a-date-picker v-model:value="formState.dateOfBirth" />
            </a-form-item>

            <a-button block type="primary" html-type="submit">Đăng ký</a-button>
        </a-form>
    </a-card>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
import { reactive } from "vue";
import { HashPwdService } from "../../services/hashPwd.service";
import dayjs, { Dayjs } from "dayjs";
import api from "../../middleware/axios.interceptor";

interface FormState {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Dayjs;
}

const formState = reactive<FormState>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: dayjs(),
});
const onFinish = async () => {
    await api
        .post("/Accounts/register", {
            username: formState.username,
            password: HashPwdService.hashedPassword(formState.password),
            fullName: formState.fullName,
            email: formState.email,
            phoneNumber: formState.phoneNumber,
            dateOfBirth: formState.dateOfBirth,
            role: 1,
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            message.error("Đăng ký thất bại");
            console.log(err);
        });
};

const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
};
</script>
