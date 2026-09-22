<template>
    <div class="x-appeal">
		<NavBar :title="t('arupiBank')"  :placeholder="false" left-arrow @click-left="toBack" >
			<template #right>
				<div class="sever x-row x-row-between x-row-middle-center" @click="handleOpen">

					{{ $t('customerService') }}
				</div>
			</template>
		</NavBar>
        <div class="x-appeal-box" v-if="pageData.pageId == 1&&!existAppealUtr">
            <div class="appealTip">
                <div class="title">{{ $t('arupiBank') }}</div>
                <p>1 {{$t('platformArrival')}};</p>
                <p>2 {{$t('followingWallets')}};</p>
                <p>3 {{$t('throughOTP')}};</p>
            </div>
            <!-- 申诉中且还在连接状态 -->
            <div class="x-tc pt60" v-if="isLink">
                <h2 class="mb5"> {{$t('orderAppealed')}}</h2>
                <h2>{{$t('orderWait')}}</h2>
            </div>
            <!-- 如果没有申诉过或者断联 -->
            <div v-else>
                <h1 class="sub">{{ $t('xg88') }}</h1>
                <!-- <p class="text">{{ $t('xg89') }}</p> -->
                <van-skeleton title :row="8" :loading="!pageData.bankList.length">
                    <BankList :list="pageData.bankList" @on-select="onSelect" />
                </van-skeleton>
            </div>

            <!-- <div class="x-appeal-box-btn">
                <div @click="goAppeal">{{ $t('xg90') }}</div>
            </div> -->
        </div>
        <div class="x-appeal-box" v-else-if="pageData.pageId !==1&&!existAppealUtr">
            <StatusStep  type="kyc" :active="pageData.msg" :releaseOrderFlag="false"> </StatusStep>
            <h3 class="tit mb4">{{$t('welcomAuthorize')}} {{ fromData.bankName}}</h3>
            <p class="txt mb24">{{$t('enjoyWork')}}<br />
                1.{{$t('enterYournumber',[fromData.bankName])}};<br/>
                2.{{$t('nextTip')}}.</p>
                <div class="item mb16">
                <h1 class="mb5"><span style="color:#EE4D4D;">*</span> UTR(UPI Ref.ID) </h1>
                <input type="text" v-model.trim="fromData.utrVal" :placeholder="$t('enterUtr')" :maxlength="12"   />
            </div>
            <div class="item mb16">
                <h1 class="mb5"><span style="color:#EE4D4D;">*</span> {{ $t('phoneNumber') }} </h1>
                <input type="text" v-model.trim="fromData.mobileNumber" :readonly="pageData.bankList.length>0?false:true" :placeholder="$t('pphone')" :maxlength="10" oninput="value=value.replace(/[^\d]/g,'')"  />
            </div>
			<div class="item mb16" v-if="fromData.bankCode==='airtel'">
				<h1 class="mb5"><span style="color:#EE4D4D;">*</span> UPI ID </h1>
				<input type="text" v-model.trim="fromData.upiId"  :placeholder="$t('phEnterUPIID')" :maxlength="30"   />
			</div>
			<div class="item mb16" v-if="fromData.bankCode==='airtel'">
				<h1 class="mb5"><span style="color:#EE4D4D;">*</span> {{$t('withdrawQrcode')}}</h1>
				<van-uploader  :after-read="afterRead"  :max-count="1" :max-size="5000 * 1024"
							  @oversize="() => showToast($t('sellTip14'))" accept="image/*"  :name="1">
					<div class="uploadImg x-row x-column x-row-middle-center">
						<van-image width="80" height="80" fit="cover" :src="updateImg" />
						{{ $t('uploadImage') }}
					</div>
				</van-uploader>
			</div>
            <smg class="mt16" v-if="pageData.msg!=0" :isShowVerifyT="false" :token="token" v-model:code="fromData.verificationCode" :type="2" :way="fromData.mobileNumber" :api-fun="KycSendMsg" ref="smgFun" :isTitle="true" :times="60" :bank-code="fromData.bankCode"></smg>
            <!-- <p class="mb5">* {{ $t('sellTip61') }}</p>
            <p>* {{ $t('sellTip62') }}</p> -->
            <div class="x-row x-row-between x-row-middle fooder">
                <div class="cmdBth step mt32 flex1" @click="toBack">{{$t('previousStep')}}</div>
                <div class="cmdBth active mt32 flex3" @click="onRegister"> {{ pageData.msg ==0 ? $t('nextStep'):t('xg91') }}</div>
            </div>
            <!-- <div class="cmdBth active mt32" @click="onRegister"> {{ pageData.msg ==0 ? $t('nextStep'):t('xg91') }}</div> -->
        </div>
		<div class="x-tc pt60 existAppeal" v-if="existAppealUtr">
			<h2 class="mb5"> {{$t('orderAppeal')}}</h2>
			<h2>{{$t('orderWait')}}</h2>
		</div>
		<VsTips @close="existAppealUtr=false" v-model:show="show" :auto="true" content-class="arupiAppealTip" :btnText="$t('resubmit')">
			<div>
				<h1>{{$t('tips')}}</h1>
				<p >{{$t('arupiAppealTip')}}</p>
			</div>
		</VsTips>
    </div>
