<template>
    <div class="screen-selection-page">
        <!-- 상단 헤더 -->
        <header class="header">
            <h1>상영관 선택</h1>
            <hr />
        </header>

        <!-- 날짜 선택 영역 -->
        <div class="date-container">
            <ul>
                <li v-for="(day, index) in days" :key="day.fullDate" :class="{
                    active: selectedDayIndex === index,
                    saturday: day.dayName === '토',
                    sunday: day.dayName === '일',
                }" @click="selectDay(index)">
                    <span class="date-number">{{ day.date }}</span>
                    <span class="date-day">{{ day.dayName }}</span>
                </li>
            </ul>
        </div>
        <!-- 해당 날짜에 대한 상영 정보 -->
        <div class="schedule-container">
            <div v-for="theater in currentDaySchedule.theaters" :key="theater.name" class="theater-block">
                <h2><span class="star-icon">★</span> {{ theater.name }}</h2>

                <div v-for="screen in theater.screens" :key="screen.screenNo" class="screen-info">
                    <!-- 상단 줄: 예) '1관' / 'IMAX' -->
                    <div class="screen-top-row">
                        <div class="screen-title">{{ screen.screenNo }}</div>
                        <div class="format-info">{{ screen.format }}</div>
                    </div>

                    <!-- 시간 버튼들 (가로 스크롤) -->
                    <div class="time-buttons">
                        <button v-for="timeSlot in screen.timeSlots" :key="timeSlot.start" class="time-button"
                            :disabled="timeSlot.availableSeats === 0" @click="goToNextPage(timeSlot)">
                            <div class="time-range">
                                {{ timeSlot.start }}
                                <p></p>
                                ~ {{ timeSlot.end }}
                            </div>
                            <div class="seat-info">
                                {{ timeSlot.seats }}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import api from "@/api";

const store = useStore();

const role = computed(() => store.getters.user || null);
// 날짜별 버튼과 스케줄 데이터를 저장할 변수
const days = ref([]);
const schedules = ref([]);

// 선택된 날짜 인덱스와 현재 날짜에 해당하는 스케줄
const selectedDayIndex = ref(0);
const currentDaySchedule = computed(() => schedules.value[selectedDayIndex.value] || { theaters: [] });

const route = useRoute();
const router = useRouter();

// API 데이터를 받아와서 기존 형식으로 가공하는 함수
async function fetchSchedules() {
    const cinemaId = route.params.cinemaId;
    const movieId = route.params.movieId;

    try {
        const response = await api.get(
            `/ticket/screen?cinemaId=${cinemaId}&movieId=${movieId}`,
            {
                withCredentials: true,
            }
        );
        console.log(response.data);
        const data = response.data;

        let screenings = [];
        for (const key in data) {
            screenings = screenings.concat(data[key]);
        }

        const scheduleByDate = {};
        screenings.forEach((item) => {
            const date = item.playingDate;
            if (!scheduleByDate[date]) {
                scheduleByDate[date] = [];
            }
            scheduleByDate[date].push(item);
        });

        // 상영일자를 기준으로 정렬
        const sortedDates = Object.keys(scheduleByDate).sort((a, b) => new Date(a) - new Date(b));

        // 날짜 선택 버튼용 days 배열 생성 (날짜와 요일 표시)
        days.value = sortedDates.map((dateStr) => {
            const dateObj = new Date(dateStr);
            const day = dateObj.getDate();
            const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];
            const dayName = weekDayNames[dateObj.getDay()];
            return { date: day, dayName, fullDate: dateStr };
        });

        // 각 날짜별 스케줄을 기존 형식으로 가공
        schedules.value = sortedDates.map((dateStr) => {
            const items = scheduleByDate[dateStr];
            const theatersMap = {};
            items.forEach((item) => {
                const theaterName = item.cinemaName;
                if (!theatersMap[theaterName]) {
                    theatersMap[theaterName] = {};
                }
                // 스크린 별 그룹화 (screenId를 기준으로)
                const screenKey = item.screenId;
                if (!theatersMap[theaterName][screenKey]) {
                    theatersMap[theaterName][screenKey] = {
                        screenNo: item.screenName,
                        format: item.type,
                        timeSlots: [],
                    };
                }
                // 시간 정보와 좌석 정보를 추가
                theatersMap[theaterName][screenKey].timeSlots.push({
                    start: item.startTime.substring(11, 16), // HH:mm 형식으로 자름
                    end: item.endTime.substring(11, 16),
                    seats: `${item.capacity - item.reservedSeat}/${item.capacity}`,
                    playingId: item.playingId,
                    movieId: item.movieId,
                    screenId: item.screenId,
                    availableSeats: item.capacity - item.reservedSeat,
                });
            });

            // 각 영화관 내 각 스크린의 timeSlots 배열을 start 시간을 기준으로 정렬
            const theaters = Object.keys(theatersMap).map((theaterName) => {
                return {
                    name: theaterName,
                    screens: Object.values(theatersMap[theaterName]).map((screen) => {
                        screen.timeSlots.sort((a, b) => a.start.localeCompare(b.start));
                        return screen;
                    }),
                };
            });

            return { theaters };
        });
    } catch (error) {
        console.error("스케줄 데이터를 불러오는데 실패했습니다.", error);
    }
}

