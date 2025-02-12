import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./routers/index";
import { i18n } from "./store/modules/i18nStore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import VueApexCharts from "vue3-apexcharts";
import store from "./store/modules/modalStore";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

axios.defaults.withCredentials = true;

app.config.globalProperties.$axios = axios;
app.use(router);
app.use(i18n);
app.use(VueApexCharts);
app.use(store);
app.mount("#app");
