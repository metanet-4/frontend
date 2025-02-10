<template>
	<button class="back-button" @click="$router.go(-1)">←</button>
</template>

<style scoped>
.back-button {
	font-size: 20px;
	border: none;
	background: none;
	cursor: pointer;
}
</style>