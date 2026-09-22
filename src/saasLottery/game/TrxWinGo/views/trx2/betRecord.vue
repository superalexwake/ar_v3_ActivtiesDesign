<template>
	<div class="wingo-record">
		<NavBar left-arrow class="main" title="Trx Win Go" @click-left="back" />
		<!-- 时段 tab -->
		<div class="wingo-record__nav">
			<van-tabs v-model:active="active" @click-tab="onClickTab">
				<van-tab v-for="(item, index) in tabs" :key="index" :title="item.gameName" />
			</van-tabs>
		</div>
		<!-- 列表 -->
		<div class="wingo-record__list">
			<BetRecordList v-if="mayrecord.length" :mayrecord="mayrecord" />
			<div v-if="!mayrecord.length && !loading" class="wingo-record__empty">
				<Empty />
			</div>
		</div>
		<!-- 翻页 -->
		<div v-if="mayrecord.length" class="wingo-record__foot">
			<div class="wingo-record__foot-prev" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" size="20" />
			</div>
			<div class="wingo-record__foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="wingo-record__foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Empty } from '@/saasLottery/components'
import { getLotteryRecord } from '@/saasLottery/api'
import { useGlobal } from '@/saasLottery/hooks'
import BetRecordList from '@/saasLottery/game/TrxWinGo/components/trx2/betRecordList.vue'

const router = useRouter()
const { gameList, getGameList } = useGlobal()

// 本游戏类型前缀（用于从后端 gameList 里筛出本游戏的时段）
const GAME_PREFIX = 'TrxWinGo'
// 动态时段 tab：取本站点实际有的时段（label=后端 gameName，取数用 gameCode，数量/顺序都随后端）
const tabs = computed(
	() => gameList.value.find((g) => g.gameList?.[0]?.gameCode?.split('_')[0] === GAME_PREFIX)?.gameList || []
)

const active = ref(0)
const pageNo = ref(1)
const totalPage = ref(1)
const mayrecord = ref<any[]>([])
const loading = ref(false)

// 拉取当前 tab + 页码的数据
const getData = async () => {
	const gameCode = tabs.value[active.value]?.gameCode
	if (!gameCode || loading.value) return
	try {
		loading.value = true
		mayrecord.value = []
		const { result, data } = await getLotteryRecord({ pageSize: 20, pageNo: pageNo.value, gameCode })
		if (result) {
			mayrecord.value = data?.list || []
			totalPage.value = data?.totalPage || 0
		}
	} finally {
		loading.value = false
	}
}
// 切换时段
const onClickTab = () => {
	pageNo.value = 1
	getData()
}
// 上一页
const pPage = () => {
	if (pageNo.value <= 1) return
	pageNo.value--
	getData()
}
// 下一页
const nPage = () => {
	if (pageNo.value >= totalPage.value) return
	pageNo.value++
	getData()
}
// 返回
function back() {
	router.go(-1)
}
onMounted(async () => {
	await getGameList(false)
	getData()
})
</script>

<style lang="scss" scoped>
.wingo-record {
	min-height: 100vh;
	background: var(--bg_color_L1);
	&__list { margin: 36px 0 30px 0; }
	&__empty { padding: 60px 0; }
	&__foot {
		height: 140px;
		background: var(--bg_color_L2);
		color: var(--text_color_L2);
		padding: 35px 178px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&-page { font-size: 24px; }
		&-prev, &-next {
			width: 70px; height: 70px; border-radius: 10px;
			background: var(--main-color); color: var(--text_color_L4);
			display: flex; align-items: center; justify-content: center;
			&.disabled { background: var(--bg_color_L3); pointer-events: none; }
		}
	}
	:deep(.van-tabs__nav) { background: var(--bg_color_L2); }
	:deep(.van-tabs__line) { background: var(--main-color); }
	:deep(.van-tab--active) { color: var(--text_color_L1); font-weight: 500; }
}
</style>
