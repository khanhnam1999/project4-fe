<template>
    <a-card title="ĐĂNG NHẬP" style="width: 400px;">
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

            <a-form-item name="remember">
                <a-checkbox v-model:checked="formState.remember">
                    Ghi nhớ đăng nhập
                </a-checkbox>
            </a-form-item>

            <a-button block type="primary" html-type="submit" :loading="loading">Đăng nhập</a-button>
        </a-form>
    </a-card>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
import { reactive, ref } from "vue";
import { HashPwdService } from "../../services/hashPwd.service";
import api from "../../middleware/axios.interceptor";
import { useAccountStore } from "../../stores/account.store";
import { useRouter } from "vue-router";

const accountStore = useAccountStore();
const router = useRouter();

interface FormState {
    username: string;
    password: string;
    remember: boolean;
}

const formState = reactive<FormState>({
    username: "",
    password: "",
    remember: true,
});

const loading = ref<boolean>(false);

const onFinish = async () => {
    loading.value = true;
    await api
        .post("/Accounts/authenticate", {
            username: formState.username,
            password: HashPwdService.hashedPassword(formState.password),
        })
        .then((res) => {
            // console.log(res.data);
            accountStore.saveAccount(res.data);
            router.push("/");
        })
        .catch((err) => {
            message.error("Đăng nhập thất bại");
            console.log(err);
        })
        .finally(() => {
           loading.value = false; 
        });
};

const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
};
</script>
