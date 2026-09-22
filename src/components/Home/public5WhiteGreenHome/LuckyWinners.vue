<template>
	<div class="lw">
		<div class="lw__title">
			<img class="lw__title-icon" :src="winningInfoIcon" alt="" />
			{{ $t('winningDetal') }}
		</div>
		<div class="lw__table">
			<div class="lw__table-head">
				<span class="col-game">{{ $t('game') }}</span>
				<span class="col-member">{{ $t('winner') }}</span>
				<span class="col-amount">{{ $t('winningAmount') }}</span>
			</div>
			<div ref="wrapperRef">
				<div class="lw__table-row" v-for="(item) in getWinInfo.slice(0, 6)" :key="item as any" @click="onWinInfoClick(item)">
					<div class="lw__table-row__game">
						<img v-lazy="item.imgUrl" alt="" />
					</div>
					<div class="lw__table-row__member">
						<img
							v-lazy="getAvatarUrl(item.userPhoto) || defaultAvatar"
							alt=""
						/>
						<span>{{ desensitizeString(item['nickName']) }}</span>
					</div>
					<div class="lw__table-row__amount">
						<img class="lw__table-row__amount-coin" :src="coinIcon" alt="" />
						<span>{{ currency(item['amount'] || 0) }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { currency, desensitizeString } from '@/utils'
// @ts-ignore
import autoAnimate from '@formkit/auto-animate'
import { WinInfoType, useHome } from '@/hooks'
import { useAssets } from '@/hooks/useAssets'
import winningInfoIcon from '@icon/home/icon_winningInfo.svg?url'
import coinIcon from '@icon/home/coin.png'

const { defaultAvatar, getAvatarUrl } = useAssets()
const { homeState, getWinInfoDetail, getWinInfo, onWinInfoClick } = useHome()

const timer = ref(null as unknown as NodeJS.Timeout)
const wrapperRef = ref<HTMLElement>(null as unknown as HTMLElement)

onMounted(async () => {
	if (homeState.winInfoList.length === 0) {
		await getWinInfoDetail()
	}
	autoAnimate(wrapperRef.value as any)
	if (homeState.winInfoList.length > 0) {
		timer.value = setInterval(async () => {
			homeState.winInfoList.push(homeState.winInfoList.shift() as WinInfoType)
		}, 3000)
	}
})
onUnmounted(() => {
	clearInterval(timer.value)
	homeState.winInfoList.splice(0)
})
</script>

<style lang="scss" scoped>
.lw {
	&__title {
		display: flex;
		align-items: center;
		font-size: 36px;
		font-weight: 500;
		color: var(--text_color_L1);
		margin-bottom: 24px;
		gap: 12px;

		&-icon {
			width: 60px;
			height: 60px;
			flex-shrink: 0;
		}
	}

	&__table {
		&-head {
			display: flex;
			align-items: center;
			height: 63px;
			font-size: 26px;
			color: var(--text_color_L1);

			.col-game {
				flex: 0 0 152px;
				padding-left: 24px;
			}

			.col-member {
				flex: 0 0 290px;
				padding-left: 48px;
			}

			.col-amount {
				flex: 1;
				padding-left: 10px;
			}
		}

		&-row {
			display: flex;
			align-items: center;
			height: 112px;
			border-radius: 24px;
			background: linear-gradient(180deg, var(--win-row-bg-from) 0%, var(--win-row-bg-to) 100%);
			border: 2px solid var(--win-row-border);
			margin-bottom: 16px;

			&__game {
				flex: 0 0 152px;
				padding-left: 20px;

				img {
					width: 64px;
					height: 82px;
					border-radius: 8px;
					object-fit: cover;
					display: block;
				}
			}

			&__member {
				flex: 0 0 290px;
				display: flex;
				align-items: center;
				gap: 12px;

				img {
					width: 48px;
					height: 48px;
					border-radius: 50%;
					flex-shrink: 0;
				}

				span {
					font-size: 26px;
					color: var(--text_color_L1);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 180px;
				}
			}

			&__amount {
				flex: 1;
				display: flex;
				align-items: center;
				gap: 12px;

				span {
					font-size: 26px;
					color: var(--main-color);
					font-weight: 600;
				}
			}

			&__amount-coin {
				width: 40px;
				height: 40px;
				flex-shrink: 0;
			}
		}
	}
}
</style>
