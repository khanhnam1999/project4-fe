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
                <a-input-group compact style="width: 300px">
                    <a-auto-complete
                        v-model:value="residentSearchInput"
                        :options="residentSuggestions"
                        :filter-option="filterSuggestion"
                        allow-clear
                        placeholder="Tên cư dân"
                        style="width: 235px"
                        @select="handleResidentSearch"
                        @clear="handleResidentSearch('')"
                    />
                    <a-button
                        type="primary"
                        style="width: 65px"
                        @click="handleResidentSearch(residentSearchInput)"
                    >
                        Tìm
                    </a-button>
                </a-input-group>
                <a-input-group compact style="width: 350px">
                    <a-auto-complete
                        v-model:value="paymentInfoSearchInput"
                        :options="paymentInfoSuggestions"
                        :filter-option="filterSuggestion"
                        allow-clear
                        placeholder="Thông tin thanh toán"
                        style="width: 285px"
                        @select="handlePaymentInfoSearch"
                        @clear="handlePaymentInfoSearch('')"
                    />
                    <a-button
                        type="primary"
                        style="width: 65px"
                        @click="
                            handlePaymentInfoSearch(paymentInfoSearchInput)
                        "
                    >
                        Tìm
                    </a-button>
                </a-input-group>
                <a-range-picker
                    v-model:value="searchDateRange"
                    format="DD/MM/YYYY"
                    :placeholder="['Từ ngày', 'Đến ngày']"
                    allow-clear
                    style="width: 260px"
                    @change="handleDateSearch"
                />
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
                    <template v-else-if="column.key === 'amount'">
                        <a-typography-text strong>
                            {{ formatCurrency(text) }}
                        </a-typography-text>
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-popconfirm
                            v-if="record.paymentStatus === 0"
                            title="Bạn có chắc chắn muốn xóa hóa đơn chưa thanh toán này?"
                            ok-text="Xóa"
                            cancel-text="Đóng"
                            :ok-button-props="{ danger: true }"
                            @confirm="handleDeletePayment(record)"
                        >
                            <a-button
                                danger
                                :loading="record.deleteLoading"
                            >
                                Xóa hóa đơn
                            </a-button>
                        </a-popconfirm>
                        <a-typography-text v-else type="secondary">
                            Không thể xóa
                        </a-typography-text>
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
import { onMounted, reactive, ref, watchPostEffect } from "vue";
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
        dataIndex: "residentName",
        key: "residentName",
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Số tiền phải thanh toán",
        dataIndex: "amount",
        key: "amount",
    },
    {
        title: "Ngày hết hạn",
        dataIndex: "paymentDeadline",
        key: "paymentDeadline",
    },
    {
        title: "Ngày xác nhận",
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
        title: "Thao tác",
        dataIndex: "paymentId",
        key: "action",
    },
];
const selectedKey = ref<number>(-1);
const residentSearchInput = ref<string>("");
const paymentInfoSearchInput = ref<string>("");
const residentSearchValue = ref<string>("");
const paymentInfoSearchValue = ref<string>("");
const searchDateRange = ref<[Dayjs, Dayjs]>();
const residentSuggestions = ref<{ value: string; label: string }[]>([]);
const paymentInfoSuggestions = ref<{ value: string; label: string }[]>([]);
const loading = ref<boolean>(false);
const payments = ref<Payment[]>([]);
const totalRecords = ref<number>(0);
const filter = reactive<Filter>({
    page: 1,
    limit: 20,
    conditions: [],
    sortName: "ModifiedDate",
    sortMethod: "DESC",
});

const getPaymentStatusInfo = (status: number) => {
    return paymentStatusData.find((a) => a.value === status);
};

const getPaymentMethodInfo = (method: number) => {
    return paymentMethodData.find((a) => a.value === method);
};

const handleResidentSearch = (value: string) => {
    residentSearchValue.value = value.trim();
    filter.page = 1;
};

const handlePaymentInfoSearch = (value: string) => {
    paymentInfoSearchValue.value = value.trim();
    filter.page = 1;
};

const handleDateSearch = () => {
    filter.page = 1;
};

const filterSuggestion = (
    input: string,
    option: { value: string; label: string },
) => option.value.toLocaleLowerCase().includes(input.toLocaleLowerCase());

