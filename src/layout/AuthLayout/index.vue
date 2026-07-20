<template>
    <div class="bg-img" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100vh;">
        <router-view />
    </div>
</template>
<style scoped>
.bg-img {
    background-image: url("/assets/images/apartment-bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100vh;
}
</style>
