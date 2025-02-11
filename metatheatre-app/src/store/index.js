// src/store/index.js
import { createStore } from 'vuex';
import modalStore from './modules/modalStore';
import movieListStore from './modules/movieListStore.js';

export default createStore({
    modules: {
        modalStore,
        movieListStore,
    },
});
