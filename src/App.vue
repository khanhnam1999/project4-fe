<template>
    <div>
        <component :is="layouts[route.meta.layout]"></component>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import AuthLayout from "./layout/AuthLayout/index.vue";
import DefaultLayout from "./layout/DefaultLayout/index.vue";

const route = useRoute();
const layouts: Record<string, any> = {
    auth: AuthLayout,
    default: DefaultLayout,
}
</script>
<style lang="">
    
</style>