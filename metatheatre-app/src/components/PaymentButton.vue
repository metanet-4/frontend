<template>
	<div class="payment-bar">
		<button @click="processPayment">{{ price }}원 결제하기</button>
	</div>
</template>

<script>
import { Bootpay } from "@bootpay/client-js";

export default {
	props: {
		price: Number,
		method: String,
		movie: Object
	},
	methods: {
		async processPayment() {
			console.log("결제 버튼 클릭됨 - 선택된 결제 수단:", this.method);
			if (!this.method) {
				alert("결제 수단을 선택해주세요.");
				return;
			}

			try {
				const response = await Bootpay.requestPayment({
					application_id: import.meta.env.VITE_BOOTPAY_ID,
					price: this.price,
					order_name: this.movie.title,
					order_id: `order_${new Date().getTime()}`,
					pg: "kcp",
					method: this.method,
					tax_free: 0,
					user: {
						id: "user_1234",
						username: "사용자 이름",
						phone: "01000000000",
						email: "user@example.com"
					},
					items: [
						{
							id: `movie_${this.movie.id}`,
							name: this.movie.title,
							qty: 1,
							price: this.price
						}
					],
					extra: {
						open_type: "iframe",
						card_quota: "0,2,3",
						escrow: false
					}
				});

				if (response.event === "done") {
					console.log("결제 성공:", response);
					alert("결제가 완료되었습니다!");
				} else if (response.event === "error") {
					console.error("결제 실패:", response);
					alert("결제에 실패했습니다.");
				} else if (response.event === "cancel") {
					console.warn("결제 취소:", response);
					alert("결제가 취소되었습니다.");
				}
			} catch (error) {
				console.error("Bootpay 요청 오류:", error);
				alert("결제 요청 중 오류가 발생했습니다.");
			}
		}
	}
};
</script>

<style scoped>
.payment-bar {
	position: fixed;
	bottom: 0;
	width: 100%;
	max-width: 390px;
	left: 50%;
	transform: translateX(-50%);
	background-color: #281B7A;
	color: white;
	text-align: center;
	padding: 12px;
}

button {
	width: 100%;
	max-width: 360px;
	font-size: 18px;
	background-color: #281B7A;
	color: white;
	border: none;
	cursor: pointer;
}
</style>