<template>
	<div class="luckyWinners__container">
		<div class="title">
			<img src="@public/home/okwinHome/winning.png" alt="">
			{{ $t('winningDetal') }}</div>
		<div class="luckyWinners__container-wrapper">
			<div ref="wrapperRef">
				<div class="item" v-for="(item) in getWinInfo.slice(0, 6)" :key="item as any" @click="onWinInfoClick(item)">
					<img class="game_img" v-lazy="item.imgUrl" />
					<div class="info">
						<div class="user_info">
							<div>
								<img v-lazy="getAvatarUrl(item.userPhoto) || defaultAvatar"  />
								<span>{{ desensitizeString(item['nickName']) }}</span>
							</div>
							<div class="time">{{item.winTime.split(' ')[1]}}</div>
						</div>
						<div class="win_text"><span>{{ $t('winningAmount') }}</span> Receive {{ currency(item['amount'] || 0) }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, } from 'vue'
import {  currency, desensitizeString } from '@/utils'
import { useAssets } from '@/hooks/useAssets'
import autoAnimate from '@formkit/auto-animate'
import { WinInfoType, useHome } from '@/hooks'

const {homeState, getWinInfoDetail, getWinInfo, onWinInfoClick} = useHome()
const { getAvatarUrl, defaultAvatar } = useAssets()

const timer = ref(null as unknown as NodeJS.Timeout)
const wrapperRef = ref<HTMLElement>(null as unknown as HTMLElement)

onMounted(async () => {
	await getWinInfoDetail()
	autoAnimate(wrapperRef.value as any)
	if (homeState.winInfoList.length > 0) {
		timer.value = setInterval(async () => {
			homeState.winInfoList.unshift(homeState.winInfoList.pop() as WinInfoType)
		}, 3000)
	}
})
onUnmounted(() => {
	clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.luckyWinners__container {
	.title {
		display: flex;
		align-items: center;
		margin-bottom: 36px;
		img {
			width: 45.222px;
			height: 44px;
			margin-right: 12px;
		}
			color: #1E2637;
			font-size: 32px;
			font-weight: 700;
	}
	.item {
		padding: 20px;
		border-radius: 16px;
		background: #FFF;
		box-shadow: 0px 4px 16px 0px rgba(208, 208, 237, 0.36);
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		.game_img {
			width: 108px;
			height: 108px;
			border-radius: 8px;
		}
		.info {
			width: 530px;
			.user_info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16px;
				img {
					width: 44px;
					height: 44px;
					border-radius: 50%;
					margin-right: 10px;
					vertical-align: middle;
				}
				span {
					color: #1E2637;
					font-size: 24px;
					font-weight: 500;
				}

				.time {
					color: #B6BCC8;
					font-size: 22px;
					font-weight: 400;
				}
			}
			.win_text {
				color: #FB5B5B;
				font-size: 26px;
				font-weight: 500;
				line-height: 24px; /* 92.308% */
				span {
					color: #768096;
					font-size: 24px;
					font-weight: 400;
					line-height: 24px; /* 100% */
				}
			}

		}
	}
}
</style>
