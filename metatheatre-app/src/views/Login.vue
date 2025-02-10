<script setup>
import { ref } from "vue";
import api from "@/api";
import { useRouter } from "vue-router";

const userId = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  errorMessage.value = "";
  try {
    const response = await api.post("/auth/login", {
      userId: userId.value,
      password: password.value,
    });

    // 로그인 성공 시 JWT 쿠키 저장 (Spring Boot가 Set-Cookie로 처리하면 자동 저장됨)
    console.log("로그인 성공:", response.data);
    
    // 홈 페이지로 이동
    router.push("/");
  } catch (error) {
    errorMessage.value = error.response?.data || "로그인 실패";
  }
};
</script>

<template>
  <div class="login-container">
    <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
    
    <input v-model="userId" placeholder="아이디를 입력하세요" class="input-box" />
    <input v-model="password" type="password" placeholder="비밀번호를 입력하세요" class="input-box" />
    
    <button @click="login" class="login-btn">로그인</button>
    
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
    
    <router-link to="/signup" class="signup-link">회원가입</router-link>
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
  background-color: #0044cc;
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
</style>
