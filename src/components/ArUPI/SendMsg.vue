<template>
    <div class="x-send">
        <label class="x-send-lab" v-if="isTitle"><span style="color:#EE4D4D;">*</span> {{$t('VerificationCode')}}</label>
        <div class="x-send-box">
            <input class="x-input input" v-model="code" type="text" :placeholder="$t(placeholderTip)" maxlength="6" oninput="value=value.replace(/\D/g,'')" />
            <div :class="timer === 0?'btn action':'btn'" @click="sendCode">{{timer === 0? $t(btnTxt): `${timer}S`}}</div>
        </div>
        <p class="x-send-tip" v-if="isShowVerifyT" @click="handleCustom">{{ $t('sellTip70') }}<span>{{ $t('customerService') }}</span></p>
    </div>
</template>
<script lang="ts" setup>

import { useIntervalFn, useThrottleFn, useVModel } from '@vueuse/core'
import { showFailToast , showSuccessToast,showLoadingToast } from 'vant';
import { ref,onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { useCustomService } from "@/hooks";
const { t } = useI18n()
const { onReady } = useCustomService({type:3});
// 控制发送验证码的倒计时效果
const props = withDefaults(
	defineProps<{
        times:number, //倒计时时间
        apiFun:Function
		code?: string //
		isShowVerifyT?: boolean //判断从更换手机号页面进入的时候，要不要显示验证码上方的标题
		placeholderTip?: string|undefined
		way: string|undefined //手机号 ||邮箱
		type?: number //0手机 1邮箱 2kyc
        isTitle?:boolean
        btnTxt?:string
        bankCode?:string //只有在kyc有
        token?:any
	}>(),
	{
        times:60,
        isShowVerifyT:true,
		placeholderTip: 'pcode',
        isTitle:false,
        btnTxt:'send'
	}
)
const emit = defineEmits(['update:code'])

const code = useVModel(props, 'code', emit)
const timer=ref(0)
const kycMsg = ref('')
const { pause, resume } = useIntervalFn(()=>{
    // 每次定时任务 控制时间递减
    if(timer.value<=0){
        // 停止递减：停止定时器
        pause()
    }else{
        timer.value-=1
    }
},1000,{
    // 首次是否自动启动定时任务：true（默认值，自动启动），false，不需要自动启动
    immediate: false,
    // 是否延时执行定时任务（false(默认值)，不延时；true表示延时）
    immediateCallback: false
})
// 发送验证码
const sendCode = useThrottleFn(async()=>{
    if([0,2].includes(Number(props.type))&&!props.way)return showFailToast(t('sellTip71')); 
    if(props.type === 1&&!props.way)return showFailToast(t('sellTip72'));
    if (timer.value===0){
        let params:any = {};
        if(props.type == 0){
            params.mobileNumber = props.way
        }else if(props.type == 1){
            params.emailAccount = props.way
        }else if(props.type == 2){
            params.phoneNumber = props.way
            params.bankCode = props.bankCode
            params.type = 1;
            params.token = props.token
        }
        const res = await props.apiFun(params)
        if(res.code === '1'){
           showSuccessToast(t('sendSuc'))
            timer.value = props.times
             // 重启定时器
            resume()
            if(props.type == 2){
                kycMsg.value = res.data;
            }
        }else {
			showFailToast(res.msg)
		}
    }else{

        return 
    }
},3000)
const handleCustom = () => {
};
onMounted(()=>{
    onReady();
})

// 清楚倒计时
const clearTimer = () => {
    timer.value = 0;
    pause()
}

const startTimer = () => {
    timer.value = props.times
    resume();
}
const clearKycMsg = () => {
    kycMsg.value = '';
}

defineExpose({
    sendCode,
    kycMsg,
    clearTimer,
    startTimer,
    clearKycMsg
})


</script>
<style lang="scss" scoped>
.x-send{
    margin-top: 20px;
    width: 100%;
    &-lab{
        display: block;
        font-size: 30px;
        margin-bottom: 10px;
		color: var(--text_color_L1);
    }
    &-box{
        position: relative;
        .input{
            width: 100%;
            height: 96px;
			background: var(--bg_color_L3);
			color: var(--text_color_L1);
			border:none;
			border-radius: 16px;
            padding: 0 40px;
            box-shadow: none;
            font-weight: 500;
            font-size: 32px;
            &::placeholder{
				color: var(--text_color_L2);
            }
            &::-webkit-input-placeholder {
				color: var(--text_color_L2);
            }
            
            /* Mozilla 浏览器 (Firefox) */
            &:-moz-placeholder {
				color: var(--text_color_L2);
                opacity: 1; /* 防止透明度问题 */
            }
            
            /* Microsoft Edge 和 IE */
            &::-ms-input-placeholder {
				color: var(--text_color_L2);
            }
            &:-ms-input-placeholder {
				color: var(--text_color_L2);
            }
        }
        .btn{
			background: var(--bg_color_L3);
			color: var(--text_color_L1);
            position: absolute;
            top: 20px;
            right: 20px;
            text-align: center;
            height: 60px;
            line-height: 60px;
            min-width: 120px;
            padding: 0 24px;
            font-size: 28px;
            border-radius: 20px;
            font-weight: 600;
            &.action{
				background: var(--main_gradient-color);
				color: var(--text_color_L4);
            }
        }
    }
    &-tip{
        margin-top: 16px;
        span{
            color: #F5BA00;
            font-weight: 500;
        }
    }
}
    
</style>