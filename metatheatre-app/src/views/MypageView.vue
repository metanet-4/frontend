<template>
    <NavBar />
    <div class="wrapper">
        <h5>마이페이지</h5>
        <div class="user-info">
            <div class="profile-container">
                <div class="profile-image">
                    <img :src="profileImage" alt="사용자 이미지" class="profile-img" />
                </div>
                <div class="profile-details">
                    <p>아이디: {{ mypageData.mypageMember.userId }}</p>
                    <p>이메일: {{ mypageData.mypageMember.email }}</p>
                    <p>생일: {{ formatDate(mypageData.mypageMember.birthday) }}</p>
                    <p>성별: {{ mypageData.mypageMember.gender === 1 ? "남성" : "여성" }}</p>
                </div>
            </div>
        </div>
        <hr class="divider" />
        <div class="user-actions">
            <router-link to="/edit-profile" class="action-text">회원 정보 수정</router-link>
            <button @click="handleLogout" class="action-text logout-button">로그아웃</button>

            <router-link to="/delete" class="action-text">회원 탈퇴</router-link>
        </div>
        <!-- 예약 목록 -->
        <h2 class="reservation-title">예매 내역</h2>
        <div v-if="mypageData.reserveList.length > 0">
            <ul class="reservation-list">
                <li v-for="(reservation, index) in mypageData.reserveList" :key="index" class="reservation-item">
                    <router-link :to="`/reservation/${reservation.reservationCode}`" class="reservation-link">
                        <div class="movie-info">
                            <img
                                :src="reservation.mainImage"
                                alt="영화 포스터"
                                class="movie-poster"
                                v-if="reservation.mainImage"
                            />
                            <div class="movie-details">
                                <strong>{{ reservation.movieTitle }}</strong> ({{ reservation.screenName }})
                                <div class="reservation-details">
                                    <span>상영 시간: {{ new Date(reservation.startTime).toLocaleString() }}</span>
                                    <span>예약 코드: {{ reservation.reservationCode }}</span>
                                    <span>좌석: {{ reservation.seatName }}</span>
                                    <span>결제 금액: {{ reservation.paymentAmount }} 원</span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <div v-else>
            <p class="no-reservation-message">예매 내역이 없습니다.</p>
        </div>

        <!-- 취소된 예약 목록 -->
        <h2 class="reservation-title">취소 내역</h2>
        <div v-if="mypageData.cancelList.length > 0">
            <ul class="reservation-list">
                <li v-for="(cancel, index) in mypageData.cancelList" :key="index" class="reservation-item">
                    <div class="movie-info">
                        <img :src="cancel.mainImage" alt="영화 포스터" class="movie-poster" v-if="cancel.mainImage" />
                        <div class="movie-details">
                            <strong>{{ cancel.movieTitle }}</strong> ({{ cancel.screenName }})
                            <div class="reservation-details">
                                <span>상영 시간: {{ new Date(cancel.startTime).toLocaleString() }}</span>
                                <span>예약 코드: {{ cancel.reservationCode }}</span>
                                <span>좌석: {{ cancel.seatName }}</span>
                                <span>결제 금액: {{ cancel.paymentAmount }} 원</span>
                                <span>취소 시간: {{ new Date(cancel.cancelTime).toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div v-else>
            <p class="no-reservation-message">취소 내역이 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import NavBar from "../components/NavBar.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
import ws from "../services/WebSocketService";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter(); // ✅ Vue Router 인스턴스 생성
const profileImage = ref(null);
const mypageData = ref({
    mypageMember: {
        userId: "", // 사용자 아이디
        email: "",
        birthday: 806166000000, // 예시 생일 (타임스탬프)
        image: null,
        gender: 1,
    },
    reserveList: [], // 예약 내역
    cancelList: [], // 취소된 예약 내역
});

// 생일 날짜 포맷 함수
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // 기본적으로 로컬 형식으로 날짜 출력
};

const handleLogout = async () => {
    try {
        await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        ws.disconnect();
        store.dispatch("logout");
        alert("로그아웃 되었습니다.");
        window.sessionStorage.removeItem("vuex");
        router.push("/");
    } catch (error) {
        alert("로그아웃 실패: " + error.message);
    }
};

// 페이지가 로드될 때 API 호출
onMounted(async () => {
    try {
        const response = await fetch("http://localhost:8080/mypage", {
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            mypageData.value = data; // 받은 데이터를 반영
            if (data.mypageMember.image) {
                const response = await axios.get(`http://localhost:8080/file/member/${data.mypageMember.id}/profile`, {
                    responseType: "blob",
                });

                if (response.data) {
                    profileImage.value = URL.createObjectURL(response.data);
                } else {
                    profileImage.value = null;
                }
            }
        } else {
            console.error("API 호출 실패");
        }
    } catch (error) {
        console.error("데이터를 가져오는 데 오류가 발생했습니다:", error);
    }
});
</script>

<style scoped>
.wrapper {
    width: 100%;
    max-width: 390px;
    margin: 0 auto;
    position: absolute;
    top: 125px;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    overflow-x: hidden;
    overflow-y: auto;
    background-color: white;
    padding: 20px;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
}

.reservation-link {
    text-decoration: none;
    color: inherit;
}

.user-info {
    text-align: center;
    margin-bottom: 30px;
}

.profile-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ccc;
    margin-right: 15px;
}

.profile-details {
    flex: 1;
    text-align: left;
}

.profile-details p {
    font-size: 14px;
    color: #666;
    margin: 4px 0;
}

.reservation-list {
    list-style-type: none;
    padding: 0;
}

.reservation-item {
    background-color: #f9f9f9;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.reservation-item:hover {
    background-color: #e0f7fa;
}

.movie-info {
    display: flex;
    align-items: center;
}

.movie-poster {
    width: 70px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 12px;
}

.movie-details {
    flex: 1;
}

.reservation-details span {
    display: block;
    font-size: 12px;
    color: #555;
    margin-top: 4px;
}

h2 {
    font-size: 18px;
    color: #333;
    margin-bottom: 12px;
}

.reservation-title {
    font-size: 20px;
    font-weight: bold;
    color: #1c3788;
    text-align: center;
    margin-bottom: 15px;
    padding-bottom: 5px;
    display: inline-block;
}

.no-reservation-message {
    font-size: 12px;
    color: #777;
    text-align: center;
    font-weight: 500;
    margin-top: 10px;
    display: inline-block;
}

.user-actions {
    text-align: left;
    margin-bottom: 20px;
}

.action-text {
    font-size: 14px;
    color: #555555;
    text-decoration: none;
    font-weight: bold;
    display: block;
    margin: 4px 0;
}

.action-text:hover {
    text-decoration: underline;
}

.divider {
    border: none;
    height: 1px;
    background-color: #aaa;
    /* 연한 회색 */
    margin: 16px 0;
    /* 위아래 여백 */
}

.wrapper h5 {
    text-decoration: underline;
    text-underline-offset: 10px;
    font-size: 20px;
    color: #1c3688;
    margin-bottom: 20px;
}

.logout-button {
    background: none;
    border: none;
    font-size: 14px;
    color: #555;
    cursor: pointer;
    font-weight: bold;
    display: block;
    margin: 4px 0 4px -5px;
    text-align: left;
}

.logout-button:hover {
    text-decoration: underline;
}
</style>
