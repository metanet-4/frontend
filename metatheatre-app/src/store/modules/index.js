// src/store/index.js
import { createStore } from "vuex";
import profileStore from "./profileStore";

export default createStore({
  modules: {
    profileStore,
  },
});
