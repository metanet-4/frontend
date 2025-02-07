import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state: {
        isModalVisible: false, // 모달 상태
        likeList: [],
    },
    mutations: {
        toggleModal(state) {
            // 모달 상태를 토글하는 mutation
            state.isModalVisible = !state.isModalVisible;
        },
        openModal(state) {
            // 모달을 열기 위한 mutation
            state.isModalVisible = true;
        },
        closeModal(state) {
            // 모달을 닫기 위한 mutation
            state.isModalVisible = false;
        },
        setLikeList(state, likeList) {
            state.likeList = likeList; // 좋아요 목록 업데이트
        },
    },
    actions: {
        async fetchLikeList({ commit }) {
            try {
                const response = await axios.get('http://localhost:8080/movie/likeList');
                commit('setLikeList', response.data); // 받아온 데이터를 상태에 저장
                commit('openModal'); // 데이터 가져온 후 모달 열기
            } catch (error) {
                console.error('Error fetching like list:', error);
            }
        },
        openModal({ commit }) {
            commit('openModal'); // openModal mutation 호출
        },
        closeModal({ commit }) {
            commit('closeModal'); // closeModal mutation 호출
        },
        toggleModal({ commit }) {
            commit('toggleModal'); // toggleModal mutation 호출
        },
    },
    getters: {
        isModalVisible: (state) => state.isModalVisible, // 모달 상태를 반환하는 getter
    },
});

export default store;
