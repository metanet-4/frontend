<template>
    <button class="back-button" @click="$router.go(-1)">
        <i class="bi bi-arrow-left"></i>
    </button>
</template>

<style scoped>
.back-button {
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
    color: #1c3788;
}
</style>
