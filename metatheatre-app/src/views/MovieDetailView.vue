<template>
    <NavBar />
    <div class="wrapper">
        <YouTube
            v-if="youtubeVideoId"
            class="youtube-player"
            :src="`https://www.youtube.com/watch?v=${youtubeVideoId}`"
            @ready="onReady"
            ref="youtube"
            :width="390"
            :height="250"
            :key="youtubeVideoId"
        />

        <div v-if="movie">
            <div class="movie-header">
                <div class="movie-header-info">
                    <h5 class="movie-title">{{ movie.krName }}</h5>
                    <p class="movie-en-title">{{ movie.enName }}</p>
                </div>
                <button @click="toggleLike" :class="liked ? 'liked' : 'unliked'">
                    {{ liked ? '❤️' : '🤍' }}
                </button>
                <button @click="bookMovie" class="book-button">예매하기</button>
            </div>
            <p class="movie-description">{{ movie.description }}</p>
            <div class="movie-header">
                <h5 class="movie-title">상세 정보</h5>
                <button @click="posterDownload" class="book-button2">포스터 다운로드</button>
            </div>
            <hr class="divider" />
            <div class="movie-info">
                <!-- 이미지 크기를 작게 설정 -->
                <img :src="movie.mainImage" alt="영화 이미지" class="movie-image" />

                <!-- 영화 정보 표시 -->
                <div class="movie-details">
                    <p>{{ movie.watchGrade }}</p>
                    <p>{{ formatDate(movie.releaseDate) }} {{ movie.openYn }} · {{ movie.showTime }}분</p>
                    <p><strong>감독</strong> {{ movie.directors }}</p>
                    <p><strong>배우</strong> {{ movie.actors }}</p>
                    <p><strong>국가</strong> {{ movie.nation }}</p>
                </div>
            </div>
            <div class="movie-extra-details"></div>
        </div>

        <div class="chart-container">
            <!-- 바 차트 -->
            <div>
                <apexchart width="190" type="bar" :options="chartOptionsBar" :series="seriesBar"></apexchart>
            </div>
            <!-- 새 바 차트 (남성 vs 여성) -->
            <div>
                <apexchart width="190" type="bar" :options="chartOptionsGender" :series="seriesGender"></apexchart>
            </div>
        </div>
        <!-- 도넛 차트 -->
        <div class="chart-container">
            <div class="chart-box">
                <apexchart type="donut" width="200" :options="chartOptionsDoughnut" :series="seriesDoughnut" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import YouTube from 'vue3-youtube';
import { useRoute } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import axios from 'axios';

const route = useRoute(); // vue-router 사용하여 현재 movieId 파라미터 가져오기

// 데이터 및 상태 변수 설정
const movie = ref(null);
const movieChart = ref(null);
const liked = ref(null);
const youtubeVideoId = ref(null);
const seriesBar = ref([{ name: '누적 관객수', data: [0] }]);
const seriesGender = ref([{ name: '관객 수', data: [0, 0] }]);
const seriesDoughnut = ref([0, 0, 0, 0, 0, 0, 0, 0]);

