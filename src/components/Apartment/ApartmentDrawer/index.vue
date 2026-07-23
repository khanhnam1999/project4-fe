<template>
    <a-drawer
        :title="`Thông tin căn hộ ${apartment.roomNumber}`"
        size="large"
        :open="open"
        :closable="false"
        :footer-style="{ textAlign: 'right' }"
        @close="onClose"
    >
        <contract-form
            v-if="
                !apartmentDetail.contracts ||
                !apartmentDetail.contracts.$values.length
            "
            :apartment="apartmentDetail"
            @createContractSuccess="onCreateContractSuccess"
        />
        <a-list
            v-else
            class="demo-loadmore-list"
            item-layout="horizontal"
            :data-source="listResidentsInApartment"
        >
            <template #loadMore>
                <div
                    style="text-align: center; margin: 12px 0"
                    v-if="!isShowAddResident"
                >
                    <a-button @click="addNewResident">
                        Thêm mới dân cư
                    </a-button>
                </div>
            </template>
            <template #renderItem="{ item }">
                <a-list-item>
                    <template #actions>
                        <div v-if="item.residentId">
                            <a-popconfirm
                                v-if="(item.residentType === 0 && listResidentsInApartment.length === 1)
                                || (item.residentType !== 0)"
                                :okButtonProps="{ danger: true }"
                                title="Bạn có muốn xóa cư dân này?"
                                ok-text="Xóa"
                                cancel-text="Hủy"
                                @confirm="deleteResidentFromContract"
                            >
                                <a-button type="link" danger>Xóa</a-button>
                            </a-popconfirm>
                        </div>
                        <template v-else>
                            <a-space direction="vertical">
                                <a-button
                                    type="primary"
                                    block
                                    @click="submitAddResident"
                                    :loading="loading"
                                >
                                    Thêm mới
                                </a-button>
                                <a-button
                                    block
                                    type="primary"
                                    danger
                                    @click="handleCloseAddResident"
                                >
                                    Xóa
                                </a-button>
                            </a-space>
                        </template>
                    </template>
                    <a-form v-if="!item.residentId">
                        <a-form-item>
                            <a-typography-text v-if="isFirstResident">
                                Đăng ký là chủ căn hộ
                            </a-typography-text>
                            <a-radio-group
                                v-else
                                v-model:value="contractResident.residentType"
                            >
                                <a-radio-button
                                    v-for="item in residentTypeData"
                                    :key="item.value"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                >
                                    {{ item.label }}
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item>
                            <a-input-group compact>
                                <a-select
                                    v-model:value="searchSelect"
                                    style="width: 120px"
                                >
                                    <a-select-option :value="0">
                                        Tên
                                    </a-select-option>
                                    <a-select-option :value="1">
                                        Số căn cước
                                    </a-select-option>
                                </a-select>
                                <a-select
                                    show-search
                                    placeholder="Chọn cư dân"
                                    style="width: 200px"
                                    :filter-option="false"
                                    allowClear
                                    @change="handleSelectResident"
                                    @search="fetchUser"
                                >
                                    <a-select-option
                                        v-for="resident in listResidents"
                                        :key="resident.residentId"
                                        :value="resident.residentId"
                                    >
                                        <a-space direction="vertical">
                                            <a-typography-text>
                                                {{ resident.account?.fullName }}
                                            </a-typography-text>
                                            <a-typography-text type="secondary">
                                                {{
                                                    resident.account
                                                        ?.identityNumber
                                                }}
                                            </a-typography-text>
                                            <a-typography-text type="secondary">
                                                {{
                                                    resident.account
                                                        ?.phoneNumber
                                                }}
                                            </a-typography-text>
                                        </a-space>
                                    </a-select-option>
                                </a-select>
                            </a-input-group>
                        </a-form-item>
                    </a-form>
                    <a-list-item-meta
                        v-else
                        :title="item.account.fullName"
                        :description="getResidentTypeLabel(item.residentType)"
                    >
                        <template #avatar>
                            <a-avatar size="large" style="margin: 0 24px">
                                <template #icon><UserOutlined /></template>
                            </a-avatar>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
        <template #extra>
            <a-space>
                <a-button style="margin-right: 8px" @click="onClose">
                    Đóng
                </a-button>
            </a-space>
        </template>
    </a-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref, watchPostEffect } from "vue";
import { type Apartment } from "../../../interfaces/apartment.interface";
import api from "../../../middleware/axios.interceptor.ts";
import { message } from "ant-design-vue";
import {
    contracResidentDefault,
    getResidentTypeLabel,
    residentTypeData,
    type ContracResident,
} from "../../../interfaces/contractResident.interface.ts";
import { UserOutlined } from "@ant-design/icons-vue";
import ContractForm from "./ContractForm.vue";
import {
    residentDefault,
    type Resident,
} from "../../../interfaces/resident.interface.ts";
import type { Filter } from "../../../interfaces/base.interface.ts";
import { debounce } from "lodash-es";
import type { Contract } from "../../../interfaces/contract.interface.ts";
import { paymentDefault, type Payment } from "../../../interfaces/payment.interface.ts";
import dayjs from "dayjs";

