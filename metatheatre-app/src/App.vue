<template>
  <div class="mobile-container">
    <router-view />
    <BottomBar />
  </div>
</template>

<script setup>
import BottomBar from "./components/BottomBar.vue";
</script>

<style scoped>
.mobile-container {
  width: 100vw;
  max-width: 390px;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  background-color: white;
}
</style>
