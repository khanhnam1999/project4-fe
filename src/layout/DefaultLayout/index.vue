<template>
    <a-layout
        has-sider
        style="
            width: 100%;
            height: 100vh;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            position: fixed;
        "
    >
        <a-layout-sider
            v-model:collapsed="collapsed"
            :trigger="null"
            collapsible
        >
            <div class="logo" />
            <slider />
        </a-layout-sider>
        <a-layout>
            <a-layout-header
                id="components-layout-demo-custom-trigger"
                :style="{ background: '#fff', padding: 0 }"
            >
                <Header>
                    <MenuUnfoldOutlined
                        v-if="collapsed"
                        class="trigger"
                        @click="() => (collapsed = !collapsed)"
                    />
                    <MenuFoldOutlined
                        v-else
                        class="trigger"
                        @click="() => (collapsed = !collapsed)"
                    />
                </Header>
            </a-layout-header>
            <a-layout-content style="overflow: auto">
                <router-view />
            </a-layout-content>
            <!-- <a-layout-footer :style="{ textAlign: 'center' }">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer> -->
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons-vue";
import Slider from "./Slider.vue";
import Header from "./Header.vue";
const collapsed = ref<boolean>(false);
</script>
<style scoped>
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
}

#components-layout-demo-fixed-sider .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}
</style>
