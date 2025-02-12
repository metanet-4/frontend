<template>
    <div class="error-container">
        <div class="icon"><i class="bi bi-exclamation-square"></i></div>
        <h1>접근 오류</h1>
        <p>이 페이지에 접근할 권한이 없습니다.</p>
        <router-link to="/" class="home-link">🏠 메인 페이지로 이동</router-link>
    </div>
</template>

<style scoped>
.error-container {
    text-align: center;
    margin-top: 100px;
}

h1 {
    font-size: 2rem;
    color: #d32f2f;
}

p {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 10px;
}

.icon {
    color: #cd1d1d;
    font-size: 120px;
    margin-top: 150px;
}

.home-link {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #283593;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
}

.home-link:hover {
    background-color: #1a237e;
}
</style>
