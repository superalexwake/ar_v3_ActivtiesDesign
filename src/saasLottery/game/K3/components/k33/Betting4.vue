<template>
	<div class="K3B__C-betting4">
		<div class="K3B__C-betting4-tip1">
			{{ t('k3bet4Desc1') }}({{ numDiff3?.playRate }})

			<van-icon @click="question('k3bet4Desc2', [1, 2, 4])" class="icon" color="#FA574A" size="16"
				name="question" />
		</div>
		<div class="K3B__C-betting4-line1 mb30">
			<div :class="{ active: bets.includes(`${numDiff3?.playType}_${item}`) }" v-for="(item, index) in 6"
				:key="index" @click="onChange({ ...numDiff3, playBet: `${item}` })">
				<div>{{ item }}</div>
			</div>
		</div>
		<!-- <div class="line"></div> -->
		<div class="K3B__C-betting4-tip1">
			{{ t('k3bet4Desc3') }}({{ numNear3All?.playRate }})

			<van-icon @click="question('k3bet4Desc4', [1, 2, 3])" class="icon" color="#FA574A" size="16"
				name="question" />
		</div>
		<div class="K3B__C-betting4-btn"
			:class="{ active: bets.includes(`${numNear3All.playType}_${numNear3All.playBet}`) }"
			@click="onChange(numNear3All)">{{ t('betPopDesc7') }}</div>
		<!-- <div class="line"></div> -->
		<div class="K3B__C-betting4-tip1">
			{{ t('k3bet4Desc5') }}({{ numDiff2?.playRate }})
			<van-icon @click="question('k3bet4Desc6', [1, 2])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting4-line1">
			<div :class="{ active: bets.includes(`${numDiff2?.playType}_${item}`) }" v-for="(item, index) in 6"
				:key="index" @click="onChange({ ...numDiff2, playBet: `${item}` })">
				<div>{{ item }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n'
import { GetGameInfoRspPlayRate } from "@/saasLottery/api";
const { t } = useI18n()
withDefaults(
	defineProps<{
		bets: string[]
		numDiff3: GetGameInfoRspPlayRate
		numNear3All: GetGameInfoRspPlayRate
		numDiff2: GetGameInfoRspPlayRate
	}>(),
	{}
)

const emit = defineEmits(['choose'])
const onChange = (item: GetGameInfoRspPlayRate) => {
	emit('choose', { item, playType: item.playType })
}

const question = (text: string, numbers: number[]) => {
	emit('question', {
		text: t(text),
		numbers,
	})
}


</script>

<style lang="scss" scoped>
.K3B__C {
	&-betting4 {
		margin-top: 20px;

		&-tip1 {
			display: flex;
			align-items: center;
			height: 30px;
			font-size: 26px;
			line-height: 30px;
			color: var(--text_color_L1);
			margin-bottom: 16px;

			.icon {
				margin-left: 10px;
			}
		}

		&-line1 {
			height: 70px;
			display: flex;
			margin: 16px 0;
			justify-content: space-between;

			&.mb30 {
				margin-bottom: 30px;
			}

			&>div {
				width: calc((100% - 100px) / 6);
				height: 70px;
				line-height: 70px;
				color: #fff;
				text-align: center;
				border-radius: 10px;
				background: var(--norm_Purple-color);
				font-size: 28px;
				opacity: 0.5;

				&.active {
					position: relative;
					opacity: 1;

					&::after {
						content: '';
						display: block;
						width: 32px;
						height: 32px;
						background-image: url('../../assets/k33/AllGames/subtract.svg');
						background-size: 32px;
						background-position: center;
						position: absolute;
						bottom: 0px;
						right: 0px;
					}
				}
			}
		}

		&-btn {
			height: 70px;
			line-height: 70px;
			text-align: center;
			background: var(--norm_red-color);
			border-radius: 10px;
			color: #fff;
			font-size: 28px;
			margin-bottom: 30px;
			opacity: .5;

			&.active {
				opacity: 1;
				position: relative;

				&::after {
					content: '';
					display: block;
					width: 32px;
					height: 32px;
					background-image: url('../../assets/k33/AllGames/subtract.svg');
					background-size: 32px;
					background-position: center;
					position: absolute;
					bottom: 0px;
					right: 0px;
				}
			}
		}
	}
}
</style>
