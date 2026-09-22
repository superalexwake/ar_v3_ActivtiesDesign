<script setup lang="ts">
import { useRouter } from 'vue-router';
import {defineAsyncComponent} from 'vue';
import LotteryMenu from './LotteryMenu.vue'
import Wallte from './Wallet.vue'
import noTiceBar from '@/components/Home/NoticeBar/index.vue'
import { useServer } from '@/hooks/useServe.hook'
//const VideoPlayer = defineAsyncComponent(() => import('../Video/VideoPlayer.vue'))
const emit = defineEmits(['change-select-game','setVoice'])
defineProps({
	VoiceType: {
		type: String,
		default: ''
	},
	countdown:{
		type: Object,
		default: {}
	},
	showNav:{
		type:Boolean,
		default:true
	}
})

// 路由
const router = useRouter()
const { getSelfCustomerServiceLink, isCenterServer } = useServer({ServerType: 2})
// 跳转路由
const goPath = (name: string) => {
	if (isCenterServer.value){
		return getSelfCustomerServiceLink()
	}
    router.push({ name })
}
const backGo = () => {
    router.go(-1)
    sessionStorage.setItem('clickedGameType', 'lottery')
}
</script>

<template>
    <div class="lottery-info" :class="{ padding: showNav }">
        <div class="bg" v-if="showNav"></div>
        <NavBar left-arrow @click-left="backGo" class="main" :headLogo="true">
            <template #right>
                <div class="more">
                    <div @click="goPath('CustomerService')"></div>
                    <div :class="{ disableVoice: VoiceType == '2' }" @click="emit('setVoice')"></div>
                </div>
            </template>
        </NavBar>
		<div v-if="showNav">
			<Wallte :countdown="countdown" />
			<noTiceBar key="wingo" class="lottery-notice" />
			<LotteryMenu @change-select-game="(item)=>emit('change-select-game',item)" />
		</div>
<!--		<VideoPlayer v-else></VideoPlayer>-->

    </div>
</template>

<style scoped lang="scss">
.lottery-info {
    position: relative;

	&.padding{
		padding: 36px 26px 0 26px;
		margin-bottom: 26px;
	}

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 675px;
		background: var(--light-main_gradient-color,var(--bg_color_L2));
        border-radius: 0 0 120px 120px;
    }
    :deep(.Wallet__C) {
        padding: 0;
        &:before {
            content: none;
        }
    }
    .lottery-notice {
        margin: 34px auto;
        background-color: var(--bg_color_L3);
        position: relative;
        z-index: 1;
    }
    .more {
        position: absolute;
        width: 116px;
        height: 48px;
        right: 26px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        html:lang(ar) & {
            right: unset;
            left: 26px;
        }
        & > div {
            width: 48px;
            height: 48px;
            background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/kefu.png');
            background-size: 48px;

            &:last-child {
                background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/voice.png');

                &.disableVoice {
                    background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/voice-off.png');
                }
            }
        }
    }
}
</style>