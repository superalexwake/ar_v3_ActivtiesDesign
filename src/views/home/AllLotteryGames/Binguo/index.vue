<template>
	<div class="binguo_container">
		<NavBar left-arrow @click-left="goBack" backgroundColor="#0a4529">
			<template #left>
				<van-icon name="arrow-left" :size="24" />
				<span class="nav_title">BINGO18</span>
			</template>
			<template #right>
				<div class="nav_right">
					<div @click.stop="() => (playerRuleVisble = true)" class="binguo_explain"></div>
					<div
						class="binguo_money"
						@click.stop="() => handleToggleShwoMoney()"
						:class="isShowBetMoney ? 'binguo_money_look' : 'binguo_money_hidden'"
					></div>
					<div @click.stop="() => goRecord()" class="binguo_count1"></div>
				</div>
			</template>
		</NavBar>

		<div class="binguo_btn_group">
			<div class="btn_1" :class="{ active_btn: store.binguoType === 1 }" @click="store.binguoType = 1">{{  $t('binguoDesk1') }}</div>
			<div class="btn_2" :class="{ active_btn: store.binguoType === 2 }" @click="store.binguoType = 2">{{$t('binguoDesk2')}}</div>
		</div>

		<BinguoInfo />

		<BinguoMainDesk />

		<BinguoBetSheet />

		<Dialog :show="overVisble" @confirm="overVisble = false" :show-cancel-btn="false" :confirmText="$t('confirm')">
			<template #header>
				<img src="@public/home/AllLotteryGames/binguo/binguo_tip.png" alt="" class="binguo_tip" />
			</template>
			<template #content>
				<div class="over_dialog_tip">{{$t('over_dialog_tip')}}</div>
			</template>
		</Dialog>

		<Dialog
			class="rule_dialog"
			:show="playerRuleVisble"
			@confirm="playerRuleVisble = false"
			:show-cancel-btn="false"
			:isShowHeader="false"
			:confirmText="$t('iKonw')"
		>
			<template #title>
				<div>{{$t('binguo_playerRule')}}</div>
			</template>
			<template #content>
				<div class="playerRule">
					<Rule />
				</div>
			</template>
		</Dialog>
		<Dialog
			class="rule_dialog"
			:show="betPopTXT"
			@confirm="betPopTXT = false"
			:show-cancel-btn="false"
			:isShowHeader="false"
			:confirmText="$t('iKonw')"
		>
			<template #title>
				<div>{{ $t('presaleRules') }}</div>
			</template>
			<template #content>
				<div class="playerRule">
					<div style="color: #fff;">
						{{ $t('betPopTXT') }}
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>
<script lang="ts" setup>
import { useBinguo } from '@/hooks/useBinguo.hook'
import BinguoInfo from './components/BinguoInfo.vue'
import BinguoMainDesk from './components/BinguoMainDesk.vue'
import BinguoBetSheet from './components/BinguoBetSheet.vue'
import Dialog from '@/components/common/Dialog.vue'

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Rule from '@/components/Home/AllLotteryGames/Bingo/Rule.vue'

const { goBack, betPopTXT, isShowBetMoney, handleToggleShwoMoney, store, overVisble, getBinguoConfig, getBinguoOddsList, playerRuleVisble } =
	useBinguo()
const router = useRouter()


const goRecord = () => {
	router.push({
		path: '/home/AllLotteryGames/BinguoRecord'
	})
}

onMounted(() => {
	getBinguoConfig()
	getBinguoOddsList()
})
</script>
<style lang="scss" scoped>
.binguo_container {
	width: 100%;
	min-height: 100vh;
	background: #0a4529;
	padding: 24px 24px 0;
	// overflow: hidden;
	.nav_title {
		font-size: 36px;
		color: #fff;
		margin-left: 30px;
	}
	.nav_right {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		.binguo_explain {
			background: url('@/assets/icons/home/AllLotteryGames/binguo/icon.png') no-repeat center center;
		}
		.binguo_money_look {
			background: url('@/assets/icons/home/AllLotteryGames/binguo/lock_money.png') no-repeat center center;
		}
		.binguo_money_hidden {
			background: url('@/assets/icons/home/AllLotteryGames/binguo/hidden_money.png') no-repeat center center;
		}
		.binguo_count1 {
			background: url('@/assets/icons/home/AllLotteryGames/binguo/record.png') no-repeat center center;
		}
		.binguo_money,
		.binguo_explain,
		.binguo_count1 {
			width: 48px;
			height: 48px;
			margin-left: 20px;
			background-size: contain;
		}
	}

	.binguo_btn_group {
		width: 540px;
		height: 70px;
		margin: auto;
		display: flex;
		align-items: center;
		border-radius: 20px;
		overflow: hidden;
		margin-bottom: 20px;
		div {
			width: 50%;
			background-color: #116946;
			color: #fff;
			color: #fff;
			font-size: 30px;
			font-style: normal;
			font-weight: 400;
			line-height: 70px; /* 100% */
			text-align: center;
		}
		.active_btn {
			background: #5dba47;
		}
	}

	.over_dialog_tip {
		color: #f9bc36;
		font-size: 36px;
		font-style: normal;
		font-weight: 700;
		line-height: 36px; /* 100% */
	}
	.binguo_tip {
		width: 160px;
		height: 160px;
	}
	:deep(.dialog__container) {
		background: #0e6946;
		.dialog__container-footer {
			button {
				background: linear-gradient(180deg, #cee98c 0%, #5dba47 100%);
				border: none;
				box-shadow: 0px 4px 0px #308f20;
			}
		}
	}
	.playerRule {
		height: 528px;
		width: 94%;
		margin: auto;
		overflow: scroll;
		margin-bottom: 30px;
	}
	.rule_dialog {
		:deep(.dialog__container-title) {
			height: 90px;
			margin-top: -40px;
			width: calc(100% + 40px);
			border-radius: 20px 20px 0 0;
			background: linear-gradient(180deg, #13ab62 0%, #168055 100%);
			text-align: center;
			line-height: 90px;
			color: #fff;
			font-size: 30px;
		}
	}
}
</style>
