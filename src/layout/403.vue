<template>
    <a-result
        status="403"
        title="403"
        sub-title="Xin lỗi, bạn không có quyền ở trang này"
    >
        <template #extra>
            <router-link to="/login">
                <a-button type="primary">Đăng nhập</a-button>
            </router-link>
        </template>
    </a-result>
</template>
