<template>
	<div class="section-header">
		<div class="section-header__title">
			<div class="section-header__title-bg">
				<span class="section-header__title-bg__inner"></span>
				<span class="section-header__title-bg__text">{{ title }}</span>
			</div>
			<div class="section-header__title-tail"></div>
		</div>
		<div class="section-header__right" v-if="showAll || extraText" @click="$emit('clickAll')">
			<span class="section-header__right-count" v-if="extraText">{{ extraText }}</span>
			<template v-if="showAll">
				<span class="section-header__right-all">ALL</span>
				<svg class="section-header__right-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	showAll?: boolean
	extraText?: string
}>()

defineEmits(['clickAll'])

</script>

<style lang="scss" scoped>
.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 78px;
	border-radius: 15px 15px 0 0;
	background: linear-gradient(to right, #251b3b, #382c53);
	box-shadow: inset 0 2px 0 0 #2e384a, 0 4px 4px 0 rgba(0, 0, 0, 0.25);
	overflow: visible;

	&__title {
		display: inline-flex;
		align-items: center;
		height: 78px;

		&-bg {
			position: relative;
			display: inline-flex;
			align-items: center;
			min-width: 220px;
			height: 100%;
			background:
				url('@icon/home/titleBgLeft.svg') no-repeat right center / auto 102%;

			// 半透明背景层（不影响文字透明度）
			&__inner {
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: calc(100% - 10px);
				height: 50px;
				background-color: #030214;
				opacity: 0.45;
				border-bottom-right-radius: 50px;
				border-top-right-radius: 50px;
				box-shadow: -4px 3px 4px 0 #0B1265 inset;
			}

			// 文字层（不受透明度影响）
			&__text {
				position: relative;
				z-index: 1;
				padding-left: 20px;
				padding-right: 30px;
				font-size: 30px;
				font-weight: 400;
				color: #fff;
				text-shadow: 0 3px 4px rgba(0, 0, 0, 0.25);
				white-space: nowrap;
				line-height: 50px;
			}
		}

		&-tail {
			width: 84px;
			min-width: 84px;
			height: 100%;
			background: url('@icon/home/titleBgRight.svg') no-repeat left center / 100% 100%;
			margin-left: -1px;
		}
	}

	&__right {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-right: 20px;
		cursor: pointer;

		&-count {
			font-family: 'Fredoka', sans-serif;
			font-size: 24px;
			font-weight: 500;
			color: #f1f7ff;
			margin-right: 32px;
		}

		&-all {
			font-family: 'Fredoka', sans-serif;
			font-size: 28px;
			font-weight: 500;
			color: #f1f7ff;
		}

		&-arrow {
			width: 36px;
			height: 36px;
			color: #f1f7ff;
			flex-shrink: 0;
		}
	}
}
</style>
