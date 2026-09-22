<script lang="ts" setup>
import {showSuccessToast} from 'vant'
import {useClipboard} from '@vueuse/core'
import {currency} from '@/utils'
import {useAgent} from "@/hooks";
import {onMounted} from "vue";
import {useI18n} from "vue-i18n";
import router from '@/router';
// const router=useRouter()
const {getInfo,goInvitation,amount,
	totalAmount,
	invitationCode,
	invitationLink,
	effectiveQuantity,
	numberOfInvitations,
	days,
	firstItem,
	secondItem,
	thirdItem,
	getUrl,
	allItem}=useAgent()
const { copy } = useClipboard({
	legacy:true
})
const {t,locale}=useI18n()
function goBack() {
	router.go(-1)
}
const onCopy=async (code:string)=>{
  await copy(code);
	showSuccessToast(t('copySuccess'))
}
onMounted(()=>{
	getInfo()
	getUrl()
})
</script>

<template>
  <div class="partner">
	  <NavBar
		  :title="$t('TeamPartner')"
		  left-arrow
		  @click-left="goBack"
	  />
	  <div class="partner-banner">
		  <h2>{{$t('invitationFrind')}}</h2>
		  <p>{{currency(amount)}}</p>
	  </div>
	  <div class="partner-main">
		  <div class="partner-item">
			  <span>{{$t('invitationCount')}}</span>
			  <span class="number">{{numberOfInvitations}}</span>
		  </div>
		  <div class="partner-item">
			  <span>{{$t('invitationEffective')}}</span>
			  <span class="count">{{effectiveQuantity}}</span>
		  </div>
		  <div class="partner-item">
			  <span>{{$t('invitationTotalBonus')}}</span>
			  <span class="money">{{currency(totalAmount)}}</span>
		  </div>
		  <div class="partner-entry" >
			  <div @click="goInvitation">
				  {{$t('inviteRecord')}}
				  <svg fill="none" height="36" viewBox="0 0 37 36" width="37" xmlns="http://www.w3.org/2000/svg">
					  <path clip-rule="evenodd" d="M11.3008 26.5V24.3644L19.0121 17.5665L11.3008 10.6356V8.5L20.1579 16.4653L21.3008 17.5665L20.1579 18.6677L11.3008 26.5Z" fill="#666666" fill-rule="evenodd"/>
					  <path clip-rule="evenodd" d="M17.5 26.5V24.3644L25.2113 17.5665L17.5 10.6356V8.5L26.3571 16.4653L27.5 17.5665L26.3571 18.6677L17.5 26.5Z" fill="#666666" fill-rule="evenodd"/>
				  </svg>
			  </div>
		  </div>
		  <div class="partner-title">
			  {{$t('invitationLink')}}
		  </div>
		  <div class="partner-code">
			  <span>{{invitationLink}}</span>
			  <span @click="onCopy(invitationLink)">
				<svg-icon name="copy" />
			  </span>
		  </div>
		  <!-- <div class="partner-title">
			  {{$t('invitationCode')}}
		  </div>
		  <div class="partner-code">
			  <span>{{invitationCode}}</span>
			  <span @click="onCopy(invitationCode)">
				<svg-icon name="copy" />
			  </span>
		  </div> -->
		  <div class="partner-rule">
			  <div class="partner-rule-title">
				  <svg-icon name="shuoming" class="img" />
				  <span>{{$t('invitationRules')}}</span>
			  </div>
			  <div v-if="locale=='zh' || locale=='my'" class="tip" v-html="$t('partnerTip',[days])"></div>
			  <div v-else class="tip">{{ $t('partnerTip')}} <span>{{ days }}</span> {{ $t('days') }}</div>
			  <div class="partner-rule-table">
				<div class="head">
					<div>{{ $t('partner1') }}</div>
					<div class="bouns">{{ $t('partner2') }}</div>
				</div>
				<div v-if="firstItem.length" class="item">
					<div class="left">{{$t('deposit1')}}</div>
					<div class="right">
						<div v-for="(item,index) in firstItem" :key="index" class="line">
							<div>
								<span v-if="index+1 < firstItem.length"><span>{{ currency(item.rechargeAmount,'',0) }}</span> ≤ {{ $t('paymentAmount') }}&lt;<span>{{ currency(firstItem[index+1].rechargeAmount,'',0) }}</span></span>
								<span v-else>{{ $t('paymentAmount') }} ≥ <span>{{ currency(item.rechargeAmount,'',0) }}</span></span>
								<span v-if="Number(item.betAmount) >= 0">{{ $t('partner3') }} ≥ <span>{{ currency(item.betAmount,'',0) }}</span></span>
							</div>
							<div>{{ currency(item.rewardAmount,'',0) }}</div>
						</div>
					</div>
				</div>
				<div v-if="secondItem.length" class="item">
					<div class="left">{{ $t('deposit2') }}</div>
					<div class="right">
						<div v-for="(item,index) in secondItem" :key="index" class="line">
							<div>
								<span v-if="index+1 < secondItem.length"><span>{{ currency(item.rechargeAmount,'',0) }}</span> ≤ {{ $t('paymentAmount') }}&lt;<span>{{ currency(secondItem[index+1].rechargeAmount,'',0) }}</span></span>
								<span v-else>{{ $t('paymentAmount') }} ≥ <span>{{ currency(item.rechargeAmount,'',0) }}</span></span>
								<span v-if="Number(item.betAmount) >= 0">{{ $t('partner3') }} ≥ <span>{{ currency(item.betAmount,'',0) }}</span></span>
							</div>
							<div>{{ currency(item.rewardAmount,'',0) }}</div>
						</div>
					</div>
				</div>
				<div v-if="thirdItem.length" class="item">
					<div class="left">{{ $t('deposit3') }}</div>
					<div class="right">
						<div v-for="(item,index) in thirdItem" :key="index" class="line">
							<div>
								<span v-if="index+1 < thirdItem.length"><span>{{ currency(item.rechargeAmount,'',0) }}</span> ≤ {{ $t('paymentAmount') }}&lt;<span>{{ currency(thirdItem[index+1].rechargeAmount,'',0) }}</span></span>
								<span v-else>{{ $t('paymentAmount') }} ≥ <span>{{ currency(item.rechargeAmount,'',0) }}</span></span>
								<span v-if="Number(item.betAmount) >= 0">{{ $t('partner3') }} ≥ <span>{{ currency(item.betAmount,'',0) }}</span></span>
							</div>
							<div>{{ currency(item.rewardAmount,'',0) }}</div>
						</div>
					</div>
				</div>
			  </div>
			  <div class="redTip">{{ $t('partnerTip1') }}</div>
			  <div class="partner-rule-text">
				  <p v-html="$t('partnerRule',[$t('deposit'+(allItem[0]?.type || 1)),currency(allItem ? allItem[0]?.rechargeAmount - 1 : 0),currency(allItem ? allItem[0]?.betAmount : 0)])"/>
				  <p>{{$t('partnerRule2')}}</p>
				  <p>{{$t('partnerRule3')}}</p>
			  </div>
		  </div>
	  </div>
  </div>
