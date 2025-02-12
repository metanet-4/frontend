<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";

const users = ref([]);
const modalVisible = ref(false);
const certificateImage = ref("");
const errorMessage = ref("");

// ✅ JWT 토큰 가져오기
const getJwtToken = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        if (cookie.startsWith("jwt=")) {
            return cookie.split("=")[1];
        }
    }
    return "";
};

// ✅ 사용자 목록 불러오기
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

// ✅ 장애인 인증서 보기 (모달)
const showCertificate = async (userId) => {
    try {
        const response = await api.get(`/admin/users/${userId}/certificate`, {
            headers: { Authorization: `Bearer ${getJwtToken()}` },
        });
        if (!response.data) {
            alert("장애인 인증서가 등록되지 않았습니다.");
            return;
        }
        certificateImage.value = `data:image/png;base64,${response.data}`;
        modalVisible.value = true;
    } catch (error) {
        alert("장애인 인증서 불러오기 실패");
    }
};

// ✅ 우대 여부 승인/거절
const updateDiscountStatus = async (userId, status) => {
    try {
        await api.put(
            `/admin/users/${userId}/discount-status`,
            { status },
            {
                headers: { Authorization: `Bearer ${getJwtToken()}` },
            }
        );
        alert(
            status === 1
                ? "우대 여부가 승인되었습니다."
                : "우대 여부가 거절되었습니다."
        );
        loadUsers();
    } catch (error) {
        alert("우대 여부 변경 실패");
    }
};

// ✅ 사용자 삭제
const deleteUser = async (userId) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    try {
        await api.delete(`/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${getJwtToken()}` },
        });
        alert("사용자가 삭제되었습니다.");
        loadUsers();
    } catch (error) {
        alert("사용자 삭제 실패");
    }
};

// ✅ 페이지 로드 시 사용자 목록 불러오기
onMounted(loadUsers);
</script>

<template>
    <div class="admin-container">
        <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
        <h2>사용자 관리</h2>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>우대 여부</th>
                        <th>장애인 인증서</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.userId">
                        <td>{{ user.userId }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span v-if="user.isDiscounted === 1"
                                >✅ 승인됨</span
                            >
                            <span v-else-if="user.isDiscounted === 0"
                                >❌ 거절됨</span
                            >
                            <span v-else>⏳ 대기 중</span>
                            <div class="button-group">
                                <button
                                    @click="
                                        updateDiscountStatus(user.userId, 1)
                                    "
                                >
                                    승인
                                </button>
                                <button
                                    @click="
                                        updateDiscountStatus(user.userId, 0)
                                    "
                                >
                                    거절
                                </button>
                            </div>
                        </td>
                        <td>
                            <button
                                v-if="user.disabilityCertificate"
                                @click="showCertificate(user.userId)"
                            >
                                확인
                            </button>
                            <span v-else>없음</span>
                        </td>
                        <td>
                            <button @click="deleteUser(user.userId)">
                                삭제
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ✅ 장애인 인증서 모달 -->
        <div v-if="modalVisible" class="modal">
            <div class="modal-content">
                <span class="close" @click="modalVisible = false">&times;</span>
                <h2>장애인 인증서</h2>
                <img :src="certificateImage" alt="장애인 인증서 없음" />
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
    height: 100vh;
    overflow-y: auto; /* ✅ 세로 스크롤 가능하도록 설정 */
}

.logo {
    width: 150px;
    margin-bottom: 10px;
}

.table-container {
    width: 100%;
    overflow-x: auto; /* ✅ 가로 스크롤 가능하도록 설정 */
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
    background-color: #0044cc;
    color: white;
}

button {
    padding: 5px;
    font-size: 12px;
    border: none;
    background-color: #0044cc;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    margin: 2px;
}

button:hover {
    background-color: #002a80;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

/* ✅ 스크롤 가능하도록 모달 스타일 */
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
