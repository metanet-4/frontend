<template>
  <div class="bottom-bar">
    <p>영화</p>
    <p>예매</p>
    <p>마이페이지</p>
  </div>
</template>

<style scoped>
.bottom-bar {
  width: 100%;
  max-width: 390px;
  height: 80px;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute; /* 부모 컨테이너(mobile-container)를 기준으로 */
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); /* 정 중앙 정렬 */
  z-index: 1000;
}
</style>
