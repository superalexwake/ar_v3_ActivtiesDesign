<template>
	<div class="mainContainer">
		<div class="firstImage">
			<img :src="projectIcon" alt="" />
		</div>
		<div class="insideMain">
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
	<!-- first container finsh here  -->
	<div class="typrgraphy">{{ $t('Terms',[projectName]) }}. <br /><br />{{ $t('Terms2',[projectName]) }}.</div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {computed} from 'vue'
import { SettingStore } from '@/stores'
const { t } = useI18n()
const settingS = SettingStore()
// 项目图标
const projectIcon = computed(() => settingS.getProjectLogo);
const projectName = computed(() => settingS.getProjectName);
</script>
<style lang="scss" scoped>
.mainContainer {
	margin-top: 0.4rem;
	margin-bottom: 0.13333rem;
	display: flex;
	flex-direction: row;
	height: auto;
	align-items: center;
	gap: 5px;
	justify-content: center;

	.firstImage {
		justify-content: center;
		display: flex;
		align-items: center;
		height: 76px;
		width: fit-content;
		img{
			height: 100%;
		}
	}
	.insideMain {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 76px;
		width: fit-content;
		font-family: Lato;
		font-size: 28px;
		font-weight: 400;
		margin-left: -0.13333rem;
		background: linear-gradient(94deg, #d1ddfb 3.21%, #626180 115.75%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
        span{
			background-repeat: no-repeat;
			background-color: var(--bg_color_L2);
			border-radius: 50%;
			background-position: center;
			background-size: contain;
		}
		span:first-of-type {
			height: 76px;
			width: 76px;
			background-image: url('./imgs/age.png');
			display: flex;
			margin-left: 0.53333rem;
		}
		span:nth-of-type(2) {
			height: 76px;
			width: 76px;
			margin: 5px;
			background-image: url('./imgs/Twitter.png');
		}
		span:last-of-type {
			height: 76px;
			width: 76px;
			background-image: url('./imgs/WhatsApp.png');
		}
	}
}
.typrgraphy {
	height: auto;
	margin-bottom: 0.66667rem;
	color: var(--Medium-blue-0, #d8d9e8);
	font-family: 'Bai Jamjuree';
	font-size: 30px;
	font-weight: 400;
	padding: 0.13333rem;
}
</style>
