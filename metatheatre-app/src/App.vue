<template>
    <div class="mobile-background">
        <div class="mobile-container">
            <router-view />
            <BottomBar />
        </div>
    </div>
</template>

<script setup>
import BottomBar from "./components/BottomBar.vue";
</script>

<style scoped>
.mobile-background {
}

.mobile-container {
    width: 100vw;
    max-width: 390px;
    height: 100vh;
    margin: 0 auto;
    position: relative;
    background-color: white;
    overflow-x: hidden;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
}

.router-view {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 70px;
}
</style>
