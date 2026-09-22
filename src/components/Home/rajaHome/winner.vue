<template>
	<div class="p3_winner">
		<div class="title"></div>
		<div class="p3_winner-wrapper">
			<div ref="wrapperRef">
				<div class="p3_winner-wrapper__item" v-for="item in getWinInfo.slice(0, 6)" :key="item as any" @click="onWinInfoClick(item)">
					<img v-lazy="item.imgUrl" />
					<div class="info">
						<div><span class="name">{{ desensitizeString(item['nickName']) }}</span>
						</div>
						<div>
							{{ $t('winningAmountRaja') }}
						</div>
						<div>
							{{ currency(item['amount'] || 0) }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { currency, desensitizeString } from '@/utils'
import autoAnimate from '@formkit/auto-animate'
import { WinInfoType, useHome } from '@/hooks'

const { homeState, getWinInfoDetail, getWinInfo, onWinInfoClick } = useHome()
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
.p3_winner {
	color: var(--text_color_L1);
	margin-top: 40px;
	.title {
		width: 426px;
		margin: 0 auto 28px;
		height: 109px;
		background-repeat: no-repeat;
		background-size: 426px auto;
		background-position: center center;
		background-image: url(./svg/dailyIcon.svg);
		position: relative;
		text-align: center;
		padding-top:12px;
		span{
			color: #FFF;
			font-family: "Climate Crisis";
			font-size: 30px;
			font-style: normal;
			font-weight: 900;
			line-height: 105%; /* 30.45px */
			letter-spacing: 2.03px;
			display: inline-block;
			width: 200px;
			text-align: center;
		}
	}

	&-wrapper {
		height: calc((123px * 5) - 15px);
		border-radius: 10px;
		overflow: hidden;

		&__item {
			display: flex;
			align-items: center;
			width: 100%;
			height: 108px;
			padding: 14px 18px 14px 55px;
			background: var(--darkBg, var(--bg_color_L2));
			margin-bottom: 15px;
			border-radius: 5px;
			gap: 20px;
			img {
				width: 60px;
				height: 80px;
			}
			.info {
				flex: 1;
				&>div {
					display: flex;
					justify-content: space-between;
					height: 24px;
					font-size: 17px;
					color: var(--text_color_L2);
					&+div {
						margin-top: 5px;
					}
				}
				.name {
					color: var(--text_color_L1);
				}
				.amount {
					color: var(--main-color);
				}
			}
		}
	}
}
</style>
