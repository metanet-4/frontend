<template>
    <NavBar />
    <div class="wrapper">
        <!-- 사용자 정보 -->
        <h1>{{ mypageData.mypageMember.name }}</h1>
        <p>이메일: {{ mypageData.mypageMember.email }}</p>
        <p>생일: {{ mypageData.mypageMember.birthday }}</p>
        <p>성별: {{ mypageData.mypageMember.gender === 1 ? '남성' : '여성' }}</p>
        <p>
            프로필:
            <img :src="mypageData.mypageMember.image" alt="사용자 이미지" v-if="mypageData.mypageMember.image" />
            <span v-else>이미지 없음</span>
        </p>

        <!-- 예약 목록 -->
        <h2>예약 목록</h2>
        <div v-if="mypageData.reserveList.length > 0">
            <ul>
                <li
                    v-for="(reservation, index) in mypageData.reserveList"
                    :key="index"
                    @click="goToDetail(reservation.reservationCode)"
                >
                    <strong>{{ reservation.movieTitle }}</strong> ({{ reservation.screenName }})
                    <br />
                    <span>상영 시간: {{ new Date(reservation.startTime).toLocaleString() }}</span>
                    <br />
                    <span>예약 코드: {{ reservation.reservationCode }}</span>
                    <br />
                    <span>좌석: {{ reservation.seatName }}</span>
                    <br />
                    <span>결제 금액: {{ reservation.paymentAmount }} 원</span>
                    <br />
                </li>
            </ul>
        </div>
        <div v-else>
            <p>예약 내역이 없습니다.</p>
        </div>

        <!-- 취소된 예약 목록 -->
        <h2>취소된 예약 목록</h2>
        <div v-if="mypageData.cancelList.length > 0">
            <ul>
                <li v-for="(cancel, index) in mypageData.cancelList" :key="index">
                    <strong>{{ cancel.movieTitle }}</strong> ({{ cancel.screenName }})
                    <br />
                    <span>상영 시간: {{ new Date(cancel.startTime).toLocaleString() }}</span>
                    <br />
                    <span>예약 코드: {{ cancel.reservationCode }}</span>
                    <br />
                    <span>좌석: {{ cancel.seatName }}</span>
                    <br />
                    <span>결제 금액: {{ cancel.paymentAmount }} 원</span>
                    <br />
                    <span>취소 시간: {{ new Date(cancel.cancelTime).toLocaleString() }}</span>
                    <br />
                </li>
            </ul>
        </div>
        <div v-else>
            <p>취소된 예약 내역이 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import { ref, onMounted } from 'vue';

const mypageData = ref({
    mypageMember: {
        userId: '',
        name: '',
        email: '',
        birthday: '',
        image: null,
        gender: 1,
    },
    reserveList: [], // 예약 내역
    cancelList: [], // 취소된 예약 내역
});

const goToDetail = (reservationCode) => {
    router.push({ name: 'ReservationDetail', params: { reservationCode } });
};

// 페이지가 로드될 때 API 호출
onMounted(async () => {
    try {
        const response = await fetch('http://localhost:8080/mypage');
        if (response.ok) {
            const data = await response.json();
            mypageData.value = data; // 받은 데이터를 반영
        } else {
            console.error('API 호출 실패');
        }
    } catch (error) {
        console.error('데이터를 가져오는 데 오류가 발생했습니다:', error);
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
}
</style>
