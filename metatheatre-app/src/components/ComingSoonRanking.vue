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
        <swiper-slide
          v-for="movie in top5"
          :key="movie.id"
          class="custom-slide"
        >
          <RankingCard
            :movie="movie"
            :movieName="movie.krName"
            :movieDirector="movie.directors"
            :movieNation="movie.nation"
            category="cs"
            @movieClicked="goToDetailPage"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMovieList } from "../store/modules/movieListStore";
import RankingCard from "./RankingCard.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCreative } from "swiper/modules";
import "swiper/css/effect-cards";
import "swiper/css";

const router = useRouter();
const { csMovies, useAutoFetch } = useMovieList();
const top5 = computed(() => csMovies.value?.slice(0, 5) || []);
const modules = [EffectCreative];

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

.custom-slide {
}
</style>
