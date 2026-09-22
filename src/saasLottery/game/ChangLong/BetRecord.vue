<template>
	<div class="BetRecord__C">
		<van-tabs class="BetRecord__C-gameTab" v-model:active="gameTab" >
			<van-tab v-for="(item, index) in gameList" :key="index"  :title="item.gameTypeName">
				<van-tabs v-if="currentGameTypeList.length>1" class="BetRecord__C-timeTab" v-model:active="timeTab" >
					<template>
						<van-tab
							v-for="(name, index) in currentGameTypeList"
							:key="index"
							:title="name.gameName.replace(item.gameTypeName,'')"
						>

						</van-tab>
					</template>
				</van-tabs>
			</van-tab>
		</van-tabs>
		<component
			:is="currentComponent"
			:has-head="false"
		/>
	</div>
</template>

<script setup lang="ts">
import {onMounted, ref, computed, nextTick, watch,} from 'vue'
import {useGlobal} from '../../hooks'
import k33MyRecord from '../K3/components/k33/MyRecord.vue'
import D5MyRecord from '../D5/components/D5_3/MyGameRecord.vue'
import WinGoMyRecord from '../WinGo/components/wingo3/myRecord.vue'
import MotoRaceMyRecord from '../MotoRace/components/myRecord.vue'
// 彩票状态
const {getGameList,gameList,useProvide,setLotteryCode,lotteryCode,trigger}=useGlobal()
const gameTab = ref(0) // 选中的游戏类型
const timeTab = ref(0) // 游戏事件选择
const currentGameTypeList=computed(()=>gameList.value[gameTab.value]?.gameList||[]);
const currentComponent = computed(() => {
	switch (lotteryCode.value) {
		case 'MotoRace':
			return MotoRaceMyRecord;
		case 'VideoWinGo':
			return WinGoMyRecord;
		case 'TrxWinGo':
			return WinGoMyRecord;
		case 'WinGo':
			return WinGoMyRecord;
		case 'D5':
			return D5MyRecord;
		case 'K3':
			return k33MyRecord;
		default:
			return null;
	}
});
useProvide()
const setType=async ()=>{
   await nextTick()
	const list=gameList.value[gameTab.value]?.gameList||[];
	const item=list[timeTab.value];
	if (!item) return;
	setLotteryCode(item.gameCode);
	trigger.emit('bets')
}
watch(gameTab,()=>{
  timeTab.value=0;
  setType();
})
watch(timeTab,()=>{
  setType();
})
onMounted(async () => {
	await getGameList()
	setType()
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
