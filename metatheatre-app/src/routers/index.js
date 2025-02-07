import { createRouter, createWebHistory } from "vue-router";
import MainView from "../views/MainView.vue";
import MovieListView from "../views/MovieListView.vue";
import MovieDetailView from "../views/MovieDetailView.vue";

const routes = [
  { path: "/", component: MainView, name: "Main" },
  { path: "/movies", component: MovieListView, name: "List" },
  { path: "/movie/:movieId", component: MovieDetailView, name: "Detail" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
