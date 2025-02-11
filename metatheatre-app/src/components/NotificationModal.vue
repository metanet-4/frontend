<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h3 class="alarm-title">알림 목록</h3>
            <ul>
                <!-- store의 alarmList를 사용 -->
                <li v-for="(alarm, index) in alarmList" :key="index">
                    <!-- alarm이 객체라면 alarm.message, 혹은 단순 문자열이면 그대로 사용 -->
                    {{ alarm.message || alarm }}
                </li>
            </ul>
            <button @click="closeModal" class="close-button">X</button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Vuex에서 알림 목록을 가져옴
const alarmList = computed(() => store.state.alarmList);

// 모달 닫기 함수 (스토어의 closeModal 뮤테이션 호출)
const closeModal = () => {
    store.commit('closeModal');
};

// 웹소켓 연결 관련
const socket = ref(null);

const connectWebSocket = () => {
    // 웹소켓 엔드포인트 (서버 주소에 맞게 변경)
    socket.value = new WebSocket('ws://localhost:8080/ws');

    socket.value.onopen = (event) => {
        console.log('WebSocket 연결 성공:', event);
    };

    socket.value.onmessage = (event) => {
        console.log('수신된 메시지:', event.data);
        let data;
        try {
            data = event.data;
        } catch (error) {
            console.error('메시지 파싱 에러:', error.message);
            // 파싱 실패 시 평문 메시지를 객체로 감싸서 처리
            data = { message: event.data };
        }
        // Vuex 스토어의 alarmList에 추가
        store.commit('addAlarm', data);
    };

    socket.value.onerror = (error) => {
        console.error('WebSocket 에러 발생:', error);
    };

    socket.value.onclose = (event) => {
        console.log('WebSocket 연결 종료:', event);
    };
};

onMounted(() => {
    connectWebSocket();
});

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.close();
    }
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    /* 필요에 따라 center 정렬 조정 */
    align-items: center;
    z-index: 1000;
}

.modal-content {
    width: 400px;
    height: 800px;
    max-width: 80%;
    max-height: 80%;
    background: #fff;
    padding: 40px;
    border-radius: 10px;
    overflow-y: auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.alarm-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
}
</style>
