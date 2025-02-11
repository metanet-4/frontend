import { createRouter, createWebHistory } from "vue-router";
import MainView from "../views/MainView.vue";
import MovieListView from "../views/MovieListView.vue";
import MovieDetailView from "../views/MovieDetailView.vue";
import MypageView from "../views/MypageView.vue";
import CinemaChoiceView from "../views/CinemaChoiceView.vue";
import ScreenChoiceView from "../views/ScreenChoiceView.vue";
import PaymentPage from "../views/PaymentPage.vue"; // 결제 페이지 추가
import ReservationDetail from "@/views/ReservationDetail.vue"; // 예매 상세 페이지
import SeatChoiceView from "@/views/SeatChoiceView.vue";
import SeatMap from "../components/SeatMap.vue";
import SearchMovieView from "../views/SearchMovieView.vue";
import ProfileUpload from "../components/ProfileUpload.vue";
import CertificateUpload from "../components/CertificateUpload.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import AdminUsersView from "../views/AdminUsersView.vue";
import UpdateInfoView from "../views/UpdateInfoView.vue";
import DeleteAccountView from "../views/DeleteAccountView.vue";

const routes = [
  { path: "/", component: MainView },
  { path: "/movies", component: MovieListView, name: "List" },
  { path: "/movie/:movieId", component: MovieDetailView, name: "Detail" },
  { path: "/cinema", component: CinemaChoiceView },
  { path: "/mypage", component: MypageView },
  {
    path: "/screen?:cinemaId&:movieId",
    component: ScreenChoiceView,
    name: "ScreenChoiceView",
  },
  {
    path: "/payment/:movieId/:playingId/:seatName/:youthCount/:adultCount/:seniorCount/:preferentialCount/:totalPrice",
    name: "PaymentPage",
    component: PaymentPage
  },
  { path: "/reservation/:reservationCode", component: ReservationDetail, props: true }, // 예매 상세 페이지
  {
    path: "/seats?:playingId",
    component: SeatChoiceView,
    name: "SeatChoiceView",
  },
  { path: "/seatMap", component: SeatMap },
  {
    path: "/movie/search/:keyword",
    component: SearchMovieView,
    name: "SearchMovieView",
  },
  // 파일 업로드 페이지 보기 편하라고 링크 만들었어요 적용하면 지워도 돼요!
  { path: "/profileUpload", component: ProfileUpload },
  { path: "/certificateUpload", component: CertificateUpload },

  { path: "/login", component: LoginView },
  { path: "/signup", component: SignupView },
  { path: "/admin/users", component: AdminUsersView },
  { path: "/edit-profile", component: UpdateInfoView },
  { path: "/delete", component: DeleteAccountView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;