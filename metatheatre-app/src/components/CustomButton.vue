<template>
  <button :style="buttonStyle">
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from "vue";

// props를 받아서 변수로 저장
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: "#281B7A",
  },
  textColor: {
    type: String,
    default: "#ffffff",
  },
});

// 버튼 스타일을 동적으로 설정
const buttonStyle = computed(() => ({
  backgroundColor: props.bgColor, // props를 통해 접근
  color: props.textColor,
  padding: "10px 10px",
  fontSize: "12px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "opacity 0.3s",
  textAlign: "center",
  cursor: "pointer",
}));
</script>
