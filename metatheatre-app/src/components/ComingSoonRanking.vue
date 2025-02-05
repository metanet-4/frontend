<template>
  <div class="cs-ranking">
    <p class="title">{{ $t("title.cs-ranking") }}</p>
    <vueper-slides
      class="no-shadow"
      :visible-slides="4"
      :slide-ratio="1 / 4"
      :dragging-distance="70"
    >
      <vueper-slide v-for="i in 10" :key="i" :title="i.toString()" />
    </vueper-slides>
  </div>
</template>

<script setup>
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
</script>

<style>
.cs-ranking {
  margin-top: 50px;
  height: 200px;
  background-color: #f8f8f8;
}

.title {
  font-size: 16px;
}
</style>
