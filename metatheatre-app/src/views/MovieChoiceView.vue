<template>
    <div class="movie-selection-page">
        <!-- 상단 헤더 -->
        <header class="header">
            <h1>영화 선택</h1>
            <hr />
        </header>
        <div class="wrapper">
            <div class="movie-show">
                <BoxOfficeMovies targetRouteName="CinemaChoice" />
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import BoxOfficeMovies from "../components/BoxOfficeMovies.vue";

</script>


<style scoped>
/* 공통 스타일 초기화 (예시) */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* 전체 페이지 컨테이너 */
.movie-selection-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 600px;
    margin: 0 auto;
    font-family: sans-serif;
    padding-bottom: 80px;
    padding-top: 20px;
}

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

/* 상단 헤더 */
.header {
    text-align: center;
}

.header h1 {
    font-size: 1.4rem;
    margin-bottom: 10px;
    font-weight: bold;
}

.header hr {
    border: none;
    border-top: 1px solid #ccc;
}

.movie-show {
    width: 100%;
    height: 50px;
    display: flex;
    gap: 10px;
    justify-content: center;
}
</style>