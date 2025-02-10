import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import MovieListView from '../views/MovieListView.vue';
import MovieDetailView from '../views/MovieDetailView.vue';
import MypageView from '../views/MypageView.vue';
import CinemaChoiceView from '../views/CinemaChoiceView.vue';
import ScreenChoiceView from '../views/ScreenChoiceView.vue';
import FileUpload from '../components/FileUpload.vue';
import PaymentPage from "../views/PaymentPage.vue"; // 결제 페이지 추가
import ReservationDetail from "@/views/ReservationDetail.vue"; // 예매 상세 페이지
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import UpdateInfo from "@/views/UpdateInfo.vue";
import Delete from "@/views/Delete.vue";
import AdminUsers from "@/views/AdminUsers.vue";

const routes = [
    { path: '/', component: MainView },
    { path: '/movies', component: MovieListView, name: 'List' },
    { path: '/movie/:movieId', component: MovieDetailView, name: 'Detail' },
    { path: '/cinema', component: CinemaChoiceView },
    { path: '/mypage', component: MypageView },
    { path: '/fileupload', component: FileUpload },
    { path: '/screen?:cinemaId&:movieId', component: ScreenChoiceView, name: 'ScreenChoiceView' },
    { path: "/payment", component: PaymentPage },// 결제 페이지 추가
    { path: "/reservation/:id", component: ReservationDetail, props: true }, // 예매 상세 페이지
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/mypage/update", component: UpdateInfo },
    { path: "/mypage/delete", component: Delete },
    { path: "/admin/user-management", component: AdminUsers },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
