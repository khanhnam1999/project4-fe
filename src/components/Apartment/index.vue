<template>
    <div>
        <a-page-header
            style="
                background-color: white;
                position: sticky;
                top: 0;
                z-index: 100;
            "
            title="Danh sách căn hộ"
        >
            <template #extra>
                <a-input-search
                    enter-button
                    placeholder="Nhập số phòng"
                    @search="handleSearch"
                />
                <a-button type="primary" @click="handleOpenModal(false)">
                    Thêm mới phòng
                </a-button>
            </template>
        </a-page-header>
        <div style="background-color: #ececec; padding: 20px">
            <div
                v-if="apartments.length === 0"
                style="
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: calc(100vh - 184px);
                "
            >
                <a-spin size="large" />
            </div>
            <a-row :gutter="[16, 24]" v-else>
                <a-col
                    :span="6"
                    v-for="aprt in apartments"
                    :key="aprt.apartmentId"
                >
                    <a-card style="width: 300px" hoverable>
                        <template #cover>
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        </template>
                        <template #actions>
                            <setting-outlined
                                key="setting"
                                @click="handleOpenDrawer(aprt)"
                            />
                            <edit-outlined
                                key="edit"
                                @click="handleOpenModal(true, aprt)"
                            />
                            <DeleteOutlined @click="handleDelete(aprt)" />
                        </template>
                        <a-card-meta :title="`Căn hộ ${aprt.roomNumber}`">
                            <template #description>
                                <a-alert
                                    v-if="aprt.status === 0"    
                                    message="Còn trống"
                                    type="info"
                                    show-icon
                                />
                                <a-alert
                                    v-else-if="aprt.status === 2"
                                    message="Đang có người ở"
                                    type="success"
                                    show-icon
                                />
                                <a-alert
                                    v-else-if="aprt.status === 1"
                                    message="Đang đợi thanh toán"
                                    type="warning"
                                    show-icon
                                />
                                <a-alert
                                    v-else-if="aprt.status === 3"
                                    message="Đang bảo trì"
                                    type="error"
                                    show-icon
                                />
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-col>
            </a-row>
        </div>
        <ApartmentModal
            v-model:open="modalOpen"
            v-model:dataDetail="apartment"
            :is-edit="isEdit"
            @reload="getListApartments(filter)"
        />
        <ApartmentDrawer
            :apartment="apartment"
            v-model:open="drawerOpen"
            v-model:dataDetail="apartment"
            @close="handleCloseDrawer"
        />
    </div>
</template>

<script setup lang="ts">
import {
    SettingOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { createVNode, reactive, ref, watchPostEffect } from "vue";
import {
    apartmentDefaultValue,
    type Apartment,
} from "../../interfaces/apartment.interface";
import ApartmentModal from "./ApartmentModal.vue";
import api from "../../middleware/axios.interceptor.ts";
import { message, Modal } from "ant-design-vue";
import ApartmentDrawer from "./ApartmentDrawer/index.vue";
import type { Filter } from "../../interfaces/base.interface.ts";

const apartments = ref<Apartment[]>([]);
const filter = reactive<Filter>({
    page: 0,
    limit: 0,
    conditions: [],
    sortName: "CreatedAt",
    sortMethod: "DESC",
});

const drawerOpen = ref<boolean>(false);
const modalOpen = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const apartment = ref<Apartment>({ ...apartmentDefaultValue });

const handleOpenModal = (edit: boolean, data?: Apartment) => {
    modalOpen.value = true;
    isEdit.value = edit;
    if (data) {
        apartment.value = data;
    }
};

const handleOpenDrawer = (data: Apartment) => {
    drawerOpen.value = true;
    setTimeout(() => {
        apartment.value = data;
    }, 500);
};

const handleCloseDrawer = () => {
    drawerOpen.value = false;
    apartment.value = { ...apartmentDefaultValue };
};

const handleDelete = (data: Apartment) => {
    Modal.confirm({
        title: "Xác nhận xóa?",
        icon: createVNode(ExclamationCircleOutlined),
        content: `Bạn có chắc chắn muốn xóa phòng số ${data.roomNumber} này không?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Đóng",
        onOk() {
            api.post("/Apartments/delete", [data.apartmentId])
                .then((res) => {
                    message.success(
                        `Xóa phòng số ${data.roomNumber} thành công`,
                    );
                    const index = apartments.value?.findIndex(
                        (i) => i.apartmentId == data.apartmentId,
                    );
                    if (index != -1 && index != undefined) {
                        apartments.value.splice(index, 1);
                    }
                })
                .catch((err) => {
                    message.error(`Xóa phòng số ${data.roomNumber} thất bại`);
                });
        },
        onCancel() {
            console.log("Cancel");
        },
    });
};

const getListApartments = (data: any) => {
    api.post(`/Apartments/filter`, data)
        .then((res) => {
            apartments.value = res.data.results.$values;
        })
        .catch((err) => {
            console.log(err);
        });
};

const handleSearch = (value: string) => {
    if (value) {
        filter.conditions = [{ key: "RoomNumber", value }];
    } else {
        filter.conditions = [];
    }
};

watchPostEffect(() => {
    getListApartments(filter);
});
</script>
<style lang="" scoped></style>
