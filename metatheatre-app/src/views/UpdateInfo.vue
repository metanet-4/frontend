<template>
  <div>
    <h1>회원 정보 수정</h1>

    <!-- ✅ 프로필 사진 변경 -->
    <h2>프로필 사진 변경</h2>
    <img :src="profileImage" alt="프로필 사진" width="150" height="150" />
    <input type="file" @change="handleProfileFileUpload" accept="image/*" />
    <button @click="updateProfile">변경</button>
    <p style="color: red;">{{ profileUploadMsg }}</p>

    <!-- ✅ 회원 정보 수정 -->
    <h2>회원 정보 수정</h2>
    <form @submit.prevent="updateUserInfo">
      <label>아이디</label>
      <input type="text" v-model="userId" readonly />

      <label>이름</label>
      <input type="text" v-model="name" required />

      <label>이메일</label>
      <input type="email" v-model="email" required />

      <label>새 비밀번호</label>
      <input type="password" v-model="password" placeholder="새 비밀번호 입력" />

      <label>비밀번호 확인</label>
      <input type="password" v-model="password2" placeholder="비밀번호 확인 입력" />

      <button type="submit">정보 수정</button>
    </form>

    <!-- ✅ 장애인 인증서 변경 -->
    <h2>장애인 인증서 변경</h2>
    <img :src="certificateImage" alt="장애인 인증서" width="150" height="150" />
    <input type="file" @change="handleCertificateFileUpload" accept="image/*" />
    <button @click="updateCertificate">변경</button>
    <p style="color: red;">{{ certificateUploadMsg }}</p>

    <br /><br />
    <router-link to="/user/profile"><button>프로필 페이지로 이동</button></router-link>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const userId = ref("testUser"); // 예제용 값
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const password2 = ref("");
    const profileImage = ref("");
    const certificateImage = ref("");
    const profileUploadMsg = ref("");
    const certificateUploadMsg = ref("");
    const profileFile = ref(null);
    const certificateFile = ref(null);

    const getJwtToken = () => {
      const cookies = document.cookie.split("; ");
      for (let cookie of cookies) {
        if (cookie.startsWith("jwt=")) {
          return cookie.split("=")[1];
        }
      }
      return "";
    };

    const loadProfileImage = async () => {
      try {
        const response = await fetch("/user/profile-pic", {
          method: "GET",
          headers: { Authorization: `Bearer ${getJwtToken()}` },
          credentials: "include",
        });
        const blob = await response.blob();
        if (blob.size > 0) {
          profileImage.value = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error("프로필 사진 로드 실패:", error);
      }
    };

    const loadCertificateImage = async () => {
      try {
        const response = await fetch("/user/certificate", {
          method: "GET",
          headers: { Authorization: `Bearer ${getJwtToken()}` },
          credentials: "include",
        });
        const blob = await response.blob();
        if (blob.size > 0) {
          certificateImage.value = URL.createObjectURL(blob);
        } else {
          certificateUploadMsg.value = "등록된 장애인 인증서가 없습니다.";
        }
      } catch (error) {
        console.error("장애인 인증서 로드 실패:", error);
      }
    };

    const updateUserInfo = async () => {
      if (password.value !== password2.value) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      const formData = {
        name: name.value,
        email: email.value,
        password: password.value,
      };
      try {
        const response = await fetch("/user/updateInfo", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getJwtToken()}` },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        alert(response.ok ? "회원 정보가 성공적으로 수정되었습니다." : "회원 정보 수정 실패");
      } catch (error) {
        alert("회원 정보 수정 실패: " + error.message);
      }
    };

    const handleProfileFileUpload = (event) => {
      profileFile.value = event.target.files[0];
    };

    const updateProfile = async () => {
      if (!profileFile.value) {
        profileUploadMsg.value = "파일을 선택해주세요.";
        return;
      }
      let formData = new FormData();
      formData.append("file", profileFile.value);
      try {
        const response = await fetch("/user/profile-pic", {
          method: "PUT",
          headers: { Authorization: `Bearer ${getJwtToken()}` },
          credentials: "include",
          body: formData,
        });
        const data = await response.json();
        profileUploadMsg.value = data.message;
        alert(data.message);
        loadProfileImage();
      } catch (error) {
        alert("업로드 중 오류 발생: " + error.message);
      }
    };

    const handleCertificateFileUpload = (event) => {
      certificateFile.value = event.target.files[0];
    };

    const updateCertificate = async () => {
      if (!certificateFile.value) {
        certificateUploadMsg.value = "파일을 선택해주세요.";
        return;
      }
      let formData = new FormData();
      formData.append("file", certificateFile.value);
      try {
        const response = await fetch("/user/certificate", {
          method: "PUT",
          headers: { Authorization: `Bearer ${getJwtToken()}` },
          credentials: "include",
          body: formData,
        });
        const data = await response.json();
        certificateUploadMsg.value = data.message;
        alert(data.message);
      } catch (error) {
        alert("업로드 중 오류 발생: " + error.message);
      }
    };

    onMounted(() => {
      loadProfileImage();
      loadCertificateImage();
    });

    return { userId, name, email, password, password2, profileImage, certificateImage, profileUploadMsg, certificateUploadMsg, handleProfileFileUpload, updateProfile, handleCertificateFileUpload, updateCertificate, updateUserInfo };
  },
};
</script>
