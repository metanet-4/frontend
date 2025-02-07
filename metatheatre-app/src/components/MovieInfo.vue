<template>
	<div class="movie-info">
		<div class="titleArea">
			<div class="tit">예매 정보</div>
		</div>

		<div class="movie-details">
			<img :src="movie.image" alt="영화 포스터" class="poster" />
			<div class="info">
				<p>{{ movie.title }}</p>
				<p>{{ movie.date }} ({{ movie.time }})</p>
				<p>{{ movie.theater }}</p>
				<p>{{ movie.seat }} ({{ movie.userType }})</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		movie: Object
	}
};
</script>

<style scoped>
.movie-info {
	padding: 16px;
	background-color: #F8F8F8;
}

.titleArea {
	width: 375px;
	height: 64px;
	display: flex;
	align-items: center; 
	padding-left: 16px; 
}

.tit {
	width: 70px;
	height: 24px;
	font-size: 16px;
	font-weight : 700;
	color: #333;
}
	
.movie-details {
	display: flex;
	align-items: center;
}

.poster {
	width: 80px;
	height: 120px;
	border-radius: 8px;
	margin-right: 12px;
}

.info h3 {
	margin: 4px 0;
}
</style>
