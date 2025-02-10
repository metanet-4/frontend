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
.movie-card-link {
    text-decoration: none;
    color: inherit;
}

/* 모달 배경 및 전체 스타일 */
.like-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 380px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 배경에 투명도 추가 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* 모달 내용 */
.modal-content {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    overflow-y: auto; /* 내용이 많을 경우 스크롤 추가 */
    max-height: 80%;
    position: relative;
}

/* 모달 제목 스타일 */
.modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

/* 영화 목록 스타일 */
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

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
    flex: 1; /* 텍스트가 남은 공간을 차지하게 */
}

/* 닫기 버튼 스타일 */
.close-btn {
    background-color: #ff6b6b;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 1rem;
    cursor: pointer;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
}

.close-btn:hover {
    background-color: #ff4d4d;
}

/* 작은 화면 대응 (반응형) */
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
