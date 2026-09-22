<template>
	<div class="GameRecord__C">
		<div class="GameRecord__C-head">
			<van-row>
				<van-col span="10">{{ $t('gameRecordNum') }}</van-col>
				<van-col span="8">{{ $t('gameRecordTotal') }}</van-col>
				<van-col span="6">{{ $t('gameRecordResult') }}</van-col>
			</van-row>
		</div>
		<div class="GameRecord__C-body">
			<template v-if="emerdList.length">
				<van-row v-for="(item, index) in emerdList" :key="index">
					<van-col span="9">
						{{ item.issueNumber }}
					</van-col>
					<van-col span="2">
						<span>{{ item.sum }}</span>
					</van-col>
					<van-col span="4">
						<span>{{ item.sum > 10 ? $t('big') : $t('small') }}</span>
					</van-col>
					<van-col span="4">
						<span>{{ item.sum % 2 ? $t('k3Odd') : $t('k3Even') }}</span>
					</van-col>
					<!-- <van-col span="6">
						<span>{{ item.sum }}</span>
						<span>{{ sumOfDigits(item.premium) > 10 ? t('common.big') : t('common.small') }}</span>
						<span>{{ sumOfDigits(item.premium) % 2 ? t('common.odd') : t('common.even') }}</span>
					</van-col> -->
					<van-col span="5">
						<div class="GameRecord__C-body-premium">
							<div v-for="(num, index) in item.premium" :key="index" :class="'number' + num"></div>
						</div>
					</van-col>
				</van-row>
			</template>
			<div v-else class="GameRecord__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="emerdList.length" class="GameRecord__C-foot">
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
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GetHistoryIssuePageRsp, getLotteryHistoryIssue } from '@/saasLottery/api'
import { useGlobalContext } from "@/saasLottery/hooks";
import { useK3Context } from "../../hooks";
import Empty from '@/components/Empty/index.vue'
// 后台有优化需求 第一页取oss 第二页取接口
const { gameCode, trigger } = useGlobalContext();
const { t } = useI18n();
const { historyIssues, historyIssuesTotalPage } = useK3Context()
const NoaverageEmerdList = ref<GetHistoryIssuePageRsp[]>([]);
const loading = ref(false)
const emerdList = computed(() => NoaverageEmerdList.value.length ? NoaverageEmerdList.value : historyIssues.value)
const totalPage = ref(historyIssuesTotalPage.value);
const pageSize = ref(10);
const pageNo = ref(1);
// 上一页
const pPage = () => {
	if (pageNo.value < 2) {
		return
	};
	pageNo.value--;
	getData();
};

// 下一页
const nPage = () => {
	pageNo.value++;
	if (pageNo.value > totalPage.value) return;
	getData();
};
//获取记录
const getData = async () => {
	try {
		loading.value = true;
		const { result, data, } = await getLotteryHistoryIssue({
			gameCode: gameCode.value,
			pageNo: pageNo.value,
			pageSize: pageSize.value,
		});
		if (result) {
			NoaverageEmerdList.value = data.list || [];
			pageNo.value = data.pageNo || 1;
			totalPage.value = data.totalPage || 0
		}
	} catch (e) {

	} finally {
		loading.value = false;
	}
};
function sumOfDigits(str: string) {
	const digits = str.split('').map(Number);
	return digits.reduce((sum, digit) => sum + digit, 0);
}

watch(historyIssues, () => {
	NoaverageEmerdList.value = [];
	pageNo.value = 1;
});
watch(historyIssuesTotalPage, () => {
	totalPage.value = historyIssuesTotalPage.value;
})
</script>
<style lang="scss" scoped>
.GameRecord__C {
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

		// &::after {
		// 	content: '';
		// 	background: #E5E5E5;
		// 	transform: scale(.5);
		// 	width: calc(200% - 40px);
		// 	height: 1px;
		// 	position: absolute;
		// 	bottom: 0;
		// 	left: calc(-50% + 20px);
		// 	right: 0;
		// }

		.van-col {
			text-align: center;
		}
	}

	&-body {
		padding: 0 10px;
		background: var(--darkBg, var(--bg_color_L2));
		color: var(--darkTextW, var(--text_color_L1));
		.van-col {
			text-align: center;

			span {
				margin: 0 4px;
			}
		}

		&-empty {
			height: 400px;
		}

		&>div {
			color: var(--darkTextW, var(--text_color_L1));
			padding: 20px 0;
			text-align: left;
			position: relative;

			&+div {
				border-top: 1px solid var(--gray-color-1);
			}

			// &::after {
			// 	content: '';
			// 	background: #E5E5E5;
			// 	transform: scale(.5);
			// 	width: 200%;
			// 	height: 1px;
			// 	position: absolute;
			// 	bottom: 0;
			// 	left: -50%;
			// 	right: 0;
			// }
		}

		&-premium {
			display: flex;
			height: 100%;
			align-items: center;
			justify-content: space-between;

			&>div {
				width: 40px;
				height: 40px;
				background-repeat: no-repeat;
				background-size: 40px;
				background-position: center;
			}
		}

		&-gameText {
			font-size: 24px;
			color: #000;
			font-weight: 400;
			// display: flex;
			// align-items: center;
			// justify-content: center;
			// height: 100%;
			// line-height: 1;
			// width: 100%;
			// word-break: break-all;
		}
	}

	&-foot {
		height: 140px;
		background: var(--bg_color_L2);
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
