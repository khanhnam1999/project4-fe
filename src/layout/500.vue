<template>
    <a-result
        status="500"
        title="500"
        sub-title="Xin lỗi, có vẻ như đang xảy ra lỗi!"
    >
        <template #extra>
            <a-button type="primary" @click="$router.go(-1)">
                Quay lại
            </a-button>
        </template>
    </a-result>
</template>
