<template>
	<div class="GameRecord__C">
		<div class="GameRecord__C-head">
			<van-row>
				<van-col span="10">{{ $t('gameRecordNum') }}</van-col>
				<van-col span="4">{{ $t('gameRecordTotal') }}</van-col>
				<van-col span="10">{{ $t('gameRecordResult') }}</van-col>
			</van-row>
		</div>
		<div class="GameRecord__C-body">
			<template v-if="NoaverageEmerdList.length">
				<van-row v-for="(item, index) in NoaverageEmerdList" :key="index">
					<van-col span="10">{{ item.issueNumber }}</van-col>
					<van-col span="1">
						<span>{{ item.sumCount }}</span>
					</van-col>
					<van-col span="3">
						<span>{{ item.sumCount > 10 ? $t('big') : $t('small') }}</span>
					</van-col>
					<van-col span="3">
						<span>{{ item.sumCount % 2 ? $t('k3Odd') : $t('k3Even') }}</span>
					</van-col>
					<van-col span="6">
						<div class="GameRecord__C-body-premium">
							<div v-for="(num, index) in item.premium" :key="index" :class="'n' + num"></div>
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
import { getK3NoaverageEmerdList } from '@/api'
import { AwaitWrap } from '@/utils'
import type { K3 } from '@/types/api'

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
	NoaverageEmerdList.value = res.list || []
	totalPage.value = res.totalPage
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
	}

	&-body {
		line-height: 80px;

		&-empty {
			height: 400px;
		}

		& > div {
			background: var(--bg_color_L2);
			color: var(--text_color_L1);

			& + div {
				border-top: 1px solid var(--gray-color-1);
			}
		}

		&-premium {
			display: flex;
			height: 100%;
			max-width: 160px;
			margin: auto;
			align-items: center;
			justify-content: space-between;

			& > div {
				width: 40px;
				height: 40px;
				background-repeat: no-repeat;
				background-size: 40px;
				background-position: center;
			}

			$list: 1 2 3 4 5 6;

			@each $i in $list {
				.n#{$i} {
					background-image: url('@icon/AllGames/n#{$i}.png');
				}
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
			display: flex;
			align-items: center;
			justify-content: center;

			&.disabled {
				background: var(--button_dis_color);
				pointer-events: none;

				.GameRecord__C-icon {
					color: var(--text_color_L2);
				}
			}

			.GameRecord__C-icon {
				color: var(--text_color_L4);
			}
		}
	}
}
</style>
