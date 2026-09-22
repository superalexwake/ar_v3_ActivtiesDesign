<template>
	<div class="changLong__C">
		<NavBar
			left-arrow
			:title="$t('loongAssistant')"
			class="main"
			@click-left="onClickLeft"
		/>
		<van-tabs class="changLong__C-tab" v-model:active="activeTab">
			<van-tab :title="$t('latestLoong')"></van-tab>
			<van-tab :title="$t('myBet')"></van-tab>
		</van-tabs>
		<Bet v-if="activeTab == 0" />
		<BetRecord v-else></BetRecord>
	</div>
</template>

<script setup lang="ts">

import {  ref } from 'vue'
import { useRouter } from 'vue-router'
import Bet from '@/saasLottery/game/ChangLong/Bet.vue'
import BetRecord from '@/saasLottery/game/ChangLong/BetRecord.vue'
const router = useRouter()
const activeTab = ref(0)
// 返回上一页
function onClickLeft(): void {
	router.go(-1)
}


</script>

<style lang="scss" scoped>
.changLong__C {
	&-tab {
		:deep(.van-tabs__line) {
			width: calc(50% - 52px);
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

	:deep(.navbar__content) {
		.van-icon {
			color: var(--textW);
		}

		.navbar__content-center {
			color: var(--textW);
		}
	}

}
</style>
