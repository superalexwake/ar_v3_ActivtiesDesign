<script setup lang="ts">
// import {useStyle, useUserInfo} from "@/hooks";
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTurntables } from '@/hooks'
import PopuerGift from './components/popuerGift.vue'
import { currency } from '@/utils'
import { useAssets } from '@/hooks/useAssets'
import ScrollNum from './components/ScrollNum.vue'
import WithdrawDialogs from '@/components/WithdrawDialog/index.vue'
import Rule from './components/Rule.vue'
import dayjs from 'dayjs'
import { closeToast, showLoadingToast } from 'vant'
import { GlobalStore } from '@/stores'
import Dialog from '@/components/common/Dialog.vue'
import { requireLoginAction } from '@/hooks/useLoginIntercept'

const router = useRouter()
const { getAvatarUrl } = useAssets()
const {
	initTurntableCanvas,
	turntableCanvas,
	recordList,
	countDownTime,
	withdrawDialog,
	withdrawNeedAmount,
	userInvitedWheelAmount,
	dollarSign,
	ruleDialog,
	loadAssets,
	getTurntableInfo,
	needAmount,
	isEveryDayGift,
	amountNoDialog,
	clearCountDown,
	removeAllAnimate,
	clearAllAnimations
} = useTurntables()

const startAmount = ref(0)

const globalStore = GlobalStore()
const userPhoto = computed(() => globalStore.getUserInfo.userPhoto)

const onClickLeft = () => {
	router.back()
}

const handleCashOut = async () => {
	if (!(await requireLoginAction())) return
	if (withdrawNeedAmount.value <= userInvitedWheelAmount.value) {
		await getTurntableInfo()
		withdrawDialog.value = true
	} else {
		// useToast().error()
		amountNoDialog.value = true
	}
}

const withdrawSuccess = async () => {
	await getTurntableInfo()
}

const goHistory = async () => {
	if (!(await requireLoginAction())) return
	router.push({ name: 'withdrawHistory' })
}

const goInvite = async () => {
	if (!(await requireLoginAction())) return
	router.push({ name: 'PromotionShare' })
}

// 在任何 await 之前注册 onMounted
onMounted(async () => {
  showLoadingToast({
    message: 'loading...',
    duration: 0, // 永久显示，直到手动关闭
    forbidClick: true,
  })
	try {
		await getTurntableInfo()
		await loadAssets()
		await initTurntableCanvas()
	} catch (error) {
		console.error('初始化转盘失败:', error)
	} finally {
		closeToast()
	}
})

onUnmounted(() => {
	  // 清理定时器或其他资源
  clearCountDown()
  removeAllAnimate()
  clearAllAnimations()
  startAmount.value = 0
  withdrawDialog.value = false
  isEveryDayGift.value = false
})
</script>