</template>
<script lang="ts" setup>
import VsTips from "@/components/ArUPI/vsImgVideo.vue";
import BankList from '@/components/ArUPI/BankList.vue'
import smg from "@/components/ArUPI/SendMsg.vue";
import StatusStep from "@/components/ArUPI/statusStep.vue";
import { onMounted, reactive, ref, watch } from 'vue';
import { showFailToast, showSuccessToast, showToast } from 'vant'
import { useRouter} from "vue-router";
import { KycSendMsg, GetAppealKycBankList, KycVerifyV2 ,RechargeAppealExist } from "@/api";
import { useI18n } from 'vue-i18n'
import { useThrottleFn } from '@vueuse/core';
import {useCustomService, useRututnUrl} from "@/hooks";
import { BrowserQRCodeReader } from '@zxing/browser';

const codeReader = new BrowserQRCodeReader();
const { goMerchant } = useRututnUrl()
const {  handleOpen } = useCustomService({type: 3})
const { t } = useI18n()
const router = useRouter();
const {token  } = router.currentRoute.value.query;

const useNavber = reactive({
    title:t('buyAppeal')||'',
    pageIndex:1,
})
const show=ref(false)
const pageData = reactive<{
    bankList:any[],
    pageId:number
    msg:number
}>({
    bankList:[],
    pageId:1,
    msg:0,
})
const updateImg=ref('')
const fromData = reactive({
    upiName: '',
    upiId: '',
    verificationCode: '',
    bankCardNumber: '',
    bankCardOwner: '',
    bankCode: '',
    bankName: '',
    email: '',
    ifscCode: '',
    mobileNumber:'',
    type: 3,
    utrVal:'',
})

const isLink = ref(false);
const existAppealUtr=ref(false)
const afterRead=async (file: any,detail:any)=>{
	updateImg.value = file.content;
}
  //kyc银行列表
const getKycBankList = async() =>{
  //  load.show();
    const res = await GetAppealKycBankList({token, source:2});
    if(res.code === '1'){
        pageData.bankList = res.data;
    }else{
        showFailToast(res.msg);
    }
}
onMounted(() => {
    getKycBankList();
    getDetail();
})
const setTitle = (name:string) =>{
    useNavber.title = name;
}
const setPageIndex= (index:number) =>{
    useNavber.pageIndex = index;
}
const smgFun =ref()
const onSelect = (item:any,index:number) =>{
    const { bankName , bankCode} = item;
    fromData.bankName = bankName;
    fromData.bankCode = bankCode;
    fromData.verificationCode = '';
    // smgFun.value.clearKycMsg(); //清空发送短信成功返回的信息
    pageData.pageId = 2;
    setPageIndex(2)
}

