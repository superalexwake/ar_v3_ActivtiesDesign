<template>
	<div class="WHD__container">
		<NavBar title="" :classN="`bg${stateP}`" left-arrow @click-left="onClick" />
		<div class="WHD__container-header" :class="`bg${stateP}`">
			<div>
				<h1>{{ $t(getArrayKey(rootConfig.RechargeState, stateP)) }}</h1>
				<span>{{ $t(getArrayKey(rootConfig.RStateCorrelationT, stateP)) }}</span>
			</div>
			<img :src="getStateIcon(stateP)" />
		</div>
		<div class="WHD__container-body">
			<div class="container">
				<div class="top ar-1px-b">
					<img src="@public/wallet/withdraw/withdrawHistory/bc.png" />
					<span>Bank Card 充值</span>
				</div>
				<div class="item">
					<div>
						<span>订单金额</span>
						<span class="yellow">$8888.88</span>
					</div>
					<div>
						<span>扣除金额</span>
						<span class="black">$8888.88</span>
					</div>
					<div>
						<span>到账金额</span>
						<span class="black">$8888.88</span>
					</div>
					<div>
						<span>订单时间</span>
						<span>2022-06-01</span>
					</div>
				</div>
				<div class="mImg"><img src="@public/wallet/withdraw/withdrawHistory/moonBar.png" /></div>

				<div class="item">
					<div>
						<span>UTR</span>
						<span>202246892345</span>
						<svg-icon @click="copy('1414')" name="copy" />
					</div>
					<div>
						<span>订单号</span>
						<span>2022102518543345000113</span>
						<svg-icon @click="copy('1414')" name="copy" />
					</div>
					<div>
						<span>支付时间</span>
						<span>2022-06-20 15：15：16</span>
						<svg-icon @click="copy('1414')" name="copy" />
					</div>
				</div>
			</div>
			<div class="containerB">
				<div class="top ar-1px-b">
					<span>银行名称</span>
				</div>
				<div class="item">
					<div>
						<span class="red">Account Name</span>
						<span>SAWARN TELECOM</span>
					</div>
					<div>
						<span class="red">Bank Number</span>
						<span>0005123100000315</span>
					</div>
					<div>
						<span class="red">Order Number</span>
						<span>2022102518543345000113</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import { copy, getArrayKey } from '@/utils'
import rechargeState0 from '@public/wallet/recharge/rechargeRecords/state/0.png'
import rechargeState1 from '@public/wallet/recharge/rechargeRecords/state/1.png'
import rechargeState2 from '@public/wallet/recharge/rechargeRecords/state/2.png'
import rechargeState3 from '@public/wallet/recharge/rechargeRecords/state/3.png'
import rechargeState4 from '@public/wallet/recharge/rechargeRecords/state/4.png'

const router = useRouter()
function onClick() {
	router.back()
}

const stateP = history.state.paramValue || 1
const stateIconMap: Record<string, string> = {
	'0': rechargeState0,
	'1': rechargeState1,
	'2': rechargeState2,
	'3': rechargeState3,
	'4': rechargeState4
}
const getStateIcon = (state: string | number) => {
	return stateIconMap[String(state)] || ''
}
//console.log(stateP)
//状态 0确认中 1 已超时 2已完成 3已取消 4充值失败,不准确噢
</script>
<style lang="scss" scoped>
.bg1 {
	background: linear-gradient(90deg, #34be8b 3%, #34be8b 95.93%);
}

.bg2 {
	background: linear-gradient(90deg, #b2b2b2 3%, #b2b2b2 95.93%);
}

:deep(.navbar) {
	.bg1 {
		background: linear-gradient(90deg, #34be8b 3%, #34be8b 95.93%) !important;
	}

	.bg2 {
		background: linear-gradient(90deg, #b2b2b2 3%, #b2b2b2 95.93%) !important;
	}
}

.WHD__container {
	font-family: 'Inter';
	font-style: normal;

	.navbar {

		:deep(div),
		:deep(.van-icon) {
			color: var(--textW);;
			font-size: 40px;
		}

		margin-bottom: -1px;
	}

	&-header {
		height: 300px;
		width: 100%;
		color: var(--textW);
		white-space: pre-wrap;
		padding: 20px 30px;
		display: flex;
		flex-direction: row;

		h1 {
			font-weight: 700;
			font-size: 36px;
			margin-bottom: 20px;
		}

		span {
			font-weight: 400;
			font-size: 26px;
			line-height: 50px;
		}

		img {
			width: 160px;
			height: 160px;
			margin-left: auto;
			text-align: right;
		}
	}

	.rechargeFailed {
		img {
			width: 80px;
			height: 80px;
			margin-top: -20px;
		}
	}

	&-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-inline: 24px;
		padding-bottom: 160px;
		position: relative;

		>div {
			display: flex;
			flex-direction: column;
			font-family: $font-family;
			border-radius: 20px;
			background-color: var(--textW);
			
		}

		.container {
			position: absolute;
			width: 94%;
			top: -60px;
		}

		.containerB {
			margin-top: 530px;

			.top {
				span {
					color: var(--text_color_L1) !important;
					font-weight: 400 !important;
					font-size: 28px !important;
					padding-left: 10px;
					border-left: red 8px solid;
					line-height: 27px;
				}
			}
		}

		.container,
		.containerB {
			padding-bottom: 20px;

			.mImg {
				background-color: #F6F6F6;
				height: 44px;

				img {
					width: 100%;
				}
			}

			.top {
				padding: 28px;
				display: flex;
				align-items: center;
				width: 100%;
				padding-bottom: 15px;

				img {
					width: 48px;
					height: 48px;
					margin-right: 10px;
				}

				span {
					color: var(--text_color_L1);
					font-weight: 700;
					font-size: 32px;
				}
			}

			.item {
				margin-top: -10px;
				width: 100%;
				display: flex;
				flex-direction: column;
				gap: 10px;
				font-size: 24px;
				color: var(--text_color_L2);
				//margin: 20px 0;
				padding: 20px;

				&>div:last-of-type {
					justify-content: space-between;
				}

				&>div {
					display: flex;
					align-items: center;
					flex-direction: row;

					span.yellow {
						color: var(--norm_secondary-color);
					}

					span.black {
						color: var(--text_color_L1);
					}

					span.red {
						color: var(--norm_red-color);
					}

					span {
						margin: 5px 0;
						padding-right: 20px;

						&:nth-of-type(2) {
							margin-left: auto;
							text-align: right;
						}
					}

					img {
						width: 30px;
					}
				}
			}
		}
	}
}
</style>
