<template>
	<div class="changLong__C">
		<div class="changLong__C-bet" v-for="(item, index) in betlist" :key="item.issueNumber+item.gameCode+item.playType">
			<div class="changLong__C-bet-l">
				<div class="titel" :class="[item.gameCode.split('_')[0]]">{{ item.gameName }}</div>
				<div class="num">
					{{ item.issueNumber }}
					<span class="time">{{ `${item.time1}${item.time2}:${item.time3}${item.time4}` }}</span>
				</div>
				<div class="other">
					<div class="remark">{{ gameType(item) }}</div>
					<div :class="['gameResult', 'bg-' + item.dragonItem]">
						{{$t('common.'+item.dragonItem.toLowerCase())}}
					</div>
					<div class="issue">{{ item.dragonCount }}{{ $t('betIssues') }}</div>
				</div>
			</div>
			<div class="changLong__C-bet-r" v-if="item.passTime > prohibitBuyTime(item.gameCode)">
				<div  v-for="bet of item.playBetList"
					  :class="[`${bet.playBet}_${item.playType}` == `${selectInfo.playBet}_${selectInfo.playType}` ? 'active' : '','bg-' + bet.playBet]"
					  @click="onBet(item,bet)">
					{{playBetName(bet)}}
				</div>
			</div>
		</div>
		<Empty v-if="betlist.length===0&&!lock"></Empty>
    <section class="flex-center " style="height: 4rem" v-if="lock">
      <van-loading  type="spinner" color="var(--main-color)" />
    </section>
	</div>
	<!-- 投注内容 begin -->
	<van-popup v-model:show="bettingPopupShow" position="bottom" :round="true" :close-on-click-overlay="false">
		<div class="Betting__Popup">
			<div class="Betting__Popup-head" :class="['bg-'+selectInfo.playBet]">
				<div class="Betting__Popup-head-title">{{ selectInfo.gameName }}</div>
				<div class="Betting__Popup-head-selectName">
					<span>{{ t('choose') }}</span
					><span>{{ playBetName(selectInfo)   }}</span>
				</div>
			</div>
			<div class="Betting__Popup-body">
				<div class="Betting__Popup-body-line">
					{{ t('amount') }}
					<div class="Betting__Popup-body-line-list">
						<div
							v-for="(item, index) in betTypeList"
							:key="index"
							class="Betting__Popup-body-line-item"
							:class="{ bgcolor: selectInfo.coin == item }"
							@click="changeCoin(item)"
						>
							{{ item }}
						</div>
					</div>
				</div>
				<div class="Betting__Popup-body-line">
					{{ t('numbers') }}
					<div class="Betting__Popup-body-line-btnL">
						<div class="Betting__Popup-btn" :class="{ bgcolor: selectInfo.count > 0 }" @click="Stepper(1)">-</div>
						<van-field
							class="Betting__Popup-input"
							v-model="selectInfo.count"
							type="digit"
							:maxlength="4"
							@input="changeStep"
						/>
						<div class="Betting__Popup-btn bgcolor" @click="Stepper(2)">+</div>
					</div>
				</div>
				<div class="Betting__Popup-body-line">
					<div></div>
					<div class="Betting__Popup-body-line-list">
						<div
							v-for="(item, index) in multipleList"
							:key="index"
							class="Betting__Popup-body-line-item"
							@click="TaskCount(item)"
							:class="{ bgcolor: selectInfo.count == item }"
						>
							X{{ item }}
						</div>
					</div>
				</div>
				<div class="Betting__Popup-body-line">
					<span
						class="Betting__Popup-agree"
						:class="{ active: isCheckPreSale }"
						@click="isCheckPreSale = !isCheckPreSale"
					>{{ t('agree') }}</span
					><span @click="isShowPreSale = true" class="Betting__Popup-preSaleShow">{{ t('presaleRules') }}</span>
				</div>
			</div>
			<div class="Betting__Popup-foot">
				<div class="Betting__Popup-foot-c" @click="clearBetting">{{ t('cancel') }}</div>
				<div class="Betting__Popup-foot-s bgcolor" :class="{ disabled: !canSubmit }" v-throttle-click="{ handler: submitBetting, wait: 2000 }">
					{{ t('totalAmount') }} {{ currency(selectInfo.count * selectInfo.coin || 0) }}
				</div>
			</div>
		</div>
	</van-popup>

	<!-- 规则弹层 begin-->
	<van-popup v-model:show="isShowPreSale" :close-on-click-overlay="false" round>
		<div class="Betting__Popup-PreSale">
			<div class="Betting__Popup-PreSale-head">{{ t('presaleRules') }}</div>
			<div class="Betting__Popup-PreSale-body">
				{{ $t('betPopTXT') }}
			</div>
			<div class="Betting__Popup-PreSale-foot">
				<div class="Betting__Popup-PreSale-foot-btn" @click="knowPreSale">{{ t('iKonw') }}</div>
			</div>
		</div>
	</van-popup>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Empty from '@/components/Empty/index.vue'
