<template>
    <a-card title="ĐĂNG KÝ" style="width: 800px">
        <template #extra>
            <router-link to="/login">
                <a-button type="link">Đăng nhập</a-button>
            </router-link>
        </template>
        <register-form :role="1" ref="registerForm" />
        <a-button
            type="primary"
            block
            @click="handleRegister"
            :loading="loading"
        >
            Đăng ký
        </a-button>
    </a-card>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import RegisterForm from "../../components/Base/RegisterForm.vue";

const registerForm = ref();
const router = useRouter();
const loading = ref<boolean>(false);

const handleRegister = () => {
    if (
        registerForm.value &&
        typeof registerForm.value.handleRegister == "function"
    ) {
        loading.value = true;
        registerForm.value
            .handleRegister()
            .then(() => {
                message.success("Đăng ký thành công");
                router.push("/login");
            })
            .catch((err: any) => {
                console.log(err);
                message.error("Đăng ký thất bại");
            })
            .finally(() => {
                loading.value = false;
            });
    }
};
</script>
