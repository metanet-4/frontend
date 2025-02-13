import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // Spring Boot 백엔드 주소
  withCredentials: true, // JWT 토큰 쿠키를 주고받기 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
