<template>
    <div class="seat-choice-view">
        <header class="header">
            <h1>좌석 선택</h1>
            <hr />
        </header>
        <!-- 상단: 영화 정보 (등급 + 제목) -->
        <div class="movie-info">
            <h2>
                <img :src="watchGradeImg" alt="관람등급" class="grade-icon" v-if="watchGradeImg" />
                {{ movieTitle }}
            </h2>
            <p>{{ formattedStartTime }}</p>
            <p>{{ cinemaInfo }}</p>
        </div>

        <!-- 좌석 맵 (스크롤 영역) -->
        <div class="seat-scroll-wrapper">
            <SeatMap v-model="selectedSeats" :total-persons="totalPersons" :unavailable-seats="unavailableSeats" />
        </div>

        <!-- 인원 선택 -->
        <div class="people-container">
            <div class="people-row">
                <label>청소년</label>
                <div class="count-container">
                    <button class="people-button" @click="decrement('youth')">-</button>
                    <span class="count-text">{{ youthCount }}</span>
                    <button class="people-button" @click="increment('youth')">+</button>
                </div>
            </div>
            <div class="people-row">
                <label>성인</label>
                <div class="count-container">
                    <button class="people-button" @click="decrement('adult')">-</button>
                    <span class="count-text">{{ adultCount }}</span>
                    <button class="people-button" @click="increment('adult')">+</button>
                </div>
            </div>
        </div>
        <div class="people-container">
            <div class="people-row">
                <label>우&nbsp;&nbsp;대&nbsp;</label>
                <div class="count-container">
                    <button class="people-button" @click="decrement('preferential')">-</button>
                    <span class="count-text">{{ preferentialCount }}</span>
                    <button class="people-button" @click="increment('preferential')">+</button>
                </div>
            </div>
            <div class="people-row">
                <label> 경로</label>
                <div class="count-container">
                    <button class="people-button" @click="decrement('senior')">-</button>
                    <span class="count-text">{{ seniorCount }}</span>
                    <button class="people-button" @click="increment('senior')">+</button>
                </div>
            </div>
        </div>
        <!-- 총 가격 표시 -->
        <div class="total-price">{{ totalPrice }}원</div>

        <!-- 예매하기 버튼 -->
        <button class="reserve-button" :disabled="!canReserve" @click="reserveTickets">예매하기</button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import SeatMap from "../components/SeatMap.vue";
import allImg from "../assets/all.png";
import age12Img from "../assets/12.png";
import age15Img from "../assets/15.png";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import api from "@/api";

const route = useRoute();
const router = useRouter();

const watchGradeImg = computed(() => {
    if (watchGrade.value === "전체관람가") return allImg;
    if (watchGrade.value === "12세이상관람가") return age12Img;
    if (watchGrade.value === "15세이상관람가") return age15Img;
    return "";
});

const selectedSeats = ref([]); // v-model (선택된 좌석)
const unavailableSeats = ref([]); // 이미 예약된 좌석 목록
const youthCount = ref(0);
const adultCount = ref(0);
const seniorCount = ref(0);
const preferentialCount = ref(0);

// 영화 정보
const movieTitle = ref("");
const watchGrade = ref("");
const startTimeRaw = ref("");
const cinemaInfo = ref("");
const playingId = ref();
const movieId = ref("");
const screenId = ref();
const seatName = ref("");

async function fetchSeats() {
    playingId.value = route.params.playingId;
    screenId.value = route.params.screenId;
    movieId.value = route.params.movieId;
    try {
        const response = await api.get(`/ticket/seats?playingId=${playingId.value}`, {
            withCredentials: true,
        });
        const data = response.data;

        // 1) 예약된 좌석 목록
        unavailableSeats.value = data.map((item) => item.name);

        // 2) 영화 정보 (첫 번째 항목 기준)
        if (data.length > 0) {
            const first = data[0];
            movieTitle.value = first.krName;
            watchGrade.value = first.watchGrade;
            startTimeRaw.value = first.startTime;
            cinemaInfo.value = `${first.cinemaName} ${first.screenName} (${first.type})`.trim();
        }
    } catch (error) {
        // console.error(error)
    }
}


onMounted(() => {
    fetchSeats();
});

function increment(type) {
    if (type === "youth") {
        youthCount.value++;
    } else if (type === "adult") {
        adultCount.value++;
    } else if (type === "senior") {
        seniorCount.value++;
    } else if (type === "preferential") {
        preferentialCount.value++;
    }
}
function decrement(type) {
    if (type === "youth" && youthCount.value > 0) {
        youthCount.value--;
    } else if (type === "adult" && adultCount.value > 0) {
        adultCount.value--;
    } else if (type === "senior" && seniorCount.value > 0) {
        seniorCount.value--;
    } else if (type === "preferential" && preferentialCount.value > 0) {
        preferentialCount.value--;
    }
}

const totalPersons = computed(() => youthCount.value + adultCount.value + seniorCount.value + preferentialCount.value);
const totalPrice = computed(() => {
    // 청소년: 10000원, 성인: 12000원
    return (
        youthCount.value * 10000 + adultCount.value * 12000 + seniorCount.value * 7000 + preferentialCount.value * 5000
    );
});

const formattedStartTime = computed(() => {
    if (!startTimeRaw.value) return "";
    const d = new Date(startTimeRaw.value);
    if (isNaN(d.getTime())) return startTimeRaw.value;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} (${hh}:${min})`;
});

const canReserve = computed(() => {
    return selectedSeats.value.length === totalPersons.value && totalPersons.value > 0;
});

// 예매하기
function reserveTickets() {
    router.push({
        name: "PaymentPage",
        params: {
            movieId: movieId.value,
            playingId: playingId.value,
            seatName: selectedSeats.value.join(", "),
            youthCount: youthCount.value,
            adultCount: adultCount.value,
            seniorCount: seniorCount.value,
            preferentialCount: preferentialCount.value,
            totalPrice: totalPrice.value,
        },
    });
}
</script>

<style scoped>
.header {
    text-align: center;
}

.header h1 {
    font-size: 1.4rem;
    margin-bottom: 10px;
    font-weight: bold;
}

.header hr {
    border: none;
    border-top: 1px solid #ccc;
}

.grade-icon {
    width: 20px;
    height: auto;
    vertical-align: middle;
    margin-right: 4px;
}

.seat-choice-view {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
}

.movie-info {
    margin-bottom: 20px;
}

.seat-scroll-wrapper {
    max-height: 300px;
    /* 스크롤 한도 */
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 20px;
}

/* 인원 선택 */
.people-container {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 20px;
}

.people-row {
    display: flex;
    align-items: center;
    gap: 5px;
}

.count-text {
    width: 20px;
    text-align: center;
    font-weight: bold;
    margin: 0 10px;
}

/* 총 가격 */
.total-price {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 20px;
}

/* 예매하기 버튼 */
.reserve-button {
    background-color: #002060;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 12px 20px;
    font-size: 1rem;
    cursor: pointer;
}

.reserve-button:disabled {
    background-color: #999;
    cursor: not-allowed;
}

.people-button {
    background: none;
    border: none;
    font-size: 18px;
}

.count-container {
    border: 1px solid;
    border-radius: 10px;
    padding: 0 7px;
    margin-left: 10px;
}
</style>
