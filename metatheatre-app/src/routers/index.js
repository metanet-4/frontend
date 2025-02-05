import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import MovieTempPage from '../views/MovieTempPage.vue';
import MovieDetail from '../views/MovieDetail.vue'; // 상세 페이지 컴포넌트 추가

const routes = [
    { path: '/', component: MainPage },
    { path: '/movie', component: MovieTempPage },
    { path: '/movie/:movieId', component: MovieDetail, name: 'Detail' }, // 동적 라우트 추가
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
