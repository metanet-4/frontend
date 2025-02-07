<script>
export default {
    name: 'MovieTempPage',
    methods: {
        getDetail(movieId) {
            this.$router.push({
                name: 'Detail',
                params: { movieId },
            });
        },
    },
};
</script>

<template>
    <div class="one">
        <router-link :to="{ name: 'Detail', params: { movieId: '20223819' } }"><button>1번테스트</button></router-link>
    </div>
</template>

<style></style>
