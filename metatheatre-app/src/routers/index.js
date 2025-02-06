import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";
import MovieListPage from "../views/MovieListPage.vue";

const routes = [
  { path: "/", component: MainPage },
  { path: "/movie-list", component: MovieListPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
