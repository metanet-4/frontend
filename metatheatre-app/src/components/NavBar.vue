<template>
<<<<<<< HEAD
  <nav class="nav-bar">
    <router-link to="/">
      <img :src="logo" alt="로고 이미지" class="logo"
    /></router-link>
    <div>검색창</div>
    <button @click="openLikeList">❤️</button>
  </nav>
  <Modal />
=======
    <nav class="nav-bar">
        <img :src="logo" alt="로고 이미지" class="logo" />
        <div>검색창</div>
        <button @click="openLikeList">❤️</button>
    </nav>
    <Modal />
>>>>>>> 482d12aa3908e6af8c9aaf27177b360f46c8e8a3
</template>

<script setup>
import logo from "../assets/logo.png";
import Modal from "./LikeModal.vue";
import { useStore } from "vuex";

const store = useStore();

const openLikeList = async () => {
  await store.dispatch("fetchLikeList");
  store.commit("openModal");
};
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
  z-index: 10;
}

.logo {
  width: 100px;
}
</style>