</template>

<style lang="scss" scoped>
.partner{
	&-banner{
      	min-height: 226px;
	    margin-bottom: 30px;
		position: relative;
		padding-left: 450px;
		padding-top: 40px;
		padding-bottom: 10px;
		background: url('@/assets/icons/promotion/teamPartnerBg.png');
		background-size: cover;
		&-box{
			left: 0;
			top: 0;
			width: 296px !important;
		}
		img{
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
		}
		h2{
			color: #1E2637;
			font-family: Inter;
			font-size: 26px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
		p{
			min-width: 241px;
			max-width: 80%;
			height: 50px;
			flex-shrink: 0;
			border-radius: 60px;
			background: #FEAA57;
			color: #fff;
			font-size: 34px;
			margin-top: 20px;
			line-height: 50px;
			text-align: center;
			position: relative;
			z-index: 2;
		}
	}
	&-main{
		padding: 0 24px;
	}
	&-item{
		height: 88px;
		border-radius: 20px;
		background: var(--bg_color_L2);
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15px;
		font-size: 28px;
		padding:20px 20px;
		span{
			color: var(--text_color_L2);
			&.number{
				color: var(--text_color_L1);
			}
			&.count{
				color:var(--norm_green-color);
			}
			&.money{
				color: var(--norm_red-color);
				font-size: 34px;
				font-weight: bolder;
			}
		}
	}
	&-entry{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		color: var(--text_color_L1);
		padding: 30px;
		div{
			display: flex;
			align-items: center;
		}
		svg{
			width: 36px;
			height: 36px;
		}
	}
	&-title{
         color:var(--text_color_L1);
		display: flex;
		align-items: center;
		font-size: 32px;
		font-weight: 700;
		line-height: 40px;
		text-align: left;
		margin-bottom: 15px;
		height:40px;
		&:before{
			content: '';
			display: inline-block;
			width: 6px;
			height: 30px;
			background: var(--main-color);
			margin-right: 10px;
		}
	}
	&-link{
		height: 88px;
		background: var(--main_gradient-color);
		border-radius: 50px;
		line-height: 40px;
		padding: 0 20px;
		margin-bottom: 40px;
		font-size: 28px;
		color:var(--text_color_L1);
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&-code{
		height: 88px;
		background: var(--bg_color_L2);
		border-radius: 50px;
		line-height: 88px;
		padding: 0 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		margin-bottom: 40px;
		color: var(--text_color_L1);
		font-size: 28px;
		&:after{
			display: block;
			content: "";
			width: 0;
			height: 0;
			border-left: 44px solid var(--bg_color_L2);
			border-bottom: 88px solid transparent;
			border-top: 0px solid transparent;
			position: absolute;
			right:164px;
			top: -1px;
		}
		&:before{
			content: '';
			position: absolute;
			width: 205px;
			height: 88px;
			right: 0;
			background: var(--main-color);
			border-radius: 0  50px 50px 0;
			z-index: 0;
		}
		span {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			flex: 1;
			&:first-of-type {
				flex: none;
				display: block;
				width: 440px;
			}
			&:last-child{
				position: relative;
				z-index: 1;
				display: inline-block;
				padding: 0 10px;
				flex: none;
			}
		}
		svg{
			color: var(--text_color_L4);
			width: 48px;
			height: 48px;
			vertical-align: middle;
		}
	}
	&-btn{
		height: 70px;
		border-radius: 50px;
		text-align: center;
		line-height: 70px;
		font-size: 32px;
		color: var(--textW);
		background: var(--main_gradient-color);
		margin-bottom: 70px;

	}
	&-rule{
		background: var(--bg_color_L2);
		border-radius: 10px;
		padding: 20px;
		&-title{
			color:var(--text_color_L1);		
			display: flex;
			align-items: center;
			font-size: 32px;
			font-weight: 700;
			line-height: 40px;
			text-align: left;
			margin-bottom: 15px;
			height:40px;
			.img{
				width: 48px;
				height: 48px;
			}
		}
		&-text{
			//border: 1px solid var(--Dividing-line_color);
			border-radius: 10px;
			padding: 30px;
		}
		&-table {
			border-radius: 16px;
			overflow: hidden;
			border: 1px solid var(--bg_color_L3);
			.head {
				background: var(--sheet_nva_color);
				color: #fff;
				display: flex;
				align-items: center;
				line-height: 28px;
				height: 60px;
				text-align: center;
				font-size: 28px;
				font-weight: 500;
				&>div {
					width: 450px;
					&.bouns {
						width: 210px;
						position: relative;
						&::before{
							content: '';
							height: 34px;
							position: absolute;
							left: 0;
							top: 50%;
							transform: translateY(-50%);
							border-left: 1px solid var(--Dividing-line_color);
						}
					}
				}
			}
			.item {
				display: flex;
				height: fit-content;
				.left {
					color: var(--text_color_L1);
					border-right: 1px solid var(--bg_color_L3);
					width: 100px;
					display: flex;
					align-items: center;
					justify-content: center;
					text-align: center;
				}
				.right {
					width: 560px;
					height: fit-content;
					.line {
						min-height: 88px;
						font-size: 24px;
						display: flex;
						&:nth-child(even) {
							background: var(--bg_color_L3);
						}
						&>div {
							padding: 10px 0;
							&:first-of-type {
								width: 349px;
								display: flex;
								align-items: center;
								justify-content: center;
								color: var(--text_color_L2);
								flex-direction: column;
							}
							&:last-of-type {
								width: 210px;
								display: flex;
								align-items: center;
								justify-content: center;
								border-left: 1px solid var(--bg_color_L3);
								color: var(--norm_red-color);
							}
						}
					}
				}
				&+.item {
					border-top: 1px solid var(--bg_color_L3);
				}
			}
		}
		p{
			color: var(--text_color_L2);
			font-size: 26px;
			line-height: 34px;
			margin-bottom: 30px;
			padding-left: 26px;
			position: relative;
			&::before {
				content: '';
				display: block;
				position: absolute;
				left: 0;
				top: 10px;
				height: 12px;
				width: 12px;
				flex: none;
				border-radius: 2px;
				background: var(--main-color);
				transform: rotate(45deg);
			}
		}
		.tip{
			color: var(--text_color_L1);
			font-size: 28px;
			min-height: 40px;
			line-height: 40px;
			margin-top: 26px;
			margin-bottom: 16px;
			:deep(span) {
				color: var(--norm_red-color);
			}
		}
		.redTip {
			font-size: 24px;
			min-height: 40px;
			line-height: 40px;
			color: var(--norm_red-color);
			font-weight: 600;
			margin-top: 14px;
			margin-bottom: 24px;
		}
	}
}
</style>