// 날짜 선택 시 호출되는 함수
function selectDay(index) {
    selectedDayIndex.value = index;
}

// 시간 버튼 클릭 시 다음 페이지로 이동
function goToNextPage(timeSlot) {
    Swal.fire({
        icon: "info",
        title: "확인 창.",
        text: `${timeSlot.start} ~ ${timeSlot.end} 시간대를\n 선택하셨습니다.`,
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        confirmButtonColor: "#429f50",
        cancelButtonColor: "#d33",
    }).then((result) => {
        if (result.isConfirmed) {
            if (role.value === "ROLE_USER") {
                router.push({
                    name: "SeatChoiceView",
                    params: {
                        playingId: timeSlot.playingId,
                        screenId: timeSlot.screenId,
                        movieId: route.params.movieId,
                    },
                });
            } else {
                router.push({ path: "/login" });
            }
        }
    });
}

onMounted(() => {
    fetchSchedules();
});
</script>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.screen-selection-page {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    font-family: sans-serif;
    padding: 20px;
}

/* 상단 헤더 */
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

/* 날짜 선택 */
.date-container {
    margin-top: 20px;
}

.date-container ul {
    display: flex;
    gap: 10px;
    list-style: none;
    margin: 10px;
    /* justify-content: center; */
}

.date-container li {
    width: 40px;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
    background-color: #f9f9f9;
    padding: 6px 0;
}

.date-container li.active {
    background-color: #c1c1c1;
    color: #fff;
}

.date-container .date-number {
    font-size: 1rem;
    font-weight: bold;
}

.date-container .date-day {
    font-size: 0.8rem;
    display: block;
    margin-top: 2px;
}

/* 스케줄 정보 */
.schedule-container {
    margin-top: 30px;
    padding: 0 10px;
}

.theater-block {
    margin-bottom: 30px;
}

.theater-block h2 {
    font-size: 1rem;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.star-icon {
    color: #ffbb00;
    margin-right: 4px;
}

/* 상영관 및 시간 슬롯 */
.screen-info {
    margin-bottom: 15px;
}

.screen-top-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.screen-title {
    font-weight: bold;
}

.format-info {
    color: #888;
    font-size: 0.9rem;
}

/* 시간 버튼 (가로 스크롤) */
.time-buttons {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0px;
    -webkit-overflow-scrolling: touch;
}

.time-button {
    flex: 0 0 auto;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
}

.time-button:hover {
    background-color: #dde3ff;
}

.time-button:disabled {
    background-color: #eee;
    color: #aaa;
    cursor: not-allowed;
    opacity: 0.6;
}

/* 토요일: 파란색 글씨 */
.date-container li.saturday .date-number,
.date-container li.saturday .date-day {
    color: blue;
}

/* 일요일: 빨간색 글씨 */
.date-container li.sunday .date-number,
.date-container li.sunday .date-day {
    color: red;
}

.time-range {
    font-size: 0.9rem;
    margin-bottom: 4px;
}

.seat-info {
    font-size: 0.8rem;
    color: #333;
}

/* 반응형 (모바일) */
@media (max-width: 768px) {
    .date-container li {
        width: 36px;
        padding: 5px 0;
    }

    .schedule-container {
        padding: 0;
    }
}
</style>
