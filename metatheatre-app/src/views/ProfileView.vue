<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);
const profileImage = ref(null);
const certificateImage = ref(null);
const certificateError = ref("");
const isModalOpen = ref(false);

// ✅ JWT 토큰 가져오기
function getJwtToken() {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        if (cookie.startsWith("jwt=")) {
            return cookie.split("=")[1];
        }
    }
    return "";
}

// ✅ 서버에서 로그인한 사용자 정보 불러오기
async function loadUserInfo() {
    try {
        console.log("사용자 정보를 불러오는 중...");
        const response = await fetch("/user/info", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getJwtToken()}`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
            credentials: "include",
        });

        if (!response.ok) throw new Error(`API 오류: ${response.status}`);

        const data = await response.json();
        console.log("API 응답 데이터:", data); // ✅ 데이터를 확인

        user.value = data;
        console.log("user.value에 저장됨:", user.value);
    } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
    }
}

// ✅ 프로필 사진 로드
async function loadProfileImage() {
    try {
        const response = await fetch("/user/profile-pic", {
            method: "GET",
            headers: { Authorization: `Bearer ${getJwtToken()}` },
            credentials: "include",
        });

        if (!response.ok) throw new Error("프로필 사진이 없습니다.");
        const blob = await response.blob();
        profileImage.value = URL.createObjectURL(blob);
    } catch (error) {
        console.log("프로필 사진 없음:", error);
    }
}

// ✅ 장애인 인증서 로드
async function loadCertificate() {
    try {
        const response = await fetch("/user/certificate", {
            method: "GET",
            headers: { Authorization: `Bearer ${getJwtToken()}` },
            credentials: "include",
        });

        if (!response.ok) throw new Error("장애인 인증서가 없습니다.");
        const blob = await response.blob();
        certificateImage.value = URL.createObjectURL(blob);
        isModalOpen.value = true;
    } catch (error) {
        console.error("장애인 인증서 조회 실패:", error);
        certificateError.value = "장애인 인증서를 불러올 수 없습니다.";
    }
}

// ✅ 모달 닫기
function closeModal() {
    isModalOpen.value = false;
}

// ✅ 페이지 로드 시 사용자 정보 및 프로필 사진 불러오기
onMounted(() => {
    loadUserInfo();
    loadProfileImage();
});
</script>

<template>
    <div class="profile-container" v-if="user">
        <h1 class="title">사용자 프로필</h1>

        <!-- ✅ 프로필 사진 -->
        <div class="profile-section">
            <h2>프로필 사진</h2>
            <img v-if="profileImage" :src="profileImage" alt="등록된 프로필 사진" class="profile-img" />
            <p v-else class="no-image">등록된 프로필 사진이 없습니다.</p>
        </div>

        <!-- ✅ 사용자 정보 -->
        <div class="info-section">
            <p><strong>아이디:</strong> {{ user.userId }}</p>
            <p><strong>이름:</strong> {{ user.name }}</p>
            <p><strong>이메일:</strong> {{ user.email }}</p>
            <p><strong>성별:</strong> {{ user.gender === 1 ? "남성" : "여성" }}</p>
            <p><strong>전화번호:</strong> {{ user.phone }}</p>
            <p><strong>생년월일:</strong> {{ user.birthday }}</p>
        </div>

        <!-- ✅ 장애인 인증서 -->
        <div class="certificate-section">
            <h2>장애인 인증서</h2>
            <button @click="loadCertificate" class="certificate-btn">인증서 보기</button>
            <p v-if="certificateError" class="error-msg">{{ certificateError }}</p>
        </div>

        <!-- ✅ 모달 창 -->
        <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
                <button @click="closeModal" class="close-btn">&times;</button>
                <img :src="certificateImage" class="certificate-img" alt="장애인 인증서" />
            </div>
        </div>

        <!-- ✅ 설정 -->
        <div class="settings-section">
            <router-link to="/user/updateInfo"><button class="update-btn">회원 정보 수정</button></router-link>
            <router-link to="/user/delete"><button class="delete-btn">회원 탈퇴</button></router-link>
        </div>

        <!-- ✅ 홈으로 이동 -->
        <div class="home-section">
            <router-link to="/"><button class="home-btn">홈으로 이동</button></router-link>
        </div>
    </div>

    <div v-else class="loading">
        <p>사용자 정보를 불러오는 중...</p>
    </div>
</template>

<style scoped>
.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.title {
    font-size: 24px;
    font-weight: bold;
}

.profile-section,
.info-section,
.certificate-section {
    margin-top: 20px;
    text-align: center;
}

.profile-img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 2px solid #ddd;
}

.no-image {
    color: gray;
}

.certificate-btn {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.error-msg {
    color: red;
    margin-top: 10px;
}

/* ✅ 모달 창 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    text-align: center;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
}

.certificate-img {
    width: 100%;
    max-height: 80vh;
}

/* ✅ 버튼 스타일 */
.settings-section,
.home-section {
    margin-top: 20px;
    text-align: center;
}

.update-btn,
.delete-btn,
.home-btn {
    margin: 5px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.update-btn {
    background-color: #28a745;
    color: white;
}

.delete-btn {
    background-color: #dc3545;
    color: white;
}

.home-btn {
    background-color: #6c757d;
    color: white;
}

.loading {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin-top: 50px;
}
</style>
