<template>
    <div>
        <a-page-header
            style="
                background-color: white;
                position: sticky;
                top: 0;
                z-index: 100;
            "
            title="Danh sách sự cố"
        >
            <template #extra>
                <a-select
                    v-model:value="selectedKey"
                    allowClear
                    style="width: 200px"
                    placeholder="Chọn trạng thái"
                >
                    <a-select-option
                        v-for="item in paymentMethodData"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
                <a-button type="primary"> Thêm mới cư dân </a-button>
            </template>
        </a-page-header>
        <div style="padding: 14px">
            <a-table
                :dataSource="payments"
                :columns="columns"
                :loading="loading"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'paymentMethod'">
                        <a-space direction="vertical">
                            <a-alert
                                :message="getPaymentStatusInfo(text)?.label"
                                :type="getPaymentStatusInfo(text)?.type"
                                show-icon
                            />
                            <a-alert
                                v-if="
                                    record.paymentMethod !== null &&
                                    record.paymentMethod !== undefined
                                "
                                :message="getPaymentMethodInfo(text)?.label"
                                type="success"
                                show-icon
                            />
                        </a-space>
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-space direction="vertical">
                            <!-- <a-button
                                type="primary"
                                block
                                @click="handleSubmit(record)"
                            >
                                {{ submitBtnText }}
                            </a-button>
                            <a-button
                                block
                                @click="handleSubmit(record, true)"
                            >
                                Hủy
                            </a-button> -->
                        </a-space>
                    </template>
                </template>
            </a-table>
            <div
                style="
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    background-color: white;
                    padding: 12px;
                "
            >
                <a-pagination
                    v-model:current="filter.page"
                    v-model:pageSize="filter.limit"
                    show-size-changer
                    :total="totalRecords"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, watchPostEffect } from "vue";
import type { Filter } from "../../interfaces/base.interface";
import api from "../../middleware/axios.interceptor";
import { message } from "ant-design-vue";
import {
    paymentMethodData,
    paymentStatusData,
    type Payment,
} from "../../interfaces/payment.interface";

const columns = [
    {
        title: "Thông tin thanh toán",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "Cư dân thanh toán",
        dataIndex: "fullName",
        key: "fullName",
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Ngày hết hạn",
        dataIndex: "paymentDeadline",
        key: "paymentDeadline",
    },
    {
        title: "Trạng thái",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
    },
    {
        title: "Ngày thanh toán",
        dataIndex: "paymentDate",
        key: "paymentDate",
    },
    {
        title: "",
        dataIndex: "paymentId",
        key: "action",
    },
];
const selectedKey = ref<number>();
const loading = ref<boolean>(false);
const payments = ref<Payment[]>([]);
const totalRecords = ref<number>(0);
const filter = reactive<Filter>({
    page: 1,
    limit: 20,
    conditions: [],
    sortName: "ModifiedAt",
    sortMethod: "DESC",
});

const getPaymentStatusInfo = (status: number) => {
    return paymentStatusData.find((a) => a.value === status);
};

const getPaymentMethodInfo = (method: number) => {
    return paymentMethodData.find((a) => a.value === method);
};

const getListPayments = (filterSearch: Filter) => {
    loading.value = true;
    api.post("/Payments/filter", filterSearch)
        .then((res) => {
            if (!res.data.results || !res.data.results.$values) return;
            const { results, totalRecords } = res.data;
            payments.value = results.$values.map((item: Payment) => {
                const { account } = item.resident;
                return {
                    ...item,
                    fullName: account.fullName,
                    phoneNumber: account.phoneNumber,
                    gender: account.gender,
                };
            });
            totalRecords.value = totalRecords;
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        });
};

watchPostEffect(() => {
    const filterOption = {
        ...filter,
        condition: [
            { key: "PaymentMethod", paymentStatusValue: selectedKey.value },
        ],
    };
    getListPayments(selectedKey.value ? filterOption : filter);
});
</script>
<style lang=""></style>
