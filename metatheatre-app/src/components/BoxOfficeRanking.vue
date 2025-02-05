<template>
  <div class="bo-ranking">
    <p class="bo-title">{{ $t("title.bo-ranking") }}</p>
    <div class="bo-ranking-contents">
      <vueper-slides
        class="no-shadow"
        :visible-slides="2"
        :slide-ratio="1 / 4"
        :dragging-distance="70"
      >
        <vueper-slide v-for="i in 10" :key="i" :title="i.toString()" />
      </vueper-slides>
    </div>
  </div>
</template>

<script setup>
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
</script>

<style>
.bo-title {
  font-size: 18px;
  margin: 10px;
}

.bo-ranking {
  height: 240px;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.bo-ranking-contents {
  width: 80%;
  align-self: center;
}
</style>
