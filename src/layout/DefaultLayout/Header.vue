<template>
    <div
        style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
        "
    >
        <slot />
        <div>
            <a-divider>
                <Notification />
                <a-dropdown
                    :trigger="['click']"
                    :arrow="{ pointAtCenter: true }"
                    placement="bottomRight"
                >
                    <a-avatar size="large" style="margin: 0 24px">
                        <template #icon><UserOutlined /></template>
                    </a-avatar>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0" @click="accountOpen = true">
                                Thông tin cá nhân
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item key="3" @click="handleLogout">
                                Đăng xuất
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-divider>
        </div>
        <Account v-model:open="accountOpen" />
    </div>
</template>
<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
import Notification from "./Notification.vue";
import { useRouter } from "vue-router";
import { CookieService } from "../../services/cookie.service.ts";
import Account from "../../components/Account.vue";
import { ref } from "vue";

const router = useRouter();

const accountOpen = ref<boolean>(false);
const handleLogout = () => {
    router.push("/login");
    CookieService.remove("token");
    CookieService.remove("accountId");
}
</script>
<style lang=""></style>
