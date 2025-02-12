import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";

const store = createStore({
    state: {
        isModalVisible: false, // 모달 상태
        likeList: [],
        alarmList: [],
        modalType: "", // 모달의 유형 (like, alarm 등)
        isAuthenticated: false,
        user: null,
    },
    mutations: {
        toggleModal(state) {
            state.isModalVisible = !state.isModalVisible;
        },
        openModal(state) {
            state.isModalVisible = true;
        },
        closeModal(state) {
            state.isModalVisible = false;
            state.modalType = ""; // 모달 닫을 때 유형 초기화
        },
        setModalType(state, modalType) {
            state.modalType = modalType;
        },
        setLikeList(state, likeList) {
            state.likeList = likeList;
        },
        setAlarmList(state, alarmList) {
            state.alarmList = alarmList;
        },
        addAlarm(state, alarm) {
            state.alarmList.push(alarm);
        },
        clearAlarms(state) {
            state.alarmList = [];
        },
        LOGIN(state, userData) {
            console.log("로그인중", userData);
            state.isAuthenticated = true;
            state.user = userData;
        },
        LOGOUT(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
        INITIALIZE(state) {
            state.isModalVisible = false;
            state.likeList = [];
            state.alarmList = [];
            state.modalType = "";
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    actions: {
        async fetchLikeList({ commit }) {
            try {
                const response = await axios.get("http://localhost:8080/likeList");
                commit("setLikeList", response.data); // 받아온 데이터를 상태에 저장
                commit("openModal"); // 데이터 가져온 후 모달 열기
            } catch (error) {
                console.error("Error fetching like list:", error);
            }
        },
        async fetchAlarmList({ commit }) {
            try {
                console.log("알림 모달창 ");
                commit("setModalType", "alarm"); // 모달 유형 설정
                commit("openModal"); // 모달 열기
            } catch (error) {
                console.error("Error fetching alarm list:", error);
            }
        },
        openModal({ commit }) {
            commit("openModal");
        },
        closeModal({ commit }) {
            commit("closeModal");
        },
        toggleModal({ commit }) {
            commit("toggleModal");
        },
        setModalType(state, modalType) {
            state.modalType = modalType;
        },
        setLikeList(state, likeList) {
            state.likeList = likeList;
        },
        setAlarmList(state, alarmList) {
            state.alarmList = alarmList;
        },
        addAlarm(state, alarm) {
            state.alarmList.push(alarm);
        },
        clearAlarms(state) {
            state.alarmList = [];
        },
        login({ commit }, userData) {
            commit("LOGIN", userData);
        },
        logout({ commit }) {
            commit("LOGOUT");
        },
        initializeStore({ commit }) {
            commit("INITIALIZE");
        },
    },
    getters: {
        isModalVisible: (state) => state.isModalVisible,
        modalType: (state) => state.modalType,
        likeList: (state) => state.likeList,
        alarmList: (state) => state.alarmList,
        isAuthenticated: (state) => state.isAuthenticated,
        user: (state) => state.user,
        isUser: (state) => state.user === "ROLE_USER",
        isAdmin: (state) => state.user === "ROLE_ADMIN",
    },
    plugins: [
        createPersistedState({
            // 세션 스토리지에 저장
            storage: window.sessionStorage,
        }),
    ],
});

export default store;