const chartOptionsBar = ref({
    chart: { id: 'movie-audience-chart', toolbar: { show: false } },
    plotOptions: {
        bar: { horizontal: false, columnWidth: '60%' },
        borderRadius: 5,
    },
    xaxis: {
        categories: ['누적 관객수'],
        labels: { show: true, style: { fontSize: '12px', fontWeight: 'bold' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    grid: { show: false },
    tooltip: { enabled: false },
    colors: ['#006666'],
    dataLabels: {
        enabled: true, // 데이터 레이블 표시
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
        },
        offsetX: 0, // 필요에 따라 위치 조정
        offsetY: 0, // 필요에 따라 위치 조정
    },
});

const chartOptionsGender = ref({
    chart: { id: 'gender-chart', toolbar: { show: false } },
    plotOptions: {
        bar: { horizontal: false, columnWidth: '50%' },
        borderRadius: 5,
    },
    xaxis: {
        categories: ['남성', '여성'],
        labels: { show: true, style: { fontSize: '12px', fontWeight: 'bold' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    grid: { show: false },
    tooltip: { enabled: true },
    colors: ['#ff9800', '#e91e63'],
});

const chartOptionsDoughnut = ref({
    chart: { type: 'donut', height: 550 },
    labels: ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'],
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#B8E986'],
    legend: { show: false },
    dataLabels: { enabled: true },
    plotOptions: {
        pie: {
            donut: {
                size: '50%',
            },
        },
    },
    title: {
        text: '연령대 분포', // 🔥 차트의 제목 추가
        align: 'center', // 가운데 정렬
        offsetY: 77, // 위치 조정 (아래쪽으로 이동)
        floating: true,
        style: {
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#333',
        },
    },
});

// 영화 데이터 가져오기 함수
const fetchMovieData = (movieId) => {
    fetch(`http://localhost:8080/movie/detail/${movieId}`, {
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((data) => {
            movie.value = data.movie;
            movieChart.value = data.movieMemberForChart;
            liked.value = data.isLiked;

            const audienceCount = movie.value.totalAudience || 0;
            seriesBar.value = [{ name: '누적 관객수', data: [audienceCount] }];
            seriesDoughnut.value = [audienceCount];

            const manCount = movieChart.value?.man || 0;
            const womanCount = movieChart.value?.woman || 0;
            seriesGender.value = [{ name: '관객 수', data: [manCount, womanCount] }];

            seriesDoughnut.value = [
                movieChart.value?.age10th || 0,
                movieChart.value?.age20th || 0,
                movieChart.value?.age30th || 0,
                movieChart.value?.age40th || 0,
                movieChart.value?.age50th || 0,
                movieChart.value?.age60th || 0,
                movieChart.value?.age70th || 0,
                movieChart.value?.age80th || 0,
            ];
        })
        .then((response) => response.json())
        .then((data) => {
            movie.value = data.movie;
            movieChart.value = data.movieMemberForChart;
            liked.value = data.isLiked;

            const audienceCount = movie.value.totalAudience || 0;
            seriesBar.value = [{ name: '누적 관객수', data: [audienceCount] }];
            seriesDoughnut.value = [audienceCount];

            const manCount = movieChart.value?.man || 0;
            const womanCount = movieChart.value?.woman || 0;
            seriesGender.value = [{ name: '관객 수', data: [manCount, womanCount] }];

            seriesDoughnut.value = [
                movieChart.value?.age10th || 0,
                movieChart.value?.age20th || 0,
                movieChart.value?.age30th || 0,
                movieChart.value?.age40th || 0,
                movieChart.value?.age50th || 0,
                movieChart.value?.age60th || 0,
                movieChart.value?.age70th || 0,
                movieChart.value?.age80th || 0,
            ];
            //API 호출 부분 비활성화 처리 (영화 제목으로 YouTube 비디오 검색)
            // if (movie.value.krName) {
            //     fetchYouTubeVideo(movie.value.krName);
            // }
        })
        .catch((error) => console.error('Error fetching movie:', error));
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp); // 타임스탬프를 Date 객체로 변환
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date); // 'yyyy.MM.dd' 형식으로 출력
};

// 초기 로딩 시 영화 데이터 가져오기
onMounted(() => {
    const movieId = route.params.movieId;
    fetchMovieData(movieId);
});

// movieId 변경 시 데이터 새로 로딩
watch(
    () => route.params.movieId, // movieId가 변경될 때
    (newMovieId) => {
        fetchMovieData(newMovieId);
    }
);

const toggleLike = async () => {
    try {
        const movieId = route.params.movieId;
        const response = await axios.post(`http://localhost:8080/movie/detail/${movieId}`, {
            credentials: 'include',
        });
        if (response.status === 200) {
            liked.value = !liked.value; // 좋아요 상태 반전
        }
    } catch (error) {
        console.error('좋아요 처리 중 오류 발생', error);
    }
};

// 예매하기 버튼 클릭
const bookMovie = () => {
    window.location.href = '/booking';
};

// YouTube API 호출을 위한 함수
const fetchYouTubeVideo = (query) => {
    const apiKey = 'AIzaSyBBMTorLdM7dwvSjjayraiT8CHXsyZ93t0';
    const searchQuery = `${query} 예고편`; // ' 예고편' 추가
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        searchQuery
    )}&type=video&key=${apiKey}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.items && data.items.length > 0) {
                youtubeVideoId.value = data.items[0].id.videoId; // videoId만 추출하여 저장
                console.log(youtubeVideoId.value);
            } else {
                youtubeVideoId.value = null;
            }
        })
        .catch((error) => {
            console.error('Error fetching YouTube video:', error);
            youtubeVideoId.value = null;
        });
};

