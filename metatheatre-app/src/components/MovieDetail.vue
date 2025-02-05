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

export default {
    components: { YouTube },
    data() {
        return {
            movie: null, // 영화 정보
            youtubeVideoId: null, // YouTube 동영상 ID
        };
    },
    mounted() {
        const productId = this.$route.params.productId; // URL에서 productId 가져오기
        fetch(`http://localhost:8080/movie/${productId}`)
            .then((response) => response.json())
            .then((data) => {
                this.movie = data;
                // api 사용횟수로 잠궈둠둠
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
    },
};
</script>

<style scoped>
.youtube-player {
    max-width: 390px;
}
</style>
