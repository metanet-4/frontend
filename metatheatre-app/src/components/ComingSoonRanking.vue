<template>
  <div class="cs-ranking">
    <p class="cs-title">{{ $t("title.cs-ranking") }}</p>
    <div class="cs-ranking-contents">
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
.cs-title {
  font-size: 18px;
  margin: 10px;
}

.cs-ranking {
  margin-top: 50px;
  height: 240px;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.cs-ranking-contents {
  width: 80%;
  align-self: center;
}
</style>
