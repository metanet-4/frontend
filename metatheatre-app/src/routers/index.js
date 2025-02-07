import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import MovieTempView from '../views/MovieTempView.vue';
import MovieDetailView from '../views/MovieDetailView.vue';
import MypageView from '../views/MypageView.vue';

const routes = [
    { path: '/', component: MainView },
    { path: '/movie', component: MovieTempView },
    { path: '/movie/:movieId', component: MovieDetailView, name: 'Detail' },
    { path: '/mypage', component: MypageView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
