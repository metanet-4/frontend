import { createI18n } from "vue-i18n";
import kr from "../../locales/kr.json";
import en from "../../locales/en.json";
import zh from "../../locales/zh.json";
import ja from "../../locales/ja.json";

const i18n = createI18n({
  legacy: false, // Composition API와 함께 사용하기 위해 false 설정
  globalInjection: true, // `t()`를 전역에서 사용 가능하게 설정
  locale: "kr", // 기본 언어
  fallbackLocale: "en", // 없는 경우 영어로 대체
  messages: { kr: kr, en, zh, ja },
});

const i18nStore = {
  namespaced: true,
  state() {
    return {
      locale: "kr", // 전역 상태로 관리할 언어
    };
  },
  mutations: {
    setLocale(state, lang) {
      state.locale = lang;
      i18n.global.locale.value = lang; // i18n 설정 변경 (Composition API 방식)
    },
  },
  actions: {
    changeLanguage({ commit }, lang) {
      commit("setLocale", lang);
    },
  },
};

export { i18n, i18nStore };
