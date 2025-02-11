// src/store/index.js
import { createStore } from "vuex";
import modalStore from "./modules/modalStore";
import movieListStore from "./modules/movieListStore.js";
import { i18nStore } from "./modules/i18nStore.js";

export default createStore({
  modules: {
    modalStore,
    movieListStore,
  },
});
