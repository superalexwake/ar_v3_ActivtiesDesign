<template>
	<div class="wallet-container">
		<div class="wallet-container-header">
			<NavBar
				:title="$t('wallet')"
				class="main"
				left-arrow
				@click-left="router.go(-1)"
			/>
			<div class="wallet-container-header-belly">
				 <svg-icon name="wallet1" />
				<div>{{ currency(money) }}</div>
				<span>{{ $t('totalBalance') }}</span>
				<div v-if="userInfo.isShowWalletTotalCT == '1'">
					<div>
						<p class="total">{{ totalWithdraw }}</p>
						<p>{{ $t('totalWithdraw') }}</p>
					</div>
					<div>
						<p class="total">{{ totalRecharge }}</p>
						<p>{{ $t('totalRechargeAmount') }}</p>
					</div>
				</div>
			</div>
		</div>
		<div class="wallet-container-content">
			<div class="container">
				<div class="progressBars">
					<div class="progressBarsL">
						<van-circle
							v-model:current-rate="mainMoneyPercent"
							:speed="100"
							:text="textL"
							stroke-width="100"
							stroke-linecap="butt"
						/>
						<h3>{{ currency(mainMoney) }}</h3>
						<span>{{ $t('mainWallet') }}</span>
					</div>
					<div class="progressBarsR">
						<van-circle
							v-model:current-rate="otherMoneyPercent"
							:speed="100"
							:text="textR"
							stroke-width="100"
							stroke-linecap="butt"
						/>
						<h3>{{ currency(otherMoney) }}</h3>
						<span>{{ $t('thirdPartyWallet') }}</span>
					</div>
				</div>
				<div class="recycleBtnD">
					<button v-if="timeDelay == 0" class="recycleBtn" @click="onRecycle">{{ $t('oneClickRecovery') }}</button>
					<button v-else class="recycleBtn disable">{{ $t('recycling') }} {{ timeDelay }}</button>
				</div>
				<div class="userDetail">
					<div v-for="(item, index) in userDetail" :key="index" @click="onUserDetailClick(item)">
						<div class="imgD">
							<img :src="getWalletIcon(item.icon)" />
						</div>
						<span>{{ item.title }}</span>
					</div>
				</div>
			</div>

			<div class="gameList" v-if="walletList">
				<div
					class="box"
					v-for="(item, index) in walletList"
					:key="index"
					:class="item.balance > 0 ? 'select' : ''"
				>
					<svg-icon :name="item.vendorCode" />
					<h3 class="money">{{ currency(item.balance, ' ') }}</h3>
					<span>{{ getSlotTitle(item.vendorCode) }} </span>
				</div>
			</div>
			<div class="gameList" v-else>
				<div>{{ $t('noData') }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AwaitApiResult, currency, getSlotTitle } from '@/utils'
