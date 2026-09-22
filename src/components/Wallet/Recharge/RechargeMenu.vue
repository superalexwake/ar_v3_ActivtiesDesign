<template>
	<div>
<!--		<div class="new_upi" v-if="arUpiPay" :class="{ upi_active: store.currentMenu === -3 }" @click="handleChangeMenu(-3)">-->
<!--			<img :src="arUpiPay.payNameUrl" alt="" />-->
<!--			<div class="upi_item rns_item">-->
<!--				<div class="title">{{ arUpiPay.payName }}</div>-->
<!--				<div v-if="arUpiPay.maxRechargeRifts" class="upi_image">+{{ arUpiPay?.maxRechargeRifts * 100 }}%</div>-->
<!--			</div>-->
<!--		</div>-->
<!--		<div class="new_upi" v-if="arPay" :class="{ upi_active: store.currentMenu === -1 }" @click="handleChangeMenu(-1)">-->
<!--			<img :src="arPay.payNameUrl" alt="" />-->
<!--			<div class="upi_item">-->
<!--				<div class="title">{{ arPay.payName }}</div>-->
<!--				<div v-if="arPay?.maxRechargeRifts" class="upi_image">+{{ arPay?.maxRechargeRifts * 100 }}%</div>-->
<!--				<div class="gift" v-if="arPay.maxRechargeRifts">-->
<!--					{{ t('arGift', [accMul(arPay.maxRechargeRifts || 0, 100) + '%']) }}-->
<!--				</div>-->
<!--				<div v-if="arPay?.maxRechargeRifts" class="upi_image">+{{ arPay?.maxRechargeRifts * 100 }}%</div>-->
<!--			</div>-->
<!--		</div>-->
<!--		<div class="new_upi" v-if="rnsPay" :class="{ upi_active: store.currentMenu === -2 }" @click="handleChangeMenu(-2)">-->
<!--			<img :src="rnsPay.payNameUrl" alt="" />-->
<!--			<div class="upi_item rns_item">-->
<!--				<div class="title">{{ rnsPay.payName }}</div>-->
<!--				<div v-if="rnsPay.maxRechargeRifts" class="upi_image">+{{ rnsPay?.maxRechargeRifts * 100 }}%</div>-->
<!--			</div>-->
<!--		</div>-->
		<div class="Recharge__container-tabcard">
			<div
				v-for="(item, index) in getPayTabList"
				:key="index"
				class="Recharge__container-tabcard__items"
				:class="{ active: index === store.currentMenu }"
				@click="handleChangeMenu(index)"
			>
				<div class="centers">
					<div class="gift" v-if="(item.maxRechargeRifts ?? 0) > 0 || (item.vipRechargeRate ?? 0) > 0">
						<span v-if="(item.maxRechargeRifts ?? 0) > 0 && (item.vipRechargeRate ?? 0) === 0">
							+{{ bouns(item.maxRechargeRifts * 100) }}%
						</span>
						<span v-else-if="(item.vipRechargeRate ?? 0) > 0 && (item.maxRechargeRifts ?? 0) === 0">
							+{{ bouns(item.vipRechargeRate * 100) }}%
						</span>
						<span v-else class="small">
							{{ bouns(item.maxRechargeRifts * 100) }}%+{{ bouns(item.vipRechargeRate * 100) }}%
						</span>
					</div>

					<div class="Recharge__container-tabcard__top">
						<img class="img" :src="index === store.currentMenu ? item.payNameUrl2 : item.payNameUrl" alt="" />
					</div>
					<div class="Recharge__container-tabcard__bot">
						{{ item.payName }}
						<!-- <span v-if="item.maxRechargeRifts && item.maxRechargeRifts > 0">{{ item?.maxRechargeRifts * 100 }}%</span> -->
					</div>
				</div>
			</div>
		</div>

		<div v-if="arPay && store.currentPayId === 21">
			<div class="rule" @click="onTradRule()">
				<div class="left">
					<svg-icon name="arpay1" />
					<p>{{ $t('arbTip1') }}</p>
				</div>
				<div class="right">{{ $t('checkOver') }}<van-icon name="arrow" /></div>
			</div>
			<div class="ar_wallet">
				<div class="info">
					<img :src="arPay.payNameUrl" alt="" />
					<div>
						<div class="tit" v-if="isArWalletActive">
							{{  t('arbTip13')}}
						</div>
						<div class="tip" v-if="!isArWalletActive">{{ $t('arNoActive') }}</div>
						<div class="wallet_amount" v-else>{{ arWallet?.balance || 0 }}<span>ARB</span></div>
					</div>
				</div>
				<div class="ar_btn" @click="handleWallet">{{ isArWalletActive ? t('comminWallet') : t('arActive') }}</div>
			</div>
			<!-- <div class="ar_wallet_tip">{{ $t('arTip') }}</div> -->
		</div>
		<div v-if="rnsPay && store.currentPayId === 22">
			<div class="ar_wallet">
				<div class="info">
					<img :src="rnsPay.payNameUrl" alt="" />
					<div>
						<div class="tip" v-if="store.rsnInfo.walletActivationStatus === 0">{{ $t('rnsNoActive') }}</div>
						<template v-else>
							<div class="tit" >
								{{  t('RSNTip')}}
							</div>
							<div class="wallet_amount"><em>{{t('balance')}}:</em> {{ store.rsnInfo?.balance || 0 }} <em>rsn</em></div>
						</template>
					</div>
				</div>
				<div class="ar_btn" @click="handleWallet('RSN')">{{ store.rsnInfo.walletActivationStatus === 0 ?t('RNSActive'): t('comminWallet')  }}</div>
			</div>
			<!-- <div class="ar_wallet_tip">{{ $t('arTip') }}</div> -->
		</div>
	</div>
	<!--激活绑定验证-->
	<ActiveVerifyDialog :isVisible="isPop" @onConfirm="confirm" @onCancel="isPop=false"/>
