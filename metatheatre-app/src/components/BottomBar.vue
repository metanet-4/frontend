<template>
    <div class="bottom-bar">
        <router-link to="/movies" class="bottom-link-button">
            <i class="bi bi-film"></i>
            <span>영화</span>
        </router-link>
        <router-link to="/movieList" class="bottom-link-button">
            <i class="bi bi-ticket-perforated-fill"></i>
            <span>예매</span>
        </router-link>
        <router-link :to="role === null ? '/login' : role === 'ROLE_ADMIN' ? '/admin/users' : '/mypage'"
            class="bottom-link-button">
            <i class="bi bi-person-lines-fill"></i>
            <span>{{ role === null ? '로그인' : role === 'ROLE_ADMIN' ? '관리자페이지' : '마이페이지' }}</span>
        </router-link>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { watch, computed } from 'vue';

const store = useStore();
const role = computed(() => store.getters.user || null);

</script>

<style scoped>
.bottom-bar {
    width: 100%;
    max-width: 390px;
    height: 70px;
    background: #f3f3f3;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}

/* 각 버튼 안의 아이콘 크기와 색상 */
.bottom-link-button i {
    font-size: 28px;
    /* 아이콘 크기 */
    color: #1c3788;
    /* 아이콘 기본 색상 */
    margin-bottom: -10px;
    /* 아이콘과 텍스트 간격 줄이기 */
}

/* 가운데 버튼을 동그라미로 감싸고 배경색 변경 */
.bottom-link-button:nth-child(2) {
    background-color: #1c3788;
    /* 파란색 배경 */
    border-radius: 50%;
    /* 동그라미로 만들기 */
    width: 50px;
    /* 원 크기 설정 */
    height: 50px;
    /* 원 크기 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.bottom-link-button:nth-child(2) i {
    color: white;
    /* 아이콘 색상 흰색 */
}

/* 가운데 버튼의 텍스트 색상 변경 */
.bottom-link-button:nth-child(2) span {
    font-size: 12px;
    /* 텍스트 크기 */
    color: white;
    /* 텍스트 색상 흰색 */
    display: block;
    /* 텍스트 아래로 표시 */
    text-align: center;
    margin-top: 0px;
    /* 텍스트와 아이콘 간격 조정 */
}

/* 버튼의 텍스트 스타일 */
.bottom-link-button span {
    font-size: 12px;
    /* 텍스트 크기 */
    color: #1c3788;
    /* 텍스트 색상 */
    display: block;
    /* 텍스트 아래로 표시 */
    text-align: center;
    margin-top: 2px;
    /* 텍스트와 아이콘 간격 조정 */
}

.bottom-link-button {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