const extractPa = (url:string) => {
	console.log(url, 'url');
	const match = url.match(/=([^&@]+@airtel)/);
	return match ? match[1] : null
}
const onRegister = useThrottleFn(async() =>{
    const { mobileNumber,bankCode , verificationCode ,utrVal,upiId } = fromData;
    if(!bankCode) return showFailToast(t('pSelectKyc'));
	if(!utrVal || utrVal.length < 12||!/^\d+$/.test(utrVal))  return showFailToast(t('formatIncorrect'));
    // if(fileListImg.value.length  < 1) return showFailToast(t('sellTip15'))
    if(!mobileNumber) return showFailToast(t('pphone'));
    if(pageData.msg == 0&&mobileNumber.length < 8) return showFailToast(t('xg19'));
	if (fromData.bankCode==='airtel'){
		if (!upiId) return showFailToast(t('phEnterUPIID'));
		if (!updateImg.value) return showFailToast(t('withdrawQrcodeTips'));
		try {
			const el=document.querySelector('.uploadImg img');
			const resultImage = await codeReader.decodeFromImageElement(el);

			if (upiId!==extractPa(resultImage.text)) {
				return showFailToast(t('upiUploadImg'));
			}

		}catch (e){
			console.error(e,updateImg.value);
			return  showFailToast(t('upiUploadImg'))
		}
	}
	if(pageData.msg == 0){
		return pageData.msg = 1;
	}
    if(!verificationCode) return showFailToast(t('pcode'));
    onSubmit();
},500)


const onSubmit = async() =>{
    const { mobileNumber,bankCode , verificationCode ,utrVal,upiId} = fromData;

    const res = await KycVerifyV2({
		bankCode,
		otp:verificationCode,
		phoneNumber:mobileNumber as string,
		token,type:1,
		response:smgFun.value.kycMsg,
		utr:utrVal,
		upiId
	});
    if(res.code === '1'){
        showSuccessToast(t('xg22'))
        setTimeout(()=>{
            goMerchant()
        },1500)
    }else{
        showFailToast(res.msg);
    }
}

// 查询是否提交过申诉
const getDetail = async() =>{
    const res = await RechargeAppealExist({token});
    if(res.code === '1'){
        const { isLink:link,orderStatus,existAppeal,isAutoFlag=true,url} = res.data;
        isLink.value = link;
		fromData.utrVal = url;
		if (!link&&existAppeal&&isAutoFlag){
			show.value = true;
		}
		if (existAppeal&&!show.value){
			existAppealUtr.value = true;
		}
		if (orderStatus==10&&!link){
			goMerchant()
		}
    }else{
        showFailToast(res.msg);
        setTimeout(()=>{
            goMerchant()
        },1500)
    }
}



watch(()=>[useNavber.pageIndex],()=>{
    pageData.pageId = useNavber.pageIndex
    pageData.msg = 0;
    fromData.verificationCode = '';
    fromData.mobileNumber = '';
    setTitle(useNavber.pageIndex===1?t('buyAppeal'):t('xg91'))
});


