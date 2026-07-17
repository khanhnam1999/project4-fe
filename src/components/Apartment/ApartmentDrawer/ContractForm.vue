<template>
    <div>
        <a-divider>Hợp đồng</a-divider>
        <a-row :gutter="[16, 16]">
            <a-col :span="8">
                <a-radio-group v-model:value="contract.type">
                    <a-radio
                        class="radioStyle"
                        v-for="item in contractTypeEnum"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </a-radio>
                </a-radio-group>
            </a-col>
            <a-col :span="16">
                <div v-show="contract.type === 0">
                    <a-typography-title :level="4">
                        Trả thẳng toàn bộ
                    </a-typography-title>
                    <a-typography-text>
                        Số tiền cần thanh toán: {{ apartment.buyPrice }} VND
                    </a-typography-text>
                </div>
                <div v-show="contract.type === 1">
                    <a-typography-title :level="4">
                        Trả theo giá thuê
                    </a-typography-title>
                    <a-typography-text>
                        Số tiền cần thanh toán:
                        {{ apartment.rentPrice }} VND
                    </a-typography-text>
                </div>
            </a-col>
        </a-row>
        <div style="text-align: right; margin: 12px;">
            <a-button type="primary" @click="handleCreateContract" :loading="loading">
                Xác nhận hợp đồng
            </a-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import api from "../../../middleware/axios.interceptor.ts";
import { message } from "ant-design-vue";

import {
    contractDefault,
    contractTypeEnum,
    type Contract,
} from "../../../interfaces/contract.interface.ts";

import { type Apartment } from "../../../interfaces/apartment.interface.ts";

const props = defineProps<{
    apartment: Apartment;
}>();

const emit = defineEmits<{
    (e: "createContractSuccess", id: string): void;
}>();

const loading = ref<boolean>(false);
const contract = reactive<Contract>({ ...contractDefault });

const handleCreateContract = () => {
    loading.value = true;
    api.post("/Contracts", {
        ...contract,
        apartmentId: props.apartment.apartmentId,
        contractId: undefined,
    })
        .then(res => {
            message.success("Tạo mới hợp đồng thành công");
            emit("createContractSuccess", res.data);
        })
        .catch(err => {
            message.error("Thêm mới hợp đồng thất bại");
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
<style>
.radioStyle {
    display: "flex";
    width: 100%;
    height: "30px";
    lineheight: "30px";
}
</style>
