<template>
    <NavBar />
    <div class="wrapper">
        <div class="showButtons">
            <button
                @click="showBoxOffice"
                :class="{ active: currentTab === 'boxOffice' }"
            >
                박스오피스
            </button>
            <button
                @click="showComingSoon"
                :class="{ active: currentTab === 'comingSoon' }"
            >
                상영예정작
            </button>
        </div>
        <div class="movie-list">
            <BoxOfficeMovies v-if="currentTab === 'boxOffice'" />
            <ComingSoonMovies v-if="currentTab === 'comingSoon'" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import BoxOfficeMovies from "../components/BoxOfficeMovies.vue";
import ComingSoonMovies from "../components/ComingSoonMovies.vue";

const currentTab = ref("boxOffice");

const showBoxOffice = () => {
    currentTab.value = "boxOffice";
};

const showComingSoon = () => {
    currentTab.value = "comingSoon";
};
</script>

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

.showButtons {
    width: 100%;
    height: 50px;
    display: flex;
    gap: 10px;
    justify-content: center;
}

button {
    background: none;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
    color: black;
    transition: color 0.3s ease, border-bottom 0.2s ease;
}

button.active {
    color: #1c3688;
    border-bottom: 2px solid #1c3688;
    font-weight: bold;
}

.movie-list {
    margin-top: 10px;
}
</style>
