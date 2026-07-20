<template>
    <div class="mr-24px">
        <a-row :gutter="[16, 16]">
            <a-col :span="6">
                <div class="bg-white">
                    <a-progress
                        type="circle"
                        :percent="apartmentReport.emptyCount"
                    />
                    <a-typography-title :level="4" style="margin-top: 6px">
                        Phòng trống
                    </a-typography-title>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="bg-white">
                    <a-progress
                        type="circle"
                        :percent="apartmentReport.maintenanceCount"
                        status="exception"
                        :format="(percent) => `${percent}%`"
                    />
                    <a-typography-title :level="4" style="margin-top: 6px">
                        Phòng đang bảo trì
                    </a-typography-title>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="bg-white">
                    <a-progress
                        type="circle"
                        :percent="apartmentReport.ownedCount"
                    />
                    <a-typography-title :level="4" style="margin-top: 6px">
                        Phòng mua đứt
                    </a-typography-title>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="bg-white">
                    <a-progress
                        type="circle"
                        :percent="apartmentReport.rentedCount"
                    />
                    <a-typography-title :level="4" style="margin-top: 6px">
                        Phòng được thuê
                    </a-typography-title>
                </div>
            </a-col>
        </a-row>
        <div style="margin: 24px 0">
            <a-space>
                <a-select v-model:value="periodType">
                    <a-select-option value="monthly">Tháng</a-select-option>
                    <a-select-option value="weekly">Tuần</a-select-option>
                </a-select>
                <a-range-picker
                    v-model:value="queryDate"
                    format="DD/MM/YYYY"
                    :disabledDate="disabledDate"
                    :defaultValue="[dayjs().startOf('month'), dayjs()]"
                    :defaultPickerValue="[dayjs().startOf('month'), dayjs()]"
                />
            </a-space>
            <div style="margin-top: 12px;">
                <apexchart
                    :options="chartOptions"
                    :series="chartSeries"
                ></apexchart>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, watchPostEffect } from "vue";
import api from "../middleware/axios.interceptor";
import dayjs, { Dayjs } from "dayjs";

/**
 * Lấy thông tin báo cáo căn hộ
 * START
 */
const apartmentReport = reactive({
    emptyCount: 0,
    maintenanceCount: 0,
    ownedCount: 0,
    rentedCount: 0,
});
const getApartmentReport = () => {
    api.get("Apartments/report")
        .then((res) => {
            const keys = Object.keys(apartmentReport);
            const { data } = res;
            keys.forEach((key) => {
                if (data[key]) {
                    const percent = (data[key] / data.totalCount) * 100;
                    apartmentReport[key] = percent
                        ? parseFloat(percent.toFixed(2))
                        : 0;
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
getApartmentReport();
/**
 * Lấy thông tin báo cáo căn hộ
 * END
 */

/**
 * Lấy thông tin báo cáo doanh thu
 * START
 */
interface PaymentReportDto {
    year: number;
    month?: number;
    week?: number;
    totalAmount: number;
    count: number;
}
type RangeValue = [Dayjs, Dayjs];
const queryDate = ref<RangeValue>([dayjs().startOf("month"), dayjs()]);
const periodType = ref<string>("monthly");
const paymentReport = ref<PaymentReportDto[]>([]);

const chartSeries = computed(() => {
    if (!paymentReport.value.length) return [];
    return [
        {
            name: "Tổng số tiền",
            type: "line",
            data: paymentReport.value.map((r) => r.totalAmount),
        },
        {
            name: "Số lượng giao dịch",
            type: "column",
            data: paymentReport.value.map((r) => r.count),
        },
    ];
});
const chartOptions = computed(() => ({
    chart: {
        height: 350,
        type: "line",
        zoom: { enabled: false },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "straight",
    },
    title: {
        text: "Thống kê thanh toán",
        align: "center",
    },
    labels: paymentReport.value.length ? paymentReport.value.map((r) => `${r.month}/${r.year}`) : "",
    grid: {
        row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
        },
    },
    // xaxis: {
    //     categories: [],
    // },
    yaxis: [
        {
            title: { text: "Tổng số tiền" },
        },
        {
            opposite: true,
            title: { text: "Số lượng giao dịch" },
        },
    ],
}));

const disabledDate = (current: Dayjs) => {
    // disable ngày >= hôm nay
    return current && current >= dayjs().startOf("day");
};

const getPaymentReport = (
    startDate: string,
    endDate: string,
    periodType: string,
) => {
    const url = `/Payments/report?startDate=${startDate}&endDate=${endDate}&periodType=${periodType}`;
    api.get(url)
        .then((res) => {
            console.log(res);
            paymentReport.value = res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
watchPostEffect(() => {
    const startDate = queryDate.value[0].format("YYYY-MM-DDTHH:mm:ss");
    const endtDate = queryDate.value[1].format("YYYY-MM-DDTHH:mm:ss");
    getPaymentReport(startDate, endtDate, periodType.value);
});
/**
 * Lấy thông tin báo cáo doanh thu
 * END
 */
</script>
<style scoped>
.bg-white {
    background: white;
    text-align: center;
    padding: 24px 0;
}
.mr-24px {
    margin: 24px;
}
</style>
