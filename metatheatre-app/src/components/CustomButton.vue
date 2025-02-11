<template>
  <button :style="buttonStyle">{{ label }}</button>
</template>

<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  label: String,
  bgColor: String,
  textColor: String,
  ftWeight: String,
});

const buttonStyle = computed(() => ({
  backgroundColor: props.bgColor ?? "#281B7A",
  fontWeight: props.ftWeight ?? "bold",
  color: "white",
  fontSize: "12px",
  padding: "0px 10px",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  transition: "opacity 0.3s",
  textAlign: "center",
  cursor: "pointer",
  height: "30px",
}));
</script>
