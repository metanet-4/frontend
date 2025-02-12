<template>
  <div class="theater-selection-page">
    <!-- 상단 헤더 -->
    <header class="header">
      <h1>극장 선택</h1>
      <hr />
    </header>

    <!-- 로딩 중일 경우 표시 -->
    <div v-if="isLoading" class="loading">
      데이터를 불러오는 중입니다...
    </div>

    <!-- 에러가 있을 경우 표시 -->
    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <!-- 정상적으로 데이터를 불러왔다면 목록 표시 -->
    <div v-else class="theater-selection-container">
      <!-- 좌측 지역 목록 -->
      <div class="region-list">
        <ul>
          <!-- (key)은 지역명, (value)은 극장 배열 -->
          <li v-for="(theatersArray, regionName) in regionData" :key="regionName"
            :class="{ active: selectedRegion === regionName }" @click="selectRegion(regionName)">
            <!-- 지역명과 극장 개수 표시 -->
            {{ regionName }} ({{ theatersArray.length }})
          </li>
        </ul>
      </div>

      <!-- 우측 극장 목록 -->
      <div class="theater-list">
        <ul>
          <!-- 선택된 지역의 극장 배열을 순회 -->
          <li v-for="(theater, tIndex) in selectedRegionTheaters" :key="theater.id"
            :class="{ active: selectedTheaterIndex === tIndex }" @click="selectTheater(tIndex)">
            <!-- 극장 이름 표시. 필요시 location, id 등도 노출 가능 -->
            {{ theater.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <!-- <div class="button-container"> -->
    <div class="button-container">
      <!-- 선택된 극장이 있을 때만 router-link를 렌더링 -->
      <router-link v-if="selectedRegionTheaters.length > 0 && selectedTheaterIndex !== null" :to="{
        name: 'ScreenChoiceView',
        params: {
          movieId: '20223819',
          cinemaId: selectedRegionTheaters[selectedTheaterIndex].id
        }
      }">
        <button class="complete-button" @click="completeSelection">
          선택 완료
        </button>
      </router-link>
      <!-- 선택되지 않았을 경우 비활성화된 버튼 표시 -->
      <button v-else class="complete-button" disabled>
        극장을 선택해주세요
      </button>
    </div>
    <!-- </div> -->
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

// 서버에서 받아올 지역/극장 데이터를 저장할 객체
const regionData = ref({})
// 현재 선택된 지역 (문자열)
const selectedRegion = ref('')
// 현재 선택된 극장 인덱스
const selectedTheaterIndex = ref(null)
// 로딩 & 에러 상태
const isLoading = ref(false)
const errorMessage = ref('')
const route = useRoute();

// 선택된 지역의 극장 배열을 반환하는 computed
const selectedRegionTheaters = computed(() => {
  if (!selectedRegion.value) return []
  const theaters = regionData.value[selectedRegion.value]
  return theaters || []
})

/**
 * 지역 선택
 */
function selectRegion(regionName) {
  selectedRegion.value = regionName
  selectedTheaterIndex.value = null
}

/**
 * 극장 선택
 */
function selectTheater(index) {
  selectedTheaterIndex.value = index
}

/**
 * 선택 완료
 */
const router = useRouter()
async function completeSelection() {
  try {
    if (!selectedRegion.value) {
      alert('지역이 선택되지 않았습니다.')
      return
    }
    const regionName = selectedRegion.value
    const theatersArr = regionData.value[regionName] || []

    let theaterName = '극장 미선택'
    if (selectedTheaterIndex.value !== null && theatersArr[selectedTheaterIndex.value]) {
      theaterName = theatersArr[selectedTheaterIndex.value].name
    }

    alert(`${regionName} - ${theaterName} 선택됨`)
    // 추가적인 로직이 있다면 여기서 실행

  } catch (error) {
    console.error('선택 완료 처리 중 오류 발생', error)
  }
}

/**
 * 서버에서 regionData 받아오기
 */
async function fetchRegions() {
  isLoading.value = true
  errorMessage.value = ''
  const movieId = route.params.movieId;
  try {
    const response = await axios.get(`http://localhost:8080/ticket/cinema?movieId=${movieId}`, {
      withCredentials: true
    })
    regionData.value = response.data

    // regionData가 비어 있지 않다면 첫 지역 자동 선택 (선택 사항)
    const regionKeys = Object.keys(regionData.value)
    if (regionKeys.length > 0) {
      selectedRegion.value = regionKeys[0]
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = '지역 정보를 불러오는 데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRegions()
})
</script>


<style scoped>
/* 공통 스타일 초기화 (예시) */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 전체 페이지 컨테이너 */
.theater-selection-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  font-family: sans-serif;
  padding-bottom: 80px;
  padding-top: 20px;
}

/* 상단 헤더 */
.header {
  text-align: center;
}

.header h1 {
  font-size: 1.4rem;
  margin-bottom: 10px;
  font-weight: bold;
}

.header hr {
  border: none;
  border-top: 1px solid #ccc;
}

/* 로딩, 에러 메시지 표시용 */
.loading,
.error {
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
}

/* 좌우(혹은 상하) 영역 */
.theater-selection-container {
  display: flex;
  gap: 20px;
  /* 좌우 영역 사이 간격 */
  margin-top: 20px;
}

/* 지역 목록 */
.region-list {
  width: 180px;
  /* PC 화면에서의 기본 너비 */
  border-right: 1px solid #ccc;
}

.region-list ul {
  list-style: none;
}

.region-list li {
  background-color: #c7cde3;
  /* 비활성 */
  padding: 12px 10px;
  cursor: pointer;
  color: #000;
  margin-bottom: 2px;
}

.region-list li.active {
  background-color: #fff;
  /* 활성 */
  font-weight: bold;
}

/* 극장 목록 */
.theater-list {
  flex: 1;
  min-width: 0;
  /* flex 아이템이 축소될 수 있도록 */
}

.theater-list ul {
  list-style: none;
}

.theater-list li {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.theater-list li.active {
  background-color: #f9f9f9;
  font-weight: bold;
}

/* 선택 완료 버튼 */
.complete-button {
  background-color: #002060;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  align-self: center;
}

/* ----- 반응형(모바일) 스타일 ----- */
@media (max-width: 768px) {
  .theater-selection-container {
    flex-direction: column;
    gap: 10px;
  }

  .region-list {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }

  .theater-list {
    width: 100%;
    padding: 0;
  }

  .header h1 {
    font-size: 1.2rem;
  }

  .complete-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>