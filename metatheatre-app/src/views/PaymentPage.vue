<template>
	<div class="mobile-container">
		<header>
			<button @click="$router.go(-1)" class="back-button">⬅</button>
			<h1 class="title">결제하기</h1>
		</header>
		<MovieInfo :movie="movie" />
		<!-- 결제 수단 선택 컴포넌트 -->
		<PaymentMethods @method-selected="setPaymentMethod" />
		<!-- 결제 버튼: selectedMethod를 props로 전달 -->
		<PaymentButton :price="100" :method="selectedMethod" :movie="movie" />
	</div>
</template>

<script>
import MovieInfo from "@/components/MovieInfo.vue";
import PaymentMethods from "@/components/PaymentMethods.vue";
import PaymentButton from "@/components/PaymentButton.vue";

export default {
	components: { MovieInfo, PaymentMethods, PaymentButton },
	data() {
		return {
			movie: {
				title: "히트맨 2",
				date: "2025-02-05",
				time: "14:00 ~ 16:30",
				theater: "신촌 / 1관",
				seat: "F6",
				userType: "성인 1",
				image: "src/assets/movie-poster.png"
			},
			selectedMethod: "" 
		};
	},
	methods: {
		setPaymentMethod(method) {
			this.selectedMethod = method;
		}
	}
};
</script>


<style scoped>
.header {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 35px;
	border-bottom: 1px solid #ddd;
	position: relative;
	padding: 0 16px;
}

.back-button {
	position: absolute;
	left: 16px;
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	height: 35px;
	display: flex;
	align-items: center;
}

.title {
	font-size: 22px;
	text-align: center;
	flex-grow: 1;
	height: 35px;
	justify-content: center;
}
</style>
