<template>
    <a-drawer
        :title="`Thông tin căn hộ ${dataDetail.roomNumber}`"
        size="large"
        :open="open"
        :closable="false"
        :footer-style="{ textAlign: 'right' }"
        @close="onClose"
    >
        <resident-register-form
            ref="residentRegisterForm"
            v-show="showResidentRegsterForm"
            v-model:stepLoading="stepLoading"
        />
        <template #extra>
            <a-space>
                <a-button
                    type="primary"
                    @click="showResidentRegsterForm = true"
                >
                    Thêm mới dân cư
                </a-button>
                <a-button style="margin-right: 8px" @click="onClose">
                    Đóng
                </a-button>
            </a-space>
        </template>
        <template #footer v-if="showResidentRegsterForm">
            <a-button style="margin-right: 8px" @click="showResidentRegsterForm = false">
                Hủy
            </a-button>
            <a-button type="primary" @click="handleSubmit"> Xác nhận </a-button>
        </template>
    </a-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import {
    apartmentDefaultValue,
    type Apartment,
} from "../../../interfaces/apartment.interface";
import type { Account } from "../../../interfaces/account.interface";
import ResidentRegisterForm from "./ResidentRegisterForm.vue";

const open = defineModel<boolean>("open", { default: false, required: true });
const dataDetail = defineModel<Apartment>("dataDetail", { required: true });

const onClose = () => {
    dataDetail.value = apartmentDefaultValue;
    open.value = false;
    // current.value = 0;
};

const showResidentRegsterForm = ref<boolean>(false);
const stepLoading = ref<boolean>(false);
const residentRegisterForm = ref();

const handleSubmit = () => {
    if (
        residentRegisterForm.value &&
        typeof residentRegisterForm.value.handleSubmitAll === "function"
    ) {
        residentRegisterForm.value.handleSubmitAll();
    }
};
</script>
<style></style>
