<template>
  <div class="container">
      <h1>회원 정보 수정</h1>

      <!-- ✅ 프로필 사진 변경 -->
      <h3>프로필 사진 변경</h3>
      <img :src="profileImage" alt="프로필 사진" class="profile-img">

      <!-- ✅ 파일 선택 버튼 및 파일명 표시 -->
      <label for="profileUpload" class="custom-file-upload">파일 선택</label>
      <input id="profileUpload" type="file" @change="updateProfile">
      <span v-if="profileFileName">{{ profileFileName }}</span>
      
      <p class="upload-msg">{{ profileUploadMsg }}</p>

      <!-- ✅ 회원 정보 수정 -->
      
      <form @submit.prevent="updateUserInfo">
          <label>아이디</label>
          <input type="text" v-model="userInfo.userId" readonly>

          <label>이름</label>
          <input type="text" v-model="userInfo.name" required>

          <label>이메일</label>
          <input type="email" v-model="userInfo.email" required>

          <label>새 비밀번호</label>
          <input type="password" v-model="password" placeholder="새 비밀번호 입력">

          <label>비밀번호 확인</label>
          <input type="password" v-model="password2" placeholder="비밀번호 확인 입력">
      </form>

      <!-- ✅ 장애인 인증서 변경 -->
      <h2>장애인 인증서 변경</h2>
      <img :src="certificateImage" alt="장애인 인증서" class="certificate-img">

      <label for="certificateUpload" class="custom-file-upload">파일 선택</label>
      <input id="certificateUpload" type="file" @change="updateCertificate">
      <span v-if="certificateFileName">{{ certificateFileName }}</span>

      <!-- ✅ 버튼을 한 줄에 정렬 -->
      <div class="button-container">
        <button type="submit" @click="updateUserInfo">정보 수정</button>
        <button @click="goToProfile">취소</button>
      </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const userInfo = ref({ userId: '', name: '', email: '' });
const password = ref('');
const password2 = ref('');
const profileImage = ref('');
const certificateImage = ref('');
const profileUploadMsg = ref('');
const certificateUploadMsg = ref('');

// JWT 토큰 가져오기
const getJwtToken = () => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
      if (cookie.startsWith("jwt=")) {
          return cookie.split("=")[1];
      }
  }
  return "";
};

// 사용자 정보 불러오기
onMounted(async () => {
  try {
      const response = await fetch('http://localhost:8080/mypage', { credentials: 'include' });
      if (response.ok) {
          const data = await response.json();
          userInfo.value = data.mypageMember;
      } else {
          console.error('사용자 정보 불러오기 실패');
      }
  } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
  }

  loadProfileImage();
  loadCertificateImage();
});

// 프로필 사진 불러오기
const loadProfileImage = async () => {
  try {
      const response = await fetch('/user/profile-pic', {
          method: 'GET',
          headers: { "Authorization": `Bearer ${getJwtToken()}` },
          credentials: 'include'
      });

      if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
              profileImage.value = URL.createObjectURL(blob);
          }
      }
  } catch (error) {
      console.error('프로필 사진 로드 실패:', error);
  }
};

// 장애인 인증서 불러오기
const loadCertificateImage = async () => {
  try {
      const response = await fetch('/user/certificate', {
          method: 'GET',
          headers: { "Authorization": `Bearer ${getJwtToken()}` },
          credentials: 'include'
      });

      if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
              certificateImage.value = URL.createObjectURL(blob);
          } else {
              certificateUploadMsg.value = '등록된 장애인 인증서가 없습니다.';
          }
      }
  } catch (error) {
      console.error('장애인 인증서 로드 실패:', error);
  }
};

// 회원 정보 수정 요청
const updateUserInfo = async () => {
    if (password.value !== password2.value) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    const formData = {
        name: userInfo.value.name,
        email: userInfo.value.email,
        password: password.value || "", // ✅ null 값 방지
        password2: password2.value || ""
    };

    try {
        const response = await fetch('http://localhost:8080/user/updateInfo', { // ✅ URL 확인
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${getJwtToken()}`
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        alert('회원 정보가 성공적으로 수정되었습니다.');
        router.push('/mypage'); // ✅ 마이페이지로 이동
    } catch (error) {
        alert('회원 정보 수정 실패: ' + error.message);
    }
};



// 프로필 사진 변경
const updateProfile = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        profileUploadMsg.value = '파일을 선택해주세요.';
        return;
    }

    // 🔹 미리보기 즉시 적용
    profileImage.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('http://localhost:8080/user/profile-pic', { // ✅ URL 확인
            method: 'PUT',
            headers: { "Authorization": `Bearer ${getJwtToken()}` },
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        profileUploadMsg.value = data.message;
        alert(data.message);
    } catch (error) {
        alert('업로드 중 오류 발생: ' + error.message);
    }
};




// 장애인 인증서 변경
const updateCertificate = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        certificateUploadMsg.value = '파일을 선택해주세요.';
        return;
    }

    // 🔹 미리보기 즉시 적용
    certificateImage.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('http://localhost:8080/user/certificate', { // ✅ URL 확인
            method: 'PUT',
            headers: { "Authorization": `Bearer ${getJwtToken()}` },
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        certificateUploadMsg.value = data.message;
        alert(data.message);
    } catch (error) {
        alert('업로드 중 오류 발생: ' + error.message);
    }
};



// 프로필 페이지로 이동
const goToProfile = () => {
  router.push('/mypage');
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-height: 95vh; /* 화면 높이의 80%만 차지하도록 설정 */
  overflow-y: auto; /* 세로 스크롤 가능하도록 설정 */
}

/* 프로필 사진 스타일 */
/* 프로필 사진 (동그랗게) */
.profile-img {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  display: block;
  margin: 10px auto;
}

/* 장애인 인증서 (네모 형태 유지) */
.certificate-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  display: block;
  margin: 10px auto;
  border-radius: 8px; /* 약간 둥글게 하고 싶다면 추가 */
}


/* 버튼 스타일 */
button {
  width: 100px;
  padding: 10px;
  margin: 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

/* 수정 버튼 */
button[type="submit"] {
  background-color: #4B0082; /* 진한 보라색 */
  color: white;
}

/* 취소 버튼 */
button:last-child {
  background-color: #6c757d; /* 회색 */
  color: white;
}

/* 입력 필드 스타일 */
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* 읽기 전용 필드 스타일 */
input[readonly] {
  background-color: #e9ecef;
}

/* 전화번호 입력란 스타일 */
.phone-group {
  display: flex;
  justify-content: space-between;
}

.phone-group input {
  width: 30%;
}
/* ✅ 기본 파일 선택 버튼 숨기기 */
input[type="file"] {
  display: none;
}

/* ✅ 커스텀 파일 선택 버튼 스타일 */
.custom-file-upload {
  display: inline-block;
  padding: 8px 15px;
  background-color: #4B0082;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 5px;
}

</style>


