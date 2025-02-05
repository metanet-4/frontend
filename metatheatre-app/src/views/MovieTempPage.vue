<script>
export default {
    name: 'MainPage',
    methods: {
        buyProduct(productId) {
            this.$router.push(`/movie/${productId}`); // Vue Router 사용하여 페이지 이동
        },
    },
};
</script>

<template>
    <div class="one">
        <button class="one" @click="buyProduct('20223819')">1번</button>
    </div>

    <div class="two">
        <button class="two" @click="buyProduct('20249281')">2번</button>
    </div>
</template>

<style></style>
