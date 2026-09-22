<template>
	<div class="super-jackpot" v-if="picList.length">
		<div class="super-jackpot__head">
			<img class="super-jackpot__head-icon" :src="partnerIcons.icon_SuperJackpot" alt="" />
			<span class="super-jackpot__title">{{ $t('superjackpot') }}</span>
		</div>
		<div class="super-jackpot__tip">
			{{ $t('bigAward') }}{{ $t('cpsTip4') }}
			<span class="super-jackpot__amount">{{ currency(settingS.jackportMaxReswadAmount) }}</span>
		</div>

		<Swipe
			class="super-jackpot__swipe"
			ref="swipeRef"
			:autoplay="3000"
			:lazy-render="false"
			:show-indicators="false"
		>
			<SwipeItem v-for="(group, x) in picList" :key="x">
				<div class="super-jackpot__grid">
					<div v-for="(game, i) in group" :key="i" class="super-jackpot__card">
						<div class="super-jackpot__multiple">{{ game.multiple }}X</div>
						<img v-lazy="game.imgUrl" alt="" class="super-jackpot__img" />
						<div class="super-jackpot__name">{{ game.gameName }}</div>
						<div class="super-jackpot__bonus">
							Bônus extra
							<span>{{ currency(game.bonusAmount) }}</span>
						</div>
					</div>
				</div>
			</SwipeItem>
		</Swipe>

		<div class="super-jackpot__btn" @click="goSuperJ">{{ $t('view') }}</div>
	</div>
</template>

<script setup lang="ts">
import { Swipe, SwipeItem } from 'vant'
import { useHome } from '@/hooks'
import { currency, splitIntoGroups } from '@/utils'
import { computed, ref } from 'vue'
import { SettingStore } from '@/stores'
import router from '@/router'
import { partnerIcons } from './partnerIcons'
import { requireLoginAction } from '@/hooks/useLoginIntercept'

const { homeState } = useHome()
const settingS = SettingStore()
const swipeRef = ref()

const picList = computed(() =>
	splitIntoGroups((homeState.allGameList?.awardrecordlist || []).slice(0, 9), 3)
)

const goSuperJ = async () => {
	if (!(await requireLoginAction())) return
	router.push({ name: 'SuperJackpot' })
}
</script>

<style scoped lang="scss">
.super-jackpot {
	display: flex;
	flex-direction: column;

	&__head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	&__head-icon {
		width: 40px;
		height: 40px;
		object-fit: contain;
	}

	&__title {
		color: var(--text_color_L1);
		font-size: 30px;
		font-weight: 600;
	}

	&__tip {
		color: var(--text_color_L2);
		font-size: 22px;
		line-height: 34px;
		margin-bottom: 24px;
	}

	&__amount {
		color: var(--main-color);
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	&__card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;
		border-radius: 16px;
		overflow: hidden;
	}

	&__multiple {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		height: 36px;
		line-height: 36px;
		padding: 0 14px;
		background: var(--main_gradient-color2);
		color: #fff;
		font-size: 22px;
		font-weight: 700;
		border-bottom-right-radius: 10px;
	}

	&__img {
		width: 100%;
		border-radius: 16px;
	}

	&__name {
		font-size: 22px;
		font-weight: 600;
		color: var(--text_color_L1);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0 4px;
	}

	&__bonus {
		font-size: 20px;
		color: var(--text_color_L2);
		padding: 0 4px;

		span {
			color: var(--main-color);
			font-weight: 600;
			margin-left: 4px;
		}
	}

	&__btn {
		margin-top: 24px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		border-radius: 40px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 30px;
		font-weight: 600;
		cursor: pointer;
	}
}
</style>
