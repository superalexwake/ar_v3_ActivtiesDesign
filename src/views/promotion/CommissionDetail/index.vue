<template>
	<div class="invitationDetail__container">
		<NavBar :title="$t('details')" left-arrow @click-left="onClick" />

		<div class="invitationDetail__container-content">
			<div class="invitationDetail__container-content__item">
				<!-- <div class="invitationDetail__container-content__item-header">
                    <span>1级下级</span>
                    <span>1级</span>
                </div> -->
				<div class="invitationDetail__container-content__item-body">
					<div>
						<span>{{ $t('invitationMember') }}</span>
						<span>64人</span>
					</div>
					<div>
						<span>{{ $t('subBets') }}</span>
						<span>888'888'88 </span>
					</div>
					<div>
						<span>{{ $t('subRecharges') }}</span>
						<span>888'888'88</span>
					</div>
					<div>
						<span>{{ $t('betTime') }}</span>
						<span>5LV</span>
					</div>
				</div>
			</div>
			<div class="btnExamine">
				<button>{{ $t('gradeRules') }}</button>
			</div>
			<img src="@public/main/moonBar.png" />
		</div>
		<div v-for="(itemP, indexP) in betHistory" :key="indexP">
			<div class="itemTop">{{ itemP.title }}</div>
			<div class="invitationDetail__container-betHistory">
				<div class="canvas">
					<svg-icon name="round"/>
				</div>
				<canvas width="20" height="320" class="icon_after" :id="`canvas${indexP}`"></canvas>
				<div v-for="(item, index) in itemP.list" :key="index">
					<span>{{ item.title }}</span>
					<div>{{ item.spent }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const betHistory = [
	{
		title: '彩票返佣比例',
		list: [
			{
				title: '1级下级',
				spent: '35%'
			},
			{
				title: '2级下级',
				spent: '35%'
			},
			{
				title: '3级下级',
				spent: '35%'
			},
			{
				title: '4级下级',
				spent: '35%'
			},
			{
				title: '5级下级',
				spent: '35%'
			},
			{
				title: '6级下级',
				spent: '35%'
			}
		]
	},
	{
		title: '电子返佣比例',
		list: [
			{
				title: '1级下级',
				spent: '35%'
			},
			{
				title: '2级下级',
				spent: '35%'
			},
			{
				title: '3级下级',
				spent: '35%'
			},
			{
				title: '4级下级',
				spent: '35%'
			}
		]
	}
]

const router = useRouter()

function onClick() {
	router.back()
}

onMounted(() => {
	for (let i = 0; i < betHistory.length; i++) {
		initCanvas(betHistory[i].list.length, i)
	}
	// for (var i of betHistory) {
	//     initCanvas(i.list.length)
	// }
})
const initCanvas = (len: number, index: number) => {
	const canvasBox = document.getElementById(`canvas${index}`) as HTMLCanvasElement
	const ctx = canvasBox.getContext('2d') as CanvasRenderingContext2D
	let iconNum = len - 1
	ctx.beginPath()
	ctx.strokeStyle = '#FF7172'
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

canvas {
	position: absolute;
	left: 14px;
	top: 0;
	z-index: 1;
}

// #canvas {
//     position: absolute;
//     left: 14px;
//     top: 0;
//     z-index: 1;
// }

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
			

			// &-header {
			//     display: flex;
			//     align-items: center;
			//     gap: 10px;

			//     span {
			//         width: 150px;
			//         height: 50px;
			//         font-size: 28px;
			//         text-align: center;
			//         line-height: 50px;
			//         border-radius: 10px;

			//         &:first-of-type {
			//             margin-left: 5px;
			//             color: var(--textW);
			//             background: #49ce9b;
			//         }

			//         &:nth-of-type(2) {
			//             color: #ff7172;
			//             border: 1px solid #ff7172;
			//         }
			//     }
			// }

			&-body {
				display: flex;
				flex-direction: column;
				gap: 10px;
				font-weight: 400;
				font-size: 26px;
				color: var(--text_color_L2);

				& > div {
					display: flex;
					align-items: center;
					justify-content: space-between;

					&:nth-of-type(2),
					&:nth-of-type(3),
					&:nth-of-type(4) {
						span {
							&:last-of-type {
								color: var(--norm_secondary-color);
							}
						}
					}

					// &:nth-of-type(8) {
					//     span {
					//         &:last-of-type {
					//             color: var(--text_color_L2);
					//         }
					//     }
					// }

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

		.btnExamine {
			background: var(--bg_color_L2);
			display: flex;
			justify-content: center;
			padding-top: 25px;
			padding-bottom: 30px;

			> button {
				background: var(--bg_color_L2);
				border: 1px solid var(--main-color);
				border-radius: 80px;
				height: 60px;
				line-height: 60px;
				width: 85%;
				color: var(--main-color);
				font-weight: 400;
				font-size: 28px;
				text-align: center;
			}
		}
	}

	.itemTop {
		color: var(--text_color_L1);
		font-weight: 400;
		font-size: 28px;
		padding: 20px;
		background: var(--bg_color_L2);
		margin-top: -9px;
	}

	&-betHistory {
		background: var(--bg_color_L2);
		margin-top: -9px;
		padding: 34px 24px 20px;
		// height: 700px;
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
