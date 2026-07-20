import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import router from './router';
import { createPinia } from 'pinia';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
const pinia = createPinia();

app.use(VueApexCharts);
app.use(pinia);
app.use(Antd);
app.use(router);

app.mount('#app')
