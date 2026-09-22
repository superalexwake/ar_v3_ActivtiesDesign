<template>
	<div class="BettingRecord5D__C">
		<div class="BettingRecord5D__C-head">
      <NavBar
          left-arrow
          @click-left="back"
          class="main"
          title="5D Lotre"
      >
      </NavBar>
		</div>
		<div class="BettingRecord5D__C-nav">
			<van-tabs v-model:active="active" @click-tab="onClickTab">
				<van-tab v-for="(item, index) in gameList" :key="index" :name="item.typeID">
					<template #title>
						<div v-html="item.typeName.replace(/<br ?\/?>/, '')"></div>
					</template>
				</van-tab>
			</van-tabs>
		</div>
		<div class="BettingRecord5D__C-list">
			<MyGameRecordList :mayrecord="mayrecord" />
		</div>
		<div v-if="mayrecord.length" class="BettingRecord5D__C-foot">
			<div class="BettingRecord5D__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="BettingRecord5D__C-icon" size="20" />
			</div>
			<div class="BettingRecord5D__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="BettingRecord5D__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="BettingRecord5D__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getMy5DEmerdList } from '@/api'
import MyGameRecordList from '@/components/Home/AllLotteryGames/FD/MayrecordList.vue'
import type { FD } from '@/types/api'
import { AwaitApiResult } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {LorreryStore} from "@/stores";

const router = useRouter()

const lottery = LorreryStore()
// 游戏列表 -后端返回
const gameList = ref<any[]>(lottery.get5D)

const mayrecord = ref<FD.resGetMy5DEmerdList[]>([])
const active = ref(0)
const pageNo = ref(1)
const totalPage = ref(4)

// 选择游戏类型
const onClickTab = (value: any) => {
	typeId.value = value.name
	pageNo.value = 1
	getData()
}

const typeId = ref(0)

// 获取数据
const getData = async () => {
	const res = await AwaitApiResult<ObjResNull<MessageData<FD.resGetMy5DEmerdList>>>(
		getMy5DEmerdList({
			pageSize: 20,
			pageNo: pageNo.value,
			typeId: typeId.value
		})
	)
	mayrecord.value = res?.data.list || []
	totalPage.value = res?.data.totalPage || 0
}

// 获取游戏列表
const getGameList = async () => {
	await lottery.get5DData()
	gameList.value = lottery.get5D
	typeId.value = gameList.value[0].typeID
	await getData()
}
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
.BettingRecord5D__C {
	&-head {
		height: 94px;
		line-height: 94px;
		text-align: center;
		background: var(--bg_color_L2);
		position: relative;
		font-weight: 500;
		font-size: 36px;
		color: var(--text_color_L1);

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
		background: var(--bg_color_L2);
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-page {
			font-size: 24px;
			color: var(--text_color_L2)
		}

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

				.BettingRecord5D__C-icon {
					color: var(--text_color_L3);
				}
			}

			.BettingRecord5D__C-icon {
				color: var(--text_color_L4);
			}
		}
	}

	:deep(.van-tabs__line) {
		background-color: var(--main-color);
	}
	:deep(.van-tabs__nav) {
		background-color: var(--bg_color_L2);
	}
	:deep(.van-tab--active) {
		color: var(--text_color_L1);
		font-weight: 500;
	}
}
</style>
