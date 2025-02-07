<template>
    <div v-if="isModalVisible" class="like-modal">
        <div class="modal-content">
            <h3>좋아요한 목록</h3>
            <ul>
                <li v-for="movie in likeList" :key="movie.movie_id">
                    <img :src="movie.mainImage" alt="영화 이미지" width="100" /> {{ movie.krName }}
                </li>
            </ul>
            <button @click="closeModal" style="width: 50px">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const isModalVisible = computed(() => store.state.isModalVisible); // Vuex 상태에 따른 모달 표시 여부
const likeList = computed(() => store.state.likeList);

const closeModal = () => {
    store.dispatch('closeModal'); // 모달 닫기
};
</script>

<style scoped>
.like-modal {
    position: fixed;
    top: 125px;
    align-self: center;
    width: 390px;
    height: 80%;
    background: white;
    z-index: 20;
}

.modal-content {
    background: white;
    padding: 20px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
</style>
