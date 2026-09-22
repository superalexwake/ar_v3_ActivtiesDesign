<template>
	<div class="section-header">
		<span class="section-header__title">{{ title }}</span>
		<div class="section-header__right" v-if="showAll || extraText" @click="$emit('clickAll')">
			<span class="section-header__right-count" v-if="extraText">{{ extraText }}</span>
			<template v-if="showAll">
				<span class="section-header__right-all">ALL</span>
				<svg class="section-header__right-arrow" viewBox="0 0 24 24" fill="none">
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
	padding: 24px 20px 16px;
	background: url('@icon/home/sectionTitleBg.png') no-repeat right center;
	background-size: contain;

	&__title {
		font-size: 30px;
		font-weight: 700;
		color: var(--text_color_L1);
	}

	&__right {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;

		&-count {
			font-size: 22px;
			font-weight: 500;
			color: var(--text_color_L4);
		}

		&-all {
			font-size: 24px;
			font-weight: 600;
			color: var(--text_color_L4);
		}

		&-arrow {
			width: 40px;
			height: 40px;
			color: var(--text_color_L4);
			flex-shrink: 0;
		}
	}
}
</style>
