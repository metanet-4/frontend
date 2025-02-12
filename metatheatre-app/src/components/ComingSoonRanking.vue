<template>
    <div class="cs-ranking">
        <p class="cs-title">{{ $t("title.cs-ranking") }}</p>
        <div class="cs-ranking-contents">
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
                    <RankingCard :movie="movie" category="cs" @movieClicked="goToDetailPage" />
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
import "swiper/css/effect-cards";
import "swiper/css";

const router = useRouter();
const { csMovies, useAutoFetch } = useMovieList();
const modules = [EffectCreative];
const { t } = useI18n();

const top5 = computed(() => {
    return (
        csMovies.value?.slice(0, 5).map((movie) => ({
            ...movie,
            movieName: t(`cs-5.${movie.id}.name`, movie.krName),
            movieDirector: t(`cs-5.${movie.id}.director`, movie.directors),
            movieNation: t(`cs-5.${movie.id}.nation`, movie.nation),
        })) || []
    );
});

const goToDetailPage = (movieId) => {
    router.push({ name: "Detail", params: { movieId } });
};

useAutoFetch(10000);
</script>

<style>
.cs-ranking {
    margin-top: 38px;
    height: 250px;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
}

.cs-title {
    font-size: 18px;
    font-weight: bold;
    color: #525252;
    margin: 10px;
}

.cs-ranking-contents {
    width: 80%;
    align-self: center;
}

.custom-swiper {
    width: 330px;
}
</style>
