<template>
    <div class="card" @click="handleCardClick">
        <img class="poster" :src="movie.mainImage" />
        <div class="card-content">
            <div class="card-content-top">
                <img :src="getGradeImage(movie.watchGrade)" class="grade-icon" />
                <p class="title">{{ movie.movieName }}</p>
            </div>
            <p class="info">
                <i class="bi bi-calendar4-event"></i>
                {{ formatDate(movie.releaseDate) }} · <i class="bi bi-stopwatch"></i> {{ movie.showTime
                }}{{ t("etc.minute") }}
            </p>
            <p class="info"><i class="bi bi-camera-reels"></i> {{ movie.movieDirector }}</p>
            <p class="info"><i class="bi bi-globe"></i> {{ movie.movieNation }}</p>
            <p v-if="category === 'bo'" class="count">
                <i class="bi bi-people-fill"></i> {{ movie.totalAudience }}{{ t("etc.audience") }}
            </p>
            <p v-else-if="category === 'cs'" class="count">
                <i class="bi bi-heart-fill"></i> {{ movie.likeCount }}{{ t("etc.like") }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import all from "../assets/all.png";
import grade12 from "../assets/12.png";
import grade15 from "../assets/15.png";
import grade19 from "../assets/19.png";
import none from "../assets/none.png";

const { t } = useI18n();

const emit = defineEmits(["movieClicked"]);

const props = defineProps({
    movie: Object,
    category: String,
});

const handleCardClick = () => {
    emit("movieClicked", props.movie.id);
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
        .format(date)
        .replace(/\.$/, "");
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
    background: none;
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 300px;
    cursor: pointer;
}

.poster {
    width: 120px;
}

.card-content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

.card-content-top {
    display: flex;
    height: 30px;
    width: 141px;
}

.grade-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

.title {
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
    margin: 0px;
}

.info {
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 0px;
    color: #525252;
}

.count {
    margin-top: auto;
    margin-bottom: 0px;
    font-size: 14px;
}
</style>