import { getWalletIcon } from '@/utils/assetIcons'
import { ref, onMounted, computed } from 'vue'
import {  RecoverBalance } from '@/api'
import { useCommonStore, useWalletStore, GlobalStore, SettingStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { useEventBus } from '@/components/common/use'
import type { UserInfo } from '@/types/api'
import { useGlobalDialog, useHome } from '@/hooks'
import { requireLoginAction } from '@/hooks/useLoginIntercept'

const { onDown } = useHome()
const globalStore = GlobalStore()
const { downAppTip } = useGlobalDialog()
const eventBus = useEventBus()
const { t: $t } = useI18n()
const router = useRouter()
const { setLoading } = useCommonStore()
const walletStore = useWalletStore()
const setting=SettingStore()
const userDetail = {
	recharge: {
		title: $t('recharge'),
		icon: 'rechargeIcon',
		link: 'Recharge'
	},
	withdraw: {
		title: $t('withdraw'),
		icon: 'widthdrawBlue',
		link: 'Withdraw'
	},
	rechargeHistory: {
		title: $t('rechargeRecords'),
		icon: 'rechargeHistory',
		link: 'RechargeHistory'
	},
	withdrawHistory: {
		title: $t('withdrawRecords'),
		icon: 'withdrawHistory',
		link: 'WithdrawHistory'
	}
}
const userInfo = computed(() => {
	return globalStore.userInfo as UserInfo
})
const onUserDetailClick = async(item: { title: string; link: string })=> {
	if (!(await requireLoginAction())) return

	if(item.link == 'Recharge' || item.link == 'Withdraw') {
		await downAppTip(item.link);
	} else {
		if (item.link === 'RechargeHistory') eventBus.emit('changeKeepAliveKey')
		await router.push({
			name: item.link
		})
	}
}
let interval:any=0;
let walletList = ref<any>([])

//总余额 -- 主钱包余额+三方钱包的余额
let money = 0

//主钱包 -- GetAllwallets 接口的 vendorCode 等于 Lottery 的金额总和
let mainMoney = 0
//百分比
let mainMoneyPercent = 0
let textL = '0%'

//三方钱包 -- GetAllwallets 接口的 vendorCode 不等于 Lottery 的金额总和
let otherMoney = 0
//百分比
let otherMoneyPercent = 0
let textR = '0%'
const timestamp = new Date().getTime() / 1000 //当前时间戳
const totalWithdraw = ref(0) //总提现金额
const totalRecharge = ref(0) //总充值金额
const timeDelay = ref(0) // 延时倒计时
const loading = ref(false)
async function getAllwallets(notify=true) {
	if (!globalStore.token) return
	setLoading(true)
	await walletStore.getAllwalletsBalance(undefined,true)
	processingData(walletStore.getAllwallets);
	setLoading(false);
	notify&&globalStore.notifyARGame();
}

//一键回收
async function onRecycle() {
	if (!(await requireLoginAction())) return
	if (timeDelay.value) return;
	if (loading.value) return;
	loading.value = true
	const res = await AwaitApiResult(RecoverBalance(true))
	loading.value = false;
	if (res) {
		timeDelay.value = 5;
		money = res.data.amount
		//重新获取所有钱包
		//otherMoney = 0
		timeOut()
	}else{
		timeDelay.value = 0
	}
}

const timeOut = async () => {
	//
	clearInterval(interval);
	interval=setInterval(async () => {
		timeDelay.value -= 1;
		if (timeDelay.value==0) {
			clearInterval(interval);
			setLoading(true)
			await getAllwallets(false);
			setLoading(false)
		};
	}, 1000)
}
function processingData(data: any) {
	if (!data) return
	if (userInfo.value.isShowWalletTotalCT == '1') {
		totalWithdraw.value = data.totalWithdraw || 0
		totalRecharge.value = data.totalRecharge || 0
	}
	walletList.value = data.thidGameBalanceList || []
	let newData = data.thidGameBalanceList || []
	mainMoney = 0
	otherMoney = 0
	if (newData) {
		for (var i of newData) {
			if (i.vendorCode === 'Lottery') mainMoney += i.balance
			else otherMoney += i.balance
		}
	}

	money = mainMoney + otherMoney
	if (money > 0) {
		mainMoneyPercent = Math.round((mainMoney / money) * 10000) / 100.0
		otherMoneyPercent = Math.round((otherMoney / money) * 10000) / 100.0
		textL = mainMoneyPercent + '%'
		textR = otherMoneyPercent + '%'
	} else {
		mainMoneyPercent = 0
		otherMoneyPercent = 0
	}
}

onMounted(async () => {
	//获取所有钱包
	if (globalStore.token) await getAllwallets()
})
</script>

<style lang="scss" scoped>
.wallet-container {
	color: var(--text_color_L2);

	&-header {
		background: var(--light-main_gradient-color,var(--bg_color_L2));
		width: 100%;
		color: #fff;
		padding-bottom: 24px;


		&-belly {
			margin-top: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;


			svg {
				width: 80px;
				height: 80px;
			}

			> div:nth-of-type(1) {
				margin: 8px 0;
				font-size: 48px;
				line-height: 48px;

			}

			span {
				font-size: 26px;

			}
			> div:nth-of-type(2) {
				width: 70%;
				display: flex;
				justify-content: space-around;
				margin-top: 20px;
				text-align: center;

				p {
					margin-bottom: 10px;

				}
			}

			.total {
				font-size: 30px;
				font-weight: 500;
			}
		}
	}

	@mixin flexS {
		display: flex;
		flex-direction: column;
	}

	@mixin font-s {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		line-height: 35px;
		letter-spacing: 0.04em;
	}
	.progressBars{
		span{
			color: var(--text_color_L1)
		}
	}

	h3 {
		@include font-s;
		font-size: 30px;
		color: var(--darkTextW,var(--text_color_L1));
	}

	span {
		@include font-s;
		font-size: 24px;
		text-align: center;

	}

	&-content {
		@include flexS;
		gap: 24px;
		padding-inline: 30px;
		padding-bottom: 225px;
		position: relative;
		align-items: center;

		.container {
			@include flexS;
			align-items: flex-start;
			min-height: 680px;
			padding: 47px 14px 20px;
			font-family: $font-family;
			border-radius: 20px;
			background-color: var(--darkBg,var(--bg_color_L2));
			width: 100%;
			margin-top: 24px;

			.progressBars {
				display: flex;
				justify-content: space-between;
				width: 100%;
				text-align: center;
				margin-bottom: 30px;

				:deep(.van-circle__text) {
					font-size: 30px;
					font-weight: 600;
					color: var(--text_color_L1);

				}

				> div {
					width: 50%;
					display: flex;
					flex-direction: column;
					align-items: center;

					:deep(.van-circle) {
						width: 184px;
						height: 184px;
					}

					h3 {
						margin-top: 12px;
					}
				}
			}

			.recycleBtnD {
				width: 100%;
				//height: 70px;
				text-align: center;
				margin-bottom: 30px;

				.recycleBtn {
					width: 100%;
					height: 70px;
					color: var(--text_color_L4);
					font-size: 30px;
					font-weight: 600;
					letter-spacing: 1.2px;
					border: none;
					border-radius: 80px;
					background: var(--main_gradient-color);
					&.disable {
						color: var(--bg_color_L2);
						background:var(--button_dis_color);
						cursor: no-drop;
					}
				}
			}

			.userDetail {
				// @include flexS;
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				// justify-content: space-between;
				gap: 21px;
				flex-direction: initial;
				width: 100%;
				margin-top: 20px;

				> div {
					@include flexS;
					align-items: center;
					justify-content: flex-start;
					gap: 10px;

					.imgD {
						width: 98px;
						height: 98px;
						border-radius: 30px;
						background: var(--bg_color_L2);
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 10px;

						img {
							width: 100%;
							height: auto;
						}
					}

					span {
						font-size: 24px;
					}
				}
			}
		}

		.gameList {
			@include flexS;
			gap: 20px;
			flex-direction: initial;
			width: 100%;
			margin-bottom: 50px;
			flex-wrap: wrap;
			text-align: center;
			//justify-content: space-between;

			.select {
				background: var(--main_gradient-color);

				span,
				h3 {
					color: var(--text_color_L4) !important;
				}
			}

			> div {
				width: 31%;
				min-height: 160px;
				background-color: var(--darkBg,var(--bg_color_L2));
				background-repeat: no-repeat;
				background-position: center;
				background-size:contain;
				border-radius: 10px;
				@include flexS;
				align-items: center;
				justify-content: center;
				gap: 10px;
				padding: 0px 15px;

				h3 {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 100%;
					font-size: 24px;
					font-weight: 700;
					text-align: center;
					color: var(--text_color_L2);

				}
			}

			.box {
				padding-left: 13px;
				padding-right: 13px;
				position: relative;
				svg {
					position: absolute;
					width: 100%;
					height: 100%;
					color: rgba(217, 217, 217,.1);
				}
				& > span {
					color: var(--text_color_L3);
					font-size: 24px;
					font-weight: 400;

				}
			}

			.money {
				font-size: 24px;
				font-weight: 700;
				display: inline-block;
				width: 110%;
				overflow: hidden;
				transform: scale(0.9);
			}
		}
	}
}
</style>
