<template>
    <div class="mobile-container">
        <header class="header">
            <button @click="$router.go(-1)" class="back-button">⬅</button>
            <h1 class="title">결제하기</h1>
        </header>
        <MovieInfo :movie="movie" />
        <PaymentMethods @method-selected="setPaymentMethod" />
        <PaymentButton
            :price="price"
            :method="selectedMethod"
            :movie="movie"
            :playing-id="playingId"
            :ticket-type="ticketType"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import MovieInfo from "@/components/MovieInfo.vue";
import PaymentMethods from "@/components/PaymentMethods.vue";
import PaymentButton from "@/components/PaymentButton.vue";

const route = useRoute();

const movieId = ref(1);
const playingId = ref(1);
const seatName = ref("");
const youthCount = ref(0);
const adultCount = ref(0);
const seniorCount = ref(0);
const preferentialCount = ref(0);
const totalPrice = ref(0);

const movie = ref({
    id: null,
    title: "",
    date: "",
    theater: "",
    seat: "",
    userType: "",
    image: "",
});

const selectedMethod = ref("");
const price = ref(100);
const ticketType = ref("");

// API 호출 함수: playingId 기반으로 영화 정보를 가져옴
const fetchMovieInfo = async () => {
    console.log("fetchMovieInfo 함수 실행됨, playingId:", playingId.value);
    try {
        const response = await axios.get(`http://localhost:8080/ticket/playing/${playingId.value}`);
        const data = response.data;

        // movie 상태 업데이트
        movie.value = {
            id: playingId.value,
            title: data.krName,
            date: data.playingTime,
            theater: `${data.cinemaName} / ${data.screenName}`,
            seat: seatName.value, // 선택된 좌석 반영
            userType: userType.value, // 예매 유형 반영
            image: data.movieImg, // 이미지 URL이 없다면 기본 이미지 사용
        };
    } catch (error) {
        console.error("영화 정보를 불러오는 중 오류 발생:", error);
    }
};

// userType을 계산하여 문자열 변환
const userType = computed(() => {
    const types = [];
    if (adultCount.value > 0) types.push(`성인 ${adultCount.value}`);
    if (youthCount.value > 0) types.push(`청소년 ${youthCount.value}`);
    if (seniorCount.value > 0) types.push(`경로 ${seniorCount.value}`);
    if (preferentialCount.value > 0) types.push(`우대 ${preferentialCount.value}`);
    return types.join(", "); // 예: "성인 1, 청소년 1"
});

// 컴포넌트가 처음 마운트될 때 API 호출
onMounted(() => {
    console.log("컴포넌트 마운트됨, 라우터 params:", route.params);

    // URL 파라미터를 상태 변수에 저장
    movieId.value = Number(route.params.movieId) || 1;
    playingId.value = Number(route.params.playingId) || 1;
    seatName.value = route.params.seatName || "E3, E4";
    youthCount.value = Number(route.params.youthCount) || 0;
    adultCount.value = Number(route.params.adultCount) || 0;
    seniorCount.value = Number(route.params.seniorCount) || 0;
    preferentialCount.value = Number(route.params.preferentialCount) || 0;
    totalPrice.value = Number(route.params.totalPrice) || 0;

    // seat, userType 업데이트
    movie.value.seat = seatName.value;
    movie.value.userType = userType.value;

    // API 호출 (playingId가 존재할 때만)
    if (playingId.value) {
        fetchMovieInfo();
    }
});

const setPaymentMethod = (method) => {
    selectedMethod.value = method;
};
</script>

<style scoped>
.header {
    display: flex;
    align-items: center; /* 세로 중앙 정렬 */
    justify-content: center; /* 가로 중앙 정렬 */
    width: 100%;
    height: 55px;
    border-bottom: 1px solid #ddd;
    position: relative;
    padding: 0 16px;
}

.back-button {
    position: absolute;
    left: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    height: 100%; /* 버튼이 header 높이에 맞게 늘어남 */
    display: flex;
    align-items: center;
}

.title {
    font-size: 22px;
    text-align: center;
    height: 100%; /* 부모인 .header 높이에 맞춤 */
    display: flex;
    align-items: center; /* 세로 중앙 정렬 */
    justify-content: center; /* 가로 중앙 정렬 */
    flex-grow: 1;
}
</style>