<template>
	<div class="ar_turntable_page">
		<div class="nav_bar_head">
			<van-icon @click="onClickLeft" class="left_icon" name="arrow-left" />
			<div class="title">{{$t('luckyWheel')}}</div>
			<div class="rithe_icon">
				<svg xmlns="http://www.w3.org/2000/svg" @click="ruleDialog = true"  viewBox="0 0 48 48" fill="none">
					<g filter="url(#filter0_d_5981_33537)">
						<path
							d="M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM24 7C14.6112 7 7 14.6112 7 24C7 33.3888 14.6112 41 24 41C33.3888 41 41 33.3888 41 24C41 14.6112 33.3888 7 24 7ZM24 31C24.5304 31 25.039 31.2109 25.4141 31.5859C25.7891 31.961 26 32.4696 26 33C26 33.5304 25.7891 34.039 25.4141 34.4141C25.039 34.7891 24.5304 35 24 35C23.4696 35 22.961 34.7891 22.5859 34.4141C22.2109 34.039 22 33.5304 22 33C22 32.4696 22.2109 31.961 22.5859 31.5859C22.961 31.2109 23.4696 31 24 31ZM24.0029 12C27.5864 12.0003 30.5 15.0589 30.5 18.8184V18.9131L30.4902 19.0078C30.1089 22.6826 28.3932 23.8638 27.1416 24.7285C26.643 25.0765 26.2415 25.3456 25.9971 25.7305C25.7135 26.1733 25.5723 26.3318 25.5723 27.3018C25.5723 28.2403 24.8673 29 23.9971 29C23.127 28.9997 22.4229 28.2402 22.4229 27.3018C22.423 23.4161 24.1684 22.7408 25.4443 21.8604C26.4466 21.1643 27.1169 20.7053 27.3467 18.7227C27.2976 16.8826 25.8157 15.4014 23.9971 15.4014C22.1493 15.4016 20.6485 16.9303 20.6484 18.8125C20.6484 19.7511 19.9445 20.5107 19.0742 20.5107C18.204 20.5107 17.5 19.7511 17.5 18.8125C17.5001 15.0582 20.4193 12 24.0029 12Z"
							fill="white"
						/>
					</g>
					<defs>
						<filter
							id="filter0_d_5981_33537"
							x="2"
							y="4"
							width="44"
							height="44"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="2" />
							<feGaussianBlur stdDeviation="1" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 0.113725 0 0 0 0 0.00392157 0 0 0 0 0.00392157 0 0 0 0.3 0"
							/>
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5981_33537" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5981_33537" result="shape" />
						</filter>
					</defs>
				</svg>

				<svg xmlns="http://www.w3.org/2000/svg" @click="goHistory" viewBox="0 0 48 48" fill="none">
					<g filter="url(#filter0_d_5981_33532)">
						<path
							d="M34.6514 23.5898C40.0242 23.5898 44.3895 27.9552 44.3994 33.3379C44.3994 38.7305 39.9845 43.1157 34.582 43.0762C29.2786 43.0265 24.9526 38.7009 24.9131 33.4072C24.8736 27.995 29.2589 23.59 34.6514 23.5898ZM31.0967 4.60547C33.8422 4.60547 36.0837 6.84719 36.084 9.60254V20.3887C36.0837 21.228 35.3727 21.8993 34.5234 21.8203C33.7829 21.7509 33.2197 21.1089 33.2197 20.3584V9.60254C33.2195 8.43732 32.262 7.47949 31.0967 7.47949H8.86426C7.69914 7.47969 6.74147 8.43744 6.74121 9.60254V38.0674C6.74128 39.2326 7.69903 40.1902 8.86426 40.1904H24.3213C25.1804 40.1904 25.8723 40.9511 25.7441 41.8398C25.6454 42.5509 25.0129 43.0644 24.292 43.0645H8.86426C6.20762 43.0643 4.01522 40.9905 3.87695 38.3438V9.33594C4.01542 6.67945 6.19788 4.60565 8.86426 4.60547H31.0967ZM34.6514 26.2666C30.7207 26.2668 27.5308 29.4959 27.5898 33.4463C27.6491 37.2388 30.7503 40.3402 34.5527 40.3896C38.4935 40.439 41.7129 37.259 41.7129 33.3281C41.7129 29.4269 38.5427 26.2666 34.6514 26.2666ZM34.3467 28.7012C34.9392 28.7013 35.4131 29.2053 35.4131 29.7979V33.5117H37.8525C38.5142 33.5117 39.0573 33.936 39.0771 34.5977C39.0969 35.2297 38.5637 35.7432 37.9316 35.7432H33.9023C33.5073 35.7432 33.1807 35.4175 33.1807 35.0225V29.9258C33.1809 29.2544 33.6752 28.7012 34.3467 28.7012ZM18.1592 27.7637C18.9491 27.7639 19.5711 28.4355 19.502 29.2354C19.4326 29.9364 18.8202 30.46 18.1191 30.46H11.2256C10.5146 30.46 9.90226 29.9364 9.84277 29.2354C9.77365 28.4355 10.3956 27.7639 11.1855 27.7637H18.1592ZM21.4775 20.6914C22.228 20.6916 22.8301 21.3043 22.8301 22.0449C22.83 22.7954 22.2279 23.4074 21.4873 23.3877H11.1953C10.4054 23.3874 9.77365 22.7159 9.84277 21.916C9.90221 21.215 10.5147 20.6914 11.2158 20.6914H21.4775ZM26.0801 13.8867C26.8009 13.8869 27.4431 14.4794 27.4629 15.2002C27.4826 15.9706 26.8699 16.5928 26.1094 16.5928H11.1855C10.8203 16.5927 10.4842 16.4451 10.2275 16.1982C9.96092 15.9218 9.81332 15.556 9.83301 15.1709C9.87251 14.4598 10.5047 13.8867 11.2158 13.8867H26.0801Z"
							fill="white"
						/>
					</g>
					<defs>
						<filter
							id="filter0_d_5981_33532"
							x="1.87695"
							y="4.60547"
							width="44.5225"
							height="42.4707"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="2" />
							<feGaussianBlur stdDeviation="1" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 0.115385 0 0 0 0 0.00562318 0 0 0 0 0.00562318 0 0 0 0.3 0"
							/>
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5981_33532" />
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5981_33532" result="shape" />
						</filter>
					</defs>
				</svg>
			</div>
		</div>
		<!-- <HeadNav :leftArrow="true" @click-s="onClickLeft" :title="$t('t571')" >
      <template #end>
        <div class="right_btn flex flex-row flex-between">
          <svg-icon name="icon_turnTable_help" icon-class="nva_help" @click="ruleDialog = true" />
          <svg-icon @click="goHistory" name="icon_History" icon-class="icon_history" />
        </div>
      </template>
    </HeadNav> -->

		<div class="my_account">{{ $t('t572') }}({{ countDownTime }})</div>

		<div class="turntable_content">
			<ScrollNum
				:startVal="startAmount"
				:decimals="2"
				:prefix="dollarSign"
				:endVal="userInvitedWheelAmount"
				:duration="1000"
				class="scroll_num"
			/>
			<!-- <div class="amount">{{currency(userInvitedWheelAmount)}}</div> -->
			<div class="cash_btn" @click="handleCashOut">{{ $t('t573') }}</div>
			<div class="turntable_all">
				<div id="turntable_canvas" ref="turntableCanvas"></div>
				<div class="turn_bottom"></div>
			</div>

			<div class="turntable_record">
				<div class="invite_btn mx-auto" @click="goInvite">{{ $t('t574') }}</div>
				<div class="tip">{{ $t('t575', [currency(needAmount), currency(withdrawNeedAmount)]) }}</div>

				<div class="record_list">
					<div class="title">{{ $t('t285') }}</div>

					<div v-for="item in recordList" :key="item.createTime" class="record_item flex flex-row flex-between">
						<div class="record_item_left flex">
							<img :src="getAvatarUrl(userPhoto)" alt="userPhoto" />
							<span>{{ item.userName }}</span>
						</div>
						<div class="record_item_right flex flex-column">
							<div class="record_amount">{{ currency(item.prizeAmount) }}</div>
							<div class="time">{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<WithdrawDialogs v-model:visible="withdrawDialog" @withdrawSuccess="withdrawSuccess" />
		<PopuerGift v-model:visible="isEveryDayGift" v-if="isEveryDayGift" />
		<Dialog
			v-model:show="amountNoDialog"
			:title="$t('t576')"
			:confirm-text="$t('t574')"
			:cancel-text="$t('ok')"
			@confirm="goInvite"
		>
		<template #content>
			<div class="amount_no_tip">
				{{ $t('t577', [currency(needAmount)]) }}
			</div>
		</template>
			
		</Dialog>

		<Rule v-model:visible="ruleDialog" />
	</div>
</template>

<style scoped lang="scss">
.ar_turntable_page {
	background-image: url('./assets//img//turntable_bg.png');
	background-size: 100% 1264px;
	background-repeat: no-repeat;
	background-position: center top;
	background-color: #bf222c;
	width: 100%;
	min-height: 100vh;
	position: relative;

	::v-deep(.head-main) {
		position: relative;
		background: var(--main_gradient-color) !important;
		color: var(--text_color_L4, #fff);
		z-index: 2;
	}

	.right_btn {
		grid-gap: 24px;
		.nva_help,
		.icon_history {
			width: 48px;
			height: 48px;
		}
	}
	.my_account {
		text-align: center;
		padding-top: 32px;
		color:  #ffffff;
		font-size: 28px;
		font-weight: 500;
	}
	.turntable_content {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.scroll_num {
			display: inline-block;
			margin: 0 auto;
			// text-align: center;
		}
		.amount {
			position: absolute;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			z-index: 3;
			//text-align: center;
			// text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
			// -webkit-text-stroke-width: 1.5px;
			// -webkit-text-stroke-color: #000;
			font-size: 68px;
			font-weight: 500;
			line-height: 88px; /* 129.412% */
			background: linear-gradient(180deg, #fffa7b 22.55%, #fffb5e 44.98%, #ffe770 59.26%, #ffb06a 73.53%);
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			//margin: 20px auto 20px;
		}
		.cash_btn {
			position: absolute;
			top: 106px;
			left: 50%;
			transform: translateX(-50%);
			min-width: 277px;
			height: 76px;
			border-radius: 50px;
			background: #fd8b01;
			box-shadow: 0px -4px 30px 0px rgba(255, 255, 255, 0.6) inset;
			color: #fff;
			text-align: center;
			text-shadow: 0px 2px 2px rgba(88, 58, 8, 0.5);
			font-size: 32px;
			font-weight: 700;
			line-height: 76px; /* 100% */
			z-index: 4;
			//margin: 0 auto 22px;
		}

		.turntable_all {
			width: 100%;
			height: 1076px;
			margin-top: -120px;
			margin-bottom: 38px;
			position: relative;
			z-index: 3;
			.turn_bottom {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 279px;
				background: url('assets/img/turn_bottom.png') no-repeat center center;
				background-size: 100% 279px;
				z-index: 2;
			}
		}
		#turntable_canvas {
			width: 660px;
			height: 906px;
			position: relative;
			margin: 0 auto;
			z-index: 1;
		}
	}
	.turntable_record {
		width: 100%;
		padding-bottom: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		.tip {
			width: 100%;
			color: #fff;
			text-align: center;
			font-size: 24px;
			font-weight: 500;
			line-height: 32px; /* 133.333% */
			margin-bottom: 36px;
			padding: 0 30px;
		}
		.record_list {
			width: 100%;
			padding: 0 30px 100px;
			.title {
				color: #fff;
				font-size: 32px;
				font-style: normal;
				font-weight: 700;
				line-height: 32px; /* 100% */
			}
			.record_item {
				height: 102px;
				padding: 24px 0;
				border-bottom: 1px solid #e43f49;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.record_item_left {
					display: flex;
					align-items: center;
					img {
						width: 64px;
						height: 64px;
						margin-right: 12px;
						border-radius: 50%;
					}
					span {
						color: #fff;
						font-size: 26px;
						font-weight: 400;
						line-height: 32px; /* 123.077% */
					}
				}
				.record_item_right {
					.record_amount {
						color: #ffdc2f;
						text-align: right;
						font-size: 26px;
						font-weight: 500;
					}
					.time {
						color: rgba(255, 255, 255, 0.8);
						text-align: right;
						font-size: 24px;
						font-weight: 400;
					}
				}
			}
			.record_item:last-child {
				border-bottom: none;
			}
		}
	}
	.invite_btn {
		display: inline-block;
		color: #fff;
		text-align: center;
		text-shadow: 0px 2px 2px rgba(88, 58, 8, 0.5);
		font-size: 28px;
		font-weight: 500;
		line-height: 76px; /* 114.286% */
		border-radius: 50px;
		background: #fd8b01;
		box-shadow: 0px -4px 30px 0px rgba(255, 255, 255, 0.6) inset;
		height: 76px;
		padding: 0 12px;
		margin: 0 auto 24px;
	}
	.amount_no_tip {
		padding: 50px 0;
		color: var(--text_color_L1, #383a4c);
		text-align: center;
		font-size: 28px;
		font-weight: 400;
		line-height: 36px; /* 128.571% */
	}
}

.nav_bar_head {
  width: 100%;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
//   background: var(--main_gradient-color);
  padding: 0 30px;
  position: sticky;
  top: 0;
  box-shadow: inset 0 -2px 0 rgba(255, 255, 255, 0.5);
  background: #E14641;
  z-index: 10;
  .left_icon {
    font-size: 48px;
    color: #ffffff;
  }
  .title {
    color: #ffffff;
    text-align: center;
    font-size: 36px;
    font-weight: 600;
    display: inline-block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .rithe_icon {
    display: flex;
    align-items: center;
    svg {
      width: 48px;
      height: 48px;
      margin-right: 24px;
    }
    svg:last-child {
      margin-right: 0;
    }
  }
}

</style>