function toBack() {
	router.push({
		name:'Recharge'
	})
}
</script>
<style lang="scss" scoped>
:deep(.van-skeleton){
    width: 100%;
    padding: 0;
}
.x-appeal {
    padding: 40px 32px 160px;
	.existAppeal{
		h2{
			font-size: 32px;
			color: var(--text_color_L1);
		}
	}
	.sever{
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		border-radius: 32px;
		padding: 10px 8px;
		font-size: 24px;
		gap: 8px;
	}
	.uploadImg {
		// @include box;
		// @include fcCC;
		margin-top: 0;
		color: var(--text_color_L2);
		width: 200px;
		height: 200px;
		border-radius: 16px;
		border: 2px solid var(--bg_color_L3);
		background: var(--bg_color_L3);
		font-size: 24px;

	}
    &-box{
        .appealTip {
            border: 2px solid var(--main-color);
            background: #FFF9E5;
            border-radius: 16px;
            padding: 24px;
            color: var(--main-color);
            margin-bottom: 30px;
            .title {
                font-size: 32px;
                font-weight: 500;
                margin-bottom: 10px;
                letter-spacing: -0.64px;
            }
            p{
                line-height:40px;
            }
        }
        &-btn{
            border-top: 2px solid #E6E7EB;
            &>div{
                height: 96px;
                line-height: 96px;
                text-align: center;
                border-radius: 16px;
                border: 2px solid #E6E7EB;
                background: #F5F6FA;
                color: #1F262F;
                font-size:28px;
                font-weight: 500;
            }
        }
        .sub{
            font-weight: 600;
            font-size:32px;
            letter-spacing: -0.64px;
			color: var(--text_color_L1);
        }
		.sub-enter{
			border-radius: 16px;
			margin-bottom: 32px;
			height:140px;
			font-weight: 600;
			font-size:32px;
			color: var(--text_color_L2);
			background: var(--bg_color_L3);
			border: 2px solid var(--main-color);
			text-align: center;
			line-height: 140px;
		}
        .text{
            color: #F63E3E;
            font-size:28px;
            margin-bottom:24px;
        }

        .tit{
            font-size: 40px;
			color: var(--text_color_L1);
            font-weight: 600;
        }
        .txt{
			color: var(--text_color_L1);
            font-size: 28px;
            font-weight: 400;
            line-height: 150%;
        }
        .item{
            h1{
                font-size: 30px;
                font-weight: 400;
				color: var(--text_color_L1);
            }
            &.upiId{
                position: relative;
                .bankSuffix{
                    position: absolute;
                    border-radius: 16px;
					background: var(--bg_color_L3);
                    width: 100%;
                    li{
                        padding: 24px;
                        font-size: 32px;
						color: var(--text_color_L1);
                        font-weight: 500;
                    }
                }
            }
            label{
                display: block;
                margin-bottom: 10px;
                font-size: 32px;
            }
            input{
				width: 100%;
				background: var(--bg_color_L3);
				color: var(--text_color_L1);
				border:none;
				border-radius: 16px;
                height: 92px;
                font-size: 32px;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.64px;
                padding: 0 40px;
                &::placeholder{
					color: var(--text_color_L2);
                }
                &::-webkit-input-placeholder {
					color: var(--text_color_L2);
                }

                &:-moz-placeholder {
					color: var(--text_color_L2);
                    opacity: 1;
                }

                &::-ms-input-placeholder {
					color: var(--text_color_L2);
                }
                &:-ms-input-placeholder {
					color: var(--text_color_L2);
                }

            }
        }
        p{
            line-height: 40px;
        }
		h2{
			color: var(--text_color_L1);
		}
    }
    .fooder{
        gap:16px;
    }
    .cmdBth {
		background: var(--button_dis_color);
		color: var(--text_color_L2);
        text-align: center;
        padding: 26px 0;
        border-radius: 16px;
        height: 96px;
		font-size: 28px;
        &.active {
            background: var(--main_gradient-color);
            color: var(--text_color_L4);
        }
        &.step{
			color: var(--text_color_L1);
        }
        &.flex1{
            flex: 1.5;
        }
        &.flex3{
            flex: 3;
        }
    }
	:deep(.van-cell-group--inset) {
		margin: 30px 0;
		box-shadow: 0px 8px 32px rgba(208, 208, 237, 0.26);
	}

}
:deep(.arupiAppealTip){
	h1{
		text-align: center;
		margin-bottom: 16px;
		font-size: 32px;
		color: var(--text_color_L1);
		font-weight: 600;
	}
	p{
		text-align: center;
		font-size: 28px;
		color: var(--text_color_L2);
		margin-bottom: 48px;
	}
	.cmdB{
		width: 400px;
		margin: 0 auto;
	}
}
</style>