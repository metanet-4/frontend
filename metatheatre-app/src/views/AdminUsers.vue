<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";

const users = ref([]);
const errorMessage = ref("");

// 🔹 사용자 목록 불러오기
const loadUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    users.value = response.data;
  } catch (error) {
    console.error("사용자 목록 불러오기 실패:", error);
    errorMessage.value = "사용자 목록을 불러오는 데 실패했습니다.";
  }
};

// 🔹 우대 여부 승인
const approveDiscount = async (userId) => {
  try {
    await api.put(`/admin/users/${userId}/approve-discount`);
    alert("우대 여부가 승인되었습니다.");
    loadUsers(); // 리스트 갱신
  } catch (error) {
    console.error("우대 승인 실패:", error);
    errorMessage.value = "우대 승인에 실패했습니다.";
  }
};

// 🔹 사용자 삭제
const deleteUser = async (userId) => {
  if (!confirm(`${userId}님을 삭제하시겠습니까?`)) return;

  try {
    await api.delete(`/admin/users/${userId}`);
    alert(`${userId}님이 삭제되었습니다.`);
    loadUsers();
  } catch (error) {
    console.error("사용자 삭제 실패:", error);
    errorMessage.value = "사용자 삭제에 실패했습니다.";
  }
};

// 🔹 페이지 로드 시 사용자 목록 불러오기
onMounted(loadUsers);
</script>

<template>
  <div class="admin-container">
    <img src="@/assets/logo.png" alt="META THEATRE" class="logo" />
    <h2>사용자 관리</h2>

    <table class="user-table">
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
            <span v-if="user.isDiscounted" class="approved">✅ 승인됨</span>
            <button v-else @click="approveDiscount(user.userId)" class="approve-btn">승인</button>
          </td>
          <td>
            <a v-if="user.hasCertificate" :href="`/admin/users/${user.userId}/certificate`" class="certificate-link">확인</a>
            <span v-else>없음</span>
          </td>
          <td>
            <button @click="deleteUser(user.userId)" class="delete-btn">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.logo {
  width: 200px;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
}

.user-table {
  width: 90%;
  max-width: 800px;
  border-collapse: collapse;
}

.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.user-table th {
  background-color: #f5f5f5;
}

.approve-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.approve-btn:hover {
  background-color: #0056b3;
}

.approved {
  color: green;
  font-weight: bold;
}

.certificate-link {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #a71d2a;
}

.error-msg {
  color: red;
  margin-top: 10px;
}
</style>
