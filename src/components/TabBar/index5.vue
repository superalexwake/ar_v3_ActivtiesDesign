<template>
	<div class="tabbar__container">
		<div
			class="tabbar__container-item"
			v-for="(item, index) in tabBars"
			:class="[item.name, { active: item.name === route.name }]"
			:key="item + '' + index"
			@click="handleClick(item.name)"
		>
			<i class="tab-icon" />
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
			<div class="promotionBg" v-if="item.name === 'promotion'"></div>
			<span v-else>
				{{ $t(item.name) }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { handleTabBarClick } from './constTabbars'
import { useActive } from '@/components/common/use'

const router = useRouter()
const route = useRoute()
async function handleClick(name: string) {
	await handleTabBarClick(name, router)
}

const { ActiveSotre } = useActive()
const redDot = computed(() => ActiveSotre.value.activityRedDot)

const tabBars = [
	{
		name: 'home'
	},
	{
		name: 'activity'
	},
	{
		name: 'promotion'
	},
	{
		name: 'wallet'
	},
	{
		name: 'main'
	}
]
</script>

<style scoped lang="scss">
.tabbar__container {
	position: fixed;
	bottom: -20px;
	left: 50%;
	display: flex;
	align-items: flex-start;
	width: 750px;
	transform: translateX(-50%);
	height: 196px;
	padding-block: 0 10px;
	font-size: 22px;
	background: url('@/assets/icons/tabBarIcons/tabBarBg.png') no-repeat center center / cover;
	z-index: 100;

	&-item {
		margin-top: 58px;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 8.78px;

		color: var(--text4,var(--text_color_L2));

		&.activity {
			position: relative;
		}

		.reddot {
			position: absolute;
			top: 4px;
			left: calc(50% + 12px);
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: #FA5B5B;
			z-index: 5;
		}

		&:nth-of-type(3) {
			position: relative;

			:deep(.tab-icon) {
				position: relative;
				top: -20px;
				width: 69px;
				height: 63px;
				z-index: 3;

				path {
					fill: #fff !important;
				}
			}

			.promotionBg {
				position: absolute;
				left: 50%;
				top: -40px;
				transform: translate(-50%, 0);
				background: var(--bg_color_L2);
				width: 98px;
				height: 98px;
				border-radius: 50%;
				z-index: 2;

				&::after {
					content: '';
					position: absolute;
					left: 50%;
					top: 50%;
					width: calc(108px - 8px);
					height: calc(108px - 8px);
					border-radius: 50%;
					transform: translate(-50%, -50%);
					background: var(--main_gradient-color2);
				}
			}
		}

		.tab-icon {
			display: block;
			width: 43.32px;
			height: 44.54px;
			background: no-repeat center / contain;
		}

		span{
			line-height: 28px;
			height: 28px;
			width: 100%;
			text-align: center;
			overflow: hidden;
		}

		&.active {
			color: var(--main-color) !important;
		}

		@each $name in (home, activity, promotion, wallet, main) {
			&.#{$name} .tab-icon { background-image: url('@public/tabBarIcons/okwin/#{$name}.png'); }
			&.#{$name}.active .tab-icon { background-image: url('@public/tabBarIcons/okwin/#{$name}_active.png'); }
		}
	}
}

@media screen and (max-width: 500px) {
	.tabbar__container {
		width: 100%;
		left: 0;
		transform: translateX(0);
		html:lang(ar) &{
			left: unset;
			right: 0;
		}
	}
}
</style>
