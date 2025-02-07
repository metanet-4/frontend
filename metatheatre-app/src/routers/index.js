import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";
import MovieDetail from "../views/MovieDetail.vue"; // 상세 페이지 컴포넌트 추가
import CinemaChoice from "../views/CinemaChoice.vue";
import FileUpload from "../components/FileUpload.vue";

const routes = [
  { path: "/", component: MainPage },
  { path: "/movie/:movieId", component: MovieDetail, name: "Detail" }, // 동적 라우트 추가
  { path: "/cinema", component: CinemaChoice },
  { path: "/fileupload", component: FileUpload },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
