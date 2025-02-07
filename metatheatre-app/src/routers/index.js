import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import MovieListView from '../views/MovieListView.vue';
import MovieDetailView from '../views/MovieDetailView.vue';
import MypageView from '../views/MypageView.vue';
import CinemaChoiceView from '../views/CinemaChoiceView.vue';
import FileUpload from '../components/FileUpload.vue';
import ReservationDetailView from '../views/ReservationDetailView.vue';

const routes = [
    { path: '/', component: MainView },
    { path: '/movies', component: MovieListView, name: 'List' },
    { path: '/movie/:movieId', component: MovieDetailView, name: 'Detail' },
    { path: '/cinema', component: CinemaChoiceView },
    { path: '/mypage', component: MypageView },
    { path: '/fileupload', component: FileUpload },
    { path: '/reservation/:reservationCode', component: ReservationDetailView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
