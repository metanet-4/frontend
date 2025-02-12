<template>
    <nav class="nav-bar">
        <!-- 상단: 로고 + 아이콘 그룹(하트, 벨) -->
        <div class="nav-top">
            <BackButton />
            <router-link to="/">
                <img :src="logo" alt="로고 이미지" class="logo" />
            </router-link>
            <div class="icon-group">
                <!-- 좋아요 리스트 열기 (기존 기능) -->
                <button @click="openLikeList" class="icon-button">
                    <i class="bi bi-heart-fill"></i>
                </button>

                <!-- 알림 기능 버튼 (새로 추가) -->
                <button @click="openAlarmList" class="icon-button">
                    <i class="bi bi-bell"></i>
                </button>
            </div>
        </div>

        <!-- 검색창 영역 -->
        <div class="search-box">
            <input
                v-model="keyword"
                type="text"
                placeholder="검색어를 입력하세요."
                @keyup.enter="searchMovie"
            />
            <button @click="searchMovie" class="icon-button">
                <img
                    src="@/assets/search-icon.png"
                    alt="검색 아이콘"
                    class="search-icon"
                />
            </button>
        </div>
    </nav>
    <!-- 좋아요 목록 모달 (기존) -->
    <Modal v-if="modalType === 'like'" @close="closeModal" />
    <NotificationModal v-if="modalType === 'alarm'" @close="closeModal" />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import logo from "@/assets/logo.png";
import Modal from "./LikeModal.vue";
import NotificationModal from "./NotificationModal.vue";
import { EventBus } from "../services/EventBus";
import ws from "../services/WebSocketService";
import BackButton from "./BackButton.vue";

const messages = ref([]);

const handleWsMessage = (message) => {
    messages.value.push(message);
};

onMounted(() => {
    // 컴포넌트가 마운트되면 이벤트 버스에 구독합니다.
    EventBus.on("ws-message", handleWsMessage);
});

onBeforeUnmount(() => {
    // 컴포넌트가 파괴되기 전에 구독을 해제합니다.
    EventBus.off("ws-message", handleWsMessage);
});

const store = useStore();
const router = useRouter();

// 검색어 상태
const keyword = ref("");

// Vuex 상태 가져오기
const modalType = computed(() => store.state.modalType);

// 좋아요 모달 열기
const openLikeList = async () => {
    await store.dispatch("fetchLikeList");
    store.commit("setModalType", "like");
    store.commit("openModal");
};

// 알림 모달 열기
const openAlarmList = async () => {
    await store.dispatch("fetchAlarmList");
    console.log("Opening alarm modal...");
    store.commit("setModalType", "alarm");
    store.commit("openModal");
    console.log("Current modal type:", store.state.modalType);
};

// 모달 닫기
const closeModal = () => {
    store.commit("closeModal");
};

// 검색 기능
const searchMovie = () => {
    if (keyword.value.trim() !== "") {
        router.push({
            name: "SearchMovieView",
            params: { keyword: keyword.value },
        });
    }
};
</script>

<style scoped>
.nav-bar {
    width: 100%;
    max-width: 390px;
    background: white;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.nav-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    margin-left: 110px;
    margin-right: 80px;
    width: 100px;
}

.icon-group {
    display: flex;
    align-items: center;
    gap: 5px;
}

.icon-button {
    font-size: 20px;
    color: #1c3788;
    background: none;
    border: none;
    cursor: pointer;
}

.icon-img {
    width: 24px;
    height: 24px;
}

.search-box {
    width: 90%;
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.search-box input {
    flex: 1;
    padding: 8px;
    border-radius: 30px;
    outline: none;
    font-size: 0.9rem;
    padding-left: 15px;
}

.search-btn {
    background: none;
    border: none;
    margin-left: -40px;
    cursor: pointer;
    padding: 0;
}

.search-icon {
    background: none;
    width: 20px;
    height: 20px;
}

.notification-button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.close-button {
    padding: 8px 15px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>
