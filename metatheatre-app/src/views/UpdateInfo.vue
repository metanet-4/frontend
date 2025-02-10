<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();
const userId = ref(""); // ID는 수정 불가
const name = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const password2 = ref("");
const profilePic = ref(null);
const profilePicUrl = ref("");
const errorMessage = ref("");

// 🔹 사용자 정보 불러오기
const loadUserData = async () => {
  try {
    const response = await api.get("/user/profile");
    const user = response.data;
    userId.value = user.userId;
    name.value = user.name;
    email.value = user.email;
    phone.value = user.phone;
    if (user.profilePic) {
      profilePicUrl.value = `data:image/png;base64,${user.profilePic}`;
    }
  } catch (error) {
    console.error("회원 정보 불러오기 실패:", error);
  }
};

// 🔹 프로필 사진 변경
const handleFileUpload = (event) => {
  profilePic.value = event.target.files[0];
};

const updateProfilePic = async () => {
  if (!profilePic.value) return;

  const formData = new FormData();
  formData.append("file", profilePic.value);

  try {
    await api.put("/user/profile-pic", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("프로필 사진이 변경되었습니다.");
    loadUserData(); // 변경 후 다시 불러오기
  } catch (error) {
    errorMessage.value = "프로필 사진 변경 실패";
  }
};

// 🔹 회원 정보 수정
const updateUserInfo = async () => {
  if (password.value && password.value !== password2.value) {
    errorMessage.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  const userData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    password2: password2.value,
  };

  try {
    await api.put("/user/updateInfo", userData);
    alert("회원 정보가 수정되었습니다.");
    router.push("/mypage");
  } catch (error) {
    errorMessage.value = "회원 정보 수정 실패";
  }
};

// 🔹 페이지 로드 시 사용자 정보 불러오기
onMounted(loadUserData);
</script>

<template>
  <div class="update-info-container">
    <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
    <h2>회원 정보 수정</h2>

    <div class="profile-section">
      <img :src="profilePicUrl || '/default-profile.png'" alt="프로필 사진" class="profile-pic" />
      <label class="file-upload">
        <input type="file" @change="handleFileUpload" />
        <button @click="updateProfilePic">사진 변경</button>
      </label>
    </div>

    <input v-model="name" placeholder="이름" class="input-box" />
    <input v-model="email" placeholder="이메일" class="input-box" />
    <input v-model="phone" placeholder="전화번호" class="input-box" />
    <input v-model="userId" placeholder="아이디" class="input-box" disabled />

    <input v-model="password" type="password" placeholder="비밀번호" class="input-box" />
    <input v-model="password2" type="password" placeholder="비밀번호 확인" class="input-box" />

    <button @click="updateUserInfo" class="update-btn">수정</button>
    <button @click="router.push('/mypage')" class="cancel-btn">취소</button>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.update-info-container {
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

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-box {
  width: 250px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.update-btn {
  width: 250px;
  padding: 10px;
  background-color: #0044cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
