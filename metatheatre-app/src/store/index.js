// src/store/index.js
import { createStore } from "vuex";
import profileStore from "./modules/profileStore";
import modalStore from "./modules/modalStore";
import movieListStore from "./modules/movieListStore.js";

export default createStore({
  modules: {
    profileStore,
    modalStore,
    movieListStore,
  },
});
