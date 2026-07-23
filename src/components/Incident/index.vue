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
            <!-- <template #extra>
                <a-button type="primary"> Thêm mới cư dân </a-button>
            </template> -->
        </a-page-header>
        <div style="padding: 14px">
            <a-tabs v-model:activeKey="activeKey" @change="handleChangeTab">
                <a-tab-pane
                    v-for="item in incidentStatus"
                    :key="item.value"
                    :tab="item.label"
                >
                    <a-table
                        :dataSource="incidents"
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
                            <template v-else-if="column.key === 'description'">
                                <a-typography-text v-if="record.status == 2">
                                    {{ record.resolvedDescription }}
                                </a-typography-text>
                                <a-typography-text v-else-if="record.status == 3">
                                    {{ record.closedDescription }}
                                </a-typography-text>
                                <a-typography-text v-else-if="record.status == 5">
                                    {{ record.cancelDescription }}
                                </a-typography-text>
                                <a-typography-text v-else>{{ text }}</a-typography-text>
                            </template>
                            <template v-else-if="column.key === 'action'">
                                <a-space direction="vertical">
                                    <a-button
                                        v-if="activeKey === 4"
                                        type="primary"
                                        block
                                        @click="handleSubmitIncident(record)"
                                    >
                                        {{ submitBtnText }}
                                    </a-button>
                                    <a-popconfirm
                                        v-else
                                        @confirm="handleSubmitIncident(record)"
                                        @cancel="handleCancelIncident"
                                        :ok-text="submitBtnText"
                                        cancel-text="Đóng"
                                    >
                                        <template #icon></template>
                                        <template #title>
                                            <a-form layout="vertical">
                                                <a-form-item label="Nhập lí do">
                                                    <a-input v-model:value="statusDesciption" />
                                                </a-form-item>
                                            </a-form>
                                        </template>
                                        <a-button type="primary" block>
                                            {{ submitBtnText }}
                                        </a-button>
                                    </a-popconfirm>
                                    <a-popconfirm 
                                        @confirm="handleSubmitIncident(record, true)"
                                        @cancel="handleCancelIncident"
                                        ok-text="Hủy"
                                        cancel-text="Đóng"
                                    >
                                        <template #icon></template>
                                        <template #title>
                                            <a-form layout="vertical">
                                                <a-form-item label="Nhập lí do">
                                                    <a-input v-model:value="statusDesciption" />
                                                </a-form-item>
                                            </a-form>
                                        </template>
                                        <a-button block>Hủy</a-button>
                                    </a-popconfirm>
                                </a-space>
                            </template>
                        </template>
                    </a-table>
                </a-tab-pane>
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
            </a-tabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watchPostEffect } from "vue";
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

import {
    incidentStatus,
    type Incident,
} from "../../interfaces/incident.interface";
import type { Filter } from "../../interfaces/base.interface";
import api from "../../middleware/axios.interceptor";
import { message } from "ant-design-vue";

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
        title: "Phòng",
        dataIndex: "roomNumber",
        key: "roomNumber",
    },
    {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
    },
    {
        title: "Thông tin sự cố",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "",
        dataIndex: "incidentId",
        key: "action",
    },
];
const activeKey = ref<number>(0);
const loading = ref<boolean>(false);
const incidents = ref<Incident[]>([]);
const totalRecords = ref<number>(0);
const filter = reactive<Filter>({
    page: 1,
    limit: 20,
    conditions: [{ key: "Status", incidentStatusValue: activeKey.value }],
    sortName: "ModifiedAt",
    sortMethod: "DESC",
});

const submitBtnText = computed(() => {
    let text = "";
    switch (activeKey.value) {
        case 0:
        case 4:
            text = "Tiếp nhận";
            break;
        case 1:
            text = "Khắc phục";
            break;
        case 2:
            text = "Hoàn thành";
            break;
        case 3:
        case 5:
            text = "Tái phát sinh";
            break;
        default:
            text = "";
            break;
    }
    return text;
});

const handleChangeTab = (value: number) => {
    filter.page = 1;
    filter.limit = 20;
    filter.conditions = [{ key: "Status", incidentStatusValue: value }];
};

const getListIncidents = (filterSearch: Filter) => {
    loading.value = true;
    api.post("/Incidents/filter", filterSearch)
        .then((res) => {
            if (!res.data.results || !res.data.results.$values) return;
            const { results, totalRecords } = res.data;
            incidents.value = results.$values.map((item: Incident) => {
                const { account } = item.resident;
                return {
                    ...item,
                    roomNumber: item.apartment.roomNumber,
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
    getListIncidents(filter);
});

const statusDesciption = ref<string>();
const handleCancelIncident = () => {
    statusDesciption.value = "";
}
const handleSubmitIncident = (record: any, isCancel: boolean = false) => {
    const data = {
        reportedBy: record.reportedBy,
        apartmentId: record.apartmentId,
        incidentId: record.incidentId,
        description: record.description,
        status: 0,
        cancelDescription: record.cancelDescription,
        resolvedDescription: record.resolvedDescription,
        closedDescription: record.closedDescription,
    };
    if(isCancel) {
        data.status = 5;
        data.cancelDescription = statusDesciption.value;
    } else {
        switch (activeKey.value) {
            case 3: // Hoàn thành
            case 5: // Đã hủy
                data.status = 4; // => Tái phát sinh
                data.description = statusDesciption.value;
                break;
            case 4:
                data.status = 1; // Tái phát sinh => Tiếp nhận
                break;
            case 1:
                data.status = 2;
                data.resolvedDescription = statusDesciption.value;
                break;
            case 2:
                data.status = 3;
                data.closedDescription = statusDesciption.value;
                break;
            default:
                message.warning("Không tìm thấy chức năng");
                return;
        }
    }
    loading.value = true;
    api.put(`/Incidents/${data.incidentId}`, data)
        .then(res => {
            message.success("Thay đổi trạng thái thành công");
            activeKey.value = data.status;
            filter.conditions = [{ key: "Status", incidentStatusValue: activeKey.value }];
        })
        .catch(err => {
            message.error("Thay đổi trạng thái không thành công");
        })
        .finally(() => {
            loading.value = false;
            statusDesciption.value = "";
        })
}
</script>
<style lang=""></style>
