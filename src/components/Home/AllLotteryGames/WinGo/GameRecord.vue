<template>
	<div class="GameRecord__C">
		<div class="GameRecord__C-head">
			<van-row>
				<van-col span="9">{{ $t('betSerial') }}</van-col>
				<van-col span="5">{{ $t('num') }}</van-col>
				<van-col span="5">{{ $t('bigOrSmall') }}</van-col>
				<van-col span="5">{{ $t('color') }}</van-col>
			</van-row>
		</div>
		<div class="GameRecord__C-body">
			<template v-if="NoaverageEmerdList.length">
				<van-row v-for="(item, index) in NoaverageEmerdList" :key="index">
					<van-col span="9">{{ item.issueNumber }}</van-col>
					<van-col span="5" class="numcenter">
						<div class="GameRecord__C-body-num" :class="setColor(item.number)">{{ item.number }}</div>
					</van-col>
					<van-col span="5">
						<span v-if="Number(item.number) > 4">{{ $t('big') }}</span>
						<span v-else>{{ $t('small') }}</span>
					</van-col>
					<van-col span="5">
						<div class="GameRecord__C-origin">
							<template v-if="item.number == '0'">
								<div class="GameRecord__C-origin-I red" />
								<div class="GameRecord__C-origin-I violet" />
							</template>
							<template v-if="item.number == '1' || item.number == '3' || item.number == '7' || item.number == '9'">
								<div class="GameRecord__C-origin-I green" />
							</template>
							<template v-if="item.number == '2' || item.number == '4' || item.number == '6' || item.number == '8'">
								<div class="GameRecord__C-origin-I red" />
							</template>
							<template v-if="item.number == '5'">
								<div class="GameRecord__C-origin-I green" />
								<div class="GameRecord__C-origin-I violet" />
							</template>
						</div>
					</van-col>
				</van-row>
			</template>
			<div v-else class="GameRecord__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="NoaverageEmerdList.length" class="GameRecord__C-foot">
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
import { winGoGetNoaverageEmerdList } from '@/api'
import { AwaitWrap } from '@/utils'
import type { WinGo } from '@/types/api'

const NoaverageEmerdList = ref<WinGo.GetNoaverageEmerdList[]>([])
const props = withDefaults(defineProps<{ typeid: number }>(), {})
const totalPage = ref(4)
const pageSize = ref(10)
const pageNo = ref(1)
// 上一页
const pPage = () => {
	pageNo.value--
	getData()
}

const emits = defineEmits<{
	(e: 'changefive', val: any): void
}>()
// 下一页
const nPage = () => {
	pageNo.value++
	getData()
}
//获取记录
const getData = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
	}
	const [err, res] = await AwaitWrap<any>(
		winGoGetNoaverageEmerdList({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	NoaverageEmerdList.value = res.list || []
	totalPage.value = res.totalPage
	if (claarNo) {
		emits(
			'changefive',
			res.list.slice(0, 5).map((item: any) => {
				return item.number
			})
		)
	}
}
const isOddNumber = (str: string) => {
	let num = parseInt(str, 10)
	return num % 2 !== 0
}

const setColor = (num: any): any => {
	let className = ''
	if (isOddNumber(num)) {
		className = 'greenColor'
	} else {
		className = 'defaultColor'
	}
	switch (num) {
		case '0':
			className = 'mixedColor0'
			break
		case '5':
			className = 'mixedColor5'
			break
	}
	return className
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
		background: var(--bgDark-2,var(--sheet_nva_color));
		border-radius: 10px 10px 0px 0px;
		font-weight: 700;
		font-size: 26px;
		color: #fff;
		.van-col{
			height: 80px;
			overflow: hidden;
		}
	}

	&-body {
		line-height: 80px;

		&-redC {
			color: var(--sheet_nva_color);
			width: 100%;
			height: 100%;
			background-size: 50px;
			background-repeat: no-repeat;
			background-position: center;
		}

		.numcenter {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&-num {
			height: 60px;
			line-height: 60px;
			width: 60px;
			font-size: 40px;
			// color: var(--text_color_L2);
			// border: 1px solid var(--text_color_L2);
			// border-radius: 50%;
			font-weight: bold;
			font-size: 50px;
		}
		.mixedColor0 {
			background: linear-gradient(180deg, var(--norm_red-color) 50.96%, rgb(182, 89, 254) 50.97%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
		.mixedColor5 {
			background: linear-gradient(180deg, var(--norm_green-color) 51.48%, rgb(182, 89, 254) 51.49%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}
		.greenColor {
			color: var(--norm_green-color);
		}
		.defaultColor {
			color: var(--norm_red-color);
		}

		&-greenC {
			color: var(--bgcolor-22);
		}

		&-empty {
			height: 400px;
		}

		& > div {
			background: var(--darkBg,var(--bg_color_L2));
			color: var(--darkTextW, var(--text_color_L1));

			& + div {
				border-top: 1px solid var(--gray-color-1);
			}
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
				background-color: var(--norm_Purple-color);
			}

			&.red {
				background: var(--norm_red-color);
			}

			&.green {
				background: var(--norm_green-color);
			}
		}
	}

	&-foot {
		height: 140px;
		background: var(--darkBg,var(--bg_color_L2));
		color: var(--text_color_L2);
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
      color: var(--text_color_L4);
			display: flex;
			align-items: center;
			justify-content: center;

			&.disabled {
				background: var(--bg_color_L3);
				pointer-events: none;
        color: var(--text_color_L2);
			}
		}
	}
}
</style>
