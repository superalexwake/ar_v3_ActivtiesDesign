<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n'
import { useReBenefit } from '@/hooks'
import reBenefitLocalImgUrl from '@/assets/icons/home/reBenefits_bg.png';
import reBenefitLocalImgUrl2 from '@/assets/icons/home/reBenefits_bg2.png';
// const { t } = useI18n()
const router = useRouter();
const { timeUnits, reBenefitObj } = useReBenefit()
const emit = defineEmits<{
	(e: 'close'): void
}>()

const dollarSign = computed(() => {
	return sessionStorage.getItem('dollarSign') || '';
});

//已经充值领取了奖励
const isHasReBenefit = computed(() => reBenefitObj.value?.isFinish || false);

const reBenefitBgUrl = computed(() => {
	const img = isHasReBenefit.value ? reBenefitLocalImgUrl2 : reBenefitLocalImgUrl;
	return `url('${img}')`;
});

const close = () => {
	emit('close')
}

const gotoRecharge = () => {
	close();
	//跳转到充值页面
	router.push('/wallet/Recharge');
};

</script>

<template>
	<div class="reBenefit-dialog">
		<div class="container">
			<div class="benefit-box">
				<div class="benefit-title">
					{{$t('reBenefits10')}}
					<br/>{{$t('reBenefits1')}}
				</div>
				<div class="isBenefit-subtitle  " v-if="isHasReBenefit">
					{{$t('reBenefits3')}}
					
				</div>
				<div class="benefit-subtitle" v-else>
					{{$t('reBenefits2')}}
				</div>
				<div class="isBenefit-bonus" v-if="isHasReBenefit">
					{{$t('reBenefits6')}}

				</div>
				<div class="bonus-box" v-else>
					<!-- <div class="limtend limtend1">{{$t('reBenefits10')}}</div>
					<div class="limtend limtend2">{{$t('reBenefits10')}}</div> -->
					<div class="bonus-details details1">
						<p class="bonus-percentage">{{reBenefitObj?.bonusAmountRate}}%</p>
						<p class="bonus-description">{{$t('reBenefits4')}}</p>
					</div>
					<div class="bonus-details details2">
						<p class="bonus-percentage">{{reBenefitObj?.bonusAmountLimit}}</p>
						<p class="bonus-description">{{$t('reBenefits5')}}</p>
					</div>
				</div>
				
				<div class="countdown-box">
					<p class="time-remaining">
						{{isHasReBenefit? $t('reBenefits8') : $t('reBenefits7')}}
					</p>
					<div class="bonus-amount" v-if="isHasReBenefit">
						{{dollarSign}}{{reBenefitObj?.rewardAmount || 0}}
					</div>
					<div class="time-box" v-else>
						<div class="time-item">
							<span>{{timeUnits.hours[0]}}</span>
							<span>{{timeUnits.hours[1]}}</span>
						</div>
						<span class="colon">:</span>
						<div class="time-item">
							<span>{{timeUnits.minutes[0]}}</span>
							<span>{{timeUnits.minutes[1]}}</span>
						</div>
						<span class="colon">:</span>
						<div class="time-item">
							<span>{{timeUnits.seconds[0]}}</span>
							<span>{{timeUnits.seconds[1]}}</span>
						</div>
					</div>
				</div>
				<div class="benefit-button-box" v-if="isHasReBenefit">
					<div class="button-benefit" @click="close">
						{{$t('iKonw')}}
					</div>
				</div>
				<div class="benefit-button-box" v-else>
					<div class="button-benefit" @click="gotoRecharge">
						{{$t('reBenefits9')}}
					</div>
				</div>

				<div class="position_click" v-if="!isHasReBenefit">
					<div class="click_area"></div>
			   </div>

			</div>

		</div>
		<button v-if="!isHasReBenefit" type="button" class="close" @click="close"></button>
	</div>
</template>

