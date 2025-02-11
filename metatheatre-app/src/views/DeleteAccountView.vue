<template>
    <div class="container">
        <h1>회원 탈퇴</h1>

        <div class="user-info">
            <p><strong>아이디:</strong> {{ userInfo.userId }}</p>
            <p><strong>이메일:</strong> {{ userInfo.email }}</p>
            <p><strong>생일:</strong> {{ formatDate(userInfo.birthday) }}</p>
        </div>

        <p class="warning-text">모든 정보가 삭제됩니다.<br>정말 탈퇴하시겠습니까?</p>

        <div class="button-container">
            <button class="button delete-btn" @click="confirmDelete">탈퇴</button>
            <button class="button cancel-btn" @click="cancelDelete">취소</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const userInfo = ref({
    userId: '',
    email: '',
    birthday: '',
});

// 생일 날짜 포맷 함수
const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
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
});

// 회원 탈퇴 요청
const confirmDelete = async () => {
    if (!confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/user/delete', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('회원 탈퇴가 완료되었습니다.');

            // ✅ 쿠키 삭제
            document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

            // ✅ 홈페이지로 이동
            router.push('/');
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        alert('회원 탈퇴 실패: ' + error.message);
    }
};

// 취소 버튼: 마이페이지로 이동
const cancelDelete = () => {
    router.push('/mypage');
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: rgba(246, 246, 246, 0.065);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    
    /* ✅ 중앙 정렬을 위한 추가 스타일 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}


h1 {
    color: #333;
}

.user-info {
    text-align: left;
    margin: 20px 0;
    padding: 10px;
    background-color: #f1f1f1;
    border-radius: 8px;
}

.user-info p {
    margin: 5px 0;
    font-size: 16px;
    color: #555;
}

.warning-text {
    margin-top: 20px;
    font-size: 14px;
    color: red;
}

.button-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.delete-btn {
    background-color: #4e73df;
    color: white;
}

.cancel-btn {
    background-color: #666;
    color: white;
}
</style>
