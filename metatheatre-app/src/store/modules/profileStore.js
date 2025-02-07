// src/store/modules/profile.js
import axios from "axios";

const state = {
  profileImage: null, // 프로필 이미지 URL 상태
};

const mutations = {
  SET_PROFILE_IMAGE(state, imageUrl) {
    state.profileImage = imageUrl;
  },
  CLEAR_PROFILE_IMAGE(state) {
    state.profileImage = null;
  },
};

const actions = {
  // 프로필 이미지 가져오기
  async fetchProfileImage({ commit }) {
    try {
      const response = await axios.get("/api/member/profile", {
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      commit("SET_PROFILE_IMAGE", imageUrl);
    } catch (error) {
      console.error("프로필 이미지 불러오기 실패:", error);
    }
  },

  // 프로필 이미지 업로드
  async uploadProfileImage({ dispatch }, file) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/member/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 업로드 성공 후 최신 이미지 불러오기
      dispatch("fetchProfileImage");
    } catch (error) {
      console.error("프로필 업로드 실패:", error);
    }
  },

  // 프로필 이미지 삭제
  async deleteProfileImage({ commit }) {
    try {
      await axios.delete("/api/member/profile/delete");
      commit("CLEAR_PROFILE_IMAGE");
    } catch (error) {
      console.error("프로필 삭제 실패:", error);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
