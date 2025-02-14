import { createRouter, createWebHistory } from "vue-router";
import store from "../store/modules/modalStore";
import MainView from "../views/MainView.vue";
import MovieListView from "../views/MovieListView.vue";
import MovieDetailView from "../views/MovieDetailView.vue";
import MypageView from "../views/MypageView.vue";
import CinemaChoiceView from "../views/CinemaChoiceView.vue";
import ScreenChoiceView from "../views/ScreenChoiceView.vue";
import PaymentPage from "../views/PaymentPage.vue";
import ReservationDetail from "@/views/ReservationDetail.vue";
import SeatChoiceView from "@/views/SeatChoiceView.vue";
import SeatMap from "../components/SeatMap.vue";
import SearchMovieView from "../views/SearchMovieView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import AdminUsersView from "../views/AdminUsersView.vue";
import UpdateInfoView from "../views/UpdateInfoView.vue";
import DeleteAccountView from "../views/DeleteAccountView.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import MovieChoiceView from "../views/MovieChoiceView.vue";

const routes = [
    { path: "/", component: MainView, meta: { authRequired: false } },
    {
        path: "/movies",
        component: MovieListView,
        name: "List",
        meta: { authRequired: false },
    },
    {
        path: "/movie/:movieId",
        component: MovieDetailView,
        name: "Detail",
        meta: { authRequired: false },
    },
    {
        path: "/cinema/:movieId",
        component: CinemaChoiceView,
        name: "CinemaChoice",
        meta: { authRequired: false },
    },
    {
        path: "/mypage",
        component: MypageView,
        meta: { authRequired: true, requiredRole: "ROLE_USER" },
    },
    {
        path: "/movieList",
        component: MovieChoiceView,
        name: "MovieList",
        meta: { authRequired: false },
    },
    {
        path: "/screen?:cinemaId&:movieId",
        component: ScreenChoiceView,
        name: "ScreenChoiceView",
        meta: { authRequired: false },
    },
    {
        path: "/payment/:movieId/:playingId/:seatName/:youthCount/:adultCount/:seniorCount/:preferentialCount/:totalPrice",
        name: "PaymentPage",
        component: PaymentPage,
        meta: { authRequired: true, requiredRole: "ROLE_USER" },
    },
    {
        path: "/reservation/:reservationCode",
        component: ReservationDetail,
        props: true,
        meta: { authRequired: true, requiredRole: "ROLE_USER" },
    },
    {
        path: "/seats?:playingId&:screenId&:movieId",
        component: SeatChoiceView,
        name: "SeatChoiceView",
        meta: { authRequired: true, requiredRole: "ROLE_USER" },
    },
    { path: "/seatMap", component: SeatMap, meta: { authRequired: true, requiredRole: "ROLE_USER" } },
    {
        path: "/movie/search/:keyword",
        component: SearchMovieView,
        name: "SearchMovieView",
        meta: { authRequired: false },
    },
    { path: "/login", component: LoginView, meta: { authRequired: false } },
    { path: "/signup", component: SignupView, meta: { authRequired: false } },
    {
        path: "/admin/users",
        component: AdminUsersView,
        meta: { requiresAuth: true, requiredRole: "ROLE_ADMIN" },
    },
    {
        path: "/edit-profile",
        component: UpdateInfoView,
        meta: { authRequired: true, requiredRole: "ROLE_USER" },
    },
    {
        path: "/delete",
        component: DeleteAccountView,
        meta: { authRequired: true, requiredRole: "ROLE_USER" },
    },
    { path: "/error/403", component: ErrorPage, meta: { authRequired: false } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userRole = store.getters.user || null;
    if (to.meta.authRequired === false) {
        next();
        return;
    }
    if (to.meta.requiredRole) {
        if (userRole === to.meta.requiredRole) {
            next();
        } else {
            next("/error/403");
        }
    } else {
        next();
    }
});

export default router;
