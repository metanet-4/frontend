<template>
    <div class="container">
      <div class="signup-box">
        <h1 class="title">META THEATRE</h1>
        <div class="profile-pic">
          <img src="https://placekitten.com/100/100" alt="프로필 사진" />
        </div>
        <form @submit.prevent="handleSubmit" class="form">
          <div class="input-group">
            <input v-model="formData.name" type="text" placeholder="이름" class="input" />
            <input v-model="formData.birthdate" type="date" class="input" />
          </div>
          <input v-model="formData.phone" type="tel" placeholder="전화번호" class="input full-width" />
          <input v-model="formData.email" type="email" placeholder="이메일" class="input full-width" />
          <input v-model="formData.username" type="text" placeholder="아이디" class="input full-width" />
          <input v-model="formData.password" type="password" placeholder="비밀번호" class="input full-width" />
          <button type="submit" class="submit-btn">가입하기</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive } from "vue";
  
  export default {
    setup() {
      const formData = reactive({
        name: "",
        birthdate: "",
        phone: "",
        email: "",
        username: "",
        password: ""
      });
  
      const handleSubmit = () => {
        console.log("회원가입 정보:", formData);
      };
  
      return {
        formData,
        handleSubmit
      };
    }
  };
  </script>
  
  <style scoped>
  /* 기본 컨테이너 스타일 */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f3f3f3;
  }
  
  /* 회원가입 박스 스타일 */
  .signup-box {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    width: 360px;
    text-align: center;
  }
  
  /* 제목 스타일 */
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  /* 프로필 이미지 스타일 */
  .profile-pic img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #ccc;
    margin-bottom: 10px;
  }
  
  /* 입력 필드 그룹 */
  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  /* 입력 필드 스타일 */
  .input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    width: 100%;
  }
  
  /* 전체 너비 입력 필드 */
  .full-width {
    width: calc(100% - 20px);
    margin-bottom: 10px;
  }
  
  /* 가입 버튼 스타일 */
  .submit-btn {
    background-color: #2c3e50;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
  }
  
  .submit-btn:hover {
    background-color: #1a252f;
  }
  </style>
  