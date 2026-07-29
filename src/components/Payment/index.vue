<template>
    <div>
        <a-page-header
            style="
                background-color: white;
                position: sticky;
                top: 0;
                z-index: 100;
            "
            title="Trang thanh toán"
        >
            <template #extra>
                <a-select
                    v-model:value="selectedKey"
                    allowClear
                    style="width: 200px"
                    placeholder="Phương thức thanh toán"
                >
                    <a-select-option :value="-1">
                        Tất cả
                    </a-select-option>
                    <a-select-option
                        v-for="item in paymentMethodData"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
                <a-input-search
                    v-if="searchField === 'Title'"
                    enter-button="Tìm kiếm"
                    style="width: 420px"
                    placeholder="Nhập tiêu đề thanh toán"
                    @search="handleSearch"
                >
                    <template #addonBefore>
                        <a-select
                            v-model:value="searchField"
                            style="width: 140px"
                        >
                            <a-select-option value="Title">
                                Tiêu đề
                            </a-select-option>
                            <a-select-option value="PaymentDate">
                                Ngày thanh toán
                            </a-select-option>
                        </a-select>
                    </template>
                </a-input-search>
                <a-input-group v-else compact style="width: 420px">
                    <a-select
                        v-model:value="searchField"
                        style="width: 140px"
                    >
                        <a-select-option value="Title">
                            Tiêu đề
                        </a-select-option>
                        <a-select-option value="PaymentDate">
                            Ngày thanh toán
                        </a-select-option>
                    </a-select>
                    <a-date-picker
                        v-model:value="searchDate"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày thanh toán"
                        allow-clear
                        style="width: 280px"
                    />
                </a-input-group>
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
                    <template v-if="column.key === 'paymentDeadline'">
                        <a-space direction="vertical">
                            <a-typography-text>
                                {{ dayjs(text).format("DD/MM/YYYY") }}
                            </a-typography-text>
                            <a-typography-text>
                                {{ dayjs(text).format("HH:mm") }}
                            </a-typography-text>
                        </a-space>
                    </template>
                    <template v-else-if="column.key === 'createdDate'">
                        <a-space v-if="text" direction="vertical">
                            <a-typography-text>
                                {{ dayjs(text).format("DD/MM/YYYY") }}
                            </a-typography-text>
                            <a-typography-text>
                                {{ dayjs(text).format("HH:mm") }}
                            </a-typography-text>
                        </a-space>
                        <a-typography-text v-else type="secondary">
                            Chưa có dữ liệu
                        </a-typography-text>
                    </template>
                    <template v-else-if="column.key === 'paymentStatus'">
                        <a-space direction="vertical">
                            <a-tag :color="getPaymentStatusInfo(text)?.type">
                                {{ getPaymentStatusInfo(text)?.label }}
                            </a-tag>
                            <a-tag v-if="text === 3" color="success">
                                {{
                                    getPaymentMethodInfo(record.paymentMethod)
                                        ?.label
                                }}
                            </a-tag>
                            <a-switch
                                v-if="[1, 2, 3].includes(text)"
                                :checked="text === 3"
                                :disabled="text === 3 || !record.transactionId"
                                @change="handleChangePaymentStatus(record)"
                                :loading="record.statusLoading"
                            />
                        </a-space>
                    </template>
                    <template v-else-if="column.key === 'paymentDate'">
                        <a-space v-if="text" direction="vertical">
                            <a-typography-text>
                                {{ dayjs(text).format("DD/MM/YYYY") }}
                            </a-typography-text>
                            <a-typography-text>
                                {{ dayjs(text).format("HH:mm") }}
                            </a-typography-text>
                        </a-space>
                        <a-typography-text v-else type="secondary">
                            Chưa có dữ liệu
                        </a-typography-text>
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
                v-if="totalRecords > filter.limit"
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
import { getCollection, type Filter } from "../../interfaces/base.interface";
import api from "../../middleware/axios.interceptor";
import { message } from "ant-design-vue";
import {
    paymentMethodData,
    paymentStatusData,
    type Payment,
} from "../../interfaces/payment.interface";
import dayjs, { type Dayjs } from "dayjs";

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
        title: "Ngày tạo payment",
        dataIndex: "createdDate",
        key: "createdDate",
    },
    {
        title: "Trạng thái",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
    },
    {
        title: "Thời gian khách thanh toán",
        dataIndex: "paymentDate",
        key: "paymentDate",
    },
    {
        title: "",
        dataIndex: "paymentId",
        key: "action",
    },
];
const selectedKey = ref<number>(-1);
const searchField = ref<"Title" | "PaymentDate">("Title");
const searchValue = ref<string>("");
const searchDate = ref<Dayjs>();
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

const handleSearch = (value: string) => {
    searchValue.value = value.trim();
    filter.page = 1;
};

const handleChangePaymentStatus = (record: Payment) => {
    if (!record.transactionId) {
        message.error("Giao dịch này chưa có mã để xác nhận");
        return;
    }

    record.statusLoading = true;
    api.put(`/Payments/transactions/${record.transactionId}/confirm`)
        .then(() => {
            record.paymentStatus = 3;
            record.paymentDate = dayjs();
            message.success("Thay đổi trạng thái thành công");
        })
        .catch(() => {
            message.error("Thay đổi trạng thái thất bại");
        })
        .finally(() => {
            record.statusLoading = false;
        });
};

const getListPayments = (filterSearch: Filter) => {
    loading.value = true;
    Promise.all([
        api.post("/Payments/filter", filterSearch),
        api.get("/Payments"),
    ])
        .then(([res, allPaymentsResponse]) => {
            const { results, totalRecords } = res.data;
            const createdDates = new Map<string, Payment["createdDate"]>(
                getCollection<Payment>(allPaymentsResponse.data).map(
                    (item): [string, Payment["createdDate"]] => [
                        item.paymentId,
                        item.createdDate,
                    ],
                ),
            );

            payments.value = getCollection<Payment>(results)
                .filter(
                    (item) =>
                        searchField.value !== "PaymentDate" ||
                        !searchDate.value ||
                        (item.paymentDate &&
                            dayjs(item.paymentDate).isSame(
                                searchDate.value,
                                "day",
                            )),
                )
                .map((item) => {
                    const account = item.resident?.account;

                    return {
                        ...item,
                        createdDate:
                            item.createdDate ??
                            createdDates.get(item.paymentId),
                        statusLoading: false,
                        fullName:
                            item.residentName ?? account?.fullName ?? "",
                        phoneNumber: account?.phoneNumber,
                        gender: account?.gender,
                    };
                });
            console.log(totalRecords);
            
            totalRecords.value =
                searchField.value === "PaymentDate" && searchDate.value
                ? payments.value.length
                : totalRecords;
            console.log(payments.value);
            
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        });
};

watchPostEffect(() => {
    const conditions: Filter["conditions"] = [];

    if (searchField.value === "Title" && searchValue.value) {
        conditions.push({
            key: searchField.value,
            value: searchValue.value,
        });
    }

    if (selectedKey.value >= 0) {
        conditions.push({
            key: "PaymentMethod",
            paymentStatusValue: selectedKey.value,
        });
    }

    getListPayments({
        ...filter,
        page:
            searchField.value === "PaymentDate" && searchDate.value
                ? 0
                : filter.page,
        limit:
            searchField.value === "PaymentDate" && searchDate.value
                ? 0
                : filter.limit,
        conditions,
    });
});
</script>
<style lang=""></style>
