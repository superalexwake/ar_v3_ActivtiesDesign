<template>
	<div class="K3B__C-betting3">
		<div class="K3B__C-betting3-tip1">
			{{ $t('k3bet3Desc1') }}
			<span v-if="OddsList[21]"
				>({{ OddsList[21].playRate ? OddsList[21].playRate : OddsList[21].playRate_Original }})</span
			>
			<van-icon @click="question($t('k3bet3Desc2'), [6, 6, 6])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting3-line1 mb30">
			<div :class="{ active: item.chack }" v-for="(item, index) in numList" :key="index" @click="BetNumCunt(item, index)">
				<div>{{ item.num }}{{ item.num }}{{ item.num }}</div>
			</div>
		</div>
		<div class="K3B__C-betting3-tip1">
			{{ $t('k3bet3Desc3') }}
			<span v-if="OddsList[22]"
				>({{ OddsList[22].playRate ? OddsList[22].playRate : OddsList[22].playRate_Original }})</span
			>
			<van-icon @click="question($t('k3bet3Desc5'), [7, 7, 7])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting3-btn" :class="{ active: props.numChack }" @click="BetNumChack">{{ $t('k3bet3Desc4') }}</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
const props = withDefaults(
	defineProps<{
		OddsList: {
			playType: number
			playBet: string
			playRate: number
			playRate_Original: number
		}[]
		numList: any
		betnumList: any
		numChack: any
		numTow: any
		numOne: any
	}>(),
	{}
)

const emit = defineEmits(['showP', 'upAll', 'selectNum', 'cNumChack', 'onQuestion'])
const BetNumCunt = (e: { num: string }, index: string | number) => {
	let item = e.num + '' + e.num + '' + e.num
	if (props.numList[index].chack) {
		props.numList[index].chack = false
		let hasBetNum = props.betnumList.indexOf(item)
		if (hasBetNum > -1) {
			//大于0 代表存在，
			props.betnumList.splice(hasBetNum, 1) //存在就删除
		}
	} else {
		props.betnumList.push(item)
		props.betnumList.sort()
		props.numList[index].chack = true
	}
	if (props.numChack || props.betnumList.length > 0 || (props.numTow.length > 0 && props.numOne.length > 0)) {
		emit('showP', true)
	} else {
		emit('showP', false)
	}
}
//选择3个匹配号码 || 选择3个连续的数字
const BetNumChack = () => {
	emit('cNumChack')
	nextTick(() => {
		if (props.numChack || props.betnumList.length > 0 || props.numTow.length > 1 || props.numOne.length > 2) {
			emit('showP', true)
		} else {
			emit('showP', false)
		}
	})
}
// 点击查看中奖规则
const question = (e: string, arr: Array<number>) => {
	emit('onQuestion', e, arr)
}
onMounted(() => {})
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
						background-image: url('@/assets/icons/svg/subtract.svg');
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
					background-image: url('@/assets/icons/svg/subtract.svg');
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
