<template>
	<div class="K3B__C-bettingList">
		<div :class="'num num' + item.num" v-for="(item, index) in bettingList" :key="index" @click="betCunt(item, index)">
			<div :class="index % 2 == 0 ? 'ball rball' : 'ball gball'" v-if="index < 16">
				<div :class="'K3B__C-odds-bet num' + item.num">{{ bettingName(item.num) }}</div>
			</div>
			<div class="" v-else>{{ bettingName(item.num) }}</div>
			<div v-if="index < 16" class="K3B__C-odds-rate">
				{{ props.OddsList[index] && (props.OddsList[index].playRate || props.OddsList[index].playRate_Original) }}X
			</div>
			<div v-else-if="index < 18" class="K3B__C-odds-rate">
				{{ props.OddsList[16] && (props.OddsList[16].playRate || props.OddsList[16].playRate_Original) }}X
			</div>
			<div v-else class="K3B__C-odds-rate">
				{{ props.OddsList[17] && (props.OddsList[17].playRate || props.OddsList[17].playRate_Original) }}X
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = withDefaults(
	defineProps<{
		OddsList: {
			playType: number
			playBet: string
			playRate: number
			playRate_Original: number
		}[]
		betnumList: any[]
	}>(),
	{}
)
const emit = defineEmits(['showP', 'upAll'])

// 投注1列表
const bettingList = ref<{ num: number | string; odds: number; chack: boolean }[]>([
	{
		num: 3,
		odds: 191.16,
		chack: false
	},
	{
		num: 4,
		odds: 63.72,
		chack: false
	},
	{
		num: 5,
		odds: 31.86,
		chack: false
	},
	{
		num: 6,
		odds: 19.11,
		chack: false
	},
	{
		num: 7,
		odds: 12.74,
		chack: false
	},
	{
		num: 8,
		odds: 9.1,
		chack: false
	},
	{
		num: 9,
		odds: 7.64,
		chack: false
	},
	{
		num: 10,
		odds: 7.08,
		chack: false
	},
	{
		num: 11,
		odds: 7.08,
		chack: false
	},
	{
		num: 12,
		odds: 7.64,
		chack: false
	},
	{
		num: 13,
		odds: 9.1,
		chack: false
	},
	{
		num: 14,
		odds: 12.74,
		chack: false
	},
	{
		num: 15,
		odds: 19.11,
		chack: false
	},
	{
		num: 16,
		odds: 31.86,
		chack: false
	},
	{
		num: 17,
		odds: 63.72,
		chack: false
	},
	{
		num: 18,
		odds: 191.16,
		chack: false
	},
	{
		num: 'A', //H
		odds: 2,
		chack: false
	},
	{
		num: 'B', //L
		odds: 2,
		chack: false
	},
	{
		num: 'C', //O
		odds: 2,
		chack: false
	},
	{
		num: 'D', //E
		odds: 2,
		chack: false
	}
])
// 名稱映射
const bettingName = (num: string | number) => {
	switch (num) {
		case 'A':
			return t('k3Big')
		case 'B':
			return t('k3Small')
		case 'C':
			return t('k3Odd')
		case 'D':
			return t('k3Even')
		default:
			return num
	}
}

// 选择总赌注下注内容
const betCunt = (e: { num: any }, index: number) => {
	if (index < 16) {
		if (bettingList.value[index].chack) {
			delBet(e, index)
		} else {
			props.betnumList.push(e.num)
			bettingList.value[index].chack = true
		}
	} else {
		getRadio(e, index)
	}
	if (props.betnumList.length > 0) {
		emit('showP', true)
		// that.betAll(props.betnumList.length, 1); //计算投注总注数
	} else {
		emit('showP', false)
	}
	emit('upAll')
}
// 大小，单双只能个选一个
const getRadio = (e: { num: any }, index: string | number) => {
	switch (index) {
		case 16:
			radioChick(e, index, 17)
			break
		case 17:
			radioChick(e, index, 16)
			break
		case 18:
			radioChick(e, index, 19)
			break
		case 19:
			radioChick(e, index, 18)
			break
		default:
	}
}
// 单选逻辑
const radioChick = (e: { num: any }, index: number, UpID: number) => {
	if (bettingList.value[UpID].chack) {
		delBet(bettingList.value[UpID], UpID)
	}
	if (bettingList.value[index].chack) {
		delBet(e, index)
	} else {
		props.betnumList.push(e.num)
		bettingList.value[index].chack = true
	}
}
// 删除方法
const delBet = (e: { num: any }, index: number) => {
	bettingList.value[index].chack = false
	let hasBetNum = props.betnumList.indexOf(e.num)
	if (hasBetNum > -1) {
		//大于0 代表存在，
		props.betnumList.splice(hasBetNum, 1) //存在就删除
	}
}

// 清理选中
const clearList = () => {
	bettingList.value = bettingList.value.map((item) => {
		item.chack = false
		return item
	})
}
defineExpose({
	clearList
})
</script>

<style lang="scss" scoped>
.K3B__C {
	&-bettingList {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		& > div {
			width: calc((100% - 45px) / 4);
      height: 120px;
      border-radius: 10px;
			text-align: center;
			margin-top: 16px;
			color: var(--text_color_L2);
			display: flex;
			flex-direction: column;
			justify-content: center;
			.ball {
				width: 88px;
				height: 88px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 auto;
				&.rball {
					background: url('@/assets/icons/home/AllLotteryGames/K3/redBall.png') no-repeat center center;
					background-size: cover;
					.K3B__C-odds-bet {
						background:  linear-gradient(180deg, #FF827A 0%, #E93333 68.18%);
						background-clip: text;
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
				&.gball {
					background: url('@/assets/icons/home/AllLotteryGames/K3/greenBall.png') no-repeat center center;
					background-size: cover;
					.K3B__C-odds-bet {
						background: var(--norm_green-color);
						background-clip: text;
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
				.K3B__C-odds-bet {
					font-size: 48px;
					font-weight: 700;
				}
			}
			&.numA,
			&.numB,
			&.numC,
			&.numD {
				height: 88px;
				background-color: var(--norm_secondary-color);
				color: #fff;
				
			}
			&.numB {
				background-color: var(--norm_bule-color);
			}
			&.numC {
				background-color: var(--norm_red-color);
			}
			&.numD {
				background-color: var(--norm_green-color);
			}

			.K3B__C-odds-bet {
				font-size: 28px;
			}
			.K3B__C-odds-rate {
				font-size: 22px;
			}
		}
	}
}
</style>
