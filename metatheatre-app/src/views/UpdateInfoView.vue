<template>
    <NavBar />
    <div class="container">
        <h1 class="title">회원 정보 수정</h1>

        <!-- ✅ 프로필 사진 변경 -->

        <img :src="profileImage" alt="프로필 사진" class="profile-img" />

        <!-- ✅ 파일 선택 버튼 및 파일명 표시 -->
        <label for="profileUpload" class="custom-file-upload">사진 변경</label>
        <input id="profileUpload" type="file" @change="updateProfile" />
        <span v-if="profileFileName">{{ profileFileName }}</span>

        <p class="upload-msg">{{ profileUploadMsg }}</p>

        <!-- ✅ 회원 정보 수정 -->

        <form @submit.prevent="updateUserInfo">
            <label>아이디</label>
            <input type="text" v-model="userInfo.userId" readonly />

            <label>이름</label>
            <input type="text" v-model="userInfo.name" required />

            <label>이메일</label>
            <input type="email" v-model="userInfo.email" required />

            <label>새 비밀번호</label>
            <input type="password" v-model="password" placeholder="새 비밀번호 입력" />

            <label>비밀번호 확인</label>
            <input type="password" v-model="password2" placeholder="비밀번호 확인 입력" />
        </form>

        <!-- ✅ 우대 인증서 변경 -->

        <img :src="certificateImage" alt="우대 인증서" class="certificate-img" />

        <label for="certificateUpload" class="custom-file-upload">인증서 변경</label>
        <input id="certificateUpload" type="file" @change="updateCertificate" />
        <span v-if="certificateFileName">{{ certificateFileName }}</span>

        <!-- ✅ 버튼을 한 줄에 정렬 -->
        <div class="button-container">
            <button type="submit" @click="updateUserInfo">정보 수정</button>
            <button @click="goToProfile">취소</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
import NavBar from "../components/NavBar.vue";

const router = useRouter();
const userInfo = ref({ userId: "", name: "", email: "" });
const password = ref("");
const password2 = ref("");
const profileImage = ref("");
const certificateImage = ref("");
const profileUploadMsg = ref("");
const certificateUploadMsg = ref("");

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
        const response = await fetch("http://localhost:8080/mypage", { credentials: "include" });
        if (response.ok) {
            const data = await response.json();
            userInfo.value = data.mypageMember;
        } else {
            console.error("사용자 정보 불러오기 실패");
        }
    } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }

    await loadProfileImage(); // ✅ 이 부분을 확인하세요
    await loadCertificateImage(); // ✅ 이 부분도 확인
});

// 프로필 사진 불러오기
const loadProfileImage = async () => {
    try {
        const response = await axios.get("http://localhost:8080/user/profile-pic", {
            responseType: "blob",
            headers: { Authorization: `Bearer ${getJwtToken()}` },
        });

        if (response.status === 200 && response.data.size > 0) {
            profileImage.value = URL.createObjectURL(response.data);
        } else {
            console.warn("프로필 사진 없음, 기본 이미지 사용");
            profileImage.value = "/images/default-profile.png"; // 기본 이미지 설정
        }
    } catch (error) {
        console.error("프로필 사진 로드 실패:", error);
        profileImage.value = "/images/default-profile.png"; // 오류 발생 시 기본 이미지
    }
};

// 우대 인증서 불러오기
const loadCertificateImage = async () => {
    try {
        const response = await axios.get("http://localhost:8080/user/certificate", {
            responseType: "blob",
            headers: { Authorization: `Bearer ${getJwtToken()}` },
            withCredentials: true, // ✅ 쿠키 기반 인증 유지
        });

        if (response.status === 200 && response.data.size > 0) {
            certificateImage.value = URL.createObjectURL(response.data);
        } else {
            console.warn("우대 인증서 없음, 기본 메시지 표시");
            certificateUploadMsg.value = "등록된 우대 인증서가 없습니다.";
        }
    } catch (error) {
        console.error("우대 인증서 로드 실패:", error);
    }
};

// 회원 정보 수정 요청
const updateUserInfo = async () => {
    if (password.value !== password2.value) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const formData = {
        name: userInfo.value.name,
        email: userInfo.value.email,
        password: password.value || "", // ✅ null 값 방지
        password2: password2.value || "",
    };

    try {
        const response = await fetch("http://localhost:8080/user/updateInfo", {
            // ✅ URL 확인
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getJwtToken()}`,
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        alert("회원 정보가 성공적으로 수정되었습니다.");
        router.push("/mypage"); // ✅ 마이페이지로 이동
    } catch (error) {
        alert("회원 정보 수정 실패: " + error.message);
    }
};

// 프로필 사진 변경
const updateProfile = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        profileUploadMsg.value = "파일을 선택해주세요.";
        return;
    }

    // 🔹 미리보기 즉시 적용
    profileImage.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:8080/user/profile-pic", {
            // ✅ URL 확인
            method: "PUT",
            headers: { Authorization: `Bearer ${getJwtToken()}` },
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        profileUploadMsg.value = data.message;
        alert(data.message);
    } catch (error) {
        alert("업로드 중 오류 발생: " + error.message);
    }
};

// 우대 인증서 변경
const updateCertificate = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        certificateUploadMsg.value = "파일을 선택해주세요.";
        return;
    }

    // 🔹 미리보기 즉시 적용
    certificateImage.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:8080/user/certificate", {
            // ✅ URL 확인
            method: "PUT",
            headers: { Authorization: `Bearer ${getJwtToken()}` },
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        certificateUploadMsg.value = data.message;
        alert(data.message);
    } catch (error) {
        alert("업로드 중 오류 발생: " + error.message);
    }
};

// 프로필 페이지로 이동
const goToProfile = () => {
    router.push("/mypage");
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 140px 20px 20px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-height: 95vh; /* 화면 높이의 80%만 차지하도록 설정 */
    overflow-y: auto; /* 세로 스크롤 가능하도록 설정 */
}

/* 프로필 사진 (동그랗게) */
.profile-img {
    border-radius: 50%;
    width: 120px;
    height: 120px;
    object-fit: cover;
    display: block;
    margin: 10px auto;
    border: 1px solid #d3d3d3; /* 연한 회색 테두리 */
}

/* 우대 인증서 (네모 형태 유지) */
.certificate-img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    display: block;
    margin: 10px auto;
    border-radius: 8px; /* 약간 둥글게 */
    border: 1px solid #d3d3d3; /* 연한 회색 테두리 */
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
    background-color: #283593; /* 진한 보라색 */
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
    background-color: #283593;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 5px;
}
.title {
    color: #283593;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
    text-decoration: underline;
    text-decoration-thickness: 2px; /* 밑줄 두께 조정 (일부 브라우저 지원) */
    text-underline-offset: 8px; /* 밑줄과 글자 간격 조정 (일부 브라우저 지원) */
}
label {
    display: block; /* 블록 요소로 만들어 줄바꿈 */
    text-align: left; /* 왼쪽 정렬 */
    margin-bottom: 5px; /* 입력 필드와 간격 추가 */
}
</style>
