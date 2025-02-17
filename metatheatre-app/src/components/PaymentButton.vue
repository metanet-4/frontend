<template>
    <div class="payment-bar">
        <button @click="processPayment">{{ price }}원 결제하기</button>
    </div>
</template>

<script>
import { Bootpay } from "@bootpay/client-js";
import Swal from "sweetalert2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
    props: {
        price: Number,
        method: String,
        movie: Object,
        playingId: Number,
        ticketType: String,
    },
    methods: {
        async processPayment() {
            console.log("playingId in PaymentButton:", this.playingId);
            console.log("ticketType in PaymentButton:", this.movie.userType);

            console.log("결제 버튼 클릭됨 - 선택된 결제 수단:", this.method);
            if (!this.method) {
                Swal.fire({
                    title: "결제 수단을 선택해주세요.",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "확인",
                });
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
                        email: "user@example.com",
                    },
                    items: [
                        {
                            id: `movie_${this.movie.id}`,
                            name: this.movie.title,
                            qty: 1,
                            price: this.price,
                        },
                    ],
                    extra: {
                        open_type: "iframe",
                        card_quota: "0,2,3",
                        escrow: false,
                    },
                });

                if (response.event === "done") {
                    console.log("결제 성공:", response);
                    await this.reserveTicket(response.data.receipt_id);
                } else if (response.event === "error") {
                    console.error("❌ 결제 실패:", response);
                    alert("결제에 실패했습니다.");
                } else if (response.event === "cancel") {
                    console.warn("⚠️ 결제 취소:", response);
                    alert("결제가 취소되었습니다.");
                }
            } catch (error) {
                console.error("Bootpay 요청 오류:", error);
                alert("결제 요청 중 오류가 발생했습니다.");
            }
        },

        async reserveTicket(receiptId) {
            try {
                const response = await fetch(`${API_BASE_URL}/payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // 쿠키를 전송하기 위해 필요
                    body: JSON.stringify({
                        playingId: this.playingId,
                        receiptId: receiptId,
                        paymentAmount: this.price,
                        ticketType: this.movie.userType,
                        seatNames: this.movie.seat,
                    }),
                });

                if (!response.ok) {
                    console.error("예매 요청 실패:", response);
                    throw new Error("예매 요청 실패");
                }

                const result = await response.json();
                console.log("예매 완료:", result);

                this.$router.push(`/reservation/${result.reservationCode}`);
            } catch (error) {
                console.error("예매 요청 오류:", error);
                alert("예매 요청 중 오류가 발생했습니다.");
            }
        },
    },
};
</script>

<style scoped>
.payment-bar {
    position: fixed;
    height: 70px;
    bottom: 0;
    width: 100%;
    max-width: 390px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #281b7a;
    color: white;
    text-align: center;
    padding: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    width: 100%;
    height: 100%;
    max-width: 360px;
    font-size: 22px;
    background-color: #281b7a;
    color: white;
    border: none;
    cursor: pointer;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
