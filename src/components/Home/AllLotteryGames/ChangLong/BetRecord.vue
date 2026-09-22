<template>
	<div class="BetRecord__C">
		<van-tabs class="BetRecord__C-gameTab" v-model:active="gameTab" @click="setTypeid">
			<van-tab v-for="(item, index) in gameList" :key="index" :title="item.name">
				<van-tabs class="BetRecord__C-timeTab" v-model:active="timeTab">
					<template>
						<van-tab v-for="(name, index) in currentGameTypeList" :key="index" >
							<template #title>
								<div v-html="name.typeName.replace(/<br ?\/?>/, '')"></div>
							</template>
						</van-tab>
					</template>
				</van-tabs>
			</van-tab>
		</van-tabs>
		<component
			ref="RecRef"
			:is="componentList[gameList[gameTab].com]"
			:typeid="typeid"
			:has-head="false"
			:ApiFun="winGoGetMyEmerdList"
			go-path-name="0"
		/>
	</div>
</template>

<script setup lang="ts">
import {onMounted, ref, nextTick, computed} from 'vue'
import Win from '@/components/Home/AllLotteryGames/WinGo/MyGameRecord.vue'
import FD from '@/components/Home/AllLotteryGames/FD/MyGameRecord.vue'
import K3 from '@/components/Home/AllLotteryGames/K3/MyGameRecord.vue'
import { winGoGetMyEmerdList } from '@/api'
import { LorreryStore } from '@/stores'
// 动态组件列表
const componentList = {
	Win,
	FD,
	K3
}
// 彩票状态
const lottery = LorreryStore()
const RecRef = ref() // ref动态组件
const gameTab = ref(0) // 选中的游戏类型
const timeTab = ref(0) // 游戏事件选择
// 游戏列表 -后端返回
const gameType = ref('wingo')

const currentGameTypeList = computed(() => lottery[`${gameType.value}`])
// 游戏类型列表
const gameList = ref([
	{ name: 'WinGo', com: 'Win' },
	{ name: '5D Lotre', com: 'FD' },
	{ name: 'K3Lotre', com: 'K3' }
])
// 游戏时间列表
// const timeList = ref(['1min', '3min', '5min', '10min'])
// 选中的游戏typeid
const typeid = ref(1)
// 点击tab出发修改游戏类型，并且更新视图。
const setTypeid = async () => {
	if(gameTab.value === 0) {
		await lottery.getWinGoData()
		gameType.value = 'wingo'
	} else if (gameTab.value === 1){
		await lottery.get5DData()
		gameType.value = 'fiveD'
	} else {
		await lottery.getK3Data()
		gameType.value = 'k3'
	}
	typeid.value = currentGameTypeList.value[timeTab.value].typeID;
	nextTick(() => {
		RecRef.value && RecRef.value.getData()
	})
}
onMounted(async () => {
	setTypeid()
})
</script>

<style lang="scss" scoped>
.BetRecord__C {
	&-gameTab {
		border-top: 1px solid var(--gray-color-1);

		:deep(.van-tabs__line) {
			width: calc(33% - 52px);
			background: var(--norm_green-color);
		}
		:deep(.van-tabs__nav) {
			background-color: var(--bg_color_L2);
		}
		:deep(.van-tab--line) {
			color: var(--text_color_L3);
		}
		:deep(.van-tab--active) {
			color: var(--text_color_L1);
			font-weight: 500;
		}
	}

	&-timeTab {
		border-top: 1px solid var(--gray-color-1);

		:deep(.van-tabs__line) {
			width: calc(25% - 52px);
			background: var(--norm_red-color);
		}
		:deep(.van-tab--line) {
			color: var(--text_color_L3);
		}
		:deep(.van-tabs__nav) {
			background-color: var(--bg_color_L2);
		}
		:deep(.van-tab--active) {
			color: var(--text_color_L1);
			font-weight: 500;
		}
	}
}
</style>
