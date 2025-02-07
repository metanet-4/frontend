<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="image/*" />
    <button @click="uploadProfile">업로드</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const selectedFile = ref(null);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadProfile = async () => {
  if (!selectedFile.value) {
    alert("이미지를 선택해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    await axios.post("/file/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("업로드 성공!");
  } catch (error) {
    console.error("업로드 실패:", error);
    alert("업로드 실패!");
  }
};
</script>
