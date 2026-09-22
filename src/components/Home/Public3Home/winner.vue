<template>
	<div class="p3_winner">
		<div class="title"><b />{{ $t('winningDetal') }}</div>
		<div class="p3_winner-wrapper"  v-if="getWinInfo.length">
			<div ref="wrapperRef">
				<div class="p3_winner-wrapper__item" v-for="item in getWinInfo.slice(0, 6)" :key="item as any" @click="onWinInfoClick(item)">
					<img v-lazy="item.imgUrl" />
					<div class="info">
						<div>
							{{ $t('winner') }} <span class="name">{{ desensitizeString(item['nickName']) }}</span>
						</div>
						<div>
							{{ $t('winningAmount') }}<span class="amount">{{ currency(item['amount'] || 0) }}</span>
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
		height: 42px;
		display: flex;
		align-items: center;
		font-size: 30px;
		font-weight: 500;
		margin-bottom: 10px;
		b {
			display: block;
			height: 26px;
			width: 8px;
			border-radius: 4px;
			background-color: var(--main-color);
			margin-inline-end: 10px;
		}
	}

	&-wrapper {
		height: calc((140px * 5) - 1px);
		border-radius: 10px;
		overflow: hidden;

		&__item {
			display: flex;
			align-items: center;
			width: 100%;
			height: 140px;
			padding: 20px 18px;
			background: var(--darkBg, var(--bg_color_L2));
			border-bottom: 1px solid var(--Dividing-line_color);
			gap: 16px;
			img {
				width: 60px;
				height: 80px;
			}
			.info {
				flex: 1;
				&>div {
					display: flex;
					justify-content: space-between;
					height: 30px;
					font-size: 24px;
					color: var(--text_color_L2);
					&+div {
						margin-top: 18px;
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
