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
const gender = ref(1); // Integer 값으로 수정
const disabilityCertificate = ref(null);
const errorMessage = ref("");
const emailMessage = ref("");
const authCode = ref("");
const authCodeMessage = ref("");
const userIdMessage = ref("");
const phoneMessage = ref("");
const router = useRouter();

const handleFileUpload = (event) => {
  disabilityCertificate.value = event.target.files[0];
};

const checkUserId = async () => {
  if (!userId.value) {
    userIdMessage.value = "아이디를 입력해주세요.";
    return;
  }
  try {
    const response = await api.get("/auth/check-userId", { params: { userId: userId.value } });
    userIdMessage.value = response.data ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다.";
  } catch (error) {
    userIdMessage.value = "아이디 확인 실패";
  }
};

const checkPhone = async () => {
  if (!phone.value) return;
  try {
    const response = await api.get("/auth/check-phone", { params: { phone: phone.value } });
    phoneMessage.value = response.data ? "이미 등록된 전화번호입니다." : "사용 가능한 전화번호입니다.";
  } catch (error) {
    phoneMessage.value = "전화번호 확인 실패";
  }
};

const sendAuthCode = async () => {
  emailMessage.value = "";
  if (!email.value) {
    emailMessage.value = "이메일을 입력해주세요.";
    return;
  }
  try {
    const response = await api.post("/auth/send-code", null, { params: { email: email.value } });
    emailMessage.value = response.status === 200 ? "인증번호가 이메일로 전송되었습니다." : "이메일 전송 실패.";
  } catch (error) {
    emailMessage.value = "이메일 전송 실패.";
  }
};

const verifyAuthCode = async () => {
  authCodeMessage.value = "";
  if (!authCode.value) {
    authCodeMessage.value = "인증번호를 입력해주세요.";
    return;
  }
  try {
    const response = await api.post("/auth/verify-code", null, { params: { email: email.value, authCode: authCode.value } });
    authCodeMessage.value = response.data === true ? "인증 성공!" : "잘못된 인증번호입니다.";
  } catch (error) {
    authCodeMessage.value = "인증 확인 실패.";
  }
};

const signup = async () => {
  errorMessage.value = "";
  if (password.value !== password2.value) {
    errorMessage.value = "비밀번호가 일치하지 않습니다.";
    return;
  }
  if (userIdMessage.value.includes("이미 존재하는")) {
    errorMessage.value = "아이디가 중복되었습니다.";
    return;
  }
  if (phoneMessage.value.includes("이미 등록된")) {
    errorMessage.value = "전화번호가 중복되었습니다.";
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
  formData.append("password2", password2.value);
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
      withCredentials: true, // ✅ 쿠키 포함 요청 설정
    });
    console.log("회원가입 성공:", response.data);
    router.push("/login");
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "회원가입 실패";
  }
};
</script>


<template>
  <div class="signup-container">
    <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
    <h2>회원가입</h2>

    <div class="input-group">
      <input v-model="userId" placeholder="아이디" class="input-box" />
      <button @click="checkUserId" class="check-btn">중복 확인</button>
    </div>
    <p v-if="userIdMessage" class="message">{{ userIdMessage }}</p>

    <input v-model="name" placeholder="이름" class="input-box" />
    <input v-model="password" type="password" placeholder="비밀번호" class="input-box" />
    <input v-model="password2" type="password" placeholder="비밀번호 확인" class="input-box" />

    <input v-model="phone" placeholder="전화번호" class="input-box" @blur="checkPhone" />
    <p v-if="phoneMessage" class="message">{{ phoneMessage }}</p>

    <input v-model="email" type="email" placeholder="이메일" class="input-box" />
    <button @click="sendAuthCode" class="email-btn">인증번호 전송</button>
    <p v-if="emailMessage" class="message">{{ emailMessage }}</p>

    <input v-model="authCode" placeholder="인증번호 입력" class="input-box" />
    <button @click="verifyAuthCode" class="verify-btn">인증번호 확인</button>
    <p v-if="authCodeMessage" class="message">{{ authCodeMessage }}</p>

    <input v-model="birthDate" type="date" class="input-box" />

    <select v-model="gender" class="input-box">
      <option :value="1">남성</option>
      <option :value="0">여성</option>
    </select>


    <!-- ✅ 장애인 인증서 업로드 UI 개선 -->
    <div class="file-upload">
      <label for="disabilityCertificate">장애인 인증서 업로드</label>
      <input type="file" id="disabilityCertificate" @change="handleFileUpload" />
    </div>

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
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 10px;
  height: 100vh;
  overflow-y: auto; /* ✅ 세로 스크롤 가능하도록 설정 */
}

.logo {
  width: 150px;
  margin-bottom: 15px;
}

.input-box {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.check-btn, .email-btn, .verify-btn {
  padding: 8px;
  background-color: #0044cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
}

.file-upload label {
  font-weight: bold;
  margin-bottom: 5px;
}

.signup-btn {
  width: 100%;
  padding: 12px;
  background-color: #0044cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>