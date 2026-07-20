import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import Page500 from "../layout/500.vue";
import Page403 from "../layout/403.vue";

import Login from "../layout/AuthLayout/Login.vue";
import ResetPwd from "../layout/AuthLayout/ResetPwd.vue";
import Register from "../layout/AuthLayout/Register.vue";

import Dashboard from "../components/Dashboard.vue";
import Apartment from "../components/Apartment/index.vue";
import Service from "../components/Service/index.vue";
import Resident from "../components/Resident/index.vue";
import Incident from "../components/Incident/index.vue";
import Payment from "../components/Payment/index.vue";

const routes: Array<RouteRecordRaw> = [
    { path: "/403", name: "Page403", component: Page403, meta: { layout: "auth"} },
    { path: "/500", name: "Page500", component: Page500, meta: { layout: "auth"} },
    { path: "/login", name: "Login", component: Login, meta: { layout: "auth"} },
    { path: "/register", name: "Register", component: Register, meta: { layout: "auth"} },
    { path: "/reset-pwd", name: "ResetPwd", component: ResetPwd, meta: { layout: "auth"} },

    { path: "/", name: "Dashboard", component: Dashboard, meta: { layout: "default"} },
    { path: "/apartment", name: "Apartment", component: Apartment, meta: { layout: "default" } },
    { path: "/service", name: "Service", component: Service, meta: { layout: "default" } },
    { path: "/resident", name: "Resident", component: Resident, meta: { layout: "default" } },
    { path: "/incident", name: "Incident", component: Incident, meta: { layout: "default" } },
    { path: "/payment", name: "Payment", component: Payment, meta: { layout: "default" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
