<template>
	<div class="Trend__C">
		<div class="Trend__C-head">
			<van-row>
				<van-col span="9">{{ $t('trendNumber') }}</van-col>
				<van-col span="5">{{ $t('trendResult') }}</van-col>
				<van-col span="10">{{ $t('trendNum') }}</van-col>
			</van-row>
		</div>
		<div class="Trend__C-body">
			<template v-if="NoaverageEmerdList.length">
				<van-row v-for="(item, index) in NoaverageEmerdList" :key="index">
					<van-col span="9">{{ item.issueNumber }}</van-col>
					<van-col span="5">
						<div class="Trend__C-body-premium">
							<div v-for="(num, index) in item.premium" :key="index" :class="'n' + num"></div>
						</div>
					</van-col>
					<van-col span="10">
						<div class="Trend__C-body-gameText">
							<span>{{ gameTypeText[item.gameType] }}</span>
						</div>
					</van-col>
				</van-row>
			</template>
			<div v-else class="Trend__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="NoaverageEmerdList.length" class="Trend__C-foot">
			<div class="Trend__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="Trend__C-icon" size="20" />
			</div>
			<div class="Trend__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="Trend__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="Trend__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onActivated } from 'vue'
import Empty from '@/components/Empty/index.vue'
import { getK3NoaverageEmerdList } from '@/api'
import { AwaitWrap } from '@/utils'
import type { K3 } from '@/types/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const NoaverageEmerdList = ref<K3.GetK3NoaverageEmerdList[]>([])
const props = withDefaults(defineProps<{ typeid: number }>(), {})
const totalPage = ref(4)
const pageSize = ref(10)
const pageNo = ref(1)

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
		getK3NoaverageEmerdList({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	NoaverageEmerdList.value =
		res.list.map((item: any) => {
			let list = [0, 0, 0, 0, 0, 0]
			let item1 = item.premium.split('').map(Number)
			let item2 = item.premium.split('').map(Number)
			for (let j = 0; list.length > j; j++) {
				list[item1[j] - 1] = item1[j]
			}
			item.Premiums = list
			item.AllEqual = isAllEqual(item2)
			return item
		}) || []
	totalPage.value = res.totalPage
}
const gameTypeText = ref<string[]>([t('trendTXT1'), t('trendTXT2'), t('trendTXT3'), t('trendTXT4')])
const isAllEqual = (array: any[]) => {
	let list = [0, 0, 0, 0, 0, 0]
	let nary = array.sort()
	let count = 2
	for (let i = 0; i < nary.length - 1; i++) {
		if (nary[i] == nary[i + 1]) {
			list[nary[i] - 1] = count++
		}
	}
	return list
}
defineExpose({
	getData
})

onActivated(() => {
	getData()
})
</script>
<style lang="scss" scoped>
.Trend__C {
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
	}

	&-body {
		line-height: 80px;

		&-empty {
			height: 400px;
		}

		& > div {
			background: var(--darkBg, var(--bg_color_L2));
			color: var(--text_color_L1);
			& + div {
				border-top: 1px solid var(--gray-color-1);
			}
		}

		&-premium {
			display: flex;
			height: 100%;
			align-items: center;
			justify-content: space-between;
			padding: 0 8px;

			& > div {
				width: 36px;
				height: 36px;
				background-repeat: no-repeat;
				background-size: 36px;
				background-position: center;
			}

			$list: 1 2 3 4 5 6;

			@each $i in $list {
				.n#{$i} {
					background-image: url('@icon/AllGames/n#{$i}.png');
				}
			}
		}

		&-gameText {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			line-height: 1;
			width: 100%;
			word-break: break-all;
		}
	}

	&-foot {
		height: 140px;
		background: var(--bg_color_L2);
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--text_color_L1);
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
				background: var(--button_dis_color);
				pointer-events: none;

				.Trend__C-icon {
					color: var(--saveTextColor-7);
				}
			}

			.Trend__C-icon {
				color: var(--text_color_L4);
			}
		}
	}
}
</style>