</template>

<script setup lang="ts">
import {  bouns } from '@/utils'
import { useRecharge } from '@/hooks/useRecharge'
import { useArwallet } from '@/hooks'
import { watch,ref } from 'vue'
import {closeToast, showFailToast, showLoadingToast} from 'vant'
import { useI18n } from 'vue-i18n'
import ActiveVerifyDialog from '@/components/common/ActiveVerify.vue'
import {ARBWalletActivate} from "@/api";
const { store, handleChangeMenu, getPayTabList, arPay, currentPayId, rnsPay } = useRecharge()

const { isArWalletActive, arWallet,onTradRule, getInfo, goWallet, goActive,activeBind } = useArwallet()
const { t } = useI18n()
const isPop=ref(false)


/*确认按钮即绑定*/
const confirm= (query:any)=>{
	console.log('进来数据',query)
	activeBind(query,'wallet/recharge')
	isPop.value = false
}

/*去激活验证*/
const goBind = async () => {
	showLoadingToast({
		message: t('loading') + '...',
		forbidClick: true
	})
	const query={returnUrl: 'https://' + window.location.host + '/#/main'}
	const res = await ARBWalletActivate(query)
	if(res?.code === 1) {
		if(res?.msgCode===1010){
			isPop.value = true
		}
		return showFailToast(res?.msg);
	}else if(res?.code === 0){
		const { walletActivationPageUrl, memberId, merchantCode, timestamp } = res?.data || {};
		window.location.href = walletActivationPageUrl +'&memberId=' +memberId +'&merchantCode=' +merchantCode +'&timestamp=' +timestamp
	}
}

const handleWallet = (type?: string) => {
	if (type === 'RSN') {
		if (store.rsnInfo.walletActivationStatus === 0) {
			goActive('wallet/recharge', 'RSN')
		} else {
			goWallet('wallet/recharge', 'RSN')
		}
		
	} else {
		if (isArWalletActive.value) {
			goWallet('wallet/recharge')
		} else {
			// goActive('wallet/recharge')
			goBind()
		}
	}
}


watch(
	() => currentPayId.value,
	async (val) => {
		if (val === 21) {
			showLoadingToast({
				message: t('loading')+'...',
				forbidClick: true
			})
			await getInfo()
			store.arPayInfo = arWallet.value
			closeToast()
		}
	},
	{
		immediate: true
	}
)
</script>

