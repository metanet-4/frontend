<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import api from "@/api";
import Swal from "sweetalert2";

const users = ref([]);
const modalVisible = ref(false);
const certificateImage = ref("");
const errorMessage = ref("");
const router = useRouter();
const store = useStore();

const getJwtToken = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        if (cookie.startsWith("jwt=")) {
            return cookie.split("=")[1];
        }
    }
    return "";
};

const loadUsers = async () => {
    try {
        const response = await api.get("/admin/users", {
            headers: { Authorization: `Bearer ${getJwtToken()}` },
        });
        users.value = response.data;
    } catch (error) {
        console.error("사용자 목록 불러오기 실패:", error);
        errorMessage.value = "사용자 목록을 불러오지 못했습니다.";
    }
};

const showCertificate = async (userId) => {
    try {
        const response = await api.get(`/admin/users/${userId}/certificate`, {
            headers: { Authorization: `Bearer ${getJwtToken()}` },
        });
        if (!response.data) {
            alert("우대 인증서가 등록되지 않았습니다.");
            return;
        }
        certificateImage.value = `data:image/png;base64,${response.data}`;
        modalVisible.value = true;
    } catch (error) {
        alert("우대 인증서 불러오기 실패");
    }
};

const updateDiscountStatus = async (userId, status) => {
    try {
        await api.put(
            `/admin/users/${userId}/discount-status`,
            { status },
            {
                headers: { Authorization: `Bearer ${getJwtToken()}` },
            }
        );

        // ✅ SweetAlert2 성공 메시지
        Swal.fire({
            icon: "success",
            title: "우대 여부 변경 완료",
            text: status === 1 ? "우대 여부가 승인되었습니다." : "우대 여부가 거절되었습니다.",
            confirmButtonColor: "#6A5ACD", // 💜 사용자 선호 색상
        });

        loadUsers();
    } catch (error) {
        // ✅ SweetAlert2 오류 메시지
        Swal.fire({
            icon: "error",
            title: "우대 여부 변경 실패",
            text: "다시 시도해 주세요.",
            confirmButtonColor: "#FF6347", // 🔴 오류 색상
        });
    }
};

const deleteUser = async (userId) => {
    // ✅ SweetAlert2 확인 메시지
    const result = await Swal.fire({
        title: "정말로 삭제하시겠습니까?",
        text: "이 작업은 되돌릴 수 없습니다!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // 🔴 삭제 버튼 색상
        cancelButtonColor: "#6A5ACD", // 💜 취소 버튼 색상
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    try {
        await api.delete(`/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${getJwtToken()}` },
        });

        // ✅ SweetAlert2 성공 메시지
        Swal.fire({
            icon: "success",
            title: "사용자 삭제 완료",
            text: "사용자가 성공적으로 삭제되었습니다.",
            confirmButtonColor: "#6A5ACD",
        });

        loadUsers();
    } catch (error) {
        // ✅ SweetAlert2 오류 메시지
        Swal.fire({
            icon: "error",
            title: "사용자 삭제 실패",
            text: "삭제를 실패했습니다. 다시 시도해 주세요.",
            confirmButtonColor: "#FF6347",
        });
    }
};

const handleLogout = async () => {
    try {
        await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        store.dispatch("logout");
        window.sessionStorage.removeItem("vuex");

        // ✅ SweetAlert2 성공 메시지 + 페이지 이동
        Swal.fire({
            icon: "success",
            title: "로그아웃 완료",
            text: "로그아웃되었습니다.",
            confirmButtonColor: "#6A5ACD",
        }).then(() => {
            router.push("/").then(() => {
                window.location.reload(); // 강제 새로고침
            });
        });
    } catch (error) {
        // ✅ SweetAlert2 오류 메시지
        Swal.fire({
            icon: "error",
            title: "로그아웃 실패",
            text: error.message,
            confirmButtonColor: "#FF6347",
        });
    }
};

onMounted(loadUsers);
</script>

<template>
    <div class="admin-container">
        <router-link to="/"><img src="@/assets/logo.png" alt="META THEATRE" class="logo" /></router-link>

        <h2 class="title">사용자 관리</h2>

        <button @click="handleLogout" class="logout-button">로그아웃</button>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>우대 여부</th>
                        <th>우대 인증서</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.userId">
                        <td>{{ user.userId }}</td>
                        <td>{{ user.name }}</td>
                        <td>
                            <span v-if="user.isDiscounted === 1">✅ 승인</span>
                            <span v-else-if="user.isDiscounted === 0">❌ 거절</span>
                            <span v-else>⏳ 대기 중</span>
                            <div class="button-group">
                                <button @click="updateDiscountStatus(user.userId, 1)">승인</button>
                                <button @click="updateDiscountStatus(user.userId, 0)">거절</button>
                            </div>
                        </td>
                        <td>
                            <button v-if="user.disabilityCertificate" @click="showCertificate(user.userId)">
                                확인
                            </button>
                            <span v-else>없음</span>
                        </td>
                        <td>
                            <button @click="deleteUser(user.userId)">삭제</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="modalVisible" class="modal">
            <div class="modal-content">
                <span class="close" @click="modalVisible = false">&times;</span>
                <h2>우대 인증서</h2>
                <img :src="certificateImage" alt="우대 인증서 없음" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 390px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 10px;
    height: 90vh;
    overflow-y: auto;
}
.title {
    margin-top: 15px;
    color: #283593;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
    text-decoration: underline;
    text-decoration-thickness: 2px; /* 밑줄 두께 조정 (일부 브라우저 지원) */
    text-underline-offset: 8px; /* 밑줄과 글자 간격 조정 (일부 브라우저 지원) */
}
.logo {
    width: 150px;
    margin-bottom: 10px;
}

.logout-button {
    background-color: #d32f2f;
    color: white;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: auto;
    margin-bottom: 10px;
}

.logout-button:hover {
    background-color: #b71c1c;
}

.table-container {
    width: 100%;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    font-size: 14px;
    word-wrap: break-word;
}

th {
    background-color: #283593;
    color: white;
}

td:first-child {
    max-width: 7ch;
    overflow-wrap: break-word;
    word-break: break-all;
}

button {
    padding: 5px;
    font-size: 12px;
    border: none;
    background-color: #283593;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    margin: 2px;
}

button:hover {
    background-color: #1a237e;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.modal {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    width: 80%;
    max-width: 350px;
}

.close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
}
</style>
