<template>
    <a-modal
        v-model:open="open"
        title="Thông tin tài khoản"
        cancel-text="Đóng"
        ok-text="Cập nhật"
        @ok="handleSubmit"
        @cancel="handleCancelModal"
        :confirmLoading="loading"
    >
        <register-form ref="accountForm" />
    </a-modal>
</template>
<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import RegisterForm from "./Base/RegisterForm.vue";
import { CookieService } from "../services/cookie.service.ts";

const accountForm = ref();

const open = defineModel("open", { default: false, required: true });
const loading = ref<boolean>(false);
const handleCancelModal = () => {
    open.value = false;
};

const handleSubmit = () => {
    if (
        accountForm.value &&
        typeof accountForm.value.getDetail === "function"
    ) {
        accountForm.value.handleUpdate();
    }
};

watch(open, async(newValue: boolean) => {
    if(!newValue) return;
    const id = CookieService.get("accountId");
    await nextTick();
    if (
        accountForm.value &&
        typeof accountForm.value.getDetail === "function"
    ) {
        accountForm.value.getDetail(id);
    }
});
</script>
<style lang=""></style>
