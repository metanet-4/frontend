import { createI18n } from "vue-i18n";
import kr from "./locales/kr.json";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";

// vue-i18n 설정
const i18n = createI18n({
  locale: "kr", // 기본 언어
  fallbackLocale: "kr", // 현재 설정된 언어에 해당하는 번역이 없을 경우, 대체로 사용할 언어
  messages: {
    kr,
    en,
    zh,
    ja,
  },
});

export default i18n;
