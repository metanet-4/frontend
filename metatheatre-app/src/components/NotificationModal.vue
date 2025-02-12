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
