<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const userId = ref("");
const email = ref("");
const birthDate = ref("");
const errorMessage = ref("");

// 🔹 사용자 정보 불러오기
const loadUserData = async () => {
    try {
        const response = await api.get("/user/profile");
        const user = response.data;
        name.value = user.name;
        userId.value = user.userId;
        email.value = user.email;
        birthDate.value = user.birthDate;
    } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
    }
};

// 🔹 회원 탈퇴 요청
const deleteUser = async () => {
    if (!confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) return;

    try {
        await api.delete("/user/delete");
        alert("회원 탈퇴가 완료되었습니다.");
        router.push("/"); // 홈으로 이동
    } catch (error) {
        errorMessage.value = "회원 탈퇴 실패. 다시 시도해주세요.";
    }
};

// 🔹 페이지 로드 시 사용자 정보 불러오기
onMounted(loadUserData);
</script>

<template>
    <div class="delete-container">
        <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
        <h2>회원 탈퇴</h2>

        <div class="user-info">
            <p><strong>이름:</strong> {{ name }}</p>
            <p><strong>아이디:</strong> {{ userId }}</p>
            <p><strong>이메일:</strong> {{ email }}</p>
            <p><strong>생일:</strong> {{ birthDate }}</p>
        </div>

        <p class="warning">
            모든 정보가 삭제됩니다.<br />정말 탈퇴하시겠습니까?
        </p>

        <button @click="deleteUser" class="delete-btn">탈퇴</button>
        <button @click="router.push('/mypage')" class="cancel-btn">취소</button>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
    </div>
</template>

<style scoped>
.delete-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #ffffff;
}

.logo {
    width: 200px;
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 20px;
}

.user-info {
    width: 80%;
    max-width: 350px;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    text-align: left;
}

p {
    margin: 5px 0;
}

.warning {
    color: red;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
}

.delete-btn {
    width: 250px;
    padding: 10px;
    background-color: #4a148c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.delete-btn:hover {
    background-color: #2c0f5a;
}

.cancel-btn {
    width: 250px;
    padding: 10px;
    background-color: #777;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.error-msg {
    color: red;
    margin-top: 10px;
}
</style>
