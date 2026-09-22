<template>
	<div class="K3B__C-betting2">
		<div class="K3B__C-betting2-tip1">
			{{ $t('k3bet2Desc1')
			}}<span v-if="OddsList[20]"
				>({{ OddsList[20].playRate ? OddsList[20].playRate : OddsList[20].playRate_Original }})</span
			>
			<van-icon @click="question($t('k3bet2Desc2'), [5, 5])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting2-line1 mb30">
			<div :class="{ active: item.chack }" v-for="(item, index) in numList" :key="index" @click="BetNumCunt(item, index)">
				<div>{{ item.num }}{{ item.num }}</div>
			</div>
		</div>
		<div class="K3B__C-betting2-tip1">
			{{ $t('k3bet2Desc3')
			}}<span v-if="OddsList[19]"
				>({{ OddsList[19].playRate ? OddsList[19].playRate : OddsList[19].playRate_Original }})</span
			>
			<van-icon @click="question($t('k3bet2Desc4'), [6, 1, 6])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting2-line2">
			<div
				:class="{ active: item.chackOne }"
				v-for="(item, index) in numList"
				:key="index"
				@click="numCunt(item, index, 1)"
			>
				<div class="">{{ item.num }}{{ item.num }}</div>
			</div>
		</div>
		<div class="K3B__C-betting2-line3">
			<div
				:class="{ active: item.chackTow }"
				v-for="(item, index) in numList"
				:key="index"
				@click="numCunt(item, index, 2)"
			>
				<div class="">{{ item.num }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
const props = withDefaults(
	defineProps<{
		OddsList: {
			playType: number
			playBet: string
			playRate: number
			playRate_Original: number
		}[]
		numList: any
		betnumList: any[]
		numTow: any[]
		numOne: any[]
		numChack: boolean
	}>(),
	{}
)
const emit = defineEmits(['showP', 'upAll', 'selectNum', 'onQuestion'])
/**
 *
 * @param e 先择的json
 * @param index 所在的list index
 * @param type 类型
 */
const numCunt = (e: any, index: any, type: any) => {
	let item1 = e.num
	let item2 = e.num + '' + e.num
	if (type == 1) {
		if (props.numList[index].chackOne) {
			props.numList[index].chackOne = false
			let numIndex = props.numTow.indexOf(item2)
			if (numIndex > -1) {
				props.numTow.splice(numIndex, 1)
			}
		} else {
			props.numList[index].chackOne = true
			props.numList[index].chackTow = false
			let numIndex = props.numOne.indexOf(item1)
			if (numIndex > -1) {
				props.numOne.splice(numIndex, 1)
			}
			props.numTow.push(item2)
		}
	} else {
		if (props.numList[index].chackTow) {
			props.numList[index].chackTow = false
			let numIndex = props.numOne.indexOf(item1)
			if (numIndex > -1) {
				props.numOne.splice(numIndex, 1)
			}
		} else {
			props.numList[index].chackTow = true
			props.numList[index].chackOne = false
			let numIndex = props.numTow.indexOf(item2)
			if (numIndex > -1) {
				props.numTow.splice(numIndex, 1)
			}
			props.numOne.push(item1)
		}
	}
	emit('selectNum')
	if ((props.numTow.length > 0 && props.numOne.length > 0) || props.betnumList.length > 0) {
		emit('showP', true)
	} else {
		emit('showP', false)
	}
}
const BetNumCunt = (e: { num: string }, index: string | number) => {
	let item = e.num + '' + e.num
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
// 点击查看中奖规则
const question = (e: string, arr: Array<number>) => {
	emit('onQuestion', e, arr)
}

onMounted(() => {})
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

			& > div {
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
			& > div {
				background: var(--norm_Purple-color);
				font-size: 28px;

				&.active {
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

		&-line2 {
			& > div {
				background: var(--norm_red-color);
				font-size: 28px;

				&.active {
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

		&-line3 {
			& > div {
				font-size: 28px;
				background: var(--norm_green-color);

				&.active {
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
}
</style>
