<template>
	<div class="changlongEnter changlong" @click="changlongEnter"></div>
</template>

<script setup lang="ts">
import { useHome } from '@/hooks/useHome.hook';

// 跳转入口页面
const {isAlowGame,goChangLong} = useHome()
const changlongEnter = async() => {
	isAlowGame('',goChangLong)
}
</script>

<style lang="scss" scoped>
.changlongEnter {
	position: fixed;
	z-index: 99;
	width: 112px;
	height: 112px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 112px;
	background-image: url('@icon/blueHome/changlong.svg');
	bottom: 320px;
	right: 30px;
	border-radius: 50%;

}
</style>
