<template>
	<div class="preview-shell">
		<div class="preview-shell__nav">
			<div class="preview-shell__nav-tabs">
				<button
					v-for="comp in components"
					:key="comp"
					:class="['tab-btn', { active: currentComp === comp }]"
					@click="switchComp(comp)"
				>{{ comp }}</button>
			</div>
			<div class="preview-shell__nav-states">
				<button
					v-for="s in currentStates"
					:key="s.key"
					:class="['state-btn', { active: currentState === s.key }]"
					@click="switchState(s.key)"
				>{{ s.label }}</button>
			</div>
		</div>
		<div class="preview-shell__content">
			<component :is="currentComponent" v-bind="currentComponentProps" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHome, WinInfoType, RankLiskType } from '@/hooks'

const route = useRoute()
const router = useRouter()
const { homeState, getWinInfoDetail } = useHome()

const components = ['LuckyWinners', 'DailyProfitRank', 'Terms', 'Champion'] as const
type CompName = typeof components[number]

const defaultStates = [
	{ key: 'real', label: 'Real API' },
	{ key: 'empty', label: 'Empty' },
	{ key: 'single', label: 'Single' },
	{ key: 'multi', label: 'Multi' }
] as const

const championStates = [
	{ key: 'ongoing', label: 'Ongoing' },
	{ key: 'upcoming', label: 'Upcoming' },
	{ key: 'ended', label: 'Ended' }
] as const

type DefaultStateKey = typeof defaultStates[number]['key']
type ChampionStateKey = typeof championStates[number]['key']
type StateKey = DefaultStateKey | ChampionStateKey

const currentComp = ref<CompName>((route.query.c as CompName) || 'LuckyWinners')
const currentStates = computed(() =>
	currentComp.value === 'Champion' ? championStates : defaultStates
)
const currentState = ref<StateKey>(normalizeState(currentComp.value, route.query.s as StateKey))

const componentMap: Record<CompName, ReturnType<typeof defineAsyncComponent>> = {
	LuckyWinners: defineAsyncComponent(() => import('../LuckyWinners.vue')),
	DailyProfitRank: defineAsyncComponent(() => import('../DailyProfitRank.vue')),
	Terms: defineAsyncComponent(() => import('../Terms.vue')),
	Champion: defineAsyncComponent(() => import('./ChampionPreview.vue'))
}

const currentComponent = computed(() => componentMap[currentComp.value])
const currentComponentProps = computed(() =>
	currentComp.value === 'Champion' ? { previewState: currentState.value } : {}
)

function normalizeState(comp: CompName, state?: StateKey) {
	if (comp === 'Champion') {
		const found = championStates.find((item) => item.key === state)
		return (found?.key || 'ongoing') as StateKey
	}
	const found = defaultStates.find((item) => item.key === state)
	return (found?.key || 'real') as StateKey
}

function switchComp(comp: CompName) {
	currentComp.value = comp
	currentState.value = normalizeState(comp)
	router.replace({ query: { ...route.query, c: comp, s: currentState.value } })
}

function switchState(s: StateKey) {
	currentState.value = s
	router.replace({ query: { ...route.query, s } })
	if (currentComp.value === 'Champion') return
	if (s === 'real') {
		getWinInfoDetail()
	} else {
		applyMockData(s as DefaultStateKey)
	}
}

// 预览假数据不涉及进游戏，入口字段给空值
const mockEntry = { typeName: '', entryType: '', vendorCode: '', vendorId: 0, gameID: '', gameNameEn: '', state: 0, isMaintain: 0, isGameSaasMaintain: 0, typeId: null }

const mockWinInfo: WinInfoType[] = [
	{ ...mockEntry, type: 'slot', userPhoto: '3', nickName: 'MockUser001', betAmount: 100, amount: 99999999, winTime: '', showType: 1, imgUrl: '' },
	{ ...mockEntry, type: 'lottery', userPhoto: '7', nickName: 'MockUser002', betAmount: 50, amount: 9999999, winTime: '', showType: 1, imgUrl: '' },
	{ ...mockEntry, type: 'live', userPhoto: '12', nickName: 'MockUser003', betAmount: 200, amount: 999999, winTime: '', showType: 1, imgUrl: '' }
]

const mockRankList: RankLiskType[] = [
	{ nickName: 'TopPlayer1', price: 285914167, time: '', typeName: 'Slot', userPhoto: '1' },
	{ nickName: 'TopPlayer2', price: 24639215, time: '', typeName: 'Lottery', userPhoto: '5' },
	{ nickName: 'TopPlayer3', price: 24639215, time: '', typeName: 'Live', userPhoto: '9' },
	{ nickName: 'Player004', price: 15914167, time: '', typeName: 'Slot', userPhoto: '13' },
	{ nickName: 'Player005', price: 3295643, time: '', typeName: 'Lottery', userPhoto: '17' },
	{ nickName: 'Player006', price: 1276527, time: '', typeName: 'Slot', userPhoto: '2' }
]

function applyMockData(s: DefaultStateKey) {
	if (s === 'real') return
	if (s === 'empty') {
		homeState.winInfoList.splice(0)
		homeState.rankList.splice(0)
		return
	}
	const count = s === 'single' ? 1 : mockWinInfo.length
	homeState.winInfoList.splice(0, homeState.winInfoList.length, ...mockWinInfo.slice(0, count))
	homeState.rankList.splice(0, homeState.rankList.length, ...mockRankList.slice(0, count === 1 ? 1 : mockRankList.length))
}

// 同步执行：在 setup() 阶段注入，早于异步子组件 resolve，子组件 onMounted 时数据已就绪
if (currentComp.value !== 'Champion' && currentState.value === 'real') {
	getWinInfoDetail()
} else if (currentComp.value !== 'Champion') {
	applyMockData(currentState.value as DefaultStateKey)
}
</script>

<style lang="scss" scoped>
.preview-shell {
	min-height: 100vh;
	background: var(--bg_color_L2);

	&__nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--bg_color_L2);
		border-bottom: 1px solid var(--Dividing-line_color);
		padding: 16px 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	&__nav-tabs,
	&__nav-states {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	&__content {
		padding: 24px 24px 60px;
		background: var(--bg_color_L2);
	}
}

.tab-btn,
.state-btn {
	padding: 8px 20px;
	border-radius: 20px;
	border: 1px solid var(--Dividing-line_color);
	background: var(--bg_color_L2);
	color: var(--text_color_L2);
	font-size: 22px;
	cursor: pointer;

	&.active {
		background: var(--main-color);
		border-color: var(--main-color);
		color: #fff;
	}
}
</style>
