<template>
	<NavBar />
	<div class="reservation-detail">
		<!-- 맨 위 작은 글씨: "온라인 티켓" -->
		<p class="online-ticket-title">온라인 티켓</p>

		<!-- QR 코드 (크게 표시) -->
		<img :src="qrUrl" alt="QR Code" class="qr-image" />

		<!-- 예매 정보 -->
		<ul class="ticket-info">
			<li>{{ watchGrade }} {{ krName }}</li>
			<li>
				상영시간
				{{ formattedPlayingDate }}
				({{ formattedStartTime }} ~ {{ formattedEndTime }})
			</li>
			<li>
				상영관 {{ cinemaName }}/{{ screenName }}
			</li>
			<li>
				좌석 {{ seatName }} ({{ ticketType }})
			</li>
			<li>
				예매번호 {{ reservationCode }}
			</li>
		</ul>

		<!-- 예매 취소 버튼 -->
		<button class="cancel-button" @click="cancelReservation">예매 취소하기</button>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import NavBar from "../components/NavBar.vue";

const route = useRoute();
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
		seatName.value = data.seatName;
		ticketType.value = data.ticketType;
		reservationCode.value = data.reservationCode;

		const codeText = `ReservationCode: ${reservationCode.value}`;
		qrUrl.value = await QRCode.toDataURL(codeText, { width: 200, margin: 2 });
	} catch (err) {
		console.error("예매 상세 정보 로드 오류:", err);
		alert("예매 상세 정보를 불러오지 못했습니다.");
	}
}

async function cancelReservation() {
	if (!confirm("정말 예매를 취소하시겠습니까?")) return;

	try {
		const url = `http://localhost:8080/ticket/${reservationCode.value}/cancel`;
		console.log("예매 취소 URL:", url);
		const response = await fetch(url, { method: "PATCH", credentials: "include" });
		if (!response.ok) {
			throw new Error("예매 취소에 실패했습니다.");
		}
		alert("예매가 취소되었습니다.");
	} catch (err) {
		console.error("예매 취소 오류:", err);
		alert("예매 취소 중 오류가 발생했습니다.");
	}
}

onMounted(loadReservation);
</script>

<style scoped>
.online-ticket-title {
	font-size: 14px;
	color: #666;
	margin-bottom: 10px;
}

.qr-image {
	width: 200px;
	height: 200px;
	object-fit: cover;
	margin-bottom: 20px;
}

.ticket-info {
	list-style-type: none;
	padding-left: 0;
	line-height: 1.6;
}

.ticket-info li {
	margin-bottom: 8px;
}

.reservation-detail {
	width: 100%;
	max-width: 390px;
	margin: 0 auto;
	padding: 16px;
	position: relative;
	top: 125px;
}

.cancel-button {
	width: 100%;
	background-color: #281B7A;
	color: white;
	padding: 12px;
	border: none;
	border-radius: 8px;
	font-size: 16px;
	cursor: pointer;
	margin-top: 20px;
}

.cancel-button:hover {
	background-color: #2b2bb2;
}
</style>