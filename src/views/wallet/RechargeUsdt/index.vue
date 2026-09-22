<!--
 * @Author: Seven
 * @Date: 2023-03-15 10:45:35
 * @LastEditTime: 2023-09-12 14:23:27
 * @LastEditors: Seven
 * @Description: 充值USDT页面
-->
<template>
	<div class="RechargeUsdt__container">
		<NavBar :title="$t('rechargeUSDT')" :placeholder="false" left-arrow @click-left="onClick"> </NavBar>

		<div class="RechargeUsdt__container__content">
			<div class="RechargeUsdt__container__content-qrCode">
				<img :src="codeUrl" alt="" />
				<div class="tip">{{ $t('rechargeUsdtDesc1') }}</div>
				<img src="@icon/wallet/recharge_usdt.png" alt="" class="usdt_bg" />
			</div>
			<div class="RechargeUsdt__container__content-info">
				<div class="label">
					<svg-icon name="usdt4" />
					<span>{{ $t('rechargeUsdtDesc2') }}</span>
				</div>
				<div class="address">
					<span>{{ usdtInfo?.coding || store.usdtOrderInfo?.rechargeAddress }}</span>
					<svg-icon name="copy" @click="copy(usdtInfo?.coding as string)" />
				</div>
			</div>

			<div class="RechargeUsdt__container__content-info">
				<div class="label">
					<svg-icon name="usdt4" />
					<span>{{ $t('rechargeUsdtDesc3') }}</span>
				</div>

				<div class="address">
					<span>{{ usdtInfo?.usdtName || store.usdtOrderInfo?.bankName }}</span>
				</div>
			</div>

			<div class="RechargeUsdt__container__content-info">
				<div class="label">
					<span>{{ $t('transferAddress') }}</span>
				</div>
				<van-field
					v-model.trim="address"
					class="address_input"
					:placeholder="$t('enterUsdtAddress')"
					:maxlength="40"
					:formatter="formatter"
				>
					<template #button>
						<div class="paste" @click="paste()">{{ $t('paste') }}</div>
					</template>
				</van-field>
			</div>

			<Instructions :show-type="19" :isShowHead="true" />
			<div class="RechargeUsdt__container-rechageBtn rechage_active" @click="submit">{{ $t('finishRechargeUsdt') }}</div>
		</div>

		<van-popup v-model:show="showPicker" round position="bottom">
			<div class="RechargeUsdt__container-popup__wrap">
				<div class="title">{{ $t('rechargeUsdtDesc4') }}</div>
				<div class="tip">{{ $t('rechargeUsdtDesc5') }}</div>
				<div class="list">
					<div class="item">
						<img src="@public/wallet/recharge/mainChain.png" alt="" />
						<span>Tron(TRC20)</span>
					</div>
					<div class="item">
						<svg-icon name="usdt4" class="icon" />
						<span>{{ $t('rechargeUsdtDesc6') }}</span>
					</div>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { AwaitApiResult, copy, getUserDeviceType } from '@/utils'
