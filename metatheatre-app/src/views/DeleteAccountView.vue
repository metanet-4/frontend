<template>
    <NavBar />
    <div class="container">
        <h1 class="title">회원 탈퇴</h1>

        <div class="user-info">
            <p><span class="label">이름</span> {{ userInfo.name }}</p>
            <p><span class="label">아이디</span> {{ userInfo.userId }}</p>
            <p><span class="label">이메일</span> {{ userInfo.email }}</p>
            <p><span class="label">생일</span> {{ formatDate(userInfo.birthday) }}</p>
        </div>

        <p class="warning-text">모든 정보가 삭제됩니다.<br />정말 탈퇴하시겠습니까?</p>

        <div class="button-container">
            <button class="button delete-btn" @click="confirmDelete">탈퇴</button>
            <button class="button cancel-btn" @click="cancelDelete">취소</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import NavBar from "../components/NavBar.vue";
import Swal from "sweetalert2";

const router = useRouter();
const userInfo = ref({
    name: "",
    userId: "",
    email: "",
    birthday: "",
});

const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
};

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
});


const confirmDelete = async () => {
    // ✅ SweetAlert2 확인 메시지 (기존 confirm 대체)
    const result = await Swal.fire({
        title: "정말로 회원 탈퇴를 진행하시겠습니까?",
        text: "탈퇴 후에는 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // 🔴 삭제 버튼 색상
        cancelButtonColor: "#6A5ACD", // 💜 취소 버튼 색상 (사용자 선호 반영)
        confirmButtonText: "탈퇴하기",
        cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    try {
        const response = await fetch("http://localhost:8080/user/delete", {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            // ✅ SweetAlert2 성공 메시지
            await Swal.fire({
                icon: "success",
                title: "회원 탈퇴 완료",
                text: "회원 탈퇴가 성공적으로 처리되었습니다.",
                confirmButtonColor: "#6A5ACD",
            });

            // ✅ 쿠키 삭제
            document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

            // ✅ 홈으로 이동
            router.push("/");
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        // ✅ SweetAlert2 오류 메시지
        Swal.fire({
            icon: "error",
            title: "회원 탈퇴 실패",
            text: error.message || "회원 탈퇴 중 문제가 발생했습니다.",
            confirmButtonColor: "#FF6347",
        });
    }
};


const cancelDelete = () => {
    router.push("/mypage");
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 160px 20px 20px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 12px;
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

.user-info {
    text-align: left;
    padding: 15px;
    background-color: #f8f8f8;
    border-radius: 8px;
    margin-bottom: 20px;
}

.user-info p {
    font-size: 16px;
    color: #333;
    margin: 5px 0;
}

.label {
    color: gray;
    font-weight: bold;
    margin-right: 10px;
}

.warning-text {
    font-size: 14px;
    color: #d32f2f;
    font-weight: bold;
    margin-bottom: 20px;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.button {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.delete-btn {
    background-color: #1a237e;
    color: white;
}

.cancel-btn {
    background-color: #666;
    color: white;
}
</style>
