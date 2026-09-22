<template>
  <div class="customer-container">
    <div class="customer-container-header">
      <NavBar
        :title="`${$t('customerServiceTitle')}`"
        class="main"
        left-arrow
        @click-left="goBack"
      >
			  <template #right>
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none" class="home" @click="goHome">
          <path d="M8.25 16.5V38.5H35.75V16.5L22 5.5L8.25 16.5Z" stroke="white" stroke-width="3.66667" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17.417 26.5833V38.4999H26.5837V26.5833H17.417Z" stroke="white" stroke-width="3.66667" stroke-linejoin="round"/>
          <path d="M8.25 38.5H35.75" stroke="white" stroke-width="3.66667" stroke-linecap="round"/>
          </svg>
        </template>
      </NavBar>
      <div class="customer-container-header-belly">
        <img src="@public/main/customerBg.png" alt="" />
      </div>
    </div>
    <div class="cg" v-if="serviceGroup?.status == 1">
      <div class="cg2">
        <div class="til1">
          <div class="left">
            <van-image
              round
              width="30"
              height="30"
              :src="settingS.ossUrl + '/' + serviceGroup?.imageUrl"
              fit="cover"
              position="center"
            >
              <template v-slot:error>
                <div class="err"></div>
              </template>
            </van-image>
            <p>{{ serviceGroup?.mainTitle }}</p>
          </div>
          <div class="btn" @click="onClickUrl({ url: serviceGroup?.url })">
            {{ $t("join") }}
          </div>
        </div>
        <div class="til2">{{ serviceGroup?.subTitle }}</div>
      </div>
    </div>
    <List :list="ContactList" @on-click="onItemClick"></List>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useServer } from "@/hooks/useServe.hook";
import { SettingStore } from "@/stores";
import router from "@/router";
const {
  onItemClick,
  goBack,
  getList,
  ContactList,
  List,
  serviceGroup,
  getCustomerServiceGroup,
  onClickUrl,
} = useServer({ ServerType: 2 });
const settingS = SettingStore();

const goHome = ()=>{
  
  router.push({
    path: '/'
  })
}
onMounted(() => {
  getList();
  getCustomerServiceGroup();
});
</script>

<style lang="scss" scoped>
.customer-container {
  &-header {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: fit-content;
    background: var(--main_gradient-color);

    :deep(.navbar) {
      .navbar__content {
        .navbar__content-left {
          .van-icon {
            color:#fff
          }
        }

        .navbar__content-center {
          color: #fff;
        }
      }
    }

    &-belly {
      height: 342px;
      img {
        width: 100%;
        margin: auto;
        background-size: cover;
       margin: 0;
      }
      display: flex;
    }
  }
  .cg {
    z-index: 2;
    position: relative;
    padding: 26px 26px;
    .cg2 {
      background: var(--bg_color_L2);
      border-radius: 20px;
      padding: 26px 26px;
      .til1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--Dividing-line_color);
        padding-bottom: 20px;
        margin-bottom: 20px;
        .left {
          display: flex;
          align-items: center;
          gap: 20px;
          p {
            color: var(--text_color_L1);
            font-size: 24px;
            word-break: break-all;
            max-width: 450px;
          }
          .err {
            width: 60px;
            height: 60px;
            background: var(--borderColor-18); 
          }
        }
        .btn {
          color: var(--main-color);
          border: 1px solid var(--main-color);
          border-radius: 10px;
          padding: 5px 30px;
        }
      }
      .til2 {
        color: var(--text_color_L2);
        font-size: 22px;
        word-break: break-all;
      }
    }
  }
}
.home {
  width: 44px;
  height: 44px;
}
</style>
