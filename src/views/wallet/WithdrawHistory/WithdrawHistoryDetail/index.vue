<template>
	<div class="WHD__container">
		<NavBar title="" left-arrow @click-left="onClick" :classN="`bg${stateP}`" />
		<div class="WHD__container-header" :class="`bg${stateP}`">
			<div>
				<h1>{{ $t(getArrayKey(rootConfig.WithdrawState, stateP)) }}</h1>
				<span>{{ $t(getArrayKey(rootConfig.WStateCorrelationT, stateP)) }}</span>
			</div>
			<img :src="getStateIcon(stateP)" />
		</div>
		<div class="WHD__container-body">
			<div class="container">
				<div class="top ar-1px-b">
					<img src="@public/wallet/withdraw/withdrawHistory/bc.png" />
					<span>Bank Card 提现</span>
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
						<svg-icon @click="copy('1414')" />
					</div>
					<div>
						<span>订单号</span>
						<span>2022102518543345000113</span>
						<svg-icon @click="copy('1414')" />
					</div>
					<div>
						<span>支付时间</span>
						<span>2022-06-20 15：15：16</span>
						<svg-icon @click="copy('1414')" />
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
import withdrawState0 from '@public/wallet/withdraw/withdrawHistory/state/0.png'
import withdrawState1 from '@public/wallet/withdraw/withdrawHistory/state/1.png'
import withdrawState2 from '@public/wallet/withdraw/withdrawHistory/state/2.png'
import withdrawState3 from '@public/wallet/withdraw/withdrawHistory/state/3.png'

const router = useRouter()
function onClick() {
	router.back()
}

const stateP = history.state.paramValue || 0
const stateIconMap: Record<string, string> = {
	'0': withdrawState0,
	'1': withdrawState1,
	'2': withdrawState2,
	'3': withdrawState3
}
const getStateIcon = (state: string | number) => {
	return stateIconMap[String(state)] || ''
}
</script>
<style lang="scss" scoped>
.bg0 {
	background: var(--main-color);
}

.bg1 {
	background: var(--linerGradient-83);
}

.bg2 {
	background: var(--main-color);
}

.bg3 {
	background: var(--main-color);
}

:deep(.navbar) {
	.bg0 {
		background: var(--main-color) !important;
	}

	.bg1 {
		background: var(--linerGradient-83) !important;
	}

	.bg2 {
		background: var(--main-color) !important;
	}

	.bg3 {
		background: var(--main-color) !important;
	}
}

.WHD__container {
	font-family: 'Inter';
	font-style: normal;

	.navbar {
		.bg0 {
			background: var(--main-color);
		}

		.bg1 {
			background: var(--linerGradient-83);
		}

		.bg2 {
			background: var(--main-color);
		}

		.bg3 {
			background: var(--main-color);
		}

		:deep(div),
		:deep(.van-icon) {
			color: var(--textW);;
			font-size: 40px;
		}
	}

	&-header {
		// background: var(backgroundColor);
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
			box-shadow: var(--BoxShadowColor-9);
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

					//background-color: #F6F6F6;

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
