<template>
	<div class="K3B__C-betting3">
		<div class="K3B__C-betting3-tip1">
			{{ t('k3bet3Desc1') }}({{ numSame3?.playRate }})
			<van-icon @click="question('k3bet3Desc2', [6, 6, 6])" class="icon" color="#FA574A" size="16"
				name="question" />
		</div>
		<div class="K3B__C-betting3-line1 mb30">
			<div :class="{ active: bets.includes(`${numSame3.playType}_${item}${item}${item}`) }" v-for="(item, index) in 6" :key="index"
				@click="onChange({...numSame3,playBet:`${item}${item}${item}`})">
				<!-- <i :class="'number' + item" v-for="i in 3" :key="i"></i> -->
				<div>{{ item }}{{ item }}{{ item }}</div>
			</div>
		</div>
    <!-- <div class="line"></div> -->
		<div class="K3B__C-betting3-tip1">
			{{ t('k3bet3Desc3') }}({{ same3All?.playRate }})
			<van-icon @click="question('k3bet3Desc5', [7, 7, 7])" class="icon" color="#FA574A" size="16"
				name="question" />
		</div>
		<div class="K3B__C-betting3-btn" :class="{ active: bets.includes(`${same3All.playType}_AAA`) }" @click="onChange(same3All)">{{ t('k3bet3Desc4') }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import {GetGameInfoRspPlayRate} from "@/saasLottery/api";
 withDefaults(
	defineProps<{
    bets:string[]
    numSame3:GetGameInfoRspPlayRate
    same3All:GetGameInfoRspPlayRate
	}>(),
	{}
)

const emit = defineEmits(['choose','question'])
const question=(text:string,numbers:number[])=>{
  emit('question',{
    text:t(text),
    numbers,
  })
}
const onChange=(item:GetGameInfoRspPlayRate)=>{
	console.log('item', item)
  emit('choose',{item,playType:item.playType})
}
</script>

<style lang="scss" scoped>
.K3B__C {
	&-betting3 {
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

			& > div {
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
			margin-bottom: 16px;
			opacity: 0.5;
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
