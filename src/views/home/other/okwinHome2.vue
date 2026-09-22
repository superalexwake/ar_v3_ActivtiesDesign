<template>
    <NavBar>
        <template #left>
            <img :src="projectIcon" alt="" />
        </template>
        <template #right>
            <div class="nav-right" v-if="!globalStore.getToken">
                <div class="nav-btn" @click="router.push({ name: 'login' })">
                    {{ $t('login') }}
                </div>
                <div class="nav-btn reg" @click="router.push({ name: 'register' })">
                    {{ $t('register') }}
                </div>
            </div>
            <div class="nav-right" v-else>
                <svg-icon v-if="(apkStore.apk.value) != ApkType.FullApk" @click.stop="onDown" name="down1"
                    class="down"></svg-icon>
                <LangPop />
            </div>
        </template>
    </NavBar>
    <div class="okwin">
        <div class="nav-enter">
            <div class="left" @click="goPath('Turntable')"></div>
            <div class="right" @click="goPath('vip')"></div>
        </div>
        <Swiper :isShowButton="true" />
        <NoticeBar />
        <div v-if="globalStore.getToken" class="amount">
            <div class="a1">
                <div class="title">
                    <svg-icon name="91-gold" />
                    {{ $t('walletBalance') }}
                </div>
                <div class="a">{{ currency(walletStore.getAmount) }}<svg-icon name="91-refresh"
                        @click="getWinsUserAmount" /></div>
            </div>
            <div class="a2" @click="router.push({ name: 'Withdraw' })"><svg-icon name="91-up" />{{ $t('withdraw') }}
            </div>
            <div class="a2" @click="router.push({ name: 'Recharge' })"><svg-icon name="91-down" />{{ $t('recharge') }}
            </div>
        </div>
        <GameList />
        <!-- 中奖信息 -->
        <Winner />
        <!-- 今日盈利排行榜 -->
        <Rank />
        <Team />
    </div>
    <!--下载PWA应用-->
    <!-- 邀请转盘 -->
    <!-- <InviteTurntable /> -->
    <DownloadPWA />
    <Turntable />
</template>

<script setup lang="ts">
import LangPop from '@/components/Login/LangPopup.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/okwin2.vue'
import GameList from '@/components/Home/Okwin2Home/gameList.vue'
import Winner from '@/components/Home/Okwin2Home/winner.vue'
import Rank from '@/components/Home/Okwin2Home/rank.vue'
import Team from '@/components/Home/Okwin2Home/team.vue'
import { GlobalStore, SettingStore, useWalletStore } from '@/stores'
import { useApkState, ApkType } from '@/stores/apk'
import { useHome } from '@/hooks'
import { useRouter } from 'vue-router'
import { onMounted} from 'vue'
import { currency } from '@/utils'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import Turntable from '@/components/common/Turntable.vue'
const { projectIcon, onDown } = useHome()
const globalStore = GlobalStore()
const router = useRouter()

// 钱包金额
const walletStore = useWalletStore()
const setting = SettingStore()
const apkStore = useApkState()

// 获取钱包金额
const getWinsUserAmount = async () => {
    walletStore.resetData(false, true);
}

const goPath = (name: string) => {
    router.push({
        name
    })
}
onMounted(() => {
    if (globalStore.getToken) {
        if (setting.getIsSwitchSaasBalance) {
            walletStore.GetARGameAndPlatWallets(false);
        } else {
            walletStore.resetData(false, false);
        }
    };
})

</script>
<style lang="scss" scoped>
.okwin {
    padding: 0 24px 320px 24px;

    .swiper_box {
        padding: 0;
    }

    .nav-enter {
        height: 98px;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        margin-bottom: 32px;

        .left {
            width: 347px;
            height: 100%;
            flex: none;
            background-image: url('@/assets/icons/home/okwin2/home1.svg');
            background-size: contain;
            background-repeat: no-repeat;
        }

        .right {
            width: 347px;
            height: 100%;
            flex: none;
            background-image: url('@/assets/icons/home/okwin2/home2.svg');
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
}

img {
    height: 60px;
    width: auto;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .nav-btn {
        border: 1px solid var(--main-color);
        color: var(--main-color);
        height: 56px;
        padding: 0 20px;
        min-width: 110px;
        border-radius: 12px;
        font-size: 26px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;

        &.reg {
            background: var(--main_gradient-color);
            color: var(--text_color_L4);
        }
    }

    svg {
        width: 48px;
        height: 48px;
    }

    .money {
        color: var(--main-color);

        .text {
            color: var(--text_color_L2);
        }
    }

    :deep(.right) {
        img {
            width: 36px;
            height: 36px;
            position: relative;
            top: -2px;
        }

        .languageName {
            font-size: 28px;
        }
    }
}

.noticeBar__container {
    width: calc(100% - 56px);
    margin: 40px auto;
    background-color: var(--bg_color_L2);
}
.amount {
    display: flex;
    margin-bottom: 50px;
    gap: 24px;

    .a1 {
        flex: 1;
        color: #1e2637;

        .title {
            font-size: 20px;
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            height: 28px;
            gap: 5px;
            color: var(--text_color_L2);

            svg {
                width: 26px;
                height: 26px;
            }
        }

        .a {
            height: 46px;
            font-size: 32px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 900;
            color: var(--text_color_L1);

            svg {
                color: var(--text_color_L2);
                width: 40px;
                height: 40px;
            }
        }
    }

    .a2 {
        width: 136px;
        height: 80px;
        background-image: url('@/assets/icons/svg/91club/91-withdraw_btn.svg');
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #fff;

        svg {
            width: 24px;
            height: 24px;
        }

        &:last-child {
            background-image: url('@/assets/icons/svg/91club/91-recharge_btn.svg');
        }
    }
}
</style>
