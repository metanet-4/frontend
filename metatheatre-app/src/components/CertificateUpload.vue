<template>
    <div>
        <img v-if="certificateImage" :src="certificateImage" />
        <input type="file" @change="handleFileChange" />
        <button v-if="certificateImage" @click="deleteCertificate">삭제</button>
        <button @click="certificateChange">변경</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const certificateImage = ref(null); // 미리보기 이미지
const selectedImage = ref(null); // 선택된 파일
const memberId = ref(1); // 실제 로그인된 사용자의 ID로 변경 필요

onMounted(() => {
    fetchCertificateImage();
});

// 인증서 이미지 가져오기
const fetchCertificateImage = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/file/member/${memberId.value}/certificate`, {
            responseType: "blob",
        });

        if (response.data) {
            certificateImage.value = URL.createObjectURL(response.data);
        } else {
            certificateImage.value = null;
        }
    } catch (error) {
        console.error("인증서 이미지 가져오기에 실패하였습니다.", error);
    }
};

// 파일 선택 (미리보기 이미지 보여 주기)
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    selectedImage.value = file;
    certificateImage.value = URL.createObjectURL(file);
};

// 인증서 이미지 변경
const certificateChange = async () => {
    if (!selectedImage.value) {
        console.log("선택된 이미지가 없습니다.");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage.value);

    try {
        await axios.put(`http://localhost:8080/file/member/${memberId.value}/certificate`, formData);

        certificateImage.value = URL.createObjectURL(selectedImage.value);
    } catch (error) {
        console.error("인증서 이미지 업로드에 실패하였습니다.", error);
    }
};

// 인증서 이미지 삭제
const deleteCertificate = async () => {
    try {
        await axios.delete(`http://localhost:8080/file/member/${memberId.value}/certificate`);
        certificateImage.value = null;
        console.log("인증서 이미지가 삭제되었습니다.");
    } catch (error) {
        console.error("인증서 이미지 삭제에 실패하였습니다.", error);
    }
};
</script>
