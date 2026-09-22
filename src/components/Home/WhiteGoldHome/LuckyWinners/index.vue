<template>
	<div class="luckyWinners__container">
		<div class="title">{{ $t('winningDetal') }}</div>

		<div class="driver"></div>

		<Swipe class="my-swipe" ref="swipeRef" autoplay="3000" :show-indicators="false">
			<SwipeItem v-for="(item, index) in list" :key="index">
				<div class="info_item" v-for="suc in item" @click="onWinInfoClick(suc)">
					<div class="item_bg"></div>
					<img class="avatar_img" v-lazy="item['userPhoto']" :data-img="defaultAvatar" />
					<div class="nick_name">{{ desensitizeString(suc['nickName']) }}</div>
					<div class="fenge"></div>
					<div class="amount">{{ currency(suc['amount'] || 0) }}</div>
					<div class="tip">{{ $t('winningAmount') }}</div>
				</div>
			</SwipeItem>
		</Swipe>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref,} from 'vue'
import {currency, desensitizeString} from '@/utils'
import {Swipe, SwipeItem} from 'vant'
import {useHome} from '@/hooks'
import { useAssets } from '@/hooks/useAssets'

const { getWinInfoDetail, getWinInfo, onWinInfoClick } = useHome()
const { defaultAvatar } = useAssets()
const timer = ref(null as unknown as NodeJS.Timeout)
// const wrapperRef = ref<HTMLElement>(null as unknown as HTMLElement)
function chunk(array: any, size: number) {
	const chunkedArr = []

	for (let i = 0; i < array.length; i += size) {
		chunkedArr.push(array.slice(i, i + size))
	}
	return chunkedArr
}

const list = computed(() => {
	return chunk(getWinInfo.value || [], 3)
})

onMounted(async () => {
	await getWinInfoDetail()
})
onUnmounted(() => {
	clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.luckyWinners__container {
	margin-bottom: 30px;
	.title {
		color: #171717;
		text-align: center;
		font-size: 30px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		margin-bottom: 36px;
	}

	.driver {
		width: 100%;
		height: 3px;
		position: relative;
		background-color: #FB716C;
		margin-bottom: 30px;
	}
	.driver::before,
	.driver::after {
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #FB716C;
	}

	.driver::before {
		left: -8px;
		top: -8px;
		html:lang(ar) &{
			left: unset;
			right: -8px;
		}
	}

	.driver::after {
		right: -8px;
		top: -8px;
		html:lang(ar) &{
			left: -8px;
			right: unset;
		}
	}
	.my-swipe  {
		height: auto;
	}
	.my-swipe .van-swipe-item {
		height: 318px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 18px;
	}


	.info_item {
		display: flex;
		width: 222px;
		height: 317px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		border-radius: 30px;
		background-color: var(--bg_color_L2);
		position: relative;
		.item_bg {
			width: 108px;
			height: 55px;
			background: url('@/assets/icons/home/luck_bg.png') no-repeat;
			background-size: 108px auto;
			position: absolute;
			top: -8px;
			left: 56px;
			html:lang(ar) &{
				left: unset;
				right: 56px;
			}
		}
		.avatar_img {
			width: 88px;
			border-radius: 44px;
			height: 88px;
			border: 3px solid #F2D5B2;
			margin-bottom: 10px;
			margin-top: 18px;
		}
		.nick_name {
			color: #171717;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			margin-bottom: 18px;
		}
		.fenge {
			width: 198px;
			height: 1px;
			background: #ECEEF6;
			margin-bottom: 18px;
		}
		.amount {
			text-align: right;
			font-size: 30px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			background-image: linear-gradient(180deg, #E49700 8.86%, #FFC047 37.5%, #E49700 80.73%);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			margin-bottom: 20px;
		}
		.tip {
			text-align: center;
			color: #888;
			font-size: 22px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}
	}
}
</style>
