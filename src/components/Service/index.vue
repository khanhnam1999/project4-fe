<template>
    <div>
        <a-page-header
            style="
                background-color: white;
                position: sticky;
                top: 0;
                z-index: 100;
            "
            title="Danh sách dịch vụ"
        >
            <template #extra>
                <!-- <a-input-search enter-button placeholder="Nhập tên dịch vụ" /> -->
                <a-button type="primary" @click="showModal(false)">
                    Thêm mới dịch vụ
                </a-button>
            </template>
        </a-page-header>
        <div style="background-color: #ececec; padding: 20px">
            <div
                v-if="services.length === 0"
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
                    v-for="service in services"
                    :key="service.serviceId"
                >
                    <a-card hoverable style="width: 300px">
                        <template #cover>
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        </template>
                        <template #actions>
                            <setting-outlined @click="showDrawer(service)" />
                            <edit-outlined @click="showModal(true, service)" />
                            <DeleteOutlined @click="handleDelete(service)" />
                        </template>
                        <a-card-meta :title="service.name">
                            <template #description>
                                <a-typography-paragraph
                                    ellipsis
                                    :content="service.description"
                                />
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-col>
            </a-row>
            <a-modal
                v-model:open="openModal"
                :title="isEditModal ? 'Chi tiết dịch vụ' : 'Thêm mới dịch vụ'"
                :confirmLoading="modalSubmitLoading"
                @ok="handleSubmit"
                @cancel="handleCancelModal"
                cancelText="Đóng"
                :okText="isEditModal ? 'Cập nhật' : 'Thêm mới'"
            >
                <a-form layout="vertical">
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="Tên dịch vụ">
                                <a-input v-model:value="serviceDetail.name" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="Giá">
                                <a-input-number
                                    style="width: 100%"
                                    v-model:value="serviceDetail.price"
                                    :formatter="
                                        (a: any) =>
                                            a.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ',',
                                            )
                                    "
                                    :parser="(a: any) => a.replace(/,/g, '')"
                                    prefix="VNĐ"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            <a-form-item label="Chi tiết">
                                <a-textarea
                                    :rows="4"
                                    v-model:value="serviceDetail.description"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-modal>
            <ServiceDrawer
                v-model:open="openDrawer"
                :serviceDetail="serviceDetail"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    SettingOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";
import api from "../../middleware/axios.interceptor";
import {
    serviceDefaultData,
    type Service,
} from "../../interfaces/service.interface";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import ServiceDrawer from "./ServiceDrawer.vue";

const services = ref<Service[]>([]);
const serviceDetail = ref<Service>({ ...serviceDefaultData });
const isEditModal = ref<boolean>(false);
const openDrawer = ref<boolean>(false);
const openModal = ref<boolean>(false);
const modalSubmitLoading = ref<boolean>(false);

const showModal = (isEdit: boolean, data?: Service) => {
    if (data) {
        serviceDetail.value = data;
    }
    isEditModal.value = isEdit;
    openModal.value = true;
};

const handleCancelModal = () => {
    openModal.value = false;
    serviceDetail.value = { ...serviceDefaultData };
};

const showDrawer = (data: Service) => {
    openDrawer.value = true;
    serviceDetail.value = data;
};

const onClose = () => {
    openDrawer.value = false;
};

const handleSubmit = () => {
    modalSubmitLoading.value = true;
    if (isEditModal.value) {
        api.put(
            `/Services/${serviceDetail.value.serviceId}`,
            serviceDetail.value,
        )
            .then((res) => {
                message.success("Sửa thông tin thành công!");
            })
            .catch((err) => {
                message.error("Sửa thông tin thất bại");
                console.log(err);
            })
            .finally(() => {
                modalSubmitLoading.value = false;
                handleCancelModal();
            });
    } else {
        api.post(`/Services`, { ...serviceDetail.value, serviceId: undefined })
            .then((res) => {
                message.success("Thêm mới dịch vụ thành công!");
                services.value.push(serviceDetail.value);
            })
            .catch((err) => {
                message.error("Thêm mới dịch vụ thất bại");
                console.log(err);
            })
            .finally(() => {
                modalSubmitLoading.value = false;
                handleCancelModal();
            });
    }
};

const handleDelete = (data: Service) => {
    Modal.confirm({
        title: "Xác nhận xóa?",
        icon: createVNode(ExclamationCircleOutlined),
        content: `Bạn có chắc chắn muốn xóa dịch vụ ${data.name} này không?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Đóng",
        onOk() {
            api.post("/Services/delete", [data.serviceId])
                .then((res) => {
                    message.success(`Xóa dịch vụ ${data.name} thành công`);
                    const index = services.value?.findIndex(
                        (i) => i.serviceId == data.serviceId,
                    );
                    if (index != -1 && index != undefined) {
                        services.value.splice(index, 1);
                    }
                })
                .catch((err) => {
                    message.error(`Xóa dịch vụ ${data.name} thất bại`);
                });
        },
        onCancel() {
            console.log("Cancel");
        },
    });
};

onMounted(() => {
    api.get("/Services")
        .then((res) => {
            services.value = res.data;
        })
        .catch((err) => {
            console.log(err);
        });
});
</script>
<style lang="" scoped></style>
