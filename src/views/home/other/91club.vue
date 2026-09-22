<template>
  <NavBar>
    <template #left>
      <img :src="projectIcon" alt="" />
    </template>
    <template #right>
      <div class="nav-right" v-if="!globalStore.getToken">
        <div class="nav-btn login" @click=" router.push({ name: 'login' })">{{ $t('login') }}</div>
        <div class="nav-btn" @click=" router.push({ name: 'register' })">{{ $t('register') }}</div>
      </div>
      <div class="nav-right" v-else>
        <svg-icon v-if="(apkStore.apk.value) != ApkType.FullApk" class="downIcon" name="91-homeDown"
          @click.stop="onDown" />
      </div>
    </template>
  </NavBar>

  <div class="club91">
    <div class="h">
      <NoticeBar>
        <div class="message" @click="onClickRightH">
          <svg-icon name="91-message_notice" />
          <Point v-show="!isRead" class="point" />
        </div>
      </NoticeBar>
      <Swiper class="nop" />
      <div v-if="globalStore.getToken" class="amount">
        <div class="a1">
          <div class="title">
            <svg-icon name="91-gold" />
            {{ $t('walletBalance') }}
          </div>
          <div class="a">{{ currency(walletStore.getAmount) }}<svg-icon name="91-refresh" @click="getWinsUserAmount" />
          </div>
        </div>
        <div class="a2" @click="router.push({ name: 'Withdraw' })"><svg-icon name="91-up" />{{ $t('withdraw') }}</div>
        <div class="a2" @click="router.push({ name: 'Recharge' })"><svg-icon name="91-down" />{{ $t('recharge') }}</div>
      </div>
      <div class="wv">
        <svg-icon name="91-turntable" @click="goProtectedRoute('Turntable')" />
        <svg-icon name="91-vip" @click="goProtectedRoute('vip')" />
      </div>
    </div>
    <game />
    <Winner />
    <rank />
    <team />
<Turntable/>
  </div>
  <!--下载PWA应用-->
  <DownloadPWA />
  <!-- 邀请转盘 -->
  <!-- <InviteTurntable /> -->

</template>
<script setup lang="ts">
import NoticeBar from '@/components/Home/NoticeBar/index2.vue'
import team from '@/components/Home/club91Home/team.vue'
import rank from '@/components/Home/club91Home/rank.vue'
import game from '@/components/Home/club91Home/game.vue'
import Winner from '@/components/Home/club91Home/winner.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import Turntable from '@/components/common/Turntable.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import { GlobalStore, SettingStore, useWalletStore } from '@/stores'
import { useApkState, ApkType } from '@/stores/apk'
import { currency } from '@/utils'
import { useHome } from '@/hooks'
import { requireLoginAction } from '@/hooks/useLoginIntercept'
import { useRouter } from 'vue-router'
import { onMounted} from 'vue';
const globalStore = GlobalStore()
const router = useRouter()
const { projectIcon, isRead, onDown } = useHome();
const walletStore = useWalletStore()
const setting = SettingStore()
const apkStore = useApkState()

// 获取钱包金额
const getWinsUserAmount = async () => {
  walletStore.resetData(false, true);
}

const goProtectedRoute = async (name: string) => {
  if (!(await requireLoginAction())) return
  router.push({ name })
}

const onClickRightH = () => {
  router.push({
    name: 'Messages'
  })
}
onMounted(() => {
  if (globalStore.getToken) {
    if (setting.getIsSwitchSaasBalance) {
      walletStore.GetARGameAndPlatWallets(false);
    } else {
      walletStore.resetData(true, false);
    }
  };
})
</script>
<style lang="scss" scoped>
img {
  height: 82px;
  width: auto;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;

  .nav-btn {
    box-sizing: border-box;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    border-radius: 8px;
    font-size: 24px;
    color: #fff;
    background: #fb5755;
    font-weight: 900;

    &.login {
      background: transparent;
      color: #1e2637;
      border: 2px solid #d0d5de;
    }
  }

  .downIcon {
    width: 48px;
    height: 48px;
  }
}

.club91 {
  display: flex;
  flex-direction: column;
  gap: 54px;
  padding: 24px 24px 340px 24px;

  &>.h {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .message {
    position: relative;

    svg {
      width: 48px;
      height: 48px;
    }

    .point {
      position: absolute;
      top: 2px;
      right: 0px;
    }
  }

  .amount {
    display: flex;
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

        svg {
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
      font-weight: 900;
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

  .wv {
    height: 98px;
    display: flex;
    justify-content: space-between;

    svg {
      height: 98px;
      width: calc(50% - 12px);
      border-radius: 16px;
      box-shadow: 0px 4px 16px -4px rgba(251, 75, 134, 0.60);

      &:last-of-type {
        box-shadow: 0px 4px 16px -4px rgba(241, 53, 251, 0.60);
      }

    }
  }

  .nop {
    padding: 0;
  }

  :deep() .van-dialog {
    width: 622px;
    height: 930px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    &__content {
      position: relative;
      width: 100%;



    }

    &__footer {
      z-index: 100;
      position: fixed;
      bottom: 30px;
      display: flex;
      flex-grow: 1;
      gap: 20px;
      width: 90%;
    }

    .van-button__text {
      color: #fff;
      width: 80%;
      height: 70px;
      text-align: center;
      line-height: 70px;
      background: var(--main_gradient-color);
      border-radius: 80px;
      z-index: 100;
      font-weight: 700;
      font-size: 32px;
      font-family: 'Inter';
      font-style: normal;
      letter-spacing: 5px;
    }

  }

}
</style>
