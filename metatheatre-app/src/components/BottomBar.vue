<template>
  <div class="bottom-bar">
    <router-link to="/movies">영화</router-link>
    <p>예매</p>
    <p>마이페이지</p>
  </div>
</template>

<script setup></script>

<style scoped>
.bottom-bar {
  width: 100%;
  max-width: 390px;
  height: 70px;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
</style>
