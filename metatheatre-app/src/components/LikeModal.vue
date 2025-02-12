<template>
    <div v-if="isModalVisible" class="like-modal">
        <div class="modal-content">
            <h3 class="modal-title">좋아요한 목록</h3>
            <ul>
                <li v-for="movie in likeList" :key="movie.movie_id" class="movie-item">
                    <router-link
                        :to="{ name: 'Detail', params: { movieId: movie.id } }"
                        class="movie-card-link"
                        @click.native="closeModal"
                    >
                        <img :src="movie.mainImage" alt="영화 이미지" class="movie-image" />
                        <span class="movie-title">{{ movie.krName }}</span>
                    </router-link>
                </li>
            </ul>
            <button @click="closeModal" class="close-btn">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const isModalVisible = computed(() => store.state.isModalVisible); // Vuex 상태에 따른 모달 표시 여부
const likeList = computed(() => store.state.likeList);

const closeModal = () => {
    store.dispatch("closeModal"); // 모달 닫기
};
</script>

<style scoped>
.movie-card-link {
    text-decoration: none;
    color: inherit;
}

/* 모달 배경 */
.like-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 390px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* 모달 내용 */
.modal-content {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* 모달 제목 */
.modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
    text-align: center;
}

/* 리스트 영역 */
ul {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    max-height: 60vh;
    /* 리스트가 길어지면 개별 스크롤 */
    flex-grow: 1;
}

/* 개별 영화 항목 */
.movie-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e2e2;
}

.movie-image {
    width: 50px;
    height: 75px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 15px;
}

.movie-title {
    font-size: 1rem;
    color: #555;
    flex: 1;
}

/* 닫기 버튼 */
.close-btn {
    background-color: #ff6b6b;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    margin-top: 15px;
    /* 리스트와 버튼 사이 여백 */
    position: relative;
}

.close-btn:hover {
    background-color: #ff4d4d;
}

/* 반응형 */
@media (max-width: 420px) {
    .like-modal {
        width: 90%;
    }

    .modal-content {
        padding: 20px;
    }

    .movie-image {
        width: 40px;
        height: 60px;
    }

    .movie-title {
        font-size: 0.9rem;
    }
}
</style>