import { useChangLong } from '@/saasLottery/hooks'
import { currency } from '@/utils'
const {t}=useI18n();
const {
  getDragonListPage,
  prohibitBuyTime,
	betlist,
	bettingPopupShow,
	isShowPreSale,
	isCheckPreSale,
	selectInfo,
	betTypeList,
	multipleList,
  lock,
	Stepper,
	canSubmit,
	changeStep,
	TaskCount,
	changeCoin,
	knowPreSale,
	submitBetting,
	onBet,
	clearBetting
}=useChangLong()
const playBetName=(item:any)=>{
	if (!item.playBet) return ''
	switch (item.playBet) {
		case 'h':
			return t('common.big')
		case 'l':
			return t('common.small')
		case 'o':
			return t('common.odd')
		case 'e':
			return t('common.even')
		default:
			return t('common.'+item.playBet.toLowerCase())

	}
}
const gameType= (item: any)=>{
	let text='';
	switch (item.playType) {
		case "FifthOddEven":
		case "FourthOddEven":
		case "ThirdOddEven":
		case "SecondOddEven":
		case "FirstOddEven":
		case "OddEven":
			text= `${t('common.even')},${t('common.odd')}`
			break;
		case "FirstBigSmall":
		case "ThirdBigSmall":
		case "SecondBigSmall":
		case "FifthBigSmall":
		case "FourthBigSmall":
		case "BigSmall":
			text= `${t('common.big')},${t('common.small')}`
			break
		case "Color":
			text=t('color')
			break
		case 'SumBigSmall':
			text= `${t('gameRecordTotal')}_${t('common.big')},${t('common.small')}`
			break
		case 'SumOddEven':
			text= `${t('gameRecordTotal')}_${t('common.even')},${t('common.odd')}`
			break
	}
	if (item.gameCode.startsWith('MotoRace')){
		if (item.playType.startsWith('First')) text=`1st_${text}`;
		if (item.playType.startsWith('Second')) text=`2nd_${text}`
		if (item.playType.startsWith('Third')) text=`3rd_${text}`
	}
	if (item.gameCode.startsWith('D5')){
		if (item.playType.startsWith('First')) text=`A_${text}`;
		if (item.playType.startsWith('Second')) text=`B_${text}`;
		if (item.playType.startsWith('Third')) text=`C_${text}`;
		if (item.playType.startsWith('Fourth')) text=`D_${text}`;
		if (item.playType.startsWith('Fifth')) text=`E_${text}`;
	}
	return  text
}
/**
 * 清理数据
 */

onMounted(() => {
	getDragonListPage()
})



</script>

