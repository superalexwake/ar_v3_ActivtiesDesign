<template>
	<div class="tabbar__container">
		<div class="tabbar__container-item" v-for="(item, index) in tabBars" :class="{
			active: item.name === route.name
		}" :key="item + '' + index" @click="handleClick(item.name)">

			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
			<svg-icon :name="item.name === route.name ? `${item.title}_a` : `${item.title}`" />
			<span >
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
	const { ActiveSotre } = useActive()
	const redDot = computed(() => ActiveSotre.value.activityRedDot)
	async function handleClick(name: string) {
		await handleTabBarClick(name, router)
	}

	const tabBars = [
		{
			icon: 'Affiliate',
			title: 'raja_affiliate',
			name: 'promotion',
		},
		{
			icon: 'Wallet',
			title: 'raja_wallet',
			name: 'wallet'
		},
		{
			icon: 'Games',
			title: 'raja_games',
			name: 'home'
		},
		{
			icon: 'Activity',
			title: 'raja_activity',
			name: 'activity'
		},
		{
			icon: 'Profile',
			title: 'raja_profile',
			name: 'main'
		}
	]
</script>

<style scoped lang="scss">
	.tabbar__container {
		position: fixed;
		bottom: 0;
		left: 50%;
		display: flex;
		align-items: center;
		width: 750px;
		transform: translateX(-50%);
		height: 152px;
		font-size: 22px;
		background: radial-gradient(130.56% 123.83% at 50% -23.83%, #4B0004 0%, #140000 100%);
		box-shadow: 0px 4px 17.5px 0px rgba(0, 0, 0, 0.25);
		z-index: 100;
		padding-bottom: 22px;
		&-item {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			gap: 8.78px;
			color: #BEC6D4;

			.reddot {
				position: absolute;
				bottom: 95px;
				left: calc(50% + 20px);
				width: 14px;
				height: 14px;
				border-radius: 50%;
				background: #FA5B5B;
				z-index: 5;
			}

			svg {
				display: block;
				width: 58px;
				height: 58px;
				&:nth-child(2){
					width: 56px;
					height: 79px;
				}
				&:nth-child(3){
					width: 96px;
					height: 81px;
				}
				&:nth-child(4){
					width: 72px;
					height: 54px;
				}
				&:nth-child(5){
					width: 71px;
					height: 55px;
				}
			}
		}
	}

	@media screen and (max-width: 500px) {
		.tabbar__container {
			width: 100%;
			left: 0;
			transform: translateX(0);

			html:lang(ar) & {
				left: unset;
				right: 0;
			}
		}
	}
</style>
