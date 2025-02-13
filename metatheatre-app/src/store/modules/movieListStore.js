import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import api from "@/api";

const boMovies = ref([]);
const csMovies = ref([]);

const fetchBoxOffice = async () => {
    try {
        const response = await api.get("/movie/boxoffice");
        boMovies.value = response.data;
    } catch (error) {
        console.error("박스오피스 목록 가져오기 실패하였습니다.", error);
    }
};

const fetchComingSoon = async () => {
    try {
        const response = await api.get("/movie/comingsoon");
        csMovies.value = response.data;
    } catch (error) {
        console.error("상영예정작 목록 가져오기 실패하였습니다.", error);
    }
};

const useAutoFetch = (interval = 20000) => {
    let timer = null;

    const startFetching = () => {
        if (!timer) {
            fetchBoxOffice();
            fetchComingSoon();
            timer = setInterval(() => {
                fetchBoxOffice();
                fetchComingSoon();
            }, interval);
        }
    };

    const stopFetching = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    onMounted(() => {
        if (document.visibilityState === "visible") {
            startFetching();
        }

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                startFetching();
            } else {
                stopFetching();
            }
        });
    });

    onUnmounted(() => {
        stopFetching();
        document.removeEventListener("visibilitychange", stopFetching);
    });
};

export const useMovieList = () => {
    return {
        boMovies,
        csMovies,
        fetchBoxOffice,
        fetchComingSoon,
        useAutoFetch,
    };
};
