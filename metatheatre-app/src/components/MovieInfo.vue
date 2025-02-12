<template>
    <div class="movie-info">
        <div class="titleArea">
            <div class="tit">예매 정보</div>
        </div>

        <div class="movie-details">
            <img :src="movie.image" alt="영화 포스터" class="poster" />
            <div class="info">
                <h2 class="movie-title">{{ movie.title }}</h2>
                <p class="movie-date">{{ movie.date }}</p>
                <p class="movie-theater">{{ movie.theater }}</p>
                <p class="movie-seat">
                    <span class="seat">{{ movie.seat }}</span>
                    <span class="user-type">({{ movie.userType }})</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        movie: Object,
    },
};
</script>

<style scoped>
.movie-info {
    background-color: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin: 16px 10px;
    max-width: 95%;
}

.titleArea {
    display: flex;
    align-items: center;
    padding-bottom: 0px;
}

.tit {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.movie-details {
    display: flex;
    align-items: flex-start;
    /* 포스터와 설명이 같은 높이에서 시작 */
    margin-top: 12px;
}

.poster {
    width: 80px;
    height: 110px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    margin-right: 10px;
}

.info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 텍스트도 포스터의 맨 위에 정렬 */
}

.movie-title {
    font-size: 16px;
    font-weight: bold;
    color: #222;
    margin-bottom: 6px;
}

.movie-date,
.movie-theater,
.movie-seat {
    font-size: 11px;
    color: #555;
    margin-bottom: 4px;
}

.seat {
    font-weight: bold;
    color: #000;
}

.user-type {
    font-size: 12px;
    color: #777;
}
</style>
