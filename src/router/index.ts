import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import Login from "../layout/AuthLayout/Login.vue";
import ResetPwd from "../layout/AuthLayout/ResetPwd.vue";
import Register from "../layout/AuthLayout/Register.vue";

import HelloWorld from "../components/HelloWorld.vue";
import Apartment from "../components/Apartment/index.vue";
import Service from "../components/Service/index.vue";
import Resident from "../components/Resident/index.vue";
import Incident from "../components/Incident/index.vue";

const routes: Array<RouteRecordRaw> = [
    { path: "/login", name: "Login", component: Login, meta: { layout: "auth"} },
    { path: "/register", name: "Register", component: Register, meta: { layout: "auth"} },
    { path: "/reset-pwd", name: "ResetPwd", component: ResetPwd, meta: { layout: "auth"} },

    { path: "/", name: "HelloWorld", component: HelloWorld, meta: { layout: "default"} },
    { path: "/apartment", name: "Apartment", component: Apartment, meta: { layout: "default" } },
    { path: "/service", name: "Service", component: Service, meta: { layout: "default" } },
    { path: "/resident", name: "Resident", component: Resident, meta: { layout: "default" } },
    { path: "/incident", name: "Incident", component: Incident, meta: { layout: "default" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
