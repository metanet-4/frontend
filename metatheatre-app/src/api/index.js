import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",  // Spring Boot 백엔드 주소
  withCredentials: true, // JWT 토큰 쿠키를 주고받기 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
