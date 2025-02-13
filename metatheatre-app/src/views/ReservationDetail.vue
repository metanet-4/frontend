<template>
    <NavBar />
    <div class="reservation-detail">
        <!-- "온라인 티켓" 제목 -->
        <p class="ticket-title">온라인 티켓</p>

        <!-- QR 코드 -->
        <div class="qr-container">
            <img :src="qrUrl" alt="QR Code" class="qr-image" />
        </div>

        <!-- 예매 정보 -->
        <ul class="ticket-info">
            <li>
                <img v-if="watchGradeImg" :src="watchGradeImg" alt="관람 등급" class="watch-grade-image" />
                <span class="movie-title">{{ krName }}</span>
            </li>
            <li>상영 시간 {{ formattedPlayingDate }} ({{ formattedStartTime }} ~ {{ formattedEndTime }})</li>
            <li>상영관 {{ cinemaName }}/{{ screenName }}</li>
            <li>좌석 {{ seatName }} ({{ ticketType }})</li>
            <li>예매 번호 {{ reservationCode }}</li>
        </ul>

        <!-- 예매 취소 버튼 -->
        <button class="cancel-button" @click="cancelReservation">예매 취소하기</button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import QRCode from "qrcode";
import Swal from "sweetalert2";
import NavBar from "../components/NavBar.vue";

import allImg from "../assets/all.png";
import age12Img from "../assets/12.png";
import age15Img from "../assets/15.png";

defineProps({
    reservationCode: String,
});

const route = useRoute();
const router = useRouter();

const reservationCode = ref(route.params.reservationCode);

const watchGrade = ref("");
const krName = ref("");
const playingDate = ref(0);
const startTime = ref(0);
const endTime = ref(0);
const cinemaName = ref("");
const screenName = ref("");
const seatName = ref("");
const ticketType = ref("");
const qrUrl = ref("");

const watchGradeImg = computed(() => {
    if (watchGrade.value === "전체관람가") return allImg;
    if (watchGrade.value === "12세이상관람가") return age12Img;
    if (watchGrade.value === "15세이상관람가") return age15Img;
    return "";
});

const formattedPlayingDate = computed(() => formatDate(playingDate.value));
const formattedStartTime = computed(() => formatTime(startTime.value));
const formattedEndTime = computed(() => formatTime(endTime.value));

function formatDate(epochMs) {
    if (!epochMs) return "";
    const date = new Date(epochMs);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
}

function formatTime(epochMs) {
    if (!epochMs) return "";
    const date = new Date(epochMs);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}

async function loadReservation() {
    try {
        const url = `http://localhost:8080/ticket/${reservationCode.value}`;
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
            throw new Error("서버 에러 또는 예매 정보를 불러올 수 없습니다.");
        }

        const data = await response.json();
        watchGrade.value = data.watchGrade;
        krName.value = data.krName;
        playingDate.value = data.playingDate;
        startTime.value = data.startTime;
        endTime.value = data.endTime;
        cinemaName.value = data.cinemaName;
        screenName.value = data.screenName;
        seatName.value = data.seatList.map((seat) => seat.name).join(", ");
        ticketType.value = data.ticketType;

        const codeText = `ReservationCode: ${reservationCode.value}`;
        qrUrl.value = await QRCode.toDataURL(codeText, {
            width: 180,
            margin: 1,
        });
    } catch (err) {
        console.error("예매 상세 정보 로드 오류:", err);
    }
}

async function cancelReservation() {
    const result = await Swal.fire({
        title: "정말 예매를 취소하시겠습니까?",
        text: "예매 취소 후에는 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "네, 취소합니다",
        cancelButtonText: "아니요",
    });

    if (!result.isConfirmed) return;

    try {
        const url = `http://localhost:8080/ticket/${reservationCode.value}/cancel`;
        const response = await fetch(url, {
            method: "PATCH",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("예매 취소에 실패했습니다.");
        }

        router.push(`/mypage`);
    } catch (err) {
        console.error("예매 취소 오류:", err);
        Swal.fire({
            title: "오류 발생",
            text: "예매 취소 중 문제가 발생했습니다.",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "확인",
        });
    }
}

onMounted(loadReservation);
</script>

<style scoped>
.reservation-detail {
    width: 100%;
    max-width: 390px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    margin-top: 120px;
    background-color: #fff;
    text-align: center;
}

/* "온라인 티켓" 스타일 */
.ticket-title {
    font-size: 22px;
    font-weight: bold;
    color: #1f4bc1;
    margin-bottom: 16px;
    border-bottom: 2px solid #1f4bc1;
    display: inline-block;
    padding-bottom: 4px;
}

.qr-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
}

.qr-image {
    width: 220px;
    height: 220px;
    object-fit: cover;
}

.ticket-info {
    list-style-type: none;
    padding: 0;
    margin-top: 10px;
    line-height: 1.6;
    font-size: 14px;
    color: #333;
    text-align: left;
}

.ticket-info li {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}

.watch-grade-image {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.movie-title {
    font-size: 16px;
    font-weight: bold;
    color: #1f1f1f;
}

.cancel-button {
    width: 100%;
    background-color: #281b7a;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
}

.cancel-button:hover {
    background-color: #2b2bb2;
}
</style>
