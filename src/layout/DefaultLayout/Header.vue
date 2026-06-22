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
        <a-dropdown :trigger="['click']">
            <a-avatar size="large" style="margin: 0 24px">
                <template #icon><UserOutlined /></template>
            </a-avatar>
            <template #overlay>
                <a-menu>
                    <a-menu-item key="0"> Thông tin cá nhân </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="3">Đăng xuất</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>
<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
</script>
<style lang=""></style>
