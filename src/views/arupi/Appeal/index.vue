<template>
    <div class="appeal">
		<NavBar :title="$t('Appeal')"  :placeholder="false" left-arrow @click-left="onClick" />
        <div class="appealTip">
            <div class="title"><van-icon name="warning" class="img" size="14" />{{ $t('notice') }}</div>
            <p>{{ $t('appealTip') }}</p>
        </div>
		<h1><span style="color:#EE4D4D;">*</span> UTR(UPI Ref.ID)</h1>
		<van-field :disabled="existAppeal" v-model.trim="utrVal" label="" type="text"  maxlength="12" :placeholder="$t('enterUtr')"/>
		<h1 ><span style="color:#EE4D4D;">*</span> {{ $t('ReasonFAppeal') }}</h1>
		<van-field :disabled="existAppeal" v-model.trim="message" rows="2" label="" type="textarea" maxlength="60" show-word-limit :placeholder="$t('sellTip3')"/>

        <UploadImage :disabled="existAppeal" v-model:fileListImg="fileListImg"  v-model:fileListVideo="fileListVideo" ></UploadImage>
        <div class="cmdBth mt16 x-row x-row-middle-center" :class="existAppeal?'':'active'"  @click="onSubmit">{{ $t('selltip4') }}</div>
    </div>
</template>
<script lang="ts" setup>
import UploadImage from "@/components/ArUPI/uploadImage.vue";
import { onMounted, ref } from 'vue';
import { showFailToast, showSuccessToast, showLoadingToast } from "vant";
import { useRouter } from "vue-router";
import {  SubmitRechargeAppeal ,RechargeAppealExist} from "@/api";
import { useI18n } from 'vue-i18n'
import { useThrottleFn } from '@vueuse/core';
import { showConfirmDialog } from 'vant';
import { useRututnUrl } from "@/hooks";
const { goMerchant } = useRututnUrl()
const { t } = useI18n()
const router = useRouter();
const message = ref("");
function onClick() {
	router.push({
		name:'kycAppeal'
	})
}
const fileListImg = ref<any[]>([]);
const fileListVideo = ref<any[]>([]);

onMounted(() => {
    getDetail()
})

const existAppeal = ref(false);
const utrVal=ref();
// 查询是否提交过申诉
const getDetail = async() =>{
    const res = await RechargeAppealExist({});
    if(res.code === '1'){
        const { existAppeal:ExistAppeal , appealReason ,images ,video,url} = res.data;
        existAppeal.value = ExistAppeal;
        message.value = appealReason;
		utrVal.value=url;
        fileListImg.value = images?images.split(',').map((url: any) => ({ url })): [];
        fileListVideo.value = video?video.split(',').map((url: any) => ({ url })): [];
    }else{
        showFailToast(res.msg);
        setTimeout(()=>{
            goMerchant()
        },1500)
    }
}

//获取上传文件名
const getFileNameUUID = (list:any) => {
    const imagesList = list.map((item: { url: string; file: { objectName: any; }; }) => {
        if (item.url) {
            return item.url.split('/').pop(); // Extract filename from the URL
        } else if (item.file && item.file.objectName) {
            return item.file.objectName; // Get the filename from the objectName property
        }
    });
    return imagesList;
}

const onSubmit = useThrottleFn(async () => {
if (existAppeal.value) return;
if(!utrVal.value || utrVal.value.length < 12)  return showFailToast(t('formatIncorrect'));
if(!message.value) return showFailToast(t('sellTip3'))
if(fileListImg.value.length  < 1) return showFailToast(t('sellTip15'))
    await showConfirmDialog({
        title: t('notice'),
        message: t('appealTip'),
    })
    const loading=showLoadingToast({
        message: t('submitting'),
        forbidClick: true,
        duration:0,
        overlay:true,
    });

    let imagesList = [],videoList = [];
    if(fileListImg.value.length > 0){
        imagesList = getFileNameUUID(fileListImg.value)
    }
    if(fileListVideo.value.length > 0){
        videoList = getFileNameUUID(fileListVideo.value)
    }
    try {
        const res = await SubmitRechargeAppeal({
			appealReason: message.value,
			video: videoList?videoList[0]:'',
			images: imagesList.join(','),
			utr: utrVal.value,
		});
        setTimeout(()=>{
            loading.close()
        },2000)
        if (res.code === "1") {
            showSuccessToast({
                message: t('SubmittedS'),
                wordBreak: "break-word",
            });
        }else{
            showFailToast(res.msg);
        }
        setTimeout(()=>{
            goMerchant()
        },1500)
    } catch (error) {
        console.log(error)
        loading.close();
    }
},1000)

</script>
<style lang="scss" scoped>
.appeal {
    padding: 40px 32px 160px;
    .appealTip {
        background: #FF9E0B;
        padding: 24px;
        color: #fff;
        margin-bottom: 68px;
        border-radius: 16px;
        .title {
            font-size: 32px;
            font-weight: 500;
            margin-bottom: 10px;
        }
    }
	h1{
		color: var(--text_color_L2);
		letter-spacing: -0.64px;
		font-size: 28px;
		font-weight: 600;
		margin-bottom: 24px;
		margin-top:20px;
	}
	.cmdBth{
		border-radius: 16px;
		background: var(--bg_color_L3);
		color: var(--text_color_L1);
		height: 96px;
		font-size: 32px;
		font-weight: 500;
		&.active{
			background: var(--main_gradient-color);
			color: var(--text_color_L4);
		}
	}
	:deep(.van-cell-group--inset) {
		margin: 30px 0;
		box-shadow: 0px 8px 32px rgba(208, 208, 237, 0.26);
	}
}





</style>
