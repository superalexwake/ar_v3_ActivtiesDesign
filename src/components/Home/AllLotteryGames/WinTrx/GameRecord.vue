<template>
	<div class="GameRecord__C">
		<div class="GameRecord__C-head">
			<van-row>
				<van-col span="4">{{ $t('betSerial') }}</van-col>
				<van-col span="6">{{ $t('winTrxDesc1') }}</van-col>
				<van-col span="5">{{ $t('winTrxDesc2') }}</van-col>
				<van-col span="5">{{ $t('winTrxDesc3') }}</van-col>
				<van-col span="4">{{ $t('winTrxDesc4') }}</van-col>
			</van-row>
		</div>
		<div class="GameRecord__C-body">
			<template v-if="list.length">
				<van-row v-for="(item, index) in list" :key="index">
					<van-col span="6">{{ item.issue }}</van-col>
					<van-col span="4" @click="goTron(item.blockNumber)"
						>{{ item.blockNumber }}
						<svg-icon name="trxquestion" class="Binquire" v-if="item.day" />
					</van-col>
					<van-col span="5"> {{ item.time }}</van-col>
					<van-col span="4">{{ item.blockName }}</van-col>
					<van-col span="5">
						<div class="numberC">
							<div class="number" :class="['num' + item.number]">{{ item.number }}</div>
							<div :class="[Number(item.number) > 4 ? 'big' : 'small']">
								{{ Number(item.number) > 4 ? 'B' : 'S' }}
							</div>
						</div>
					</van-col>
				</van-row>
			</template>
			<div v-else class="GameRecord__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="list.length" class="GameRecord__C-foot">
			<div class="GameRecord__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="GameRecord__C-icon" size="20" />
			</div>
			<div class="GameRecord__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="GameRecord__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="GameRecord__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onActivated } from 'vue'
import Empty from '@/components/Empty/index.vue'
import { winTxrGetTRXNoaverageEmerdList } from '@/api'
import { AwaitWrap } from '@/utils'
import type { WinGo } from '@/types/api'
import { useRouter } from 'vue-router'

const list = ref<WinGo.GetNoaverageEmerdList[]>([])
const props = withDefaults(defineProps<{ typeid: number }>(), {})
const totalPage = ref(4)
const pageSize = ref(10)
const pageNo = ref(1)
const router = useRouter()
const pPage = () => {
	pageNo.value--
	getData()
}

const nPage = () => {
	pageNo.value++
	getData()
}

const getData = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
	}
	const [err, res] = await AwaitWrap<any>(
		winTxrGetTRXNoaverageEmerdList({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	if (!res) return
	let ServiceTime = res?.data.date.serviceTime
	list.value = res.data.gameslist.map((item: any) => {
		if (item.blockID) {
			var disLength = item.blockID.length
			var shortName2 = item.blockID.substring(disLength - 4, disLength)
			item.blockName = '**' + shortName2
		}
		if (item.issueNumber) {
			let number = item.issueNumber
			var Number1 = number.substring(0, 3)
			var disLength1 = item.issueNumber.length
			var Number2 = item.issueNumber.substring(disLength1 - 4, disLength1)
			item.issue = Number1 + '**' + Number2
		}
		if (item.blockTime) {
			let time = ServiceTime.split(' ')
			let time1 = item.blockTime.split(' ')
			item.day = time[0].substring(8, 10) == time1[0].substring(8, 10)
			item.time = time1[1]
		}
		return item
	})
	totalPage.value = res.totalPage
}

const goTron = (item: any) => {
	let url = `https://tronscan.org/#/block/${item}`
	window.location.href = url;
}
defineExpose({
	getData
})

onActivated(() => {
	getData()
})
</script>
<style lang="scss" scoped>
.GameRecord__C {
	width: calc(100% - 52px);
	margin: 36px auto 0;
	text-align: center;
	font-size: 24px;

	&-head {
		height: 80px;
		line-height: 80px;
		background: var(--sheet_nva_color);
		border-radius: 10px 10px 0px 0px;
		font-weight: 700;
		font-size: 26px;
		color: #fff;
		.van-col {
			height: 80px;
			overflow: hidden;
		}
	}

	&-body {
		line-height: 80px;

		&-redC {
			color: var(--main-color);
		}

		&-greenC {
			color: var(--bgcolor-22);
		}

		&-empty {
			height: 400px;
		}

		:deep(.van-col) {
			position: relative;
			height: 100px;
			line-height: 100px;
		}

		& > div {
			background: var(--darkBg, var(--bg_color_L2));
			color: var(--darkTextW, var(--text_color_L1));

			& + div {
				border-top: 1px solid var(--gray-color-1);
			}
		}

		.numberC {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;

			& > div {
				width: 36px;
				height: 36px;
				font-size: 24px;
				line-height: 36px;
			}
		}

		.small,
		.big {
			margin-left: 10px;
		}

		.big {
			color: var(--norm_secondary-color);
		}

		.small {
			color: var(--norm_bule-color);
		}

		.number {
			color: #fff;
			border-radius: 50%;

			&.num1,
			&.num3,
			&.num7,
			&.num9 {
				background-color: var(--norm_green-color);
			}

			&.num2,
			&.num4,
			&.num6,
			&.num8 {
				background-color: var(--norm_red-color);
			}

			&.num0 {
				background-image: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_Purple-color) 0);
			}

			&.num5 {
				background-image: linear-gradient(to bottom right, var(--norm_green-color) 50%, var(--norm_Purple-color) 0);
			}
		}

		.Binquire {
			width: 32px;
			height: 32px;
			background-image: url('@/assets/public3Style/icons/public/icon-question.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	&-origin {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		& > div {
			& + div {
				margin-left: 20px;
			}
		}

		&-I {
			width: 20px;
			height: 20px;
			border-radius: 50%;

			&.violet {
				background-color: var(--bgcolor-21);
			}

			&.red {
				background: var(--norm_red-color);
			}

			&.green {
				background: var(--bgcolor-22);
			}
		}
	}

	&-foot {
		height: 140px;
		background: var(--darkBg, var(--bg_color_L2));
		color: var(--text_color_L1);
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-previous,
		&-next {
			width: 70px;
			height: 70px;
			border-radius: 10px;
			background: var(--main-color);
			display: flex;
			align-items: center;
			justify-content: center;

			&.disabled {
				background: var(--bg_color_L1);
				pointer-events: none;

				.GameRecord__C-icon {
					color: var(--saveTextColor-7);
				}
			}

			.GameRecord__C-icon {
				color: var(--text_color_L4);
			}
		}
	}
}
</style>
