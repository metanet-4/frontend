<template>
  <NavBar />
  <div class="wrapper">
    <div
      id="carouselExampleInterval"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="5000">
          <img
            src="../assets/main1.jpg"
            class="d-block w-100"
            alt="홍보 이미지 1"
          />
        </div>
        <div class="carousel-item" data-bs-interval="5000">
          <img
            src="../assets/main2.jpg"
            class="d-block w-100"
            alt="홍보 이미지 2"
          />
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
      <CustomButton label="한국어" bgColor="#ADA7D1" />
      <CustomButton label="English" bgColor="#ADA7D1" />
      <CustomButton label="中文" bgColor="#ADA7D1" />
      <CustomButton label="日本語" bgColor="#ADA7D1" />
    </div>
    <BoxOfficeRanking />
  </div>
</template>

<script setup>
import NavBar from "../components/NavBar.vue";
import CustomButton from "../components/CustomButton.vue";
import BoxOfficeRanking from "../components/BoxOfficeRanking.vue";
</script>

<style>
.wrapper {
  height: 100%;
  padding-top: 120px;
  padding-bottom: 80px;
  background-color: white;
}

.buttons {
  display: flex;
  gap: 5px;
  margin: 5px;
}
</style>