const formatCurrency = (value: number | string) =>
    `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} ₫`;

const loadSearchSuggestions = async () => {
    try {
        const response = await api.post("/Payments/filter", {
            page: 0,
            limit: 0,
            conditions: [],
            sortName: "ModifiedDate",
            sortMethod: "DESC",
        });
        const allPayments = getCollection<Payment>(response.data.results);

        // Gợi ý lấy từ DTO filter vì DTO này luôn có sẵn residentName.
        residentSuggestions.value = [
            ...new Set(
                allPayments
                    .map((item) => item.residentName ?? "")
                    .filter(Boolean),
            ),
        ].map((value) => ({ value, label: value }));
        paymentInfoSuggestions.value = [
            ...new Set(
                allPayments
                    .flatMap((item) => [item.title, item.description])
                    .filter(Boolean),
            ),
        ].map((value) => ({ value, label: value }));
    } catch (error) {
        console.log("Không tải được gợi ý tìm kiếm hóa đơn", error);
    }
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
            record.paymentDate = dayjs().toISOString();
            message.success("Thay đổi trạng thái thành công");
        })
        .catch(() => {
            message.error("Thay đổi trạng thái thất bại");
        })
        .finally(() => {
            record.statusLoading = false;
        });
};

const handleDeletePayment = async (record: Payment) => {
    if (record.paymentStatus !== 0) {
        message.warning("Chỉ có thể xóa hóa đơn chưa thanh toán");
        return;
    }

    record.deleteLoading = true;
    try {
        // Backend xóa mềm nên hóa đơn không còn xuất hiện trên dashboard
        // và ứng dụng cư dân, nhưng dữ liệu vẫn được giữ để đối soát.
        await api.post("/Payments/delete", [record.paymentId]);
        payments.value = payments.value.filter(
            (item) => item.paymentId !== record.paymentId,
        );
        totalRecords.value = Math.max(0, totalRecords.value - 1);
        message.success("Xóa hóa đơn thành công");
    } catch (error: any) {
        const backendMessage =
            typeof error?.response?.data === "string"
                ? error.response.data
                : error?.response?.data?.message;
        message.error(backendMessage || "Xóa hóa đơn thất bại");
    } finally {
        record.deleteLoading = false;
    }
};

const getListPayments = (filterSearch: Filter) => {
    loading.value = true;
    Promise.all([
        api.post("/Payments/filter", filterSearch),
        api.get("/Payments"),
    ])
        .then(([res, allPaymentsResponse]) => {
            const { results, totalRecords } = res.data;
            const allPayments = getCollection<Payment>(
                allPaymentsResponse.data,
            );
            const createdDates = new Map<string, Payment["createdDate"]>(
                allPayments.map(
                    (item): [string, Payment["createdDate"]] => [
                        item.paymentId,
                        item.createdDate,
                    ],
                ),
            );

            payments.value = getCollection<Payment>(results)
                .map((item) => {
                    const account = item.resident?.account;

                    return {
                        ...item,
                        createdDate:
                            item.createdDate ??
                            createdDates.get(item.paymentId),
                        statusLoading: false,
                        deleteLoading: false,
                        fullName:
                            item.residentName ?? account?.fullName ?? "",
                        phoneNumber: account?.phoneNumber,
                        gender: account?.gender,
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
    const conditions: Filter["conditions"] = [];

    if (residentSearchValue.value) {
        conditions.push({
            key: "ResidentName",
            value: residentSearchValue.value,
        });
    }

    if (paymentInfoSearchValue.value) {
        conditions.push({
            key: "PaymentInfo",
            value: paymentInfoSearchValue.value,
        });
    }

    if (searchDateRange.value?.[0]) {
        conditions.push({
            key: "PaymentDateFrom",
            value: searchDateRange.value[0].format("YYYY-MM-DD"),
        });
    }

    if (searchDateRange.value?.[1]) {
        conditions.push({
            key: "PaymentDateTo",
            value: searchDateRange.value[1].format("YYYY-MM-DD"),
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
        conditions,
    });
});

onMounted(loadSearchSuggestions);
</script>
<style lang=""></style>
