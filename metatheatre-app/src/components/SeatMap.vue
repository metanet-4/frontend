<template>
    <div class="seat-map-container">
        <div class="screen-box">SCREEN</div>

        <!-- 좌석 100개 (A1 ~ J10) -->
        <div class="seat-grid">
            <button
                v-for="seat in seats"
                :key="seat.id"
                class="seat-button"
                :class="{
                    selected: selectedSeatIds.includes(seat.id),
                    unavailable: isUnavailable(seat.id),
                }"
                :disabled="isUnavailable(seat.id) && !isAlreadySelected(seat.id)"
                @click="toggleSeat(seat)"
            >
                <!-- 사용 불가 좌석이면 텍스트 표시 X -->
                <span v-if="!isUnavailable(seat.id)">
                    {{ seat.label }}
                </span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    totalPersons: {
        type: Number,
        default: 0,
    },
    unavailableSeats: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(["update:modelValue"]);

const seats = ref([]);
const selectedSeatIds = ref([...props.modelValue]); // 초기값 복사 (v-model)

onMounted(() => {
    generateSeats();
});

// (1) 좌석 생성
function generateSeats() {
    const rows = "ABCDEFGHIJ"; // 10행
    const cols = 10; // 10열
    const temp = [];
    for (let r = 0; r < rows.length; r++) {
        for (let c = 1; c <= cols; c++) {
            const seatLabel = rows[r] + c; // A1, A2 ...
            temp.push({ id: seatLabel, label: seatLabel });
        }
    }
    seats.value = temp;
}

// (2) 이미 예약된 좌석인지
function isUnavailable(seatId) {
    return props.unavailableSeats.includes(seatId);
}

// (3) 이미 선택된 좌석인지
function isAlreadySelected(seatId) {
    return selectedSeatIds.value.includes(seatId);
}

// (4) 좌석 클릭 (토글)
function toggleSeat(seat) {
    // (4-1) 먼저, 이 좌석이 "이미 선택된 좌석"이면 -> 해제(취소) 가능
    const idx = selectedSeatIds.value.indexOf(seat.id);
    if (props.totalPersons === 0) {
        alert("인원을 선택해주세요.");
        return;
    }
    if (idx >= 0) {
        selectedSeatIds.value.splice(idx, 1);
        emit("update:modelValue", [...selectedSeatIds.value]);
        return;
    }

    // (4-2) 아직 선택 안 된 좌석이면:
    if (isUnavailable(seat.id)) {
        return;
    }

    // (4-3) 이미 인원 수만큼 다 선택했으면 추가 선택 불가
    if (selectedSeatIds.value.length >= props.totalPersons && props.totalPersons > 0) {
        alert("좌석이 모두 선택되었습니다.");
        return;
    }

    // (4-4) 새로 선택
    selectedSeatIds.value.push(seat.id);
    emit("update:modelValue", [...selectedSeatIds.value]);
}
</script>

<style scoped>
.seat-map-container {
    text-align: center;
}

.screen-box {
    width: 100%;
    max-width: 300px;
    margin: 0 50px 10px;
    background-color: #ccc;
    padding: 10px;
    font-weight: bold;
    border-radius: 4px;
}

/* 좌석 그리드 (10 × 10) */
.seat-grid {
    display: grid;
    grid-template-columns: repeat(10, 35px);
    margin-left: 100px;
    gap: 8px;
    justify-content: center;
}

/* 기본 좌석 버튼 */
.seat-button {
    width: 35px;
    height: 35px;
    background-color: #444;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

/* hover 시 약간 밝게 */
.seat-button:hover {
    background-color: #555;
}

/* 선택된 좌석 (파란색) */
.seat-button.selected {
    background-color: #4255ff;
}

/* 이미 예약된(사용 불가) 좌석 (검정) */
.seat-button.unavailable {
    background-color: black;
}

.seat-button.unavailable:hover {
    background-color: black;
}
</style>
