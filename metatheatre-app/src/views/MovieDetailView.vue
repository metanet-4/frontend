<template>
  <NavBar />
  <div class="wrapper">
    <button @click="posterDownload">포스터 다운로드</button>
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
      <h1>{{ movie.krName }}</h1>
      <img :src="movie.mainImage" alt="영화 이미지" width="390" />
      <p>{{ movie.description }}</p>
      <p>누적 관객수: {{ movie.totalAudience }}</p>
      <button @click="toggleLike" :class="liked ? 'liked' : 'unliked'">
        {{ liked ? "❤️" : "🤍" }}
      </button>
      <button @click="bookMovie">예매하기</button>
    </div>
    <!-- 도넛 차트 -->
    <div class="chart-container">
      <div class="chart-box">
        <apexchart
          type="donut"
          width="200"
          :options="chartOptionsDoughnut"
          :series="seriesDoughnut"
        />
      </div>
    </div>

    <div class="chart-container">
      <!-- 바 차트 -->
      <div>
        <apexchart
          width="190"
          type="bar"
          :options="chartOptionsBar"
          :series="seriesBar"
        ></apexchart>
      </div>
      <!-- 새 바 차트 (남성 vs 여성) -->
      <div>
        <apexchart
          width="190"
          type="bar"
          :options="chartOptionsGender"
          :series="seriesGender"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import YouTube from "vue3-youtube";
import { useRoute } from "vue-router";
import NavBar from "../components/NavBar.vue";
import axios from "axios";

const route = useRoute(); // vue-router 사용하여 현재 movieId 파라미터 가져오기

// 데이터 및 상태 변수 설정
const movie = ref(null);
const movieChart = ref(null);
const liked = ref(null);
const youtubeVideoId = ref(null);
const seriesBar = ref([{ name: "누적 관객수", data: [0] }]);
const seriesGender = ref([{ name: "관객 수", data: [0, 0] }]);
const seriesDoughnut = ref([0, 0, 0, 0, 0, 0, 0, 0]);

const chartOptionsBar = ref({
  chart: { id: "movie-audience-chart", toolbar: { show: false } },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "20%" },
    borderRadius: 5,
  },
  xaxis: {
    categories: ["누적 관객수"],
    labels: { show: true, style: { fontSize: "12px", fontWeight: "bold" } },
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
  colors: ["#36a2eb"],
});

const chartOptionsGender = ref({
  chart: { id: "gender-chart", toolbar: { show: false } },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "30%" },
    borderRadius: 5,
  },
  xaxis: {
    categories: ["남성", "여성"],
    labels: { show: true, style: { fontSize: "12px", fontWeight: "bold" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { show: true },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  grid: { show: false },
  tooltip: { enabled: true },
  colors: ["#ff9800", "#e91e63"],
});

const chartOptionsDoughnut = ref({
  chart: { type: "donut" },
  labels: ["10대", "20대", "30대", "40대", "50대", "60대", "70대", "80대"],
  colors: [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#B8E986",
  ],
  legend: { show: false },
  dataLabels: { enabled: true },
});

// 영화 데이터 가져오기 함수
const fetchMovieData = (movieId) => {
  fetch(`http://localhost:8080/movie/detail/${movieId}`, {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      movie.value = data.movie;
      movieChart.value = data.movieMemberForChart;
      liked.value = data.isLiked;

      const audienceCount = movie.value.totalAudience || 0;
      seriesBar.value = [{ name: "누적 관객수", data: [audienceCount] }];
      seriesDoughnut.value = [audienceCount];

      const manCount = movieChart.value?.man || 0;
      const womanCount = movieChart.value?.woman || 0;
      seriesGender.value = [{ name: "관객 수", data: [manCount, womanCount] }];

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
    .catch((error) => console.error("Error fetching movie:", error));
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
    const response = await axios.post(
      `http://localhost:8080/movie/detail/${movieId}`,
      {
        credentials: "include",
      }
    );
    if (response.status === 200) {
      liked.value = !liked.value; // 좋아요 상태 반전
    }
  } catch (error) {
    console.error("좋아요 처리 중 오류 발생", error);
  }
};

// 예매하기 버튼 클릭
const bookMovie = () => {
  window.location.href = "/booking";
};

// YouTube API 호출을 위한 함수
const fetchYouTubeVideo = (query) => {
  const apiKey = "AIzaSyBBMTorLdM7dwvSjjayraiT8CHXsyZ93t0";
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
      console.error("Error fetching YouTube video:", error);
      youtubeVideoId.value = null;
    });
};

// 포스터 다운로드
const posterDownload = async () => {
  console.log(movie.value.mainImage);
  try {
    const response = await axios.get(
      `http://localhost:8080/movie/proxy-image?url=${encodeURIComponent(
        movie.value.mainImage
      )}`,
      {
        responseType: "blob",
      }
    );

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;

    const filename = movie.value.krName;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("포스터 다운로드에 실패하였습니다.", error);
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
</style>
