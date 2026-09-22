<template>
	<div class="coins-container">
		<NavBar title="金币" left-arrow @click-left="router.go(-1)" />
		<div class="coins-container-header">
			<img src="@public/main/MyCoinsBanner.png" class="imgBanner" alt="" />
			<img src="@public/main/mycoins_bg.png" class="bg2" />
			<div class="tip">
				<div>我的金币</div>
				<div>88.888.8889</div>
			</div>
		</div>

		<div class="coins-container-content">
			<div class="coins-container-content-desc">
				<h2>目前金币与<span>USDT(TRC20)</span>的兑换比率为</h2>
				<h3><span>1</span>金币=<span>1</span>USDT(TRC20)</h3>
			</div>
			<div class="coins-container-content-vipcard">
				<div class="coins-container-content-vipcard-title">
					<img src="@icon/main/privacyIcon.png" alt="" />
					<h1>VIP券兑换</h1>
				</div>
				<h1>
					<input type="number" v-model="exchangeAmount" placeholder="兑换数量" />
					<span>对不起！您的VIP券不足。</span>
					<img class="clearImg" type="number" src="@public/main/clearIcon.png" @click="clearIpt" alt="" />
				</h1>
				<h2>
					<p>兑换</p>
					<div>
						<img src="@public/main/vaultSmallIcon.png" alt="" />
						<span>8888.88</span>
					</div>
				</h2>
				<div class="coins-container-content-vipcard-coin">
					<div v-for="item in coinItems">
						<h1>
							<img src="@public/main/myCoin.png" alt="" />
							<span>{{ item.num }}</span>
						</h1>
						<p>{{ item.title }}</p>
					</div>
				</div>
			</div>
			<div class="coins-container-content-btn">
				<button class="redeem" @click="onRedeem">兑换</button>
				<button class="gainCoins">获取<span>金币</span></button>
			</div>
			<div class="coins-container-content-recordcard">
				<div class="coins-container-content-recordcard-title">
					<img src="@icon/main/privacyIcon.png" alt="" />
					<h1 class="ar-1px-b">兑换记录</h1>
				</div>
				<div class="coins-container-content-recordcard-items" v-for="item in recordItems">
					<h1>
						金币兑换<span>{{ item.name }}</span>
					</h1>
					<p>{{ item.date }}</p>
					<div class="ar-1px-b">
						<h2>
							<img src="@public/main/myCoin.png" alt="" />

							<span>{{ item.num }}</span>
						</h2>
						<img src="@public/main/exchangeIcon.png" alt="" />
						<h2>
							<img src="@public/main/vaultSmallIcon.png" alt="" />
							<span>888</span>
						</h2>
					</div>
				</div>
			</div>
		</div>

		<van-dialog v-model:show="showExchange" :show-confirm-button="false" z-index="3100">
			<img src="@icon/public/succeed.png" class="succeed" />
			<div class="van-dialog__content-title">兑换成功</div>
			<div class="van-dialog__content-note">
				<div>
					<h1>获得</h1>
					<h2>
						<img src="@public/main/vaultSmallIcon.png" alt="" />
						<span>8888.88</span>
					</h2>
				</div>
			</div>
			<div class="van-dialog__content-btn" @click="onConfirm">确认</div>
		</van-dialog>
	</div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { TaskList } from '@/types/api'
import { getTaskList } from '@/api'

import { onMounted } from 'vue'

const router = useRouter()

const recordData = ref<TaskList>()
const showExchange = ref(false)
let exchangeAmount = ref<any>('')

const getList = async () => {
	const list = await getTaskList()
	recordData.value = list
}

function clearIpt() {
	exchangeAmount.value = ''
}

async function onRedeem() {
	//todo 兑换
	showExchange.value = true
}
async function onConfirm() {
	showExchange.value = false
	//todo 兑换成功 刷新兑换记录
}

onMounted(() => {
	// getList()
})

const coinItems = [
	{
		num: 100,
		title: '金币'
	},
	{
		num: 100,
		title: '金币'
	},
	{
		num: 100,
		title: '金币'
	},
	{
		num: 100,
		title: '金币'
	},
	{
		num: 100,
		title: '金币'
	},
	{
		num: 100,
		title: '金币'
	}
]
const recordItems = [
	{
		name: 'VND',
		date: '2022-12-12',
		num: 888
	},
	{
		name: 'VND',
		date: '2022-12-12',
		num: 888
	},
	{
		name: 'VND',
		date: '2022-12-12',
		num: 888
	},
	{
		name: 'VND',
		date: '2022-12-12',
		num: 888
	},
	{
		name: 'VND',
		date: '2022-12-12',
		num: 888
	}
]
</script>

