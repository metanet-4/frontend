<template>
    <NavBar />
    <div class="wrapper" :key="keyword">
        <h2>"{{ keyword }}" 검색 결과</h2>
        <div v-if="movies.length > 0">
            <ul>
                <li v-for="movie in movies" :key="movie.id">
                    <strong>{{ movie.krName }}</strong> ({{ movie.enName }})
                    <p>감독: {{ movie.directors }}</p>
                    <p>출연진: {{ movie.actors }}</p>
                    <p>개봉일: {{ formatDate(movie.releaseDate) }}</p>
                    <p>국가: {{ movie.nation }}</p>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>검색 결과가 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '../components/NavBar.vue';

const router = useRoute();
const keyword = ref(router.params.keyword); // URL에서 검색어 가져오기
const movies = ref([]); // 영화 리스트
let intervalId = null;
let prevCount = ref(0);

// 🔹 API 호출 함수
const fetchMovies = async (searchKeyword) => {
    try {
        const response = await fetch(`http://localhost:8080/movie/search/${encodeURIComponent(searchKeyword)}`, {
            method: 'GET',
            credentials: 'include', // ✅ 쿠키 전송
        });
        if (response.ok) {
            const data = await response.json();
            movies.value = data; // 영화 데이터 저장
        } else {
            console.error('API 호출 실패');
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
    }
};

// 🔹 영화 개수 확인 함수
const checkMovieCount = async () => {
    try {
        const response = await fetch(`http://localhost:8080/movie/search/${encodeURIComponent(keyword.value)}/count`, {
            method: 'GET',
            credentials: 'include', // ✅ 쿠키 전송
        });
        if (response.ok) {
            const count = await response.json();
            if (count !== prevCount.value) {
                fetchMovies(keyword.value); // 개수가 변경되면 새로 데이터를 가져옴
                prevCount.value = count; // 개수 업데이트
            }
        }
    } catch (error) {
        console.error('영화 개수 체크 중 오류 발생:', error);
    }
};

const formatDate = (timestamp) => {
    if (timestamp) {
        const date = new Date(parseInt(timestamp)); // 타임스탬프를 Date 객체로 변환
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 포맷팅 (01, 02, ...)
        const day = date.getDate().toString().padStart(2, '0'); // 일 포맷팅 (01, 02, ...)
        return `${year}-${month}-${day}`; // "YYYY-MM-DD" 형식으로 반환
    }
    return '';
};

// 🔹 onMounted: 처음 페이지 로딩 시에만 실행
onMounted(() => {
    fetchMovies(keyword.value); // 최초 검색어로 API 호출
    checkMovieCount(); // 최초 영화 개수 체크
    intervalId = setInterval(() => {
        checkMovieCount(); // 10초마다 영화 개수 확인
    }, 10000);
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});

// 🔹 watch: keyword가 변경될 때마다 호출
watch(
    () => router.params.keyword,
    (newKeyword) => {
        if (newKeyword) {
            keyword.value = newKeyword;
            movies.value = [];
            prevCount.value = 0; // 이전 영화 개수 초기화
            fetchMovies(newKeyword);
            checkMovieCount(); // 새로운 검색어로 영화 개수 체크
        }
    }
);
</script>

<style scoped>
.wrapper {
    max-width: 600px;
    margin: 20px auto;
    padding: 10px;
    background: white;
}
</style>
