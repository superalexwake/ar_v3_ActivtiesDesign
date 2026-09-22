<script setup lang="ts">
import {currency} from '@/utils'
import { useBonusPack } from '@/hooks'
defineProps({
	item:{
		type:Object,
	},
	state:{
		type:Number,
		default:0
	},
	time:{
		type:Boolean,
		default:true
	}
})
const {rewardTypeMap,rewardStateMap,mapParam}=useBonusPack()
const emit = defineEmits(['pack'])
const vaules=Object.keys(mapParam)

const showInfo = (item: any) => {
	const toPercent = (num: number) => `${Math.floor(num * 1000) / 10}%`
	if (item.recordType === 1) {
		if (typeof item.maxRewardableRate === 'number') {
			return `⬆${toPercent(item.maxRewardableRate)}`
		}
		if (typeof item.maxRewardableAmount === 'number') {
			return `⬆${currency(item.maxRewardableAmount)}`
		}
		return '???'
	}
	return item.amount ? currency(item.amount) : '???'
}

</script>

<template>
	<div class="bonus-item">
		<div class="bonus-item-left">
			<p class="bonus-item-amount">
				<svg xmlns="http://www.w3.org/2000/svg" width="35" height="36" viewBox="0 0 35 36" fill="none">
					<circle cx="17.1089" cy="18.8912" r="17.1089" fill="url(#paint0_linear_10062_22583)"/>
					<circle cx="17.1089" cy="17.1089" r="16.9096" fill="url(#paint1_linear_10062_22583)" stroke="url(#paint2_linear_10062_22583)" stroke-width="0.398523"/>
					<g filter="url(#filter0_i_10062_22583)">
						<circle cx="17.1021" cy="17.1088" r="14.6138" fill="url(#paint3_linear_10062_22583)"/>
					</g>
					<circle cx="17.1021" cy="17.1088" r="14.4146" stroke="url(#paint4_linear_10062_22583)" stroke-width="0.398523"/>
					<circle cx="17.111" cy="17.109" r="11.9195" fill="url(#paint5_linear_10062_22583)" stroke="url(#paint6_linear_10062_22583)" stroke-width="0.398523"/>
					<g filter="url(#filter1_i_10062_22583)">
						<path d="M16.1719 11.6004C16.4105 10.8661 17.4494 10.8661 17.688 11.6004L18.5515 14.2582C18.6582 14.5866 18.9643 14.809 19.3096 14.809H22.1041C22.8763 14.809 23.1973 15.797 22.5726 16.2509L20.3118 17.8935C20.0324 18.0964 19.9155 18.4562 20.0222 18.7846L20.8858 21.4424C21.1244 22.1767 20.2839 22.7873 19.6593 22.3335L17.3984 20.6909C17.1191 20.4879 16.7408 20.4879 16.4614 20.6909L14.2006 22.3335C13.5759 22.7873 12.7355 22.1767 12.9741 21.4424L13.8376 18.7846C13.9443 18.4562 13.8274 18.0964 13.5481 17.8935L11.2872 16.2509C10.6626 15.797 10.9836 14.809 11.7557 14.809H14.5503C14.8956 14.809 15.2016 14.5866 15.3083 14.2582L16.1719 11.6004Z" fill="url(#paint7_linear_10062_22583)"/>
					</g>
					<defs>
						<filter id="filter0_i_10062_22583" x="2.48828" y="2.495" width="29.2266" height="30.0247" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
							<feFlood flood-opacity="0" result="BackgroundImageFix"/>
							<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
							<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
							<feMorphology radius="1.59409" operator="erode" in="SourceAlpha" result="effect1_innerShadow_10062_22583"/>
							<feOffset dy="0.797045"/>
							<feGaussianBlur stdDeviation="0.797045"/>
							<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
							<feColorMatrix type="matrix" values="0 0 0 0 0.883333 0 0 0 0 0.526241 0 0 0 0 0 0 0 0 1 0"/>
							<feBlend mode="normal" in2="shape" result="effect1_innerShadow_10062_22583"/>
						</filter>
						<filter id="filter1_i_10062_22583" x="10.957" y="11.0497" width="11.9453" height="12.2367" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
							<feFlood flood-opacity="0" result="BackgroundImageFix"/>
							<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
							<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
							<feOffset dy="0.797045"/>
							<feGaussianBlur stdDeviation="0.797045"/>
							<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
							<feColorMatrix type="matrix" values="0 0 0 0 0.9125 0 0 0 0 0.38325 0 0 0 0 0 0 0 0 1 0"/>
							<feBlend mode="normal" in2="shape" result="effect1_innerShadow_10062_22583"/>
						</filter>
						<linearGradient id="paint0_linear_10062_22583" x1="5.52473" y1="34.7525" x2="29.5841" y2="34.7525" gradientUnits="userSpaceOnUse">
							<stop stop-color="#F88F03"/>
							<stop offset="0.537037" stop-color="#FFC225"/>
							<stop offset="1" stop-color="#F98F06"/>
						</linearGradient>
						<linearGradient id="paint1_linear_10062_22583" x1="17.1089" y1="0" x2="17.1089" y2="34.2177" gradientUnits="userSpaceOnUse">
							<stop stop-color="#FFEB5D"/>
							<stop offset="1" stop-color="#FCD74C"/>
						</linearGradient>
						<linearGradient id="paint2_linear_10062_22583" x1="17.1089" y1="0" x2="17.1089" y2="34.2177" gradientUnits="userSpaceOnUse">
							<stop stop-color="#FFF499"/>
							<stop offset="1" stop-color="#FFEA60"/>
						</linearGradient>
						<linearGradient id="paint3_linear_10062_22583" x1="17.1021" y1="2.49499" x2="17.1021" y2="31.7226" gradientUnits="userSpaceOnUse">
							<stop stop-color="#FFA71D"/>
							<stop offset="1" stop-color="#F88D04"/>
						</linearGradient>
						<linearGradient id="paint4_linear_10062_22583" x1="17.1021" y1="2.49499" x2="17.1021" y2="31.7226" gradientUnits="userSpaceOnUse">
							<stop stop-color="#FFF499"/>
							<stop offset="1" stop-color="#FFEA60"/>
						</linearGradient>
						<linearGradient id="paint5_linear_10062_22583" x1="17.111" y1="4.99023" x2="17.111" y2="29.2278" gradientUnits="userSpaceOnUse">
							<stop stop-color="#FFF18E"/>
							<stop offset="1" stop-color="#FCD751"/>
						</linearGradient>
						<linearGradient id="paint6_linear_10062_22583" x1="17.111" y1="4.99023" x2="17.111" y2="29.2278" gradientUnits="userSpaceOnUse">
							<stop stop-color="#FFF499"/>
							<stop offset="1" stop-color="#FFEA60"/>
						</linearGradient>
						<linearGradient id="paint7_linear_10062_22583" x1="16.9299" y1="9.26746" x2="16.9299" y2="25.307" gradientUnits="userSpaceOnUse">
							<stop stop-color="#F89300"/>
							<stop offset="1" stop-color="#F88906"/>
						</linearGradient>
					</defs>
				</svg>
				<!--<span>{{item.amount?currency(item.amount):'???'}}</span>-->
				<span>{{showInfo(item)}}</span>
			</p>
			<p>{{rewardTypeMap[item.rewardType]?.label}}</p>
			<p v-if="time">{{item.createTime}}</p>
		</div>
		<template v-if="!time.isReceiveButtonHidden">
			<div class="bonus-item-right" :class="{receiveIng:item.loading}" v-if="state===0" @click="emit('pack',item)">
				<!--{{item.loading?$t('receiveIng'):vaules.includes(item.rewardType+'')?$t('checkOver'):$t('receive')}}-->
				<span v-if="item.loading">{{$t('receiveIng')}}</span>
				<span v-else-if="[20,118,107,30,29,103].includes(item.rewardType)">
					{{ item.recordType===1 && item.amount === 0 ? $t('checkOver') : $t('receive') }}
				</span>
				<span v-else>
					{{ vaules.includes(String(item.rewardType)) ? $t('checkOver') : $t('receive') }}
				</span>
			</div>
			<div class="bonus-item-right disable" v-else>
				{{rewardStateMap[state]?.label}}
			</div>
		</template>
	</div>
</template>

<style scoped lang="scss">
.bonus-item{
	display: flex;
	padding: 20px;
	align-items: center;
	justify-content: space-between;
	border-radius: 16px;
	background: var(--bg_color_L2);
	&:not(:last-child){
		margin-bottom: 10px;
	}
	p{
		margin-bottom: 12px;
		color: var(--text_color_L1, #333);
		font-family: "PingFang SC";
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	&-amount{

		display: flex;
		align-items: center;
		svg{
			width: 36px;
			height: 36px;
			margin-right: 16px;
		}
		span{
			color: var(--norm_secondary-color, #FEAA57);
			font-family: "PingFang SC";
			font-size: 30px;
			font-style: normal;
			font-weight: 600;
			line-height: 40px;

		}
	}
	&-right{
		display: flex;
		min-width: 120px;
		height: 60px;
		padding: 10px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		border-radius: 50px;
		background: var(--main-color);
		color: #fff;
		&.disable{
			background: var(--button_dis_color);
		}
		&.receiveIng{
			opacity: .8;
		}
	}
}
</style>
