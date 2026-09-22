<template>
	<div class="binguo_count">
		<NavBar left-arrow @click-left="goBack" backgroundColor="#0a4529" :title="`${$t('binguoCount')}`"></NavBar>

		<BinguoTab />

		<BinguoBetCount v-if="store.currentTabIndex === 0" />

		<BinguoDetail v-if="store.currentTabIndex === 1" />

		<BinguoLast7Day v-if="store.currentTabIndex === 2" />

		<BinguoTrend v-if="store.currentTabIndex === 3" />


	</div>
</template>
<script lang="ts" setup>
import BinguoTab from './components/BinguoTab.vue'
import BinguoBetCount from './components/BinguoBetCount.vue'
import BinguoDetail from './components/BinguoDetail.vue'
import BinguoTrend from './components/BinguoTrend.vue'
import BinguoLast7Day from './components/BinguoLast7Day.vue'
import { useBinguoCount } from '@/hooks/useBinguoCount'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const { store, getTrendstatistics, getLotteryRankList, getLotteryResult7Day, getBingo18Last50Result } = useBinguoCount()
const router = useRouter()

const goBack = () => {
	router.back()
}

watch(
	() => store.currentTabIndex,
	(index) => {
		switch (index) {
			case 0:
				getTrendstatistics()
				break
			case 1:
				getBingo18Last50Result()
				break
			case 2:
				getLotteryResult7Day()
				break
			case 3:
				getLotteryRankList()
				break
			default:
				break
		}
	},
	{ immediate: true }
)
</script>
<style lang="scss">
.binguo_count {
	padding: 24px 24px 0;
	background: #0a4529;
	min-height: 100vh;
}
.column_time {
	width: 100px;
	height: 100%;
	background: #0e6d48 !important;
	color: #fff;
	font-size: 22px;
}
</style>
