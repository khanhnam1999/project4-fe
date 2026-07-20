<template>
    <a-modal
        v-model:open="open"
        :title="props.isEdit ? 'Chi tiết căn hộ' : 'Thêm mới căn hộ'"
        :confirmLoading="loading"
        @ok="handleSubmit"
        @cancel="handleCancelModal"
        cancelText="Đóng"
        :okText="props.isEdit ? 'Cập nhật' : 'Thêm mới'"
    >
        <a-form layout="vertical">
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Tầng">
                        <a-input-number
                            style="width: 100%"
                            v-model:value="dataDetail.floor"
                            :formatter="(a: any) => InputService.showNumber(a)"
                            :parser="(a: any) => a.replace(/,/g, '')"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Số phòng">
                        <a-input v-model:value="dataDetail.roomNumber" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Diện tích">
                        <a-input-number
                            style="width: 100%"
                            v-model:value="dataDetail.area"
                            :formatter="(a: any) => InputService.showNumber(a)"
                            :parser="(a: any) => a.replace(/,/g, '')"
                        >
                            <template #prefix> m&sup2; </template>
                        </a-input-number>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Trạng thái">
                        <a-select
                            v-model:value="dataDetail.status"
                            :options="[
                                { value: 0, label: 'Còn trống' },
                                { value: 1, label: 'Đang đợi thanh toán' },
                                { value: 2, label: 'Đang có người ở' },
                                { value: 3, label: 'Đang bảo trì' },
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Giá thuê">
                        <a-input-number
                            style="width: 100%"
                            v-model:value="dataDetail.rentPrice"
                            :formatter="(a: any) => InputService.showNumber(a)"
                            :parser="(a: any) => a.replace(/,/g, '')"
                            prefix="VNĐ"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Giá bán">
                        <a-input-number
                            style="width: 100%"
                            v-model:value="dataDetail.buyPrice"
                            :formatter="(a: any) => InputService.showNumber(a)"
                            :parser="(a: any) => a.replace(/,/g, '')"
                            prefix="VNĐ"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Ảnh">
                        <a-upload
                            v-model:file-list="fileList"
                            name="avatar"
                            list-type="picture-card"
                            accept=".jpg,.jpeg,.png,.gif"
                            class="avatar-uploader"
                            :show-upload-list="false"
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            :before-upload="beforeUpload"
                            @change="handleChange"
                        >
                            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                            <div v-else>
                                <loading-outlined v-if="uploadLoading" />
                                <plus-outlined v-else />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row> -->
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
    apartmentDefaultValue,
    type Apartment,
} from "../../interfaces/apartment.interface";
import {
    message,
    type UploadProps,
    type UploadChangeParam,
} from "ant-design-vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import api from "../../middleware/axios.interceptor";
import { InputService } from "../../services/input.service";
const props = defineProps({
    isEdit: {
        type: Boolean,
        required: true,
        default: false,
    },
});
const emit = defineEmits(["reload"])
const open = defineModel<boolean>("open", { default: false, required: true });
const dataDetail = defineModel<Apartment>("dataDetail", { required: true });

const loading = ref<boolean>(false);
const handleCancelModal = () => {    
    dataDetail.value = {...apartmentDefaultValue};
    open.value = false;
};

const handleSubmit = () => {
    loading.value = true;
    if (props.isEdit) {
        api.put(`/Apartments/${dataDetail.value.apartmentId}`, dataDetail.value )
            .then((res) => {
                message.success("Sửa thông tin căn hộ thành công");
            })
            .catch((err) => {
                message.error("Sửa thông tin căn hộ thất bại");
            })
            .finally(() => {
                loading.value = false;
                handleCancelModal();
            });
    } else {
        api.post("/Apartments", { ...dataDetail.value, apartmentId: undefined })
            .then((res) => {
                message.success("Thêm mới căn hộ thành công");
                emit("reload");
            })
            .catch((err) => {
                message.error("Thêm mới căn hộ thất bại");
            })
            .finally(() => {
                loading.value = false;
                handleCancelModal();
            });
    }
};

// upload
function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
}

const fileList = ref([]);
const uploadLoading = ref<boolean>(false);
const imageUrl = ref<string>("");

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
        loading.value = true;
        return;
    }
    if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url: string) => {
            imageUrl.value = base64Url;
            loading.value = false;
        });
    }
    if (info.file.status === "error") {
        loading.value = false;
        message.error("upload error");
    }
};

const beforeUpload = (file: UploadProps["fileList"][number]) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};
</script>
<style scoped>
.avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
}
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
