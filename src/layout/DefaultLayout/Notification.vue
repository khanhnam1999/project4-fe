<template>
    <a-dropdown
        :trigger="['click']"
        :arrow="{ pointAtCenter: true }"
        placement="bottomRight"
    >
        <a-badge :count="totalCounts">
            <a-avatar size="large">
                <BellOutlined
                    style="font-size: 30px; transform: translateY(4px)"
                />
            </a-avatar>
        </a-badge>
        <template #overlay>
            <a-menu v-if="notifications.length">
                <a-menu-item v-for="noti in notifications" :key="noti.notificationId"> 
                    <a-typography-title :level="5">{{ noti.title }}</a-typography-title>
                    <a-typography-text>{{ noti.description }}</a-typography-text>
                </a-menu-item>
            </a-menu>
            <a-empty 
                v-else
                description="Không có thông báo nào"
            />
        </template>
    </a-dropdown>
</template>
<script setup lang="ts">
import { BellOutlined } from "@ant-design/icons-vue";
import signalRService from "../../services/signalR.service";
import api from "../../middleware/axios.interceptor";
import { ref } from "vue";
import { type Notification } from "../../interfaces/notification.interface";

const { start } = signalRService;
start();

const notifications = ref<Notification[]>([]);
const totalCounts = ref<number>(0);
const getListNotifications = () => {
    api.get("/Notifications")
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
}

getListNotifications();
</script>
<style></style>
