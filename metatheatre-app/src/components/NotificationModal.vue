<template>
    <!-- 모달이 열려 있고, 모달 타입이 'alarm'일 때만 표시 -->
    <div v-if="isModalVisible && modalType === 'alarm'" class="modal-overlay-style">
        <div class="modal-content">
            <header class="modal-header">
                <h2>알람 목록</h2>
                <button class="close-button" @click="closeModal">X</button>
            </header>
            <section class="modal-body">
                <!-- 알람 목록 출력 -->
                <ul>
                    <li v-for="(alarm, index) in alarmList" :key="index">
                        {{ alarm.message }}
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const isModalVisible = computed(() => store.state.isModalVisible);
const modalType = computed(() => store.state.modalType);
const alarmList = computed(() => store.state.alarmList);
// 모달 닫기 함수 (스토어에 closeModal 뮤테이션이 있다고 가정)
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
/* 모달 스타일 예제 */
.modal-overlay-style {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 390px;
    height: 100%;
    transform: translate(-50%, -50%);
    justify-content: center;

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
