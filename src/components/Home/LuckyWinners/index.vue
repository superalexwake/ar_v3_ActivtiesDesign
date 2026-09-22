<template>
	<div class="luckyWinners__container">
		<h1>{{ $t('winningDetal') }}</h1>
		<div class="luckyWinners__container-wrapper">
			<div ref="wrapperRef">
				<div class="luckyWinners__container-wrapper__item" v-for="(item) in getWinInfo.slice(0, 6)" :key="item as any" @click="onWinInfoClick(item)">
					<div class="luckyWinners__container-wrapper__item-img">
						<img v-lazy="getAvatarUrl(item.userPhoto) || defaultAvatar"  />
					</div>
					<div class="luckyWinners__container-wrapper__item-info">
						<h1>{{ desensitizeString(item['nickName']) }}</h1>
					</div>
					<div class="luckyWinners__container-wrapper__item-winType">
						<img v-lazy="item.imgUrl" />
					</div>
					<div class="luckyWinners__container-wrapper__item-winAmount">
						<h1>{{ $t('titleGot') }} {{ currency(item['amount'] || 0) }}</h1>
						<span>{{ $t('winningAmount') }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, } from 'vue'
import { currency, desensitizeString } from '@/utils'
import autoAnimate from '@formkit/auto-animate'
import { WinInfoType, useHome } from '@/hooks'
import { useAssets } from '@/hooks/useAssets'

const { getAvatarUrl, defaultAvatar } = useAssets()
const {homeState, getWinInfoDetail, getWinInfo, onWinInfoClick} = useHome()

const timer = ref(null as unknown as NodeJS.Timeout)
const wrapperRef = ref<HTMLElement>(null as unknown as HTMLElement)

onMounted(async () => {
	await getWinInfoDetail()
	autoAnimate(wrapperRef.value as any)
	if (homeState.winInfoList.length > 0) {
		timer.value = setInterval(async () => {
			homeState.winInfoList.push(homeState.winInfoList.shift() as WinInfoType)
		}, 3000)
	}
})
onUnmounted(() => {
	clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.luckyWinners__container {
	& > h1 {
		position: relative;
		margin-bottom: 26px;
		padding-left: 20px;
		font-size: 36px;
		font-weight: bold;
		color: var(--darkTextW,var(--text_color_L1));

		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			width: 6px;
			height: 30px;
			background: var(--main-color);
		}
	}

	&-wrapper {
		height: calc((120px * 5) + 24px + 26px);
		overflow: hidden;

		&__item {
			display: flex;
			align-items: center;
			width: 100%;
			height: 120px;
			margin-bottom: 10px;
			padding: 20px 18px;
			border-radius: 10px;
			background: var(--darkBg,var(--bg_color_L2));

			&-img {
				margin-right: 13px;

				img {
					width: 80px;
					height: 80px;
					border-radius: 50%;
				}
			}

			&-info {
				width: 168px;
				margin-right: 16px;

				h1 {
					color: var(--darkTextW,var(--text_color_L1));
					font-size: 24px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 100%;
				}

				span {
					color: var(--text_color_L2);
					font-size: 22px;
				}
			}

			&-winType {
				display: flex;
				align-items: center;
				/* width: 166px;
				height: 108px; */
				width: 126px;
				height: 82px;
				margin-right: 17px;
				position: relative;
				img {
					width: 100%;
					height: 100%;
					background: var(--main_gradient-color2);
					border-radius: 16px;
					box-shadow: var(--BoxShadowColor-20);
					object-fit: cover;
				}

				span {
					display: inline-block;
					width: 56px;
					font-weight: bold;
					font-size: 16px;
					color: #fff;
					position: absolute;
					left: 15px;
					top: 12px;
					word-break: keep-all;
				}
			}

			&-winAmount {
				text-align: center;
				display: flex;
				flex-direction: column;

				h1 {
					color: var(--text_color_L1);
					font-size: 26px;
					font-weight: 600;
					margin-bottom: 10px;
				}

				span {
					color: var(--text_color_L2);
					font-size: 24px;
				}
			}
		}
	}
}
</style>
