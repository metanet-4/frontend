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

const routes = [
    { path: '/', component: MainView },
    { path: '/movies', component: MovieListView, name: 'List' },
    { path: '/movie/:movieId', component: MovieDetailView, name: 'Detail' },
    { path: '/cinema', component: CinemaChoiceView },
    { path: '/mypage', component: MypageView },
    { path: '/fileupload', component: FileUpload },
    { path: '/screen?:cinemaId&:movieId', component: ScreenChoiceView, name: 'ScreenChoiceView' },
    { path: "/payment", component: PaymentPage },// 결제 페이지 추가
    { path: "/reservation/:id", component: ReservationDetail, props: true }, // 동적 파라미터 추가
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
