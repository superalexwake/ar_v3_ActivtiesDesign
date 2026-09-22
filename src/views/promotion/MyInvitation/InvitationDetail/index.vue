<template>
	<div class="invitationDetail__container">
		<NavBar :title="$t('myInvitation')" left-arrow @click-left="onClick" />

		<div class="invitationDetail__container-content">
			<div class="invitationDetail__container-content__item">
				<div class="invitationDetail__container-content__item-header">
					<span>{{ $t('startUp') }}</span>
					<span>1级</span>
				</div>
				<div class="invitationDetail__container-content__item-body">
					<div>
						<span>{{ $t('nickName') }}</span>
						<span>MemberNNG0DDAF</span>
					</div>
					<div>
						<span>UID</span>
						<span>90164</span>
					</div>
					<div>
						<span>{{ $t('totalBetAmount') }}</span>
						<span>50,000.00</span>
					</div>
					<div>
						<span>{{ $t('totalRechargeAmount') }}</span>
						<span>50,000.00</span>
					</div>
					<div>
						<span>总返佣</span>
						<span>88</span>
					</div>
					<div>
						<span>{{ $t('subordinatesNumber') }}</span>
						<span>88</span>
					</div>
					<div>
						<span>获得返佣</span>
						<span>50,000.00</span>
					</div>
					<div>
						<span>{{ $t('loginTime') }}</span>
						<span>2023-02-13 16:22:30</span>
					</div>
				</div>
			</div>
			<img src="@public/main/moonBar.png" />
		</div>

		<div class="invitationDetail__container-betHistory">
			<div class="canvas">
				<svg-icon name="round" class="img" v-for="item in betHistory.length" :key="item"/>
			</div>
			<canvas width="20" height="320" class="icon_after" id="canvas"></canvas>
			<div v-for="(item, index) in betHistory" :key="index">
				<span>{{ item.title }}</span>
				<div>{{ item.spent }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const betHistory = [
	{
		title: '彩票投注',
		spent: '50,000.00'
	},
	{
		title: 'Slots投注',
		spent: '50,000.00'
	},
	{
		title: '赌场投注',
		spent: '50,000.00'
	},
	{
		title: 'Slots投注',
		spent: '50,000.00'
	},
	{
		title: '赌场投注',
		spent: '50,000.00'
	},
	{
		title: 'Slots投注',
		spent: '50,000.00'
	},
	{
		title: '赌场投注',
		spent: '50,000.00'
	},
	{
		title: 'Slots投注',
		spent: '50,000.00'
	},
	{
		title: '赌场投注',
		spent: '50,000.00'
	}
]

const router = useRouter()

function onClick() {
	router.back()
}

onMounted(() => {
	initCanvas()
})
const initCanvas = () => {
	const canvasBox = document.getElementById('canvas') as HTMLCanvasElement
	const ctx = canvasBox.getContext('2d') as CanvasRenderingContext2D
	let iconNum = betHistory.length - 1
	ctx.beginPath()
	ctx.strokeStyle = 'var(--main-color)'
	ctx.moveTo(10, 28)
	ctx.setLineDash([1, 1])
	let more = iconNum * 3 + 32
	ctx.lineTo(10, iconNum * 28 + more)
	ctx.stroke()
}
</script>

<style lang="scss" scoped>
.canvas {
	width: 20px;
	display: flex;
	flex-direction: column;
	position: absolute;
	justify-content: flex-start;
	z-index: 2;
	left: 22px;
	top: 38px;
	svg {
		width: 20px;
		height: 20px;
		margin-bottom: 38px;
	}
}
#canvas {
	position: absolute;
	left: 14px;
	top: 0;
	z-index: 1;
}
.invitationDetail__container {
	padding-inline: 24px;
	padding-block: 0 112px;
	font-family: $font-family;

	:deep(.van-nav-bar) {
		background-color: #F6F6F6;

		.van-nav-bar__content {
			.van-nav-bar__left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}

			.van-nav-bar__title {
				color: var(--text_color_L1);
			}
		}
	}

	&-content {
		img {
			width: 702px;
			height: 44px;
		}
		&__item {
			display: flex;
			flex-direction: column;
			gap: 24px;
			padding: 24px 10px;
			border-radius: 10px 10px 0 0;
			background-color: var(--textW);
			

			&-header {
				display: flex;
				align-items: center;
				gap: 10px;

				span {
					width: 150px;
					height: 50px;
					font-size: 28px;
					text-align: center;
					line-height: 50px;
					border-radius: 10px;

					&:first-of-type {
						margin-left: 5px;
						color: var(--textW);
						background: var(--norm_green-color);
					}

					&:nth-of-type(2) {
						color: var(--main-color);
						border: 1px solid var(--main-color);
					}
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 10px;
				font-size: 24px;
				color: var(--text_color_L2);

				& > div {
					display: flex;
					align-items: center;
					justify-content: space-between;

					&:nth-of-type(3),
					&:nth-of-type(4),
					&:nth-of-type(5),
					&:nth-of-type(7) {
						span {
							&:last-of-type {
								color: var(--norm_secondary-color);
							}
						}
					}

					&:nth-of-type(8) {
						span {
							&:last-of-type {
								color: var(--text_color_L2);
							}
						}
					}

					span {
						height: 60px;
						padding: 0 20px;
						line-height: 60px;

						&:first-of-type {
							flex: 0.45;
							clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
						}

						&:last-of-type {
							flex: 0.55;
							text-align: right;
						}
					}
				}
			}
		}
	}

	&-betHistory {
		background: var(--bg_color_L2);
		margin-top: -9px;
		padding: 34px 24px 20px;
		height: 700px;
		position: relative;
		& > div {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 28px;
			margin-bottom: 30px;

			span {
				color: var(--text_color_L3);
				font-size: 26px;
				line-height: 28px;
				margin-left: 28px;
			}

			div {
				font-size: 26px;
				line-height: 28px;
				color: var(--text_color_L1);
			}
		}
	}
}
</style>