<style lang="scss" scoped>
.Recharge__container-tabcard {
	margin-top: 30px;
	margin-bottom: 20px;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 16px;

	.centers {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__items {
		width: 100%;
		height: 180px;
		background: var(--bgDark-2, var(--bg_color_L2));
		color: var(--text_color_L2);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		position: relative;
		/* justify-content: center; */

		.gift {
			position: absolute;
			right: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: url('@icon/wallet/gift.png') no-repeat center center;
			background-size: 100% 100%;
			padding: 0 6px;
			height:80px;
			box-sizing:border-box;
			min-width: 71px;
			span {
				display: block;
				color: #fff;
				font-size:20px;
				letter-spacing: -0.88px;
				text-align: center;
				padding-top:18px;
				white-space: nowrap;
				&.small{
					scale: 0.88;
				}
			}
		}
		&.active {
			background: var(--main_gradient-color);
			color: var(--text_color_L4);
		}

		.Recharge__container-tabcard__bot {
			font-size: 24px;
			text-align: center;
		}

		.mgt24 {
			margin-top: 24px;
		}

		/* &:nth-child(5) img {
    width: 62px;
    height: 62px;
  } */
	}

	&__top {
		flex: none;
		width: 70px;
		height: 70px;
		margin: 23px auto 10px;

		img {
			width: 100%;
			height: 100%;
		}

		.lists {
			display: flex;
			align-items: center;

			svg {
				/* margin-right: 12px; */
				width: 42px;
				margin-right: 10px;
			}

			svg:nth-child(2) {
				width: 33px;
				height: 52px;
			}
		}
	}
}

.new_upi {
	margin-top: 30px;
	display: flex;
	align-items: center;
	background: var(--bgDark-2, var(--bg_color_L2));
	border-radius: 20px;
	padding: 20px 18px;
	position: relative;

	img {
		width: 80px;
		height: 80px;
		margin-right: 30px;
	}

	.upi_item {
		color: var(--text_color_L1);
		display: flex;
		height: 100px;
		width: auto;
		flex-direction: column;
		// justify-content: space-between;

		// align-items: center;
		

		.title {
			font-size: 30px;
			margin-bottom: 18px;
		}
		&.rns_item{
			align-items: center;
			justify-content: center;
			.title {
				margin-bottom: 0;
			}
		}

		.upi_image {
			display: flex;
			justify-content: center;
			align-items: center;
			background: url('@/assets/icons/svg/ArPayBackground.svg') no-repeat center center;
			background-size: cover;
			width: fit-content;
			height: 46px;
			color: #fff;
			font-size: 22px;
			position: absolute;
			right: 10px;
			top: 0;
			padding: 5px 20px;
			&::before {
				content: '';
				display: block;
				width: 22px;
				height: 22px;
				background: url('@icon/wallet/Ar_Gift.svg') no-repeat center center;
				background-size: cover;
				margin-right: 10px;
			}
		}
	}
}

.upi_active {
	background: var(--main_gradient-color);

	.upi_item {
		color: #fff;

		.gift {
			color: #fff;
		}
	}
}

.ar_wallet {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100px;
	border-radius: 10px;
	background: var(--bg_color_L2);
	margin-bottom: 32px;
	padding: 10px 24px;
	.info {
		display: flex;
		align-items: center;
		img {
			width: 80px;
			height: 80px;
			margin-right: 10px;
		}
		.tip {
			color: var(--text_color_L1);
			font-size: 24px;
		}
		.tit {
			color: var(--text_color_L1);
			span {
				color: #999;
				font-size: 24px;
				font-weight: 400;
			}
		}
		.wallet_amount {
			color: var(--text_color_L1);
			font-size: 28px;
			font-weight: 700;
			vertical-align: bottom;
			span {
				color: var(--text_color_L1);
				font-size: 24px;
				font-weight: 700;
			}
			em{
				color: var(--text_color_L1);
				font-size: 24px;
				font-weight: normal;
			}
		}
	}
	.ar_btn {
		padding: 18px;
		border-radius: 10px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 24px;
		width: fit-content;
		height: 100%;
		display: flex;
		align-items: center;
		flex: none;
	}
}
.ar_wallet_tip {
	background: url('@icon/wallet/hint.png') no-repeat 0px 4px;
	background-size: 22px 22px;
	padding-left: 26px;
	color: var(--main-color);
	font-size: 20px;
	font-weight: 400;
}
.rule {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
	margin-bottom: 30px;
	border-radius: 10px;
	background: var(--bg_color_L2);
	color: var(--text_color_L1);
	.left {
		display: flex;
		align-items: center;
		gap: 20px;
		color: var(--text_color_L1);
		svg {
			width: 40px;
			height: 40px;
		}
	}
}
</style>