<style lang="scss" scoped>
.coins-container {
	padding: 0 24px;

	&-header {
		height: 170px;
		width: 100%;
		border-radius: 10px;
		position: relative;

		.bg2 {
			width: 100%;
			height: 100%;
			position: absolute;
			right: 0;
			top: 0;
		}

		.imgBanner {
			width: 147px;
			height: 145px;
			position: absolute;
			right: 41px;
			top: 13px;
			z-index: 99;
		}

		.tip {
			position: absolute;
			top: 36px;
			left: 29px;

			div {
				color: var(--textW);
				font-size: 44px;
			}

			div:first-child {
				font-weight: 700;
				font-size: 28px;
				margin-bottom: 26px;
			}
		}
	}

	&-content {
		&-desc {
			font-size: 28px;
			padding-top: 25px;

			h2 {
				color: var(--text_color_L2);
				padding-bottom: 14px;
			}

			h3 {
				color: var(--text_color_L1);
				padding-bottom: 14px;
			}

			span {
				color: var(--main-color);
			}
		}

		&-vipcard {
			margin: 20px 0;
			padding: 34px 21px 10px;
			background: var(--bg_color_L2);
			border-radius: 10px;

			&-title {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				font-weight: bold;
				font-size: 32px;

				img {
					width: 54px;
					height: 37px;
					margin-right: 12px;
				}

				margin-bottom: 24px;
			}

			h1 {
				position: relative;

				input {
					height: 88px;
					width: 660px;
					border-radius: 88px;
					background: var(--walletBgColor-1);
					color: var(--text_color_L1);
					font-size: 28px;
					border: none;
					padding-left: 56px;
				}

				span {
					font-size: 22px;
					color: var(--main-color);
				}

				.clearImg {
					position: absolute;
					width: 48px;
					height: 48px;
					right: 40px;
					top: 20px;
				}
			}

			h2 {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28px;
				margin-top: 47px;
				margin-bottom: 43px;

				p {
					color: var(--text_color_L1);
				}

				div {
					display: flex;
					align-items: center;
				}

				img {
					width: 36px;
					height: 36px;
					margin-right: 9px;
				}

				span {
					color: var(--norm_secondary-color);
				}
			}

			&-coin {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;

				div {
					display: flex;
					flex-direction: column;
					justify-content: center;
					width: 200px;
					height: 100px;
					border-radius: 10px;
					border: 1px solid var(--Dividing-line_color);
					font-size: 24px;
					margin-bottom: 20px;

					h1 {
						display: flex;
						justify-content: center;
						align-items: center;

						img {
							width: 30px;
							height: 30px;
							margin-right: 8px;
						}

						span {
							color: var(--DailyTaskTextColor-3);
							font-size: 26px;
						}
					}

					p {
						text-align: center;
						margin-top: 6px;
					}
				}
			}
		}

		&-btn {
			display: flex;
			flex-direction: column;

			button {
				width: 100%;
				height: 70px;
				border-radius: 70px;
				font-size: 32px;
				margin-top: 26px;
			}

			.redeem {
				color: var(--textW);
				border: none;
				background:  var(--main_gradient-color2);
			}

			.gainCoins {
				border: 1px solid var(--main-color);
				background-color: #F6F6F6;
				color: var(--text_color_L1);

				span {
					color: var(--main-color);
				}
			}
		}

		&-recordcard {
			background: var(--bg_color_L2);
			width: 100%;
			border-radius: 10px;
			padding: 32px 14px 40px;
			margin-top: 40px;
			display: flex;
			flex-direction: column;

			&-title {
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;
				font-weight: bold;
				font-size: 32px;

				img {
					width: 40px;
					height: 40px;
					margin-right: 16px;
					margin-top: 4px;
				}

				h1 {
					width: 100%;
					padding-bottom: 20px;
				}
			}

			&-items {
				padding-top: 46px;

				h1 {
					color: var(--text_color_L1);
					font-size: 34px;
					margin-bottom: 18px;
				}

				p {
					color: var(--text_color_L2);
					font-size: 26px;
					margin-bottom: 46px;
				}

				div {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-bottom: 40px;

					img {
						width: 36px;
						height: 36px;
					}

					h2 {
						display: flex;
						justify-content: flex-start;
						align-items: center;

						img {
							width: 36px;
							height: 36px;
							margin-right: 14px;
						}

						span {
							color: var(--text_color_L1);
							font-size: 30px;
						}
					}
				}
			}
		}
	}
}

:deep(.van-dialog) {
	overflow: visible;

	.van-dialog__content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}

:deep(.explain) {
	box-shadow: none;
}

.van-dialog {
	&__content {
		padding-bottom: 20px;

		img.succeed {
			width: 280px;
		}

		&-title {
			color: var(--text_color_L1);
			font-weight: 700;
			font-size: 36px;
			margin: 24px 0 45px;
		}

		&-note {
			margin-bottom: 2.5rem;
			display: flex;
			flex-direction: column;
			font-size: 28px;
			width: 100%;

			div {
				display: flex;
				justify-content: center;
				align-items: center;

				h2 {
					display: flex;
					align-items: center;
					justify-content: flex-end;

					font-size: 28px;

					color: var(--norm_secondary-color);

					img {
						width: 36px;
						margin: 0 10px 0 60px;
					}
				}
			}
		}

		&-btn {
			width: 400px;
			height: 80px;
			background: var(--main_gradient-color);
			border-radius: 80px;
			text-align: center;
			line-height: 80px;
			font-size: 32px;
			color: var(--text_color_L4);
			
			margin-bottom: 40px;
		}
	}
}
</style>
