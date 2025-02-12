<template>
    <div class="bo-list">
        <MovieCard v-for="movie in boMovies" :key="movie.id" :movie="movie" @movieClicked="goToDetailPage" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieList } from '../store/modules/movieListStore';
import MovieCard from './MovieCard.vue';

const router = useRouter();
const { boMovies, useAutoFetch } = useMovieList();
const props = defineProps({
    targetRouteName: {
        type: String,
        default: 'Detail'
    }
});
const goToDetailPage = (movieId) => {
    router.push({ name: props.targetRouteName, params: { movieId } });
};

useAutoFetch();
</script>

<style>
.bo-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0px 20px;
}
</style>
