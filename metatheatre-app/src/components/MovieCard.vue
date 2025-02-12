<template>
    <div class="card" @click="handleCardClick">
        <img class="poster" :src="movie.mainImage" />
        <div class="card-top">
            <img :src="getGradeImage(movie.watchGrade)" class="grade-icon" />
            <p class="title">{{ movie.krName }}</p>
        </div>
        <div class="card-bottom">
            <p class="date">{{ formatDate(movie.releaseDate) }} 개봉</p>
            <p class="time"><i class="bi bi-stopwatch"></i> {{ movie.showTime }}분</p>
        </div>
    </div>
</template>

<script setup>
import all from "../assets/all.png";
import grade12 from "../assets/12.png";
import grade15 from "../assets/15.png";
import grade19 from "../assets/19.png";
import none from "../assets/none.png";

const props = defineProps({
    movie: Object,
});

const emit = defineEmits(["movieClicked"]);

const handleCardClick = () => {
    emit("movieClicked", props.movie.id);
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
};

const getGradeImage = (watchGrade) => {
    const gradeImages = {
        전체관람가: all,
        "12세이상관람가": grade12,
        "15세이상관람가": grade15,
        청소년관람불가: grade19,
        미정: none,
    };
    return gradeImages[watchGrade] || all;
};
</script>

<style scoped>
.card {
    text-decoration: none;
    border: none;
    display: flex;
    flex-direction: column;
    width: 160px;
    cursor: pointer;
}

.poster {
    height: 229px;
}

.card-top {
    display: flex;
    margin-top: 5px;
}

.grade-icon {
    width: 20px;
    height: 20px;
    margin-right: 3px;
}

.title {
    margin: 0px;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
}

.card-bottom {
    display: flex;
    justify-content: space-between;
}

.date {
    font-size: 10px;
    margin-top: 3px;
}

.time {
    font-size: 12px;
}
</style>
