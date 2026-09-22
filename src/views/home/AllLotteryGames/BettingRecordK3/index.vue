<template>
	<div class="BettingRecordK3__C">
		<div class="BettingRecordK3__C-head">
      <NavBar
          left-arrow
          @click-left="back"
          class="main"
          title="K3 Lotre"
      >
      </NavBar>
		</div>
		<div class="BettingRecordK3__C-nav">
			<van-tabs v-model:active="active" @click-tab="onClickTab">
				<van-tab v-for="(item, index) in gameList" :key="index" :name="item.typeID">
					<template #title>
						<div v-html="item.typeName.replace(/<br ?\/?>/, '')"></div>
					</template>
				</van-tab>
			</van-tabs>
		</div>
		<div class="BettingRecordK3__C-list">
			<MyGameRecordList :mayrecord="mayrecord" />
		</div>
		<div v-if="mayrecord.length" class="BettingRecordK3__C-foot">
			<div class="BettingRecordK3__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="BettingRecordK3__C-icon" size="20" />
			</div>
			<div class="BettingRecordK3__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="BettingRecordK3__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="BettingRecordK3__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getMyK3EmerdList } from '@/api'
import MyGameRecordList from '@/components/Home/AllLotteryGames/K3/MayrecordList.vue'
import type { K3 } from '@/types/api'
import { AwaitApiResult } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {LorreryStore} from "@/stores";

const router = useRouter()
const lottery = LorreryStore()
// 游戏列表 -后端返回
const gameList = ref<any[]>(lottery.getK3)

const mayrecord = ref<K3.resGetMyK3EmerdList[]>([])
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

// 获取数据，解析投注类型
const getData = async () => {
	const res = await AwaitApiResult<ObjResNull<MessageData<K3.resGetMyK3EmerdList>>>(
		getMyK3EmerdList({
			pageSize: 20,
			pageNo: pageNo.value,
			typeId: typeId.value
		})
	)
	const dataList = res?.data.list || []
	for (let i = 0; dataList.length > i; i++) {
		let list = []
		let gameType = dataList[i].gameType.split(',')
		let item = dataList[i].selectType.split(',')
		list.push(gameType, item)
		for (let j = 0; gameType.length > j; j++) {
			if (gameType[j] == '1' || gameType[j] == '2' || gameType[j] == '3') {
				dataList[i].gameType = '1'
				dataList[i].oneList = item
			} else if (gameType[j] == '5' || gameType[j] == '6') {
				let oneList = []
				let towList = []
				let threeList = []
				for (let t = 0; item.length > t; t++) {
					if (
						item[t] == '|11|' ||
						item[t] == '|22|' ||
						item[t] == '|33|' ||
						item[t] == '|44|' ||
						item[t] == '|55|' ||
						item[t] == '|66|'
					) {
						let oneItme = item[t].split('|')
						oneItme.pop()
						oneItme.shift()
						oneList.push(oneItme.join())
					}
					if (
						item[t] == ':11:' ||
						item[t] == ':22:' ||
						item[t] == ':33:' ||
						item[t] == ':44:' ||
						item[t] == ':55:' ||
						item[t] == ':66:'
					) {
						let towItme = item[t].split(':')
						towItme.pop()
						towItme.shift()
						towList.push(towItme.join())
					}
					if (
						item[t] == ':1:' ||
						item[t] == ':2:' ||
						item[t] == ':3:' ||
						item[t] == ':4:' ||
						item[t] == ':5:' ||
						item[t] == ':6:'
					) {
						let threeItme = item[t].split(':')
						threeItme.pop()
						threeItme.shift()
						threeList.push(threeItme.join())
					}
				}
				dataList[i].gameType = '2'
				dataList[i].oneList = oneList
				dataList[i].towList = Boolean(selectNum(towList, threeList))
				dataList[i].towListArr = selectNum(towList, threeList)
			} else if (gameType[j] == '7' || gameType[j] == '8') {
				let oneList = []
				let towList = false
				for (let t = 0; item.length > t; t++) {
					if (
						item[t] == '|111|' ||
						item[t] == '|222|' ||
						item[t] == '|333|' ||
						item[t] == '|444|' ||
						item[t] == '|555|' ||
						item[t] == '|666|'
					) {
						let oneItme = item[t].split('|')
						oneItme.pop()
						oneItme.shift()
						oneList.push(oneItme.join())
					}
					if (item[t] == '|AAA|') {
						towList = true
					}
					dataList[i].oneList = oneList
					dataList[i].towList = towList
					dataList[i].gameType = '3'
				}
			} else if (gameType[j] == '9' || gameType[j] == '10' || gameType[j] == '4') {
				let oneList = []
				let towList = false
				let threeList = []
				for (let t = 0; item.length > t; t++) {
					if (
						item[t] == '|1|' ||
						item[t] == '|2|' ||
						item[t] == '|3|' ||
						item[t] == '|4|' ||
						item[t] == '|5|' ||
						item[t] == '|6|'
					) {
						let oneItme = item[t].split('|')
						oneItme.pop()
						oneItme.shift()
						oneList.push(oneItme.join())
					}
					if (item[t] == '|ABC|') {
						towList = true
					}
					if (
						item[t] == '.1.' ||
						item[t] == '.2.' ||
						item[t] == '.3.' ||
						item[t] == '.4.' ||
						item[t] == '.5.' ||
						item[t] == '.6.'
					) {
						let threeItme = item[t].split('.')
						threeItme.pop()
						threeItme.shift()
						threeList.push(threeItme.join())
					}
				}
				dataList[i].oneList = oneList
				dataList[i].towList = towList
				dataList[i].threeList = threeList
				dataList[i].gameType = '4'
			}
		}
	}
	mayrecord.value = dataList || []
	totalPage.value = res?.data.totalPage || 0
}
// 整合选中数据
const selectNum = (numTow: any, numOne: any) => {
	let list = []
	for (var i = 0; numTow.length > i; i++) {
		let item = numTow[i]
		let arr = []
		for (var j = 0; numOne.length > j; j++) {
			arr.push(numOne[j])
		}
		if (arr.length > 0) {
			let con = arr.sort().join(',')
			list.push(item + '|' + con)
		}
	}
	return list.sort()
}
// 获取游戏列表
const getGameList = async () => {
	await lottery.getK3Data()
	gameList.value = lottery.getK3
	typeId.value = gameList.value[0].typeID
	await getData()
}
// 返回上一页面
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
.BettingRecordK3__C {
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
		color: var(--text_color_L1);
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
			display: flex;
			align-items: center;
			justify-content: center;

			&.disabled {
				background: var(--button_dis_color);
				pointer-events: none;

				.BettingRecordK3__C-icon {
					color: var(--text_color_L2);
				}
			}

			.BettingRecordK3__C-icon {
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
