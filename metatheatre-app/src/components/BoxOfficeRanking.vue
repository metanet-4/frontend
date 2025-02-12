<template>
    <div class="bo-ranking">
        <p class="bo-title">{{ $t("title.bo-ranking") }}</p>
        <div class="bo-ranking-contents">
            <swiper
                :grabCursor="true"
                :effect="'creative'"
                :creativeEffect="{
                    prev: {
                        shadow: true,
                        translate: ['-120%', 0, -500],
                    },
                    next: {
                        shadow: true,
                        translate: ['120%', 0, -500],
                    },
                }"
                :modules="modules"
                class="mySwiper2 custom-swiper"
            >
                <swiper-slide v-for="movie in top5" :key="movie.id" class="custom-slide">
                    <RankingCard :movie="movie" category="bo" @movieClicked="goToDetailPage" />
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMovieList } from "../store/modules/movieListStore";
import RankingCard from "./RankingCard.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCreative } from "swiper/modules";
import "swiper/css/effect-creative";
import "swiper/css";

const router = useRouter();
const { boMovies, useAutoFetch } = useMovieList();
const modules = [EffectCreative];
const { t } = useI18n();

const top5 = computed(() => {
    return (
        boMovies.value?.slice(0, 5).map((movie) => ({
            ...movie,
            movieName: t(`bo-5.${movie.id}.name`, movie.krName),
            movieDirector: t(`bo-5.${movie.id}.director`, movie.directors),
            movieNation: t(`bo-5.${movie.id}.nation`, movie.nation),
        })) || []
    );
});

const goToDetailPage = (movieId) => {
    router.push({ name: "Detail", params: { movieId } });
};

useAutoFetch(10000);
</script>

<style>
.bo-ranking {
    height: 250px;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
}

.bo-title {
    font-size: 18px;
    font-weight: bold;
    color: #525252;
    margin: 10px;
}

.bo-ranking-contents {
    width: 80%;
    align-self: center;
}

.custom-swiper {
    width: 330px;
}
</style>
