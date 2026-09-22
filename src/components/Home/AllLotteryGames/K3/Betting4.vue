<template>
	<div class="K3B__C-betting4">
		<div class="K3B__C-betting4-tip1">
			{{ $t('k3bet4Desc1') }}
			<span v-if="OddsList[23]"
				>({{ OddsList[23].playRate ? OddsList[23].playRate : OddsList[23].playRate_Original }})</span
			>
			<van-icon @click="question($t('k3bet4Desc2'), [1, 2, 4])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting4-line1 mb30">
			<div
				:class="{ active: item.chackOne }"
				v-for="(item, index) in numList"
				:key="index"
				@click="TaskNmCunt(item, index, 1)"
			>
				<div>{{ item.num }}</div>
			</div>
		</div>
		<div class="K3B__C-betting4-tip1">
			{{ $t('k3bet4Desc3') }}
			<span v-if="OddsList[24]"
				>({{ OddsList[24].playRate ? OddsList[24].playRate : OddsList[24].playRate_Original }})</span
			>
			<van-icon @click="question($t('k3bet4Desc4'), [1, 2, 3])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting4-btn" :class="{ active: numChack }" @click="BetNumChack">{{ $t('betPopDesc7') }}</div>
		<div class="K3B__C-betting4-tip1">
			{{ $t('k3bet4Desc5') }}
			<span v-if="OddsList[18]"
				>({{ OddsList[18].playRate ? OddsList[18].playRate : OddsList[18].playRate_Original }})</span
			>
			<van-icon @click="question($t('k3bet4Desc6'), [1, 2])" class="icon" color="#FA574A" size="16" name="question" />
		</div>
		<div class="K3B__C-betting4-line1">
			<div
				:class="{ active: item.chackTow }"
				v-for="(item, index) in numList"
				:key="index"
				@click="TaskNmCunt(item, index, 2)"
			>
				<div>{{ item.num }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
const props = withDefaults(
	defineProps<{
		OddsList: {
			playType: number
			playBet: string
			playRate: number
			playRate_Original: number
		}[]
		numList: any
		numTow: any[]
		numOne: any[]
		numChack: any
		betnumList: any
	}>(),
	{}
)

const emit = defineEmits(['showP', 'upAll', 'selectNum', 'cNumChack', 'onQuestion'])

// 选择 3 个不同的数字||选择2个不同的数字:下注内容 1选择内容，2当前点击的下标，3类型
const TaskNmCunt = (e: { num: any }, index: number, type: number) => {
	if (type == 1) {
		if (props.numList[index].chackOne) {
			props.numList[index].chackOne = false
			var numindex = props.numOne.indexOf(e.num)
			if (numindex > -1) {
				//大于0 代表存在，
				props.numOne.splice(numindex, 1) //存在就删除
			}
		} else {
			props.numList[index].chackOne = true
			props.numOne.push(e.num)
			props.numOne.sort()
		}
	} else {
		if (props.numList[index].chackTow) {
			props.numList[index].chackTow = false
			var index = props.numTow.indexOf(e.num)
			if (index > -1) {
				//大于0 代表存在，
				props.numTow.splice(index, 1) //存在就删除
			}
		} else {
			props.numList[index].chackTow = true
			props.numTow.push(e.num)
			props.numTow.sort()
		}
	}
	if (props.numChack || props.numTow.length > 1 || props.numOne.length > 2) {
		emit('showP', true)
	} else {
		emit('showP', false)
	}
}
// 点击查看中奖规则
const question = (e: string, arr: Array<number>) => {
	emit('onQuestion', e, arr)
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
onMounted(() => {})
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
