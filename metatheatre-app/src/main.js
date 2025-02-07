import { createApp } from 'vue';
import App from './App.vue';
import router from './routers/index';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import i18n from './i18n';
import VueApexCharts from 'vue3-apexcharts';
import store from './store/store';

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(VueApexCharts);
app.use(store);
app.mount('#app');