const props = defineProps<{
    open: boolean;
    apartment: Apartment;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const onClose = () => {
    listResidentsInApartment.value = [];
    emit("close");
};

const isShowAddResident = ref<boolean>(false);
const isFirstResident = ref<boolean>(false);
const selectedResident = ref<Resident>({ ...residentDefault });
const totalResidents = ref<number>(0);
const listResidents = ref<Resident[]>([]);
const filterResident = reactive<Filter>({
    page: 1,
    limit: 20,
    conditions: [],
    sortName: "ModifiedAt",
    sortMethod: "DESC",
});
const searchSelect = ref<number>(0);
const fetchUser = debounce((value: string) => {
    listResidents.value = [];
    if (value) {
        if (searchSelect.value === 1) {
            filterResident.conditions = [{ key: "IdentityNumber", value }];
        } else {
            filterResident.conditions = [{ key: "FullName", value }];
        }
    } else {
        filterResident.conditions = [];
    }
}, 300);
const addNewResident = () => {
    isShowAddResident.value = true;
    listResidentsInApartment.value.push({ ...selectedResident.value });
};
const handleCloseAddResident = () => {
    isShowAddResident.value = false;
    selectedResident.value = { ...residentDefault };
    if (apartmentDetail.value.residents) {
        apartmentDetail.value.residents.$values.pop();
    }
};
const handleSelectResident = (value: string) => {
    fetchUser("");
    const result = listResidents.value.find(
        (item: Resident) => item.residentId === value,
    );
    if (result) {
        selectedResident.value = result;
        payment.residentId = result.residentId;
    } 
};
const submitAddResident = async () => {
    contractResident.residentId = selectedResident.value.residentId;
    if (isFirstResident.value) {
        contractResident.residentType = 0;
    }
    loading.value = true;
    Promise.all([
        api.post("/Contracts/addResidentToContract", contractResident), 
        api.post("/Payments", {
            ...payment,
            paymentId: undefined,
        }), 
    ])
        .then(() => {
            message.success("Thêm cư dân thành công");
            listResidentsInApartment.value = [];
            getListResidentByContract(contractResident.contractId);
            handleCloseAddResident();
        })
        .catch((err) => {
            message.error("Thêm cư dân thất bại");
        })
        .finally(() => {
            loading.value = false;
        });
    
};
const getListResidents = (filterSearch: Filter) => {
    // loading.value = true;
    api.post("/Residents/filter", filterSearch)
        .then((res) => {
            if (!res.data.results || !res.data.results.$values) return;
            listResidents.value.push(...res.data.results.$values);
            totalResidents.value = res.data.totalRecords;
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            // loading.value = false;
        });
};
watchPostEffect(() => {
    getListResidents(filterResident);
});

const apartmentDetail = ref<Apartment>({ ...props.apartment });
const loading = ref<boolean>(false);
const contractResident = reactive<ContracResident>({
    ...contracResidentDefault,
});
const payment = reactive<Payment>({...paymentDefault});
const onCreateContractSuccess = async (data: Contract) => {
    isFirstResident.value = true;
    contractResident.contractId = data.contractId;

    await getApartmentDetal(props.apartment.apartmentId);

    if(data.type === 0) { // trả thẳng
        payment.amount = apartmentDetail.value.buyPrice;
        payment.title = "Thanh toán tiền nhà";
        payment.description = "Thanh toán tiền nhà sau khi ký hợp đồng";
    } else { // trả tiền thuê
        // tính số ngày còn lại tới cuối tháng
        const dayLeft = dayjs().endOf("month").diff(dayjs(), "day") + 1;
        // Lấy số ngày trong tháng hiện tại
        const daysInMonth = dayjs().daysInMonth();
        payment.amount = (apartmentDetail.value.rentPrice / daysInMonth) * dayLeft;
        payment.title = "Thanh toán tiền nhà tháng đầu tiên";
        payment.description = `Thanh toán tiền nhà sau ${dayLeft} ngày cho tới cuối tháng`;
    } 
};

const getApartmentDetal = (key: string) => {
    return new Promise((resolve, reject) => {
        api.get(`/Apartments/${key}`)
            .then((res: any) => {
                apartmentDetail.value = res.data;
                if (
                    apartmentDetail.value.contracts &&
                    apartmentDetail.value.contracts.$values &&
                    apartmentDetail.value.contracts.$values[0]
                ) {
                    const contract: Contract =
                        apartmentDetail.value.contracts.$values[0];
    
                    contractResident.contractId = contract.contractId;
                    if (
                        contract.contractResidents &&
                        contract.contractResidents.$values.length
                    ) {
                        isFirstResident.value = false;
                        getListResidentByContract(contract.contractId);
                    } else {
                        isFirstResident.value = true;
                    }
                }
                resolve(res);
            })
            .catch((err) => {
                console.log(err);
                message.error("Lây thông tin căn hộ thất bại");
                reject(err);
            })
    })
};

const listResidentsInApartment = ref<Resident[]>([]);
const getListResidentByContract = (contractId: string) => {
    api.get(`/Contracts/${contractId}`)
        .then((res) => {
            res.data.contractResidents.$values.forEach(
                (item: ContracResident) => {
                    if (item.resident) {
                        listResidentsInApartment.value.push({
                            ...item.resident,
                            residentType: item.residentType,
                        });
                    }
                },
            );
        })
        .catch((err) => {
            console.log(err);
        });
};

const deleteResidentFromContract = () => {
    api.post("/Contracts/updateResidentToContract", {
        ...contractResident,
        isDeleted: true,
    })
        .then(res => {
            message.success("Xóa thành công");
            listResidentsInApartment.value = [];
            getListResidentByContract(contractResident.contractId);
        })
        .catch(err => {
            message.error("Xóa thật bại");
        });
};

watchPostEffect(() => {
    const key = props.apartment.apartmentId;
    getApartmentDetal(key);
});
</script>
<style></style>