// 포스터 다운로드
const posterDownload = async () => {
    console.log(movie.value.mainImage);
    try {
        const response = await axios.get(
            `http://localhost:8080/movie/proxy-image?url=${encodeURIComponent(movie.value.mainImage)}`,
            {
                responseType: 'blob',
            }
        );

        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;

        const filename = movie.value.krName;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('포스터 다운로드에 실패하였습니다.', error);
    }
};
</script>

<style scoped>
.youtube-player {
    max-width: 390px;
}

.chart-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
}

.chart-box {
    width: 50%;
    display: flex;
    justify-content: center;
}
</style>

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

.youtube-player {
    max-width: 390px;
}
.chart-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
}

.chart-box {
    width: 50%; /* 두 개의 차트가 균등하게 배치됨 */
    display: flex;
    justify-content: center; /* 차트 가운데 정렬 */
}

.apexcharts-svg {
    height: 300px;
}

.movie-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    gap: 10px; /* 제목과 버튼 사이 간격 */
}

.movie-header-info {
    flex: 1; /* 버튼을 제외한 나머지 공간을 차지하도록 설정 */
    min-width: 0; /* flex 사용 시, 글자가 넘치는 것 방지 */
}

.movie-title {
    font-size: 16px; /* 기존보다 살짝 작은 크기 */
    font-weight: bold;
    margin: 0;
    word-break: break-word; /* 긴 제목도 줄바꿈 가능하게 설정 */
}

.movie-en-title {
    font-size: 14px; /* 영어 제목도 살짝 작은 크기로 조정 */
    color: gray;
    margin: 0;
    word-break: break-word;
}

.book-button {
    background-color: #281b7a; /* 예쁜 빨간색 버튼 */
    color: white;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    white-space: nowrap; /* 버튼은 한 줄 유지 */
}

.book-button2 {
    background-color: #666666;
    color: white;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    white-space: nowrap; /* 버튼은 한 줄 유지 */
}

.book-button:hover {
    background-color: #3a2ca4;
}

.book-button2:hover {
    background-color: #777777;
}

.movie-description {
    font-size: 14px;
    line-height: 1.6; /* 줄 간격 */
    color: #333; /* 글자 색 */
    background-color: #f8f8f8; /* 부드러운 배경 */
    padding: 10px; /* 안쪽 여백 */
    border-radius: 8px; /* 둥근 모서리 */
    word-break: break-word; /* 긴 단어 자동 줄바꿈 */
    text-align: justify; /* 양쪽 정렬 */
}

.divider {
    border: none;
    height: 1px;
    background-color: #aaa; /* 연한 회색 */
    margin: 16px 0; /* 위아래 여백 */
}

.liked,
.unliked {
    background: none; /* 배경 제거 */
    border: none; /* 테두리 제거 */
    font-size: 24px; /* 하트 크기 조절 */
    cursor: pointer; /* 클릭 가능 표시 */
    padding: 5px; /* 여백 추가 */
}

.movie-info {
    display: flex;
    align-items: center; /* 수평으로 정렬 */
}

.movie-image {
    width: 120px; /* 이미지 크기를 작게 설정 */
    margin-right: 10px; /* 이미지와 텍스트 사이 간격 */
    margin-bottom: 15px;
}

.movie-details {
    font-size: 15px; /* 텍스트 크기 설정 */
    font-weight: bold;
    line-height: 1.3;
}
</style>
