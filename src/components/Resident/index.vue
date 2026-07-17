<template>
    <div>
        <a-page-header
            style="
                background-color: white;
                position: sticky;
                top: 0;
                z-index: 100;
            "
            title="Danh sách cư dân"
        >
            <template #extra>
                <a-input-search
                    enter-button
                    :placeholder="`Nhập ${searchSelect === 1 ? 'số căn cước' : 'tên'}`"
                    @search="handleSearch"
                >
                    <template #addonBefore>
                        <a-select
                            v-model:value="searchSelect"
                            style="width: 120px"
                        >
                            <a-select-option :value="0"> Tên </a-select-option>
                            <a-select-option :value="1">
                                Số căn cước
                            </a-select-option>
                        </a-select>
                    </template>
                </a-input-search>
                <a-button type="primary" @click="handleOpenModal('Add')">
                    Thêm mới cư dân
                </a-button>
            </template>
        </a-page-header>
        <a-table
            :dataSource="residents"
            :columns="columns"
            :loading="loading"
            :pagination="false"
        >
            <template #bodyCell="{ column, text }">
                <template v-if="column.key === 'gender'">
                    <div>
                        <div v-if="text === 0">Nam</div>
                        <div v-else-if="text === 1">Nữ</div>
                        <div v-else>Khác</div>
                    </div>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <!-- <a-divider type="vertical" /> -->
                        <a-button type="link" @click="handleOpenModal(text)">
                            Edit
                        </a-button>
                    </span>
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
        <resident-modal
            v-model:open="openModal"
            :selectedId="selectedResident"
        />
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, watchPostEffect } from "vue";
import { convertResident, type Resident } from "../../interfaces/resident.interface";
import type { Filter } from "../../interfaces/base.interface";
import api from "../../middleware/axios.interceptor";
import ResidentModal from "./ResidentModal.vue";

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
        title: "Nơi thường trú",
        dataIndex: "addressDetail",
        key: "addressDetail",
    },
    {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Căn cước",
        dataIndex: "identityNumber",
        key: "identityNumber",
    },
    {
        title: "",
        dataIndex: "accountId",
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

const searchSelect = ref<number>(0);

const handleSearch = (value: string) => {
    if (value) {
        if (searchSelect.value === 1) {
            filter.conditions = [{ key: "IdentityNumber", value }];
        } else {
            filter.conditions = [{ key: "FullName", value }];
        }
    } else {
        filter.conditions = [];
    }
};

const getListResidents = (filterSearch: Filter) => {
    loading.value = true;
    api.post("/Residents/filter", filterSearch)
        .then((res) => {
            if (!res.data.results || !res.data.results.$values) return;
            residents.value = res.data.results.$values.map((item: Resident) => {
                return convertResident(item);
            });
            totalRecords.value = res.data.totalRecords;
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        });
};

watchPostEffect(() => {
    getListResidents(filter);
});

const openModal = ref<boolean>(false);
const selectedResident = ref<string>("");

const handleOpenModal = (selected: string) => {
    selectedResident.value = selected;
    openModal.value = true;
};
</script>
<style lang=""></style>
