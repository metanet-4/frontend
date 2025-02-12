<template>
    <NavBar />
    <div class="wrapper">
        <h6 class="text-xl font-bold text-gray-800 mb-4">"{{ keyword }}" 검색 결과</h6>

        <div v-if="movies.length > 0" class="grid gap-6">
            <div v-for="movie in movies" :key="movie.id" class="movie-card">
                <router-link :to="{ name: 'Detail', params: { movieId: movie.id } }" class="movie-card-link">
                    <div class="movie-card-content">
                        <!-- 🎬 영화 포스터 -->
                        <img
                            :src="movie.mainImage || 'https://via.placeholder.com/120x180?text=No+Image'"
                            alt="영화 포스터"
                            class="poster-img"
                        />

                        <!-- 📌 영화 정보 -->
                        <div class="movie-info">
                            <h3 class="text-sm font-semibold text-gray-900 truncate">{{ movie.krName }}</h3>
                            <p class="text-xs text-gray-500 italic truncate">{{ movie.enName }}</p>
                            <div class="mt-1 text-xs text-gray-600 space-y-0.5">
                                <p><span class="font-medium">🎬 감독:</span> {{ movie.directors }}</p>
                                <p><span class="font-medium">👥 출연:</span> {{ movie.actors }}</p>
                                <p><span class="font-medium">📅 개봉:</span> {{ formatDate(movie.releaseDate) }}</p>
                                <p><span class="font-medium">🌍 국가:</span> {{ movie.nation }}</p>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <div v-else class="text-center text-gray-600 mt-10">
            <p class="text-lg">검색 결과가 없습니다. 😢</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import NavBar from "../components/NavBar.vue";

const router = useRoute();
const keyword = ref(router.params.keyword);
const movies = ref([]);
let intervalId = null;

// 🔹 API 호출 함수
const fetchMovies = async (searchKeyword) => {
    try {
        const response = await fetch(`http://localhost:8080/movie/search/${encodeURIComponent(searchKeyword)}`, {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            movies.value = data;
        } else {
            console.error("API 호출 실패");
        }
    } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    }
};

const formatDate = (timestamp) => {
    if (timestamp) {
        const date = new Date(parseInt(timestamp));
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    return "";
};

// 🔹 컴포넌트 마운트 시 API 호출 및 10초마다 갱신
onMounted(() => {
    fetchMovies(keyword.value);
    intervalId = setInterval(() => {
        fetchMovies(keyword.value);
    }, 10000);
});

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});

// 🔹 검색어 변경 감지
watch(
    () => router.params.keyword,
    (newKeyword) => {
        if (newKeyword) {
            keyword.value = newKeyword;
            movies.value = [];
            fetchMovies(newKeyword);
        }
    }
);
</script>

<style scoped>
.movie-card-link {
    text-decoration: none;
    color: inherit;
}

.wrapper {
    max-width: 100%;
    margin: 20px auto;
    padding: 15px;
    background: #f9fafb;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 카드 스타일 */
.movie-card {
    display: flex;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
    align-items: center;
    width: 100%;
    flex-wrap: wrap; /* 포스터와 내용이 가로로 배치되도록 */
    margin-bottom: 15px;
}

/* 카드 내 내용들을 감싸는 div */
.movie-card-content {
    display: flex;
    align-items: center; /* 세로 중앙 정렬 */
    width: 100%;
}

/* 영화 포스터 스타일 */
.poster-img {
    width: 120px;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
}

/* 영화 정보 스타일 */
.movie-info {
    margin-left: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* 영화 정보 텍스트 스타일 */
.movie-info h3 {
    font-size: 1rem; /* 제목 크기 조정 */
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.movie-info p {
    font-size: 0.8rem; /* 글씨 크기 줄이기 */
    color: #666;
}

/* 반응형을 고려한 1개씩 표시 */
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}
</style>
