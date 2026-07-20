<template>
    <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="dark"
        :items="items"
        @click="onSelectMenu"
    ></a-menu>
</template>
<script setup lang="ts">
interface MenuItem {
    key: number;
    icon: any;
    label: string;
    title: string;
    path: string;
}
import {
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined,
} from "@ant-design/icons-vue";

import { onMounted, ref, h, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const selectedKeys = ref<number[]>([]);

const items = reactive<MenuItem[]>([
    {
        key: 1,
        icon: () => h(PieChartOutlined),
        label: "Dashboard",
        title: "Báo cáo",
        path: "/",
    },
    {
        key: 2,
        icon: () => h(DesktopOutlined),
        label: "Aparment",
        title: "Căn hộ",
        path: "/apartment",
    },
    {
        key: 3,
        icon: () => h(InboxOutlined),
        label: "Service",
        title: "Dịch vụ",
        path: "/service",
    },
    {
        key: 4,
        icon: () => h(MailOutlined),
        label: "Resident",
        title: "Dân cư",
        path: "/resident",
    },
    {
        key: 5,
        icon: () => h(AppstoreOutlined),
        label: "Incident",
        title: "Sự cố",
        path: "/incident",
    },
    {
        key: 6,
        icon: () => h(AppstoreOutlined),
        label: "Payment",
        title: "Hóa đơn",
        path: "/payment",
    },
]);

const onSelectMenu = ({item}: any): any => {
    router.push(item.path);
};

onMounted(() => {
    setTimeout(() => {
        items.forEach((item: MenuItem) => {
            if(item.path == route.path) {
                selectedKeys.value.push(item.key);
            }
        });
    }, 100);
});
</script>
