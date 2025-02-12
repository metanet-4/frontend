<template>
    <div>
        <h1>회원 정보 수정</h1>

        <!-- ✅ 프로필 사진 변경 -->
        <h2>프로필 사진 변경</h2>
        <img :src="profileImage" alt="프로필 사진" width="150" height="150" />
        <input type="file" @change="handleProfileFileUpload" accept="image/*" />
        <button @click="updateProfile">변경</button>
        <p style="color: red">{{ profileUploadMsg }}</p>

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
            <input
                type="password"
                v-model="password"
                placeholder="새 비밀번호 입력"
            />

            <label>비밀번호 확인</label>
            <input
                type="password"
                v-model="password2"
                placeholder="비밀번호 확인 입력"
            />

            <button type="submit">정보 수정</button>
        </form>

        <!-- ✅ 장애인 인증서 변경 -->
        <h2>장애인 인증서 변경</h2>
        <img
            :src="certificateImage"
            alt="장애인 인증서"
            width="150"
            height="150"
        />
        <input
            type="file"
            @change="handleCertificateFileUpload"
            accept="image/*"
        />
        <button @click="updateCertificate">변경</button>
        <p style="color: red">{{ certificateUploadMsg }}</p>

        <br /><br />
        <router-link to="/user/profile"
            ><button>프로필 페이지로 이동</button></router-link
        >
    </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
    setup() {
        const userId = ref("");
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

        const loadUserInfo = async () => {
            try {
                const response = await fetch("/user/info", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${getJwtToken()}` },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    userId.value = data.userId;
                    name.value = data.name;
                    email.value = data.email;
                }
            } catch (error) {
                console.error("사용자 정보 로드 실패:", error);
            }
        };

        onMounted(() => {
            loadUserInfo();
        });

        return {
            userId,
            name,
            email,
            password,
            password2,
            profileImage,
            certificateImage,
            profileUploadMsg,
            certificateUploadMsg,
            getJwtToken,
            loadUserInfo,
        };
    },
};
</script>
