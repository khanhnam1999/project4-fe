<template>
    <a-drawer
        v-model:open="open"
        :title="serviceDetail.name"
        width="1024"
        :closable="false"
    >
        <a-table
            :dataSource="residents"
            :columns="columns"
            :loading="loading"
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'gender'">
                    <div>
                        <div v-if="text === 0">Nam</div>
                        <div v-else-if="text === 1">Nữ</div>
                        <div v-else>Khác</div>
                    </div>
                </template>
                <template v-else-if="column.key === 'status'">
                    <a-switch
                        :checked="text === 1"
                        @change="handleChangeStatus(record)"
                        :loading="record.statusLoading"
                    />
                </template>
                <template v-else-if="column.key === 'action'">
                    <a-popconfirm
                        title="Bạn có chắc muốn xóa đặt lịch của người này không?"
                        ok-text="Xóa"
                        :okButtonProps="{ danger: true }"
                        cancel-text="Hủy"
                        @confirm="handleDelete(text)"
                    >
                        <a-button danger type="link"> Delete </a-button>
                    </a-popconfirm>
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
    </a-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import {
    convertResident,
    residentDefault,
    type Resident,
} from "../../interfaces/resident.interface";
import { type Service } from "../../interfaces/service.interface";
import type { Filter, FilterResult } from "../../interfaces/base.interface";
import api from "../../middleware/axios.interceptor";
import { message } from "ant-design-vue";
import type { Booking } from "../../interfaces/booking.interface";
const props = defineProps<{
    serviceDetail: Service;
}>();
const open = defineModel("open", { default: false, required: true });
const columns = [
    {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
    },
    {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
    },
    {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
    },
    {
        title: "Căn cước",
        dataIndex: "identityNumber",
        key: "identityNumber",
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "",
        dataIndex: "bookingId",
        key: "action",
    },
];
const loading = ref<boolean>(false);
const residents = ref<Resident[]>([]);
const totalRecords = ref<number>(0);
const filter = reactive<Filter>({
    page: 1,
    limit: 20,
    conditions: [],
    sortName: "ModifiedAt",
    sortMethod: "DESC",
});

const handleDelete = (id: string) => {
    return new Promise((resolve) => {
        api.post("/Bookings/delete", [id])
            .then((res) => {
                message.success("Xóa thành công");
                handleGetListBooking();
            })
            .catch((err) => {
                message.error("Xóa thất bại");
            })
            .finally(() => resolve(true));
    });
};

const handleChangeStatus = (record: any) => {
    const data: Booking = {
        bookingId: record.bookingId,
        residentId: record.residentId,
        serviceId: record.serviceId,
        bookingDate: record.bookingDate,
        status: record.status === 1 ? 0 : 1,
    };
    record.statusLoading = true;
    api.put(`/Bookings/${data.bookingId}`, data)
        .then((res) => {
            record.status = data.status;
            message.success("Thay đổi trạng thái thành công");
        })
        .catch((err) => {
            message.error("Thay đổi trạng thái thất bại");
        })
        .finally(() => {
            record.statusLoading = false;
        });
};

const handleGetListBooking = () => {
    loading.value = true;
    api.post("/Bookings/filter", {
        ...filter,
        conditions: [
            { key: "ServiceId", guidValue: props.serviceDetail.serviceId },
        ],
    } as Filter)
        .then((res) => {
            const data: FilterResult<Booking> = res.data;

            totalRecords.value = data.totalRecords;

            if (data.results.$values) {
                residents.value = data.results.$values.map((item) => {
                    return {
                        ...item,
                        ...convertResident(item.resident || residentDefault),
                        statusLoading: false,
                    };
                });

                console.log(residents.value);
            }
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        });
};

watch(open, (newValue) => {
    if (newValue) {
        handleGetListBooking();
    }
});
</script>
<style></style>
