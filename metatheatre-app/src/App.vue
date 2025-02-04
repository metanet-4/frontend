<template>
  <div class="mobile-container"><router-view /></div>
</template>

<script setup></script>

<style scoped>
.mobile-container {
  width: 100vw;
  max-width: 390px;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
}
</style>
