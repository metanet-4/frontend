<template>
  <div class="boMovies">
    <p v-for="movie in boMovies" :key="movie.id">
      <router-link :to="{ name: 'Detail', params: { movieId: movie.id } }"
        >{{ movie.krName }} - {{ movie.showTime }}분 -
        {{ movie.watchGrade }} ({{ movie.releaseDate }} 개봉)</router-link
      >
    </p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMovieList } from "../stores/movieListStore";

import MovieCard from "./MovieCard.vue";

const { boMovies, fetchBoxOffice } = useMovieList();
onMounted(() => {
  fetchBoxOffice();
});
</script>

<style></style>
