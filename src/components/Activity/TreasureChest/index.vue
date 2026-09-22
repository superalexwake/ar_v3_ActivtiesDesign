<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useGlobalDialog, useTreasureChest } from '@/hooks'
import { useRoute } from 'vue-router';
import {GlobalStore} from "@/stores";
const user=GlobalStore();
const { store } = useGlobalDialog()
const { currentChest, rewardAmount, openChest, closeCurrentChest , initTreasureChest} = useTreasureChest()
const isShowTreasureChest = ref(true)
const isChestOpened = ref(false)
const route = useRoute()

const handleOpenChest = async () => {
    await openChest()
    isChestOpened.value = true
}

const handleConfirm = () => {
    isChestOpened.value = false
    closeCurrentChest()
}
const ChestRouteNameList = ['home', 'main']

// 判断是否已登录
const isLoggedIn = () => {
    return !!user.token && !!user.userInfo && Object.keys(user.userInfo).length > 0
}

watch(()=>route.name,
    (value)=>{
        if (route.name && ChestRouteNameList.includes(route.name as string) && isLoggedIn()) {
            initTreasureChest()
        }
    }
)

watch(() => store.isShowTreasureChest, value => {
    if (!value) isChestOpened.value = false
})

onMounted(() => {
    if (route.name && ChestRouteNameList.includes(route.name as string) && isLoggedIn()) {
        initTreasureChest()
    }
})

</script>

<template>
	<van-dialog v-model:show="store.isShowTreasureChest" className="treasureChest-dialog" :show-confirm-button="false">
		<div class="container">
            <div class="title" v-if="currentChest?.taskType == 1">{{ $t('treasureChest1', { task: currentChest?.taskTitle || '' }) }}</div>
            <div class="title" v-else>{{ $t('treasureChest1', { task: currentChest?.taskTitle || '' }) }}</div>
             <div class="subtitle" v-if="!currentChest?.minRewardAmount|| !currentChest?.maxRewardAmount">{{ $t('treasureChest2', { amount: currentChest?.rewardAmount || 0 }) }}</div>
            <div class="subtitle" v-else>{{ $t('treasureChest2', { amount: `${currentChest?.minRewardAmount || 0}~${currentChest?.maxRewardAmount || 0}` }) }}</div>
            <div class="rewards">
               
                <div class="get-reward-animation" ref="animation">
                    <div v-if="!isChestOpened">
                         <div class="box_bg_light"></div>
                        <div class="box_closed"></div>
                    </div>
                   <div v-else>
                       <div class="box_open"></div>
                        <div class="box_front_light"></div>
                        <div class="reward_item">{{ $t('treasureChest4', { amount: rewardAmount || 0 }) }}</div>
                   </div>
                   
                </div>
            </div>
            <div class="button-box">
                <div v-if="isChestOpened" class="btn btn-close-chest" @click="handleConfirm">{{ $t('confirm') }}</div>
                <div v-else class="btn btn-open-chest" @click="handleOpenChest">{{ $t('treasureChest3') }}</div>
            </div>
            
		</div>
	</van-dialog>
</template>

<style scoped lang="scss">
.container{
    color: #fff;
    justify-content: center;
    .title{
        color: #FDE240;
        text-align: center;
        -webkit-text-stroke-width: 1.5px;
        -webkit-text-stroke-color: #AB1E1E;
        font-family: "Poppins";
        font-size: 36px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    .subtitle{
        text-align: center;
        color: #FFF;
        font-family: "Poppins";
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-top: 30px;
    }
    .rewards{
        position: relative;
    }
    .reward-item{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        color: #FFE65B;
        text-align: center;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: #AB1E1E;
        font-family: "PingFang SC";
        font-size: 48px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .get-reward-animation{
        width: 500px;
        height: 500px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .box_bg_light{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: url('@/assets/icons/treasureChest/box_bg_light.png') no-repeat center/cover;
        animation: rotate 12s linear infinite;
    }
    .box_closed{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background: url('@/assets/icons/treasureChest/box_closed.png') no-repeat center/cover;
        animation: shake 2.5s ease-in-out infinite;
    }
    .box_open{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        background: url('@/assets/icons/treasureChest/box_open.png') no-repeat center/cover;
    }
    .box_front_light{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 4;
        background: url('@/assets/icons/treasureChest/box_front_light.png') no-repeat center/cover;
        animation: rotate 12s linear infinite;
    }
    .reward_item{
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
        color: #FFE65B;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #AB1E1E;
        font-family: "Poppins";
        font-size: 48px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        animation: scaleIn 0.6s ease-out forwards;
    }

    .btn{
        width: 380px;
        height: 100px;
        background: url('@/assets/icons/treasureChest/chest_btn.png') no-repeat center/cover;
       text-align: center;
       color: #fff;
       font-size: 36px;
       font-weight: 600;
       display: flex;
       justify-content: center;
       line-height: 100px;
    }
    .button-box{
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
}
 @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    @keyframes shake {
        0% {
            transform: translateX(0) rotate(0deg);
        }
        5% {
            transform: translateX(-16px) rotate(-6deg);
        }
        10% {
            transform: translateX(16px) rotate(6deg);
        }
        15% {
            transform: translateX(-16px) rotate(-6deg);
        }
        20% {
            transform: translateX(16px) rotate(6deg);
        }
        25% {
            transform: translateX(-16px) rotate(-6deg);
        }
        30% {
            transform: translateX(0) rotate(0deg);
        }
        100% {
            transform: translateX(0) rotate(0deg);
        }
    }
    
    @keyframes scaleIn {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
</style>
<style lang="scss">
.treasureChest-dialog.van-dialog {
	width: 622px;
	background:transparent;
	overflow: inherit;

	.van-dialog__content {
		padding-bottom: 20px;
	}

	.van-dialog__header {
		padding: 26px 32px 10px 32px;
	}

	.close {
		position: absolute;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		left: 50%;
		transform: translateX(-50%);
		bottom: -120px;
		background-image: url('@/assets/icons/activity/PointMall/close.png');
		background-repeat: no-repeat;
		background-size: contain;
	}
}
</style>
