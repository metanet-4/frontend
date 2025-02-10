<script setup>
import { ref } from "vue";
import api from "@/api";
import { useRouter } from "vue-router";

const userId = ref("");
const name = ref("");
const password = ref("");
const password2 = ref("");
const phone = ref("");
const email = ref("");
const birthDate = ref("");
const gender = ref("남성");
const disabilityCertificate = ref(null);
const errorMessage = ref("");
const emailMessage = ref("");
const authCode = ref("");
const authCodeMessage = ref("");
const router = useRouter();

const handleFileUpload = (event) => {
  disabilityCertificate.value = event.target.files[0];
};

// ✅ 이메일 인증번호 전송 (쿼리 스트링 방식)
const sendAuthCode = async () => {
  emailMessage.value = "";
  if (!email.value) {
    emailMessage.value = "이메일을 입력해주세요.";
    return;
  }

  try {
    const response = await api.post(`/auth/send-code?email=${email.value}`);
    if (response.status === 200) {
      emailMessage.value = "인증번호가 이메일로 전송되었습니다.";
    } else {
      emailMessage.value = "이메일 전송 실패.";
    }
  } catch (error) {
    emailMessage.value = "이메일 전송 실패.";
  }
};

// ✅ 인증번호 확인 (쿼리 스트링 방식)
const verifyAuthCode = async () => {
  authCodeMessage.value = "";
  if (!authCode.value) {
    authCodeMessage.value = "인증번호를 입력해주세요.";
    return;
  }

  try {
    const response = await api.post(`/auth/verify-code?email=${email.value}&authCode=${authCode.value}`);
    if (response.data === true) {
      authCodeMessage.value = "인증 성공!";
    } else {
      authCodeMessage.value = "잘못된 인증번호입니다.";
    }
  } catch (error) {
    authCodeMessage.value = "인증 확인 실패.";
  }
};

// ✅ 회원가입 (FormData 방식 - 변경 없음)
const signup = async () => {
  errorMessage.value = "";
  if (password.value !== password2.value) {
    errorMessage.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  if (authCodeMessage.value !== "인증 성공!") {
    errorMessage.value = "이메일 인증을 완료해주세요.";
    return;
  }

  const formData = new FormData();
  formData.append("userId", userId.value);
  formData.append("name", name.value);
  formData.append("password", password.value);
  formData.append("phone", phone.value);
  formData.append("email", email.value);
  formData.append("birthday", birthDate.value);
  formData.append("gender", gender.value);
  if (disabilityCertificate.value) {
    formData.append("disabilityCertificate", disabilityCertificate.value);
  }

  try {
    const response = await api.post("/auth/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("회원가입 성공:", response.data);
    router.push("/login"); // 회원가입 후 로그인 페이지로 이동
  } catch (error) {
    errorMessage.value = error.response?.data || "회원가입 실패";
  }
};
</script>

<template>
  <div class="signup-container">
    <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
    <h2>회원가입</h2>

    <input v-model="userId" placeholder="아이디" class="input-box" />
    <input v-model="name" placeholder="이름" class="input-box" />
    <input v-model="password" type="password" placeholder="비밀번호" class="input-box" />
    <input v-model="password2" type="password" placeholder="비밀번호 확인" class="input-box" />
    <input v-model="phone" placeholder="전화번호" class="input-box" />
    
    <div class="email-container">
      <input v-model="email" type="email" placeholder="이메일" class="input-box" />
      <button @click="sendAuthCode" class="email-btn">인증번호 전송</button>
      <p v-if="emailMessage" class="message">{{ emailMessage }}</p>
    </div>

    <div class="auth-container">
      <input v-model="authCode" placeholder="인증번호 입력" class="input-box" />
      <button @click="verifyAuthCode" class="verify-btn">인증번호 확인</button>
      <p v-if="authCodeMessage" class="message">{{ authCodeMessage }}</p>
    </div>

    <input v-model="birthDate" type="date" class="input-box" />

    <select v-model="gender" class="input-box">
      <option value="남성">남성</option>
      <option value="여성">여성</option>
    </select>

    <label class="file-upload">
      장애인 인증서 업로드:
      <input type="file" @change="handleFileUpload" />
    </label>

    <button @click="signup" class="signup-btn">회원가입</button>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <router-link to="/" class="home-link">홈으로 가기</router-link>
  </div>
</template>

<style scoped>
.signup-container {
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

.input-box {
  width: 250px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.email-container, .auth-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.email-btn, .verify-btn {
  padding: 8px 12px;
  background-color: #0044cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.email-btn:hover, .verify-btn:hover {
  background-color: #002a80;
}

.signup-btn {
  width: 250px;
  padding: 10px;
  background-color: #0044cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.signup-btn:hover {
  background-color: #002a80;
}

.file-upload {
  margin-top: 10px;
}

.error-msg, .message {
  color: red;
  margin-top: 10px;
}

.message {
  font-size: 14px;
  color: green;
}

.home-link {
  margin-top: 20px;
  text-decoration: none;
  color: black;
  border-bottom: 1px solid black;
}
</style>