<style lang="scss" scoped>
.changLong__C {
	padding: 24px 26px;

	:deep(.navbar__content) {
		.van-icon {
			color: var(--text_color_L4);
		}

		.navbar__content-center {
			color: var(--text_color_L4);
		}
	}

	:deep(.van-tabs__line) {
		width: calc(50% - 52px);
		background: var(--colorText-2);
	}

	:deep(.van-tabs__content) {
		padding: 24px 26px;
	}

	&-bet {
		//height: 180px;
		width: 100%;
		background: var(--bg_color_L2);
		border-radius: 10px;
		//display: flex;
		padding: 18px 14px;

		&-l {
			width: auto;
			flex: none;

			.titel {
				height: 40px;
				line-height: 40px;
				margin-bottom: 18px;
				color: var(--text_color_L1);
				font-size: 26px;



			}

			.num {
				height: 30px;
				margin-bottom: 10px;
				font-size: 24px;
				color: var(--text_color_L2);

				.time {
					color: var(--norm_red-color);
				}
			}

			.other {
				height: 48px;
				line-height: 48px;
				display: flex;

				& > div {
					color: var(--text_color_L4);
					font-size: 24px;

					& + div {
						margin-left: 6px;
					}
				}

				.remark {
					color: var(--text_color_L1);
					background: var(--button_dis_color);
					padding: 0 14px;
				}

				.issue {
					background: var(--main-color);
					color: var(--text_color_L4);
					padding: 0 14px;
				}

				.gameResult {
					padding: 0 10px;
					color: var(--text_color_L4);
					&.bg-Big,
					&.bg-big,
					&.bg-h
					{
						background-color: var(--norm_secondary-color);

					}

					&.bg-Red,
					&.bg-red,
					&.bg-Odd,
					&.bg-odd,
					&.bg-o
					{
						background-color: var(--norm_red-color);
					}

					&.bg-violet {
						background-color: var(--norm_Purple-color);
					}
					&.bg-Small,
					&.bg-small,
					&.bg-l{
						background-color: var(--norm_bule-color);
					}
					&.bg-Green,
					&.bg-green,
					&.bg-even,
					&.bg-Even,
					&.bg-e {
						background-color: var(--norm_green-color);

					}
				}
			}
		}

		&-r {
			margin-top: 30px;
			display: flex;
			justify-content: center;
			align-items: center;

			& > div {
				flex:1;
				height: 60px;
				line-height: 60px;
				text-align: center;
				border-radius: 8px;
				font-size: 24px;
				color: var(--text_color_L4);
				&.bg-Big,
				&.bg-big,
				&.bg-h
				{
					background-color: var(--norm_secondary-color);
				}

				&.bg-Red,
				&.bg-red,
				&.bg-Odd,
				&.bg-odd,
				&.bg-o
				{
					background-color: var(--norm_red-color);

				}

				&.bg-violet {
					background-color: var(--norm_Purple-color);
				}
				&.bg-Small,
				&.bg-small,
				&.bg-l{
					background-color: var(--norm_bule-color);
				}
				&.bg-Green,
				&.bg-green,
				&.bg-even,
				&.bg-Even,
				&.bg-e {
					background-color: var(--norm_green-color);
				}

				//&.active {
				//	background: var(--main-color);
				//	color: var(--text_color_L4);
				//}

				& + div {
					margin-left: 16px;
				}
			}

			&.disable {
				& > div {
					pointer-events: none;
					background-color: var(--button_dis_color);
					color: var(--text_color_L2);
					border: 2px solid var(--Dividing-line_color);

					&.active {
						background-color: var(--button_dis_color);
						color: var(--text_color_L4);
					}
				}
			}
		}

		& + div {
			margin-top: 16px;
		}
	}
}
.Betting__Popup {
	.bgcolor {
		background-color: var(--main-color);
	}

	&-head {
		height: 190px;
		position: relative;
		padding-top: 30px;

		&.bg-Big,
		&.bg-big,
		&.bg-h
		{
			background-color: var(--norm_secondary-color);
		}

		&.bg-Red,
		&.bg-red,
		&.bg-Odd,
		&.bg-odd,
		&.bg-o
		{
			background-color: var(--norm_red-color);
		}

		&.bg-violet {
			background-color: var(--norm_Purple-color);
		}
		&.bg-Small,
		&.bg-small,
		&.bg-l{
			background-color: var(--norm_bule-color);
		}
		&.bg-Green,
		&.bg-green,
		&.bg-even,
		&.bg-Even,
		&.bg-e {
			background-color: var(--norm_green-color);
		}

		&::after {
			content: '';
			position: absolute;
			width: 50%;
			left: 0;
			bottom: 0;
			height: 59px;
			background-image: linear-gradient(9deg, var(--bg_color_L2) 50%, transparent 50%);
			html:lang(ar) &{
				right: 0;
				left: unset;
			}
		}

		&::before {
			content: '';
			position: absolute;
			right: 0;
			bottom: 0;
			width: 50%;
			height: 59px;
			background-image: linear-gradient(-9deg, var(--bg_color_L2) 50%, transparent 50%);
			html:lang(ar) &{
				right: unset;
				left: 0;
			}
		}

		&-title {
			height: 44px;
			font-weight: 700;
			font-size: 36px;
			text-align: center;
			color: var(--text_color_L4);
		}

		&-selectName {
			width: 560px;
			height: 50px;
			margin: 16px auto 0;
			//background:var(--light-main_gradient-color, var(--text_color_L1));
			border-radius: 10px;
			text-align: center;
			font-weight: 500;
			font-size: 26px;
			color: var(--text_color_L4);

			& > span {
				line-height: 50px;

				& + span {
					margin-left: 28px;
				}
			}
		}
	}

	&-body {
		height: 390px;
		padding: 57px 26px 40px 26px;
		background: var(--bg_color_L3);
		&-line {
			font-size: 32px;
			color: var(--darkTextW,var(--text_color_L1));
			height: 56px;
			line-height: 56px;
			display: flex;
			justify-content: space-between;

			&-list {
				display: flex;
				justify-content: space-between;
			}

			&-item {
				padding: 0 16px;
				background: var(--bg_color_L3);
				border-radius: 6px;
				color: var(--text_color_L2);

				& + div {
					margin-left: 12px;
				}
			}

			& + div {
				margin-top: 30px;
			}

			&-btnL {
				justify-content: center;
				display: flex;
			}

			&:last-child {
				justify-content: flex-start;
			}
		}
	}

	&-foot {
		height: 100px;
		display: flex;
		text-align: center;
		line-height: 100px;
		font-size: 28px;
		color: var(--text_color_L4);

		&-c {
			flex: 1;
			background: var(--bg_color_L3);
			color: var(--text_color_L2);
		}

		&-s {
			flex: 2;

			&.disabled {
				opacity: 0.6;
			}
		}
	}

	&-btn {
		width: 56px;
		height: 56px;
		pointer-events: none;
		text-align: center;
		font-size: 50px;
		padding: 0;
		background: var(--gray-color-1);
		color: var(--button_dis_color);
		flex: none;
		border-radius: 6px;
	}

	&-input {
		border: 1px solid var(--gray-color-1);
		padding: 2px 20px;
		width: 158px;
		margin: 0 12px;
		background: unset;
		background-color: var(--bg_color_L1);
		border-radius: 6px;
		&::after {
			content: none;
		}
		:deep(.van-field__control) {
			text-align: center;
			font-size: 28px;
			line-height: 54px;
		}
	}

	&-agree {
		padding-left: 60px;
		background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/agree-b.png');
		background-repeat: no-repeat;
		background-position: left center;
		background-size: 48px;
		font-size: 24px;
		color: var(--text_color_L2);
		html:lang(ar) &{
			background-position: right center;
		}
		&.active {
			background-image: url('@icon/common/agree-a.png');
		}
	}

	&-preSaleShow {
		margin-left: 26px;
		font-size: 24px;
		color: var(--norm_red-color);
	}

	&-PreSale {
		width: 528px;

		&-head {
			height: 90px;
			line-height: 90px;
			color: var(--text_color_L4);
			font-size: 30px;
			text-align: center;
			background: var(--main_gradient-color);
		}

		&-body {
			max-height: 600px;
			overflow-y: auto;
			color: var(--text_color_L1);
			padding: 30px;
			font-size: 24px;
			line-height: 60px;

			:deep(p) {
				margin-bottom: 15px;
				line-height: 40px;
			}
		}

		&-foot {
			height: 140px;
			display: flex;
			justify-content: center;
			align-items: center;

			&-btn {
				width: 60%;
				background: var(--main_gradient-color);
				border-radius: 40px;
				height: 70px;
				line-height: 70px;
				text-align: center;
				font-size: 28px;
				color: var(--text_color_L4);
			}
		}
	}
}

.bgcolor {
	pointer-events: all;
	color: var(--bg_color_L1);
}
</style>
