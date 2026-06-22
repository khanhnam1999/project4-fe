import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import Apartment from "../components/Apartment/index.vue";
import Login from "../layout/AuthLayout/Login.vue";
import Register from "../layout/AuthLayout/Register.vue";
import Service from "../components/Service/index.vue";

const routes: Array<RouteRecordRaw> = [
    { path: "/login", name: "Login", component: Login, meta: { layout: "auth"} },
    { path: "/register", name: "Register", component: Register, meta: { layout: "auth"} },
    { path: "/", name: "HelloWorld", component: HelloWorld, meta: { layout: "default"} },
    { path: "/apartment", name: "Apartment", component: Apartment, meta: { layout: "default" } },
    { path: "/service", name: "Service", component: Service, meta: { layout: "default" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
