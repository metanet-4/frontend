<template>
    <div class="error-container">
        <h1>403 - 접근 권한이 없습니다</h1>
        <p>이 페이지에 접근할 권한이 없습니다.</p>
        <router-link to="/" class="home-link">🏠 홈으로 이동</router-link>
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
