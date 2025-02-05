<template>
  <button :style="buttonStyle">{{ label }}</button>
</template>

<script setup>
import { computed, watch } from "vue";

// props 받아서 변수로 저장
const props = defineProps({
  label: String,
  bgColor: String,
  textColor: String,
});

// 버튼 스타일을 동적으로 설정
const buttonStyle = computed(() => ({
  backgroundColor: props.bgColor ?? "#281B7A",
  color: props.textColor ?? "white",
  padding: "10px 10px",
  fontSize: "12px",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  transition: "opacity 0.3s",
  textAlign: "center",
  cursor: "pointer",
}));
</script>
