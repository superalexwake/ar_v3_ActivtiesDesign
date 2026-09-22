<template>
	<div class="BettingRecordWin__C">
		<div class="BettingRecordWin__C-head">
      <NavBar
          left-arrow
          @click-left="back"
          class="main"
          title="Win Go"
      >
      </NavBar>
		</div>
		<div class="BettingRecordWin__C-nav">
			<van-tabs v-model:active="active" @click-tab="onClickTab">
				<van-tab v-for="(item, index) in gameList" :key="index" :name="item.typeID">
					<template #title>
						<div v-html="item.typeName.replace(/<br ?\/?>/, '')"></div>
					</template>
				</van-tab>
			</van-tabs>
		</div>
		<div class="BettingRecordWin__C-list">
			<MyGameRecordList :mayrecord="mayrecord" />
		</div>
		<div v-if="mayrecord.length" class="BettingRecordWin__C-foot">
			<div class="BettingRecordWin__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="BettingRecordWin__C-icon" size="20" />
			</div>
			<div class="BettingRecordWin__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="BettingRecordWin__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="BettingRecordWin__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { winGoGetMyEmerdList } from '@/api'
import MyGameRecordList from '@/components/Home/AllLotteryGames/WinGo/MayrecordList.vue'
import { LorreryStore } from '@/stores'
import type { WinGo } from '@/types/api'
import { AwaitWrap } from '@/utils'
import {onMounted, reactive, ref} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 彩票状态
const lottery = LorreryStore()
// 游戏列表 -后端返回
let gameList = ref<any[]>([])
const mayrecord = ref<WinGo.GetMyEmerdList[]>([])
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
	const [err, res] = await AwaitWrap<any>(
		winGoGetMyEmerdList({
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
	await lottery.getWinGoData()
	gameList.value = lottery.getWingo
	typeId.value = gameList.value[0].typeID
	getData()
}
// 返回上一页
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
.BettingRecordWin__C {
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
    color: var(--text_color_L2);;
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-page {
			font-size: 24px;
		}

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

				.BettingRecordWin__C-icon {
					color: var(--saveTextColor-7);
				}
			}

			.BettingRecordWin__C-icon {
				color: var(--textW);
			}
		}
	}

	:deep(.van-tabs) {
		background-color: var(--main-color);
    .van-tabs__nav{
      background: var(--bg_color_L2);
    }
    .van-tab--active{
      color: var(--text_color_L1);
    }
    .van-tabs__line{
      background: var(--main-color);
    }
	}

	:deep(.van-tab--active) {
		color: var(text-1);
		font-weight: 500;
	}

	:deep(.MyGameRecordList__C) {
		padding: 0 24px;
	}
}
</style>
