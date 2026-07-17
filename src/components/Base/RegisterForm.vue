<template>
    <a-form
        :model="formState"
        name="AccountForm"
        ref="formRef"
        layout="vertical"
        :rules="rules"
    >
        <a-row :gutter="[16, 16]">
            <a-col :span="12">
                <a-form-item label="Họ và tên" name="fullName">
                    <a-input v-model:value="formState.fullName" />
                </a-form-item>
            </a-col>
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
            <a-col :span="12">
                <a-form-item label="Ngày sinh" name="dateOfBirth">
                    <a-date-picker
                        style="width: 100%"
                        v-model:value="formState.dateOfBirth"
                        valueFormat="YYYY-MM-DDTHH:mm:ss"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày sinh"
                        :disabledDate="disabledDate"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Giới tính" name="gender">
                    <a-select
                        :options="genderOptions"
                        v-model:value="formState.gender"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Số căn cước" name="identityNumber">
                    <a-input
                        v-model:value="formState.identityNumber"
                        :disabled="isEdit"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Ngày cấp" name="identityIssuedDate">
                    <a-date-picker
                        style="width: 100%"
                        v-model:value="formState.identityIssuedDate"
                        valueFormat="YYYY-MM-DDTHH:mm:ss"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày cấp"
                        :disabledDate="disabledDate"
                        :disabled="isEdit"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Nơi cấp" name="identityIssuedPlace">
                    <a-input
                        v-model:value="formState.identityIssuedPlace"
                        :disabled="isEdit"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Tỉnh/thành phố" name="provinceId">
                    <a-select
                        v-model:value="formState.provinceId"
                        @change="handleChangeProvince"
                    >
                        <a-select-option
                            v-for="province in addressStore.provinces"
                            :key="province.provinceId"
                            :value="province.provinceId"
                        >
                            {{ province.provinceName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="Xã/phường" name="wardId">
                    <a-select v-model:value="formState.wardId">
                        <a-select-option
                            v-for="ward in addressStore.wards"
                            :key="ward.wardId"
                            :value="ward.wardId"
                        >
                            {{ ward.wardName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="Địa chỉ thường trú" name="addressDetail">
                    <a-input v-model:value="formState.addressDetail" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import {
    accountDefault,
    genderOptions,
    type Account,
} from "../../interfaces/account.interface";
import api from "../../middleware/axios.interceptor";
import { useAddressStore } from "../../stores/address.store";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const addressStore = useAddressStore();

const props = defineProps({
    role: {
        type: Number,
        default: 0,
        required: false,
    },
});

const formRef = ref();
const isEdit = ref<boolean>(false);
const formState = ref<Account>({ ...accountDefault });

const rules: Record<string, Rule[]> = {
    wardId: [
        {
            required: true,
            message: "Vui lòng chọn xã/phường",
        },
    ],
    provinceId: [
        {
            required: true,
            message: "Vui lòng chọn tỉnh/thành phố",
        },
    ],
    addressDetail: [
        {
            required: true,
            whitespace: true,
            message: "Vui lòng nhập địa chỉ thường trú",
        },
    ],
    identityNumber: [
        {
            required: true,
            whitespace: true,
            message: "Vui lòng nhập số căn cước",
        },
        {
            pattern: /^[0-9]{12}$/,
            message: "Căn cước là số có đủ 12 số",
        },
    ],
    identityIssuedPlace: [
        {
            required: true,
            whitespace: true,
            message: "Vui lòng nhập nơi cấp",
        },
    ],
    identityIssuedDate: [
        {
            required: true,
            message: "Vui lòng chọn ngày cấp",
        },
    ],
    gender: [
        {
            required: true,
            message: "Vui lòng chọn giới tính",
        },
    ],
    fullName: [
        {
            required: true,
            whitespace: true,
            message: "Vui lòng nhập tên cư dân",
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

const disabledDate = (current: Dayjs) => {
    // disable ngày >= hôm nay
    return current && current >= dayjs().startOf("day");
};

const handleChangeProvince = (value: string) => {
    formState.value.wardId = "";
    addressStore.getListApiWards(value);
};

const handleRegister = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(() => {
                api.post("/Accounts/register", {
                    ...formState.value,
                    role: props.role,
                    accountId: undefined,
                })
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            })
            .catch((err: any) => reject(err));
    });
};

const handleUpdate = () => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(() => {
                api.put(
                    `/Accounts/${formState.value.accountId}`,
                    formState.value,
                )
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            })
            .catch((err: any) => reject(err));
    });
};

const getDetail = (selectedId: string) => {
    isEdit.value = true;
    return new Promise((resolve, reject) => {
        api.get(`/Accounts/${selectedId}`)
            .then((res) => {
                formState.value = res.data;
                addressStore.getListApiWards(res.data.provinceId);
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const resetFormState = () => {
    formState.value = { ...accountDefault };
    isEdit.value = false;
    formRef.value.resetFields();
};

defineExpose({ handleRegister, handleUpdate, getDetail, resetFormState });

onMounted(() => {
    addressStore.getListApiProvinces();
});
</script>
<style></style>
