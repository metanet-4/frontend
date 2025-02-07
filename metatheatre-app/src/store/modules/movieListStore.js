import { ref } from "vue";
import axios from "axios";

const boMovies = ref(null);
const csMovies = ref(null);

export const fetchBoxOffice = async () => {
  if (boMovies.value) return;

  try {
    const response = await axios.get("http://localhost:8080/movie/boxoffice");
    console.log(response.data);
    boMovies.value = response.data;
  } catch (error) {
    console.error("Error fetching box office data:", error);
  }
};

export const fetchComingSoon = async () => {
  if (csMovies.value) return;

  try {
    const response = await axios.get("http://localhost:8080/movie/comingsoon");
    console.log(response.data);
    csMovies.value = response.data;
  } catch (error) {
    console.error("Error fetching coming soon movies:", error);
  }
};

export const useMovieList = () => {
  return {
    boMovies,
    fetchBoxOffice,
    csMovies,
    fetchComingSoon,
  };
};
