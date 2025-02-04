<template>
  <div class="bo-ranking">
    <vueper-slides
      class="no-shadow"
      :visible-slides="3"
      slide-multiple
      :gap="3"
      :slide-ratio="1 / 4"
      :dragging-distance="200"
      :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }"
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
.bo-ranking {
  height: 400px;
  background-color: #f8f8f8;
}
</style>
