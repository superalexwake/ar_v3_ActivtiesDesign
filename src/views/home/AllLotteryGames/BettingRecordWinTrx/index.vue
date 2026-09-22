<template>
	<div class="BettingRecordWinTrx__C">
		<div class="BettingRecordWinTrx__C-head">
      <NavBar
          left-arrow
          @click-left="back"
          class="main"
          title="Trx Win Go"
      >
      </NavBar>
		</div>
		<div class="BettingRecordWinTrx__C-nav">
			<van-tabs v-model:active="active" @click-tab="onClickTab">
				<van-tab v-for="(item, index) in gameList" :key="index" :name="item.typeID">
					<template #title>
						<div v-html="item.typeName.replace(/<br ?\/?>/, '')"></div>
					</template>
				</van-tab>
			</van-tabs>
		</div>
		<div class="BettingRecordWinTrx__C-list">
			<MyGameRecordList :mayrecord="mayrecord" />
		</div>
		<div v-if="mayrecord.length" class="BettingRecordWinTrx__C-foot">
			<div class="BettingRecordWinTrx__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="BettingRecordWinTrx__C-icon" size="20" />
			</div>
			<div class="BettingRecordWinTrx__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="BettingRecordWinTrx__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="BettingRecordWinTrx__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { winTxrGetMyEmerdList } from '@/api'
import MyGameRecordList from '@/components/Home/AllLotteryGames/WinGo/MayrecordList.vue'
import type { WinGo } from '@/types/api'
import { AwaitWrap } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {LorreryStore} from "@/stores";

const router = useRouter()
const lottery = LorreryStore()
// 游戏列表 -后端返回
const gameList = ref<{ typeID: number; typeName: string; intervalM: number; scope: string; gamePresentation: string | null }[]>(lottery.getTrx)
// 我的记录
const mayrecord = ref<WinGo.GetMyEmerdList[]>([])
const active = ref(0)
const pageNo = ref(1)
// 类型 id
const typeId = ref(0)
// 总页数
const totalPage = ref(4)
// 选择游戏类型
const onClickTab = (value: any) => {
	typeId.value = value.name
	pageNo.value = 1
	getData()
}

// 获取数据
const getData = async () => {
	const [err, res] = await AwaitWrap<any>(
		winTxrGetMyEmerdList({
			pageSize: 20,
			pageNo: pageNo.value,
			typeId: typeId.value
		})
	)
	mayrecord.value = res.list || []
	totalPage.value = res.totalPage
}

// 获取游戏列表
const getGameList = async () => {
	await lottery.getTrxData()
	gameList.value = lottery.getTrx
	typeId.value = gameList.value[0].typeID
	getData()
}
// 返回路由上一页
function back() {
	router.go(-1)
}
// 上一页
const pPage = () => {
	pageNo.value--
	getData()
}
// 下一页
const nPage = () => {
	pageNo.value++
	getData()
}
onMounted(() => {
	getGameList()
})
</script>

<style lang="scss" scoped>
.BettingRecordWinTrx__C {
	&-head {
		height: 94px;
		line-height: 94px;
		text-align: center;
		background: var(--darkBg,var(--bg_color_L2));
		position: relative;
		font-weight: 500;
		font-size: 36px;
		color: var(--textW);

		&-bcak {
			position: absolute;
			width: 48px;
			height: 48px;
			background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/bcakIcon.png');
			background-size: 48px;
			left: 26px;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	&-list {
		margin: 36px 0 30px 0;

		:deep(.MyGameRecordList__C) {
			padding: 0 24px;
		}
	}

	&-foot {
		height: 140px;
		background: var(--darkBg,var(--bg_color_L2));
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--darkTextW, var(--text_color_L1));

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
				background: var(--gray-color-1);
				pointer-events: none;

				.BettingRecordWinTrx__C-icon {
					color: var(--saveTextColor-7);
				}
			}

			.BettingRecordWinTrx__C-icon {
				color: var(--textW);
			}
		}
	}

	:deep(.van-tabs__line) {
		background-color: var(--darkLight,var(--main-color));
	}

	:deep(.van-tab--active) {
		color: var(--darkTextW,var(--colorText-3));
		font-weight: 500;
	}
}
</style>
