<template>
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
    <!-- 도넛 차트 -->
    <div class="chart-container">
        <div class="chart-box">
            <apexchart type="donut" width="200" :options="chartOptionsDoughnut" :series="seriesDoughnut" />
        </div>
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
    <div v-if="movie">
        <h1>{{ movie.krName }}</h1>
        <img :src="movie.mainImage" alt="영화 이미지" />
        <p>{{ movie.description }}</p>
        <p>누적 관객수: {{ movie.totalAudience }}</p>
        <button @click="likeMovie">좋아요</button>
        <button @click="bookMovie">예매하기</button>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import YouTube from 'vue3-youtube';
import VueApexCharts from 'vue3-apexcharts';

export default defineComponent({
    components: { YouTube, apexchart: VueApexCharts },
    data() {
        return {
            movie: null,
            movieChart: null,
            youtubeVideoId: null,
            seriesBar: [{ name: '누적 관객수', data: [0] }], // 기본값 0
            chartOptionsBar: {
                chart: { id: 'movie-audience-chart', toolbar: { show: false } },
                plotOptions: { bar: { horizontal: false, columnWidth: '20%' }, borderRadius: 5 },
                xaxis: {
                    categories: ['누적 관객수'], // X축 최소한의 카테고리 유지
                    labels: { show: true, style: { fontSize: '12px', fontWeight: 'bold' } }, // X축 라벨 보이게 함
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                },
                yaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } }, // Y축 숨김
                grid: { show: false }, // 배경선 숨김
                tooltip: { enabled: false }, // 툴팁 숨김
                colors: ['#36a2eb'], // 파란색 계열
            },
            // 새 바 차트 (남성 vs 여성)
            seriesGender: [{ name: '관객 수', data: [0, 0] }], // 초기값
            chartOptionsGender: {
                chart: { id: 'gender-chart', toolbar: { show: false } },
                plotOptions: { bar: { horizontal: false, columnWidth: '30%' }, borderRadius: 5 },
                xaxis: {
                    categories: ['남성', '여성'],
                    labels: { show: true, style: { fontSize: '12px', fontWeight: 'bold' } },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                },
                yaxis: { labels: { show: true }, axisBorder: { show: false }, axisTicks: { show: false } },
                grid: { show: false },
                tooltip: { enabled: true },
                colors: ['#ff9800', '#e91e63'],
            },
            // 연령대별 도넛 차트
            seriesDoughnut: [0, 0, 0, 0, 0, 0, 0, 0], // 10대~80대 초기값
            chartOptionsDoughnut: {
                chart: { type: 'donut' },
                labels: ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'],
                colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#B8E986'],
                legend: { show: false },
                dataLabels: { enabled: true },
            },
        };
    },
    mounted() {
        const movieId = this.$route.params.movieId; // URL에서 productId 가져오기
        fetch(`http://localhost:8080/movie/${movieId}`)
            .then((response) => response.json())
            .then((data) => {
                this.movie = data.movie;
                this.movieChart = data.movieMemberForChart;
                // 🔥 누적 관객수 데이터를 반영
                const audienceCount = this.movie.totalAudience || 0;
                this.seriesBar = [{ name: '누적 관객수', data: [audienceCount] }];
                this.seriesDoughnut = [audienceCount];
                const manCount = this.movieChart?.man || 0;
                const womanCount = this.movieChart?.woman || 0;
                this.seriesGender = [{ name: '관객 수', data: [manCount, womanCount] }];

                // 연령대별 도넛 차트 업데이트
                this.seriesDoughnut = [
                    this.movieChart?.age10th || 0,
                    this.movieChart?.age20th || 0,
                    this.movieChart?.age30th || 0,
                    this.movieChart?.age40th || 0,
                    this.movieChart?.age50th || 0,
                    this.movieChart?.age60th || 0,
                    this.movieChart?.age70th || 0,
                    this.movieChart?.age80th || 0,
                ];
                // API 사용 제한으로 비활성화
                // if (this.movie?.krName) {
                //     this.fetchYouTubeVideo(this.movie.krName); // 영화 제목으로 YouTube 검색
                // }
            })
            .catch((error) => console.error('Error fetching movie:', error));
    },
    methods: {
        likeMovie() {
            alert('좋아요를 눌렀습니다!');
        },
        bookMovie() {
            window.location.href = '/booking';
        },
        onReady() {
            this.$refs.youtube.playVideo();
        },
        fetchYouTubeVideo(query) {
            const apiKey = 'AIzaSyBBMTorLdM7dwvSjjayraiT8CHXsyZ93t0';
            const searchQuery = `${query} 예고편`; // 🔥 ' 예고편' 추가
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
                searchQuery
            )}&type=video&key=${apiKey}`;

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (data.items && data.items.length > 0) {
                        this.youtubeVideoId = data.items[0].id.videoId; // videoId만 추출하여 저장
                        console.log(this.youtubeVideoId);
                    } else {
                        this.youtubeVideoId = null;
                    }
                })
                .catch((error) => {
                    console.error('Error fetching YouTube video:', error);
                    this.youtubeVideoId = null;
                });
        },
        updateChart() {
            if (this.movie) {
                this.series = [{ name: '누적 관객수', data: [this.movie.totalAudience || 0] }];
            }
        },
    },
});
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
    width: 50%; /* 두 개의 차트가 균등하게 배치됨 */
    display: flex;
    justify-content: center; /* 차트 가운데 정렬 */
}
</style>
