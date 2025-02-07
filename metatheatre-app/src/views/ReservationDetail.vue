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
	</div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
// 1) qrcode 라이브러리 import
import QRCode from "qrcode";

export default {
	components: { NavBar },
	data() {
		return {
			watchGrade: "",
			krName: "",
			playingDate: 0, // epoch millisecond
			startTime: 0,   // epoch millisecond
			endTime: 0,     // epoch millisecond
			cinemaName: "",
			screenName: "",
			seatName: "",
			ticketType: "",
			reservationCode: "",
			qrUrl: "", // QR 코드 결과(base64) 저장할 곳
		};
	},

	computed: {
		// 라우트 파라미터에서 예매 ID 추출
		reservationId() {
			return this.$route.params.id;
		},

		// 예: 1739890800000 -> "2025.02.05"
		formattedPlayingDate() {
			return this.formatDate(this.playingDate);
		},
		// 예: 1738386000000 -> "14:00"
		formattedStartTime() {
			return this.formatTime(this.startTime);
		},
		// 예: 1738395000000 -> "16:30"
		formattedEndTime() {
			return this.formatTime(this.endTime);
		},
	},

	mounted() {
		this.loadReservation();
	},

	methods: {
		formatDate(epochMs) {
			if (!epochMs) return "";
			const date = new Date(epochMs);
			const y = date.getFullYear();
			const m = String(date.getMonth() + 1).padStart(2, "0");
			const d = String(date.getDate()).padStart(2, "0");
			return `${y}.${m}.${d}`;
		},
		formatTime(epochMs) {
			if (!epochMs) return "";
			const date = new Date(epochMs);
			const hh = String(date.getHours()).padStart(2, "0");
			const mm = String(date.getMinutes()).padStart(2, "0");
			return `${hh}:${mm}`;
		},

		async loadReservation() {
			try {
				// 2) 서버에서 예매 정보 가져오기
				const url = `http://localhost:8080/ticket/${this.reservationId}`;
				const response = await fetch(url, { credentials: "include" });
				if (!response.ok) {
					throw new Error("서버 에러 또는 예매 정보를 불러올 수 없습니다.");
				}

				const data = await response.json();

				// data를 컴포넌트에 저장
				this.watchGrade = data.watchGrade;
				this.krName = data.krName;
				this.playingDate = data.playingDate;
				this.startTime = data.startTime;
				this.endTime = data.endTime;
				this.cinemaName = data.cinemaName;
				this.screenName = data.screenName;
				this.seatName = data.seatName;
				this.ticketType = data.ticketType;
				this.reservationCode = data.reservationCode;

				// 3) QR 코드 생성
				//    여기서는 예매번호를 담고 싶다고 가정 -> 문자열로 변환
				const codeText = `ReservationCode: ${this.reservationCode}`;
				this.qrUrl = await QRCode.toDataURL(codeText, {
					width: 200, // QR 코드 이미지 크기
					margin: 2,  // 여백
				});

			} catch (err) {
				console.error("예매 상세 정보 로드 오류:", err);
				alert("예매 상세 정보를 불러오지 못했습니다.");
			}
		},
	},
};
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

</style>
