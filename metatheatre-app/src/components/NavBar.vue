<template>
  <nav class="nav-bar">
    <router-link to="/">
      <img :src="logo" alt="로고 이미지" class="logo"
    /></router-link>
<<<<<<< HEAD
    <div>검색창</div>
=======
    <!-- 🔍 검색창 추가 -->
    <div class="search-box">
      <input
        v-model="keyword"
        type="text"
        placeholder="검색어를 입력하세요."
        @keyup.enter="searchMovie"
      />
      <button @click="searchMovie">
        <img
          src="@/assets/search-icon.png"
          alt="검색 아이콘"
          class="search-icon"
        />
      </button>
      <button @click="openLikeList">❤️</button>
    </div>
>>>>>>> e005fa6e5f1dcf74a48b9ac8e8f35f787a0770d9
  </nav>
  <Modal />
</template>

<script setup>
import { ref } from "vue";
import logo from "../assets/logo.png";
import Modal from "./LikeModal.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();
const keyword = ref(""); // 검색어 가져오기

const store = useStore();

const openLikeList = async () => {
  await store.dispatch("fetchLikeList");
  store.commit("openModal");
};

const searchMovie = () => {
  if (keyword.value.trim() !== "") {
    router.push({
      name: "SearchMovieView",
      params: { keyword: keyword.value },
    });
  }
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

.search-box {
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 95%;
}

.search-box input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  width: 100%;
}

.search-box button {
  margin-left: 5px;
  padding: 5px 10px;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.search-icon {
  width: 20px; /* 아이콘 크기 작게 */
  height: 20px; /* 아이콘 크기 작게 */
}
</style>
