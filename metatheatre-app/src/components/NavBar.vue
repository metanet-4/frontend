<template>
  <nav class="nav-bar">
    <img :src="logo" alt="로고 이미지" class="logo" />
    <div>검색창</div>
  </nav>
</template>

<script setup>
import logo from "../assets/logo.png";
</script>

<style scoped>
.nav-bar {
  width: 100%;
  max-width: 390px;
  height: 120px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute; /* 부모 컨테이너(mobile-container)를 기준으로 */
  top: 0;
  left: 50%;
  transform: translateX(-50%); /* 정 중앙 정렬 */
  z-index: 1000;
}

.logo {
  width: 100px;
}
</style>
