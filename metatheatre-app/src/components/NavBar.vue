<template>
  <nav class="nav-bar">
    <router-link to="/">
      <img :src="logo" alt="로고 이미지" class="logo"
    /></router-link>
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
  height: 125px;
  background: white;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.logo {
  width: 100px;
}
</style>