import Instructions from '@/components/Wallet/Recharge/Instructions.vue'
import { ref } from 'vue'
import { useRecharge } from '@/hooks/useRecharge'
import { onUnmounted, onMounted } from 'vue'
import type { RechargeLocalUsdtInfo, RechargeUsdtReq, UpdateUsdtOrderInfo } from '@/types/api'
import { showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const showPicker = ref(false)
const codeUrl = ref('')
const { store, submitUsdtRecharge, getLocalUsdtInfo, handlePaste, createQrCode, getUsdtOrderInfo, handleUpdateUsdtOrder } =
	useRecharge()
const address = ref('')
const usdtInfo = ref<RechargeLocalUsdtInfo | null>(null)
const formatter = (value: string) => value.replace(/[\u4e00-\u9fa5\s]/g, '')

onMounted(async () => {
	await getUsdtOrderInfo()
	if (!sessionStorage.getItem('usdtInfo') && !store.isUsdtOrder) {
		usdtInfo.value = getLocalUsdtInfo.value
		usdtInfo.value ? sessionStorage.setItem('usdtInfo', JSON.stringify(usdtInfo.value)) : ''
	} else {
		let str = sessionStorage.getItem('usdtInfo')
		let info = JSON.parse(str || '{}')
		usdtInfo.value = info
	}
	let coding = usdtInfo.value?.coding || store.usdtOrderInfo?.rechargeAddress
	let url = ''
	if (coding) {
		url = (await createQrCode(
			(usdtInfo.value?.coding as string) || (store.usdtOrderInfo?.rechargeAddress as string)
		)) as string
	}
	if (store.isUsdtOrder) {
		address.value = store.usdtOrderInfo?.transferOutAddress as string
	}
	codeUrl.value = url + ''
})

const submit = async () => {
	if (!address.value) {
		showFailToast(t('enterUsdtAddress'))
		return
	}
	if (store.isUsdtOrder) {
		let query: UpdateUsdtOrderInfo = {
			usdtId: store.usdtOrderInfo?.usdtId as number,
			usdtType: store.usdtOrderInfo?.usdtType as number,
			rechargeAddress: store.usdtOrderInfo?.rechargeAddress as string,
			transferOutAddress: address.value,
			amount: Number(store.usdtOrderInfo?.amount),
			orderNo: store.usdtOrderInfo?.orderNumber as string
		}
		await handleUpdateUsdtOrder(query)
		return
	}
	const typeDev = await getUserDeviceType()
	let query: RechargeUsdtReq = {
		usdtId: usdtInfo.value?.usdtID as number,
		amount: Number(router.currentRoute.value.query.amount),
		usdtType: usdtInfo.value?.usdtType as number,
		rechargeAddress: usdtInfo.value?.coding as string,
		transferOutAddress: address.value,
		deviceType:typeDev
	}
	await submitUsdtRecharge(query)
}

onUnmounted(() => {
	sessionStorage.removeItem('usdtInfo')
})

const paste = async () => {
	address.value = await handlePaste()
}

function onClick() {
	router.go(-1)
}
</script>

<style lang="scss" scoped>
.RechargeUsdt__container {
	position: relative;
	width: 100%;
	font-family: 'Inter', sans-serif;
	overflow: hidden;

	&__content {
		width: 100%;
		padding: 0 24px 130px;
		position: relative;

		&-qrCode {
			position: relative;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 380px;
			background-image: var(--main_gradient-color);

			border-radius: 20px;
			margin-bottom: 50px;

			img {
				width: 178px;
				height: 178px;
				margin: 42px 0;
			}

			.tip {
				width: 100%;
				color: var(--textW);
				font-weight: 400;
				font-size: 24px;
				line-height: 40px;
				text-align: center;
			}

			.usdt_bg {
				position: absolute;
				bottom: 0;
				right: -32px;
				width: 241px;
				height: 279px;
			}
		}

		&-info {
			margin-bottom: 50px;

			.label {
				display: flex;
				align-items: center;
				margin-bottom: 20px;

				svg {
					width: 48px;
					height: 48px;
					margin-right: 15px;
				}

				span {
					color: var(--darkTextW, var(--text_color_L1));
					font-weight: 400;
					font-size: 32px;
					line-height: 40px;
				}
			}

			.address {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: var(--bgDark-2, var(--bg_color_L2));

				border-radius: 10px;
				padding: 20px 28px 20px 20px;
				font-size: 24px;
				color: var(--text_color_L2);
				letter-spacing: 0.04em;

				img {
					width: 32px;
					height: 32px;
				}
			}
		}
	}

	&-rechageBtn {
		background: var(--button_dis_color);
		width: 100%;
		height: 70px;
		line-height: 70px;
		color: var(--textW);
		text-align: center;
	}

	.rechage_active {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		max-width: 750px;
		height: 120px;
		background: var(--main-color);
		color: var(--text_color_L4);
		text-align: center;
		font-size: 34px;
		font-style: normal;
		font-weight: 700;
		line-height: 120px; /* 105.882% */
		html:lang(ar) & {
			right: 0;
			left: auto;
		}
	}

	&-popup__wrap {
		background: var(--bg_color_L2);
		padding-top: 45px;
		padding-bottom: 74px;

		.title {
			text-align: center;
			font-size: 32px;
			color: var(--text_color_L1);
			margin-bottom: 22px;
		}

		.tip {
			font-size: 24px;
			color: var(--text_color_L2);
			text-align: center;
			margin-bottom: 84px;
		}

		.list {
			width: 702px;
			margin: auto;

			.item {
				display: flex;
				align-items: center;
				margin-bottom: 36px;
				background: var(--bgColor-6);
				height: 70px;
				border-radius: 10px;

				img,
				svg {
					width: 48px;
					height: 48px;
					margin-right: 15px;
					margin-left: 20px;
				}

				span {
					color: var(--text_color_L1);
					font-weight: 400;
					font-size: 28px;
					line-height: 36px;
				}
			}
		}
	}
}
.address_input {
	padding: 0;
	height: 80px;
	line-height: 80px;
	padding-left: 20px;
	background-color: var(--bg_color_L2);
	color: var(--text_color_L2);
}
.paste {
	width: 190px;
	height: 70px;
	border-radius: 10px;
	background: var(--bg_color_L2);
	color: var(--text_color_L4);
	text-align: center;
	font-size: 26px;
	line-height: 70px;
	margin-right: 20px;
	border-radius: 10px;
	background: var(--main_gradient-color);
}
</style>
