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
  margin: 0 auto; /* 가운데 정렬 */
  overflow: hidden;
  position: relative; /* 하위 요소를 기준으로 위치 설정 가능 */
  background-color: white;
}
</style>