<style scoped lang="scss">
.reBenefit-dialog {
	position: relative;
	width: 632px;
	background: v-bind(reBenefitBgUrl) no-repeat;
	background-size: contain;
	overflow: visible;

	.container {
		width: 632px;
	}
	.benefit-box{
		color: #fff;
		padding-top: 240px;
		padding-left: 25px;
		padding-right: 25px;
		padding-bottom: 60px;
		position: relative;
	}

	.close {
		position: absolute;
		width: 60px;
		height: 60px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		left: 50%;
		transform: translateX(-50%);
		bottom: -100px;
		background: url('@/assets/icons/home/reBenefits_close.png');
		background-repeat: no-repeat;
		background-size: contain;
	}
}
.benefit-title{
	color: #333;
	text-align: center;
	font-family: Poppins;
	font-size: 40px;
	font-style: normal;
	font-weight: 600;
	line-height: 45px;
}
.isBenefit-subtitle{
	color: #333;
	text-align: center;
	font-family: Poppins;
	font-size: 28px;
	font-style: normal;
	line-height: 40px;
	padding:0 40px;
	margin-top: 10px;
}
.benefit-subtitle{
	color: #333;
	text-align: center;
	font-family: Poppins;
	font-size: 28px;
	font-style: normal;
	font-weight: 600;
	line-height: 28px; /* 100% */
	margin-top: 20px;
}
.isBenefit-bonus{
	color: #FF4067;
	font-family: Poppins;
	font-size: 28px;
	font-style: normal;
	line-height: 46px; /* 143.75% */
	height: 240px;
	display: flex;
	justify-content: center;
	padding: 50px 60px 0  60px;
}
.bonus-box{
	display: flex;
	justify-content: center;
	margin-top: 30px;
	position: relative;
	height: 250px;
	.limtend{
		position: absolute;
		top: 30px;
		width: 120px;
		height: 90px;
		text-align: center;
		font-family: Poppins;
		font-size: 22px;
		font-style: normal;
		font-weight: 500;
		line-height: 27px; /* 112.5% */
		text-transform: uppercase;
		display: flex;
		justify-content: center;
		align-items: center;
		&1{
			left: 75px;
			color: #FF5151;
		}
		&2{
			right: 70px;
			color: #515CFF;
		}
	}
	.details1{
		.bonus-percentage{
			color: #EB4343;
		}
		.bonus-description{
			color: #FF4067;
		}
	}
	.details2{
		margin-left: 30px;
	}
	.bonus-details{
		width: 250px;
		height: 220px;
		text-align: center;
		padding-top: 40px;
		.bonus-percentage{
			text-align: center;
			font-family: Poppins;
			font-size: 50px;
			font-style: normal;
			font-weight: 800;
			line-height: 50px; /* 100% */
			margin-bottom: 6px;
		}
		.bonus-description{
			text-align: center;
			font-family: Poppins;
			font-size: 26px;
			font-style: normal;
			font-weight: 400;
		}
	}
}
.countdown-box{
	.time-remaining{
		text-align: center;
		color: #FF5F5F;
		font-family: Poppins;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px; /* 100% */
		text-transform: uppercase;
	}
	.time-box{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		.time-item{
			display: flex;
			flex-direction: row;
			span{
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 5px;
				flex: 1;
				text-align: center;
				font-family: Poppins;
				font-size: 32px;
				font-style: normal;
				line-height: 52px;
				color: #fff;
				width: 52px;
				height: 66px;
				background: url('@/assets/icons/home/reBenefits_time.png') no-repeat center/cover;
			}
		}
		.colon{
			margin: 0 5px;
			font-family: Poppins;
			font-size: 50px;
			font-style: normal;
			font-weight: 700;
			color: #F75A5A;
		}
	}	
}
.benefit-button-box{
	display: flex;
	justify-content: center;
	margin-top: 30px;
}
.button-benefit{
	border-radius: 70px;
	border: 2px solid #FFF;
	background: linear-gradient(90deg, #FF47A6 0%, #C65EFF 51.92%, #A733FF 100%);
	box-shadow: 0 -6px 10px 0 #FF54E0 inset, 0 6px 8px 0 #FF94ED inset, 0 8px 14px 0 rgba(225, 107, 255, 0.41);
	width: 500px; 
	height: 72px;
	color: #FFF; 
	text-align: center;
	font-family: Poppins;
	font-size: 30px;
	font-style: normal;
	font-weight: 600;
	line-height: 68px; /* 100% */
	text-transform: uppercase;
	cursor: pointer;
	overflow: hidden;
}
.bonus-amount{
	color: #FF5F5F;
	font-family: Poppins;
	font-size: 44px;
	font-style: normal;
	font-weight: 600;
	line-height: 44px; /* 100% */
	text-transform: uppercase;
	text-align: center;
	margin-top: 30px;
}
.position_click{
	position: relative;
}
.click_area{
	position: absolute;
	width: 108px;
	height: 122px; 
	z-index: 2;
	right: 30px;
	bottom: -120px;
	background: url('@/assets/icons/home/reBenefits_click.png') no-repeat center/cover;
}
</style>
