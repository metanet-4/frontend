<template>
  <div class="csMovies">
    <p v-for="movie in csMovies" :key="movie.id">
      {{ movie.krName }} - {{ movie.showTime }}분 - {{ movie.watchGrade }} ({{
        movie.releaseDate
      }}
      개봉 예정)
    </p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMovieList } from "../store/modules/movieListStore";

import MovieCard from "./MovieCard.vue";

const { csMovies, fetchComingSoon } = useMovieList();
onMounted(() => {
  fetchComingSoon();
});
</script>

<style></style>
