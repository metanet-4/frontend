<template>
    <NavBar />
    <div class="wrapper">
        <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="3000">
                    <img src="../assets/main1.jpg" class="d-block w-100" alt="홍보 이미지 1" />
                </div>
                <div class="carousel-item" data-bs-interval="3000">
                    <img src="../assets/main2.jpg" class="d-block w-100" alt="홍보 이미지 2" />
                </div>
                <div class="carousel-item" data-bs-interval="3000">
                    <img src="../assets/main3.jpg" class="d-block w-100" alt="홍보 이미지 3" />
                </div>
            </div>
            <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="prev"
            >
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="next"
            >
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="buttons">
            <CustomButton
                v-for="lang in ['kr', 'en', 'zh', 'ja']"
                :key="lang"
                @click="changeLanguage(lang)"
                :label="getLanguageLabel(lang)"
                :bgColor="computedBgColor(lang)"
                :ftWeight="computedFtWeight(lang)"
            />
        </div>
        <BoxOfficeRanking />
        <ComingSoonRanking />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import NavBar from "../components/NavBar.vue";
import CustomButton from "../components/CustomButton.vue";
import BoxOfficeRanking from "../components/BoxOfficeRanking.vue";
import ComingSoonRanking from "../components/ComingSoonRanking.vue";

const store = useStore();
const locale = computed(() => store.state.i18nStore.locale);

const changeLanguage = (lang) => {
    store.dispatch("changeLanguage", lang);
};

const computedBgColor = (lang) => {
    return locale.value === lang ? null : "#ADA7D1";
};

const computedFtWeight = (lang) => {
    return locale.value === lang ? null : "normal";
};

const getLanguageLabel = (lang) => {
    const labels = { kr: "한국어", en: "English", zh: "中文", ja: "日本語" };
    return labels[lang];
};
</script>

<style>
.wrapper {
    width: 100%;
    max-width: 390px;
    margin: 0 auto;
    position: absolute;
    top: 125px;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    overflow-x: hidden;
    overflow-y: auto;
    background-color: white;
}

.buttons {
    display: flex;
    gap: 5px;
    margin: 10px;
}
</style>
