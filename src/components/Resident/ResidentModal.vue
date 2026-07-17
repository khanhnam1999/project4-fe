<template>
    <a-modal
        v-model:open="open"
        :title="isEdit ? 'Chi tiết' : 'Thêm mới'"
        :confirmLoading="loading"
        @ok="handleSubmit"
        @cancel="handleCancelModal"
        cancelText="Đóng"
        :okText="isEdit ? 'Cập nhật' : 'Thêm mới'"
    >
        <a-spin :spinning="loading">
            <RegisterForm ref="registerForm" />
        </a-spin>
    </a-modal>
</template>
<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import RegisterForm from "../Base/RegisterForm.vue";
import { message } from "ant-design-vue";
import api from "../../middleware/axios.interceptor.ts";

const props = defineProps({
    selectedId: {
        type: String,
        default: "",
    },
});

const isEdit = ref<boolean>(false);

const registerForm = ref();

const open = defineModel<boolean>("open", { default: false, required: true });

const loading = ref<boolean>(false);
const handleCancelModal = () => {
    registerForm.value.resetFormState();
    open.value = false;
};

const handleSubmitForm = () => {
    return new Promise(async(resolve, reject) => {
        if(isEdit.value) {
            await registerForm.value.handleUpdate()
                .then((res) => resolve(res))
                .catch(err => reject(err));
        } else {
            const { data: accountId } = await registerForm.value.handleRegister();
            const { data } = await api.post("/Residents", {
                residentId: undefined,
                accountId,
            });

            if (data) {
                resolve(data);
            } else {
                reject();
            }
        }
    })
}

const handleSubmit = () => {
    loading.value = true;
    handleSubmitForm()
        .then(res => {
            message.success("Thao tác thành công");
        })
        .catch(err => {
            console.log(err);
            message.error("Thao tác với cư dân thất bại");
        })
        .finally(() => {
            loading.value = false;
        });
};

watch(open, async(newValue) => {    
    await nextTick();
    if(newValue && props.selectedId !== "Add") {
        loading.value = true;
        await registerForm.value.getDetail(props.selectedId)
            .finally(() => {
                loading.value = false;
            })
    } else {
        registerForm.value.resetFormState();
    }
});
</script>
<style></style>
