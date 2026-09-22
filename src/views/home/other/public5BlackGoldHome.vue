<template>
  <NavBar>
    <template #left>
      <img :src="projectIcon" alt="" />
    </template>
    <template #right>
      <div v-if="!globalStore.getToken" class="nav-right">
        <div class="nav-btn" @click="router.push({ name: 'login' })">
          {{ $t('login') }}
        </div>
        <div class="nav-btn reg" @click="router.push({ name: 'register' })">
          {{ $t('register') }}
        </div>
      </div>
      <div v-else class="nav-right">
        <svg-icon v-if="(apkStore.apk.value) != ApkType.FullApk" class="down" name="down1"
          @click.stop="onDown"></svg-icon>
        <LangPop />
      </div>
    </template>
  </NavBar>
  <div class="public5BlackGoldHome">
    <div class="box">
      <Swiper :isShowButton="true" />
    </div>
    <div class="box">
      <NoticeBar />
    </div>
    <div class="box">
      <Winner />
    </div>
    <game />
    <div class="box">
      <rank />
    </div>
    <div class="box">
      <team />
    </div>
  </div>

  <!--下载PWA应用-->
  <DownloadPWA />

  <!-- 邀请转盘 -->
  <!-- <InviteTurntable /> -->

  <Turntable />
</template>

<script lang="ts" setup>
import LangPop from '@/components/Login/LangPopup.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import team from '@/components/Home/Public5BlackGoldHome/team.vue'
import rank from '@/components/Home/Public5BlackGoldHome/rank.vue'
import game from '@/components/Home/Public5BlackGoldHome/game.vue'
import Winner from '@/components/Home/Public5BlackGoldHome/winner.vue'
import { GlobalStore } from '@/stores'
import { useHome } from '@/hooks'
import { useRouter } from 'vue-router'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import Turntable from "@/components/common/Turntable.vue";
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
import { useApkState, ApkType } from '@/stores/apk'

const { projectIcon, onDown } = useHome()
const globalStore = GlobalStore()
const router = useRouter()
const apkStore = useApkState()
</script>
<style lang="scss" scoped>
.public5BlackGoldHome {
  padding: 10px 0 200px 0;
  background: var(--bg_color_L1, #110D14);

  .box {
    padding: 0 24px;

    .swiper_box {
      padding: 0;
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
  margin: 32px auto;
}
</style>
