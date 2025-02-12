<template>
    <div class="payment-methods">
        <p class="payment-title">결제 수단</p>
        <div class="methods-grid">
            <div
                v-for="method in methods"
                :key="method.id"
                class="method-item"
                :class="{ selected: selectedMethod === method.id }"
                @click="selectMethod(method.id)"
            >
                <i :class="['bi', method.icon, 'method-icon']"></i>
                <span class="method-text">{{ method.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedMethod: null,
            methods: [
                { id: "card", name: "카드결제", icon: "bi-credit-card" },
                { id: "mobile", name: "휴대폰결제", icon: "bi-phone" },
                { id: "bank", name: "계좌이체", icon: "bi-bank" },
                { id: "virtual", name: "가상계좌", icon: "bi-file-earmark-text" },
                { id: "kakao", name: "카카오페이", icon: "bi-wallet2" },
                { id: "payco", name: "페이코", icon: "bi-cash" },
            ],
        };
    },
    methods: {
        selectMethod(id) {
            this.selectedMethod = id;
            this.$emit("method-selected", id);
        },
    },
};
</script>

<style scoped>
.payment-methods {
    padding: 16px;
}

.payment-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    text-align: left;
    /* 왼쪽 정렬 */
    margin-left: 12px;
    /* 왼쪽으로 너무 붙지 않게 적절한 여백 */
    padding-bottom: 6px;
    border-bottom: 2px solid #007bff;
    display: inline-block;
    /* border 길이 조정 */
    transition: border-color 0.3s ease-in-out;
}

/* 결제 수단 아이콘 및 텍스트 스타일 */
.methods-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.method-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.method-item:hover {
    transform: scale(1.05);
}

.method-icon {
    font-size: 32px;
    color: #333;
    transition: color 0.2s ease-in-out;
}

/* 선택된 결제 수단 스타일 */
.method-item.selected .method-icon {
    color: #007bff;
}

.method-text {
    font-size: 16px;
}

.method-item.selected .method-text {
    font-weight: bold;
    color: #007bff;
}
</style>
