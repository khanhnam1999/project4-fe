<template>
    <div>
        <a-steps :current="current" :items="items" :percent="count" />
        <div v-if="current === 0">
            <a-divider>Điền thông tin đăng ký</a-divider>
            <a-form
                :model="formState"
                name="basic"
                ref="formRef"
                layout="vertical"
                :rules="rules"
                autocomplete="off"
            >
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="Tên cư dân" name="fullName">
                            <a-input v-model:value="formState.fullName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="Tài khoản" name="username">
                            <a-input v-model:value="formState.username" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="Mật khẩu" name="password">
                            <a-input-password
                                v-model:value="formState.password"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            label="Xác thực mật khẩu"
                            name="confirmPassword"
                        >
                            <a-input-password
                                v-model:value="formState.confirmPassword"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="Email" name="email">
                            <a-input v-model:value="formState.email" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="Số điện thoại" name="phoneNumber">
                            <a-input v-model:value="formState.phoneNumber" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="Ngày sinh" name="dateOfBirth">
                            <a-date-picker
                                style="width: 100%"
                                v-model:value="formState.dateOfBirth"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <!-- <a-form-item
                            label="Ngày sinh"
                            name="dateOfBirth"
                            :rules="[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày sinh',
                                },
                            ]"
                        >
                            <a-date-picker
                                style="width: 100%"
                                v-model:value="formState.dateOfBirth"
                            />
                        </a-form-item> -->
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div v-else-if="current === 1" style="text-align: center">
            <a-divider>Xác nhận thông tin đăng ký</a-divider>
            <a-card>
                <a-form layout="vertical">
                    <a-form-item label="Chọn quan hệ trong hộ gia đình">
                        <a-segmented
                            v-model:value="value"
                            block
                            :options="data"
                        />
                    </a-form-item>
                </a-form>
                <div>
                    Bạn có chắc chắc muốn thêm người dùng này thành dân cư của
                    căn hộ?
                </div>
            </a-card>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted } from "vue";
import {
    accountDefault,
    type Account,
} from "../../../interfaces/account.interface";
import { HashPwdService } from "../../../services/hashPwd.service";
import api from "../../../middleware/axios.interceptor";
import { message } from "ant-design-vue";
import type { Rule, RuleObject } from "ant-design-vue/es/form";
import type { StoreValue } from "ant-design-vue/es/form/interface";

const current = ref<number>(1);
const stepLoading = defineModel<boolean>("stepLoading", {
    default: false,
    required: true,
});

const items = [
    { title: "Đăng ký tài khoản" },
    { title: "Xác nhận dân cư" },
    { title: "Xác nhận hợp đồng" },
];
const formRef = ref();
const formState = reactive<Account>({ ...accountDefault });

const rules: Record<string, Rule[]> = {
    fullName: [
        {
            required: true,
            whitespace: true,
            message: "Vui lòng nhập tên cư dân",
        },
    ],
    username: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập tài khoản",
        },
        {
            max: 20,
            min: 3,
            message: "Tài khoản phải từ 3 đến 20 ký tự",
        },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "Tài khoản chỉ được chứa chữ, số và dấu gạch dưới",
        },
    ],
    password: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập mật khẩu",
        },
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        },
    ],
    confirmPassword: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập lại đúng mật khẩu",
        },
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        },
        {
            validator(_: RuleObject, value: StoreValue) {
                if (!value || value === formState.password) {
                    return Promise.resolve();
                }
                return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp"),
                );
            },
        },
    ],
    email: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập email",
        },
        {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Email không hợp lệ",
        },
    ],
    phoneNumber: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập số điện thoại",
        },
        {
            pattern: /^(0|\+84)(\d{9})$/,
            message: "Số điện thoại không hợp lệ",
        },
    ],
    dateOfBirth: [
        {
            whitespace: true,
            required: true,
            message: "Vui lòng nhập ngày sinh",
        },
    ],
};

const data = reactive<string[]>(["Vợ/Chồng", "Con cái", "Người thuê"]);
const value = ref(data[0]);

const handleRegister = () => {
    formRef.value.validate().then(() => {
        stepLoading.value = true;
        if (!formState.password) {
            message.warning("Vui lòng điền mật khẩu");
            return;
        }
        increaseToSuccess(
            api.post("/Accounts/register", {
                ...formState,
                password: HashPwdService.hashedPassword(formState.password),
                role: 1,
            }),
        )
            .then(([res1, res2]) => {
                console.log(res1);
                setTimeout(() => {
                    current.value = 1;
                }, 500);
            })
            .catch((err) => {
                message.error("Đăng ký thất bại");
                console.log(err);
            })
            .finally(() => {
                stepLoading.value = false;
                count.value = 100;
                setTimeout(() => {
                    resetLoading();
                }, 500);
            });
    });
};

const handleSubmit = () => {
    stepLoading.value = true;
    setTimeout(() => {
        current.value = 2;
        stepLoading.value = false;
    }, 10000);
};

const handleComplete = () => {
    stepLoading.value = true;
    setTimeout(() => {
        stepLoading.value = false;
    }, 10000);
};

const handleSubmitAll = () => {
    switch (current.value) {
        case 0:
            handleRegister();
            break;
        case 1:
            handleSubmit();
            break;
        case 2:
            handleComplete();
            break;
        default:
            message.warning("Chức năng không tồn tại!");
            break;
    }
};

const count = ref(0);
let intervalId: NodeJS.Timeout;

function increaseToSuccess(apiPromise: Promise<any>): Promise<[number, any]> {
    const promise = new Promise((resolve) => {
        let value = 0;
        const intervalId = setInterval(() => {
            value++;
            console.log(value);

            if (value >= 90) {
                clearInterval(intervalId);
                resolve(value); // Promise hoàn thành khi đạt 90
            }
        }, 50); // mỗi 50ms tăng 1
    });

    return Promise.all([apiPromise, promise]);
}

const resetLoading = () => {
    count.value = 0;
    clearInterval(intervalId);
};

defineExpose({
    handleSubmitAll,
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>
<style lang=""></style>
