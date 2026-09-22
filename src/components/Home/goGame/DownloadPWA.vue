<template>
	<div class="container">
		<div class="btn pwa-btn">
			<div class="text"><van-icon name="cross" @click="show = false" color="white" /> {{ $t('downloadMobileApp') }}</div>
			<div class="download" @click="onDown">Download</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useSessionStorage } from '@vueuse/core'
import {useHome} from "@/hooks";
const show = useSessionStorage('show-pwa-download', true)
const { t: $t } = useI18n()

const {onDown} = useHome();

</script>
<style lang="scss" scoped>
.container {
	position: relative;
	z-index: 10;
}
.btn {
	width: 100%;
	height: 60px;
	background: rgba(0, 6, 40, 0.9);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 10px;
	padding-right: 5px;
	color: #fff;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	overflow: hidden;

	.text {
		font-weight: 500;
		font-size: 24px;
		line-height: 24px;
		color: var(--text_color_L4, #e4e7ed);
		margin-left: 10px;
		font-family: Inter;
		gap: 15px;
		max-width: fit-content;
	}
	.download {
		border-radius: 10px;
		background: var(--main_gradient-color);
		display: inline-flex;
		height: 42px;
		padding: 16px;
		justify-content: center;
		align-items: center;
		gap: 12px;
		color: var(--text_color_L4, #e4e7ed);
		text-align: center;
		font-family: Inter;
		font-size: 18px;
		font-style: italic;
		font-weight: 600;
	}

	.van-badge__wrapper van-icon van-icon-cross {
		width: 20px;
		height: 20px;
	}
}
</style>
