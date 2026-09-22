<template>
	<div class="arCard"  v-if="pageType !== 'wallet/recharge'">
		<div class="left">
			<img src="@icon/wallet/withdrawType/21.png" />
			{{$t('arbTip3')}}
		</div>
		<!--<div class="right" @click="goActive(pageType)">{{$t('arbActive')}}</div>-->
		<div class="right" @click="goBind">{{$t('arbActive')}}</div>
	</div>
	<div class="features">
		<div class="title">
			<svg-icon name="arpay2" />
			{{$t('arbTip4')}}
		</div>
		<p>{{$t('arbTip5')}}</p>
		<p class="t1">{{$t('arbTip6')}}</p>
		<p class="t2" @click="onTradRule()">{{$t('arbTip7')}}<van-icon name="arrow" /></p>
		<p class="t3">{{$t('arbTip8')}}</p>
		<p v-html="$t('abbTip9',[projectName])"></p>
		<p v-html="$t('arbTip10',[projectName])"></p>
		<p>{{$t('arbTip11')}}</p>
		<p>{{$t('arbTip12')}}</p>
		<!--<div class="toActive" @click="goActive(pageType)">{{$t('arActive')}}</div>-->
		<div class="toActive" @click="goBind">{{$t('arActive')}}</div>
	</div>
	<!--激活绑定验证-->
	<ActiveVerifyDialog :isVisible="isPop" @onConfirm="confirm" @onCancel="isPop=false"/>
</template>
<script setup lang="ts">
import {ref,computed} from 'vue'
import { useArwallet } from '@/hooks'
import { SettingStore } from '@/stores'
import {ARBWalletActivate } from "@/api";
import ActiveVerifyDialog from '@/components/common/ActiveVerify.vue';
import {showFailToast, showLoadingToast} from "vant";
import {useI18n} from "vue-i18n";
const {t} = useI18n()

const { goActive,activeBind,onTradRule } = useArwallet()
const projectName = computed(() => SettingStore().getProjectName)
const isPop=ref(false)


const props = withDefaults(
	defineProps<{
		pageType: string
	}>(),
	{}
)

/*去激活验证*/
const goBind = async () => {
	showLoadingToast({
		message: t('loading') + '...',
		forbidClick: true
	})
	const query={returnUrl: 'https://' + window.location.host + '/#/main'}
	const res = await ARBWalletActivate(query)
	if(res?.code === 1) {
		if(res?.msgCode===1010){
			isPop.value = true
		}
		return showFailToast(res?.msg);
	}else if(res?.code === 0){
		const { walletActivationPageUrl, memberId, merchantCode, timestamp } = res?.data || {};
		window.location.href = walletActivationPageUrl +'&memberId=' +memberId +'&merchantCode=' +merchantCode +'&timestamp=' +timestamp
	}
}

/*确认*/
const confirm= (query:any)=>{
	console.log('进来数据',query)
	activeBind(query,props.pageType)
	isPop.value = false
}

</script>
<style lang="scss" scoped>
@import '@/assets/styles/withdraw';
.features {
	@include baseBox;
	padding: 20px;
	text-align: left;
	color: var(--text_color_L1);
	margin-bottom: 32px;
	.title {
		font-size: 32px;
		font-weight: 600;
		display: flex;
		gap: 20px;
		svg {
			width: 44px;
			height: 44px;
		}
	}
	> p {
		font-size: 28px;
		margin: 20px 0;
		line-height: 50px;
		:deep(span){
			font-size: 28px;
			font-weight: 500;
			margin: 0px 10px;
		}
	}
	.t1 {
		margin: 20px 0;
	}

	.t1,
	.t2 {
		font-size: 28px;
		font-weight: 500;
	}
	.t2 {
		color: var(--main_gradient-color);
	}
	.t3 {
		font-size: 32px;
		font-weight: 600;
		margin: 40px 0px 20px;
	}
	.toActive {
		background: var(--main-color);
		border-radius: 10px;
		color: var(--text_color_L4);
		padding: 20px 0;
		text-align: center;
		font-size: 28px;
		font-weight: 500;
	}
}
</style>
