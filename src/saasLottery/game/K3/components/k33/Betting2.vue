<template>
	<div class="K3B__C-betting2">
		<div class="K3B__C-betting2-tip1" v-if="same2Rate">
			{{ t('k3bet2Desc1') }}({{ same2Rate?.playRate }})
			<van-icon @click="question('k3bet2Desc2', [5, 5])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting2-line1 mb30">
			<div :class="{ active: bets.includes(`${same2Rate.playType}_${item}${item}`) }" v-for="(item, index) of 6"
				:key="index" @click="onChange({ ...same2Rate, playBet: `${item}${item}` })">
				<div>{{ item }}{{ item }}</div>
				<!-- <i :class="'number'+ (item)"></i>
				<i :class="'number'+ (item)"></i> -->
			</div>

		</div>
		<!-- <div class="line"></div> -->
		<div class="K3B__C-betting2-tip1">
			{{ t('k3bet2Desc3') }}({{ same2Mult?.playRate }})

			<van-icon @click="question('k3bet2Desc4', [6, 1, 6])" class="icon" color="#FA574A" size="16"
				name="question" />
		</div>
		<div class="K3B__C-betting2-line2">
			<div :class="{ active: bets.includes(`${same2Mult.playType}_${item}${item}`) }" v-for="(item, index) in 6"
				:key="index" @click="onChange({ ...same2Mult, playBet: `${item}${item}` })">
				<div>{{ item }}{{ item }}</div>
			</div>
		</div>
		<div class="K3B__C-betting2-line3">
			<div :class="{ active: bets.includes(`${same2Mult.playType}_${item}`) }" v-for="(item, index) in 6"
				:key="index" @click="onChange({ ...same2Mult, playType: 'NumSame2Mult2', playBet: `${item}` })">
				<div>{{ item }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { GetGameInfoRspPlayRate } from "@/saasLottery/api";
withDefaults(
	defineProps<{
		same2Mult: GetGameInfoRspPlayRate
		same2Rate: GetGameInfoRspPlayRate
		bets: string[]
	}>(),
	{}
)
const emit = defineEmits(['choose', 'question'])
const question = (text: string, numbers: number[]) => {
	emit('question', {
		text: t(text),
		numbers,
	})
}
const onChange = (item: GetGameInfoRspPlayRate | any) => {
	emit('choose', { item, playType: item.playType })
}
</script>

<style lang="scss" scoped>
.K3B__C {
	&-betting2 {
		margin-top: 20px;

		&-tip1 {
			display: flex;
			align-items: center;
			height: 30px;
			font-size: 26px;
			line-height: 30px;
			color: var(--text_color_L1);

			.icon {
				margin-left: 10px;
			}
		}

		&-line1,
		&-line2,
		&-line3 {
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
				opacity: 0.5;

				&.active {
					opacity: 1;
				}
			}
		}

		&-line1 {
			&>div {
				background: var(--norm_Purple-color);
				font-size: 28px;

				&.active {
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

		&-line2 {
			&>div {
				background: var(--norm_red-color);
				font-size: 28px;

				&.active {
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

		&-line3 {
			&>div {
				font-size: 28px;
				background: var(--norm_green-color);

				&.active {
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
}
</style>
