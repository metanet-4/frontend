<script setup>
import { ref } from "vue";
import api from "@/api";
import { useRouter } from "vue-router";
import ws from "../services/WebSocketService";
import { useStore } from "vuex";

const userId = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const store = useStore();
const WS_URL = import.meta.env.VITE_WS_URL;

const login = async () => {
    errorMessage.value = "";

    // 아이디와 비밀번호 입력 여부 확인
    if (!userId.value) {
        errorMessage.value = "아이디를 입력해주세요";
        return;
    }
    if (!password.value) {
        errorMessage.value = "비밀번호를 입력해주세요";
        return;
    }

    try {
        const response = await api.post("/auth/login", {
            userId: userId.value,
            password: password.value,
        });

        console.log("로그인 성공:", response.data);
        const role = response.data.role;
        store.dispatch("login", role);

        router.push("/");
        ws.connect(WS_URL);
        console.log("웹 소켓 연결 성공");
    } catch (error) {
        // 백엔드 응답과 관계없이 동일한 오류 메시지 출력
        errorMessage.value = "아이디 또는 비밀번호가 잘못되었습니다.";
    }
};


</script>

<template>
    <div class="login-container">
        <router-link to="/" class="logo-link">
            <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
        </router-link>

        <input
            v-model="userId"
            placeholder="아이디를 입력하세요"
            class="input-box"
        />
        <input
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            class="input-box"
        />

        <button @click="login" class="login-btn">로그인</button>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <router-link to="/signup" class="signup-link">회원가입</router-link>

        <div class="white-overlay"></div>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #ffffff;
}
.logo-link {
    display: inline-block;
}
.logo {
    width: 200px;
    margin-bottom: 30px;
}

.input-box {
    width: 250px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.login-btn {
    width: 250px;
    padding: 10px;
    background-color: #283593;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.login-btn:hover {
    background-color: #002a80;
}

.error-msg {
    color: red;
    margin-top: 10px;
}

.signup-link {
    margin-top: 20px;
    text-decoration: none;
    color: black;
    border-bottom: 1px solid black;
}
.white-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px; /* 하단 바 높이만큼 설정 */
    background-color: white;
    z-index: 9999; /* 최대한 높은 값으로 설정 */
}
</style>
