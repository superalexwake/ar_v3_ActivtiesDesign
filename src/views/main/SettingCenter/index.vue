<template>
  <UserInformation :userInfo="userInfo" />
  <div class="content setting-wrapper">
    <div class="setting-items-wrapper">
      <div class="content-sub_title">
        <div>{{ $t("securityInfo") }}</div>
      </div>
      <div class="phone_container">
        <div class="phone_container-item" @click="onUpdatePass">
          <div class="phone_container-item-left">
            <figure class="icon">
              <svg-icon name="editIcon" />
            </figure>
            <span>{{ $t("loginPSW") }}</span>
          </div>
          <div class="phone_container-item-right">
            <span>{{ $t("edit") }}</span>
            <van-icon name="arrow" color="#888" />
          </div>
        </div>
      </div>

      <div class="setting_container">
        <div
          v-if="userInfo?.regType == 2"
          class="phone_container-item setting_container_item ar-1px-b"
          @click="router.push({ name: 'SettingCenter-UpdatePhone' })"
        >
          <div class="phone_container-item-left" v-if="isbindPhone == ''">
            <img src="@icon/main/editPhoneIcon.png" />
            <span>{{ $t("bindPhone") }}</span>
          </div>
          <div class="phone_container-item-left" v-if="isbindPhone != ''">
            <img src="@icon/main/editPhoneIcon.png" />
            <span>{{ $t("changephone") }}</span>
          </div>
          <div class="phone_container-item-right" v-if="isbindPhone != ''">
            <span>{{ hidePhoneNumber(userInfo?.verifyMethods?.mobile) }} </span>
            <van-icon name="arrow" color="#888" />
          </div>
          <div class="phone_container-item-right" v-if="isbindPhone == ''">
            <div v-if="userInfo?.bindReward > 0" class="phoneright">
              <div>{{ $t("award") }}</div>
              <div>{{ currency(userInfo?.bindReward) }}</div>
            </div>
            <div v-else class="phoneright">
              <div>{{ $t("tobind") }}</div>
            </div>
            <van-icon name="arrow" color="#888" />
          </div>
        </div>
        <div
          v-if="userInfo?.regType == 1"
          class="phone_container-item setting_container_item"
          @click="router.push({ name: 'SettingCenter-BindEmail' })"
        >
          <div class="phone_container-item-left" v-if="isbindEmail == ''">
            <figure class="icon email">
              <svg-icon name="messageIcon" />
            </figure>
            <span>{{ $t("bindEmail") }}</span>
          </div>
          <div class="phone_container-item-left" v-if="isbindEmail != ''">
            <figure class="icon email">
              <svg-icon name="email" />
            </figure>
            <span>{{ $t("email") }}</span>
          </div>
          <div class="phone_container-item-right" v-if="isbindEmail == ''">
            <div v-if="userInfo?.bindReward > 0" class="emailright">
              <div>{{ $t("award") }}</div>
              <div>{{ currency(userInfo?.bindReward) }}</div>
            </div>
            <div v-else class="emailright">
              <div>{{ $t("tobind") }}</div>
            </div>
            <van-icon name="arrow" color="#888" />
          </div>
          <div class="phone_container-item-right" v-if="isbindEmail != ''">
            <span>{{ hideEmail(userInfo?.verifyMethods?.email) }}</span>
            <van-icon name="arrow" color="#888" />
          </div>
        </div>

        <div
          class="setting_container_item"
          v-show="userInfo.isGoogle === '1'"
          @click="onGoogle"
        >
          <div>
            <figure class="icon">
              <svg-icon name="googleIcon" />
            </figure>
            <span>{{ $t("googleVerify") }}</span>
          </div>
          <div>
            <span v-if="checked" class="green"> {{ $t("turnedOn") }} </span>
            <span v-else> {{ $t("unopened") }} </span>
            <van-icon name="arrow" color="#888" />
          </div>
        </div>
        <div class="setting_container_item">
          <div>
            <figure class="icon">
              <svg-icon name="versionUpdateIcon" />
            </figure>
            <span>{{ $t("updateNewVersion") }}</span>
          </div>
          <div>
            <h5>1.0.9</h5>
            <van-icon name="arrow" color="var(--text_color_L2)" />
          </div>
        </div>
      </div>
      <van-button
        class="cg-default"
        block
        round
        size="large"
        color="var(--main_gradient-color2)"
        @click="clearCachef"
        v-if="isapp"
      >
        <template #icon>
          <img src="@public/main/clear.png" />
        </template>
        {{ $t("clearcache") }}
      </van-button>
    </div>
  </div>
  <div v-haspermission="19" class="delAllRq" @click="delAll">{{ $t("delAllBtn") }}</div>
  <!-- 验证弹窗 -->
  <VerifyPopup
    :showPopup="show"
    @onConfirm="onConfirm"
    @onBack="show = false"
  ></VerifyPopup>

  <div class="setting-records-modal">
    <Dialog v-model:show="dialogShow" :show-cancel-btn="true" :title="$t('delAllTip1')">
    <template #content>
      <div class="idlockTip">{{ $t("delAllTip2") }}</div>
    </template>
    <template #footer>
      <div class="dialogBtn" @click="delAllAxios">
        {{ $t("confirmDelete") }}
      </div>
      <div class="dialogBtn" @click="dialogShow = false">
        {{ $t("cancel") }}
      </div>
    </template>
  </Dialog>
  </div>
</template>

<script setup lang="ts">
import VerifyPopup from "@/components/Main/VerifyPopup/index.vue";
import UserInformation from "@/components/Main/UserInformation/index.vue";
import Dialog from "@/components/common/Dialog.vue";
import { GlobalStore, useUserStore } from "@/stores";
import type { UserInfo } from "@/types/api";
import { showSuccessToast } from "vant";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { hidePhoneNumber, AwaitApiResult, currency, hideEmail } from "@/utils"
import { clearCache } from "@/utils/jsBridge";
import { useThrottleFn } from "@vueuse/core";
import { GetGoogleVerify, delall } from "@/api";
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();
const clearCachef = useThrottleFn(clearCache, 500);
const router = useRouter();
const userStore = useUserStore();
const globalStore = GlobalStore();
userStore.getUserInfo({ signature: globalStore.token });
const userInfo = globalStore.getUserInfo as UserInfo;
const isapp = ref(false);
//进入修改登录密码界面
function onUpdatePass() {
  localStorage.setItem("toPath", "ResetPassword");
  router.push({
    name: "SettingCenter-LoginPassword",
  });
}
// 是否绑定邮箱
const isbindEmail = computed(() => userInfo?.verifyMethods?.email);
const isbindPhone = computed(() => userInfo?.verifyMethods?.mobile);
// 是否开启谷歌验证
const checked = Boolean(userInfo.googleVerify);
const show = ref(false);
const onGoogle = () => {
  if (userInfo.googleVerify === 1) {
    show.value = true;
  } else {
    router.push({ name: "GoogleVerify" });
  }
};
// 绑定谷歌验证码提交
const onConfirm = (e: string) => {
  GetGoogleVerifyApi(e);
};
const GetGoogleVerifyApi = async (code: string) => {
  const res = await AwaitApiResult(GetGoogleVerify({ verifyCode: code, verifyType: 3 }));
  if (res?.data?.secret) {
    router.push({
      name: "GoogleVerify-BindGoogle",
      query: { secret: res.data?.secret, type: 1 },
    });
  }
};

const dialogShow = ref(false);
const delAll = () => {
  dialogShow.value = true;
};
const delAllAxios = async () => {
  const res = await AwaitApiResult(delall());
  if (res.code == 0) {
    dialogShow.value = false;
    showSuccessToast($t("delete") + $t("success"));
  }
};
</script>

<style lang="scss" scoped>
.van-nav-bar {
  background: transparent;

  &__title,
  &__arrow {
    color: var(--textW);
  }
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
 // background: var(--bg_color_L3);
  border-radius: 20px;
  &.email {
    svg {
      min-height: 70px;
    }
  }
  svg {
    min-width: 100px;
    min-height: 100px;
    color: var(--main-color);
  }
}

.content {
  position: relative;
  top: 24px;
  padding-top: 180px;
  padding-block-end: 10px;

  .cg-default {
    margin-top: 85px;
  }

  .content-sub_title {
    margin-top: 30px;

    & > div {
      font-size: 32px;
      color: var(--darkTextW, var(--text_color_L1));
      font-weight: bold;
      padding-left: 20px;
      margin-bottom: 20px;
      border-left: 6px solid var(--main-color);
    }
  }

  .clearbutton {
    width: 580px;
    height: 80px;
    color: var(--textW);
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 4px;
    border-radius: 80px;
    border: none;
    background: var(--main_gradient-color);

    &.disable-btn {
      background: var(--main_gradient-color);
      box-shadow: var(--BoxShadowColor-3);
    }
  }
}

.setting_container {
  .setting_container_item {
    height: 140px;
    background: var(--bg_color_L2);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 26px 21px;
    margin-bottom: 30px;
    &:last-of-type{
      div{
        .icon{
          svg{
            min-width: 70px;
            min-height: 70px;
          }
        }
      }
    }

    div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
		img{
			max-width:80px;
		}
      &:last-of-type{
        span{
          color: var(--text_color_L2)

        }
      }
    }
    span {
      font-size: 28px;
      color: var(--text_color_L1);
      padding: 0 26px;
      &.green {
        color: var(--norm_green-color);
      }
    }

    h5 {
      display: inline-block;
      font-size: 26px;
      color: var(--text_color_L2);
      margin-right: 34px;
    }
  }
}

.phone_container {
  //height: 320px;
  background: var(--bg_color_L2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 21px;
  margin-bottom: 30px;

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 0;

    &-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      span {
        font-size: 28px;
        color: var(--text_color_L1);
        padding-left: 25px;
      }
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span {
        font-size: 28px;
        color: var(--text_color_L2);
        padding-right: 18px;
      }
      .phoneright,
      .emailright {
        padding-right: 16px;
        & > div {
          text-align: center;
        }
        & > div:nth-child(1) {
          color: var(--text_color_L2);
          font-size: 26px;
        }
        & > div:nth-child(2) {
          color: var(--main-color);
          font-size: 26px;
        }
      }
    }
  }
}

:deep(.van-icon) {
  font-size: 28px;
}
.delAllRq {
  width: 680px;
  height: 70px;
  line-height: 70px;
  background-image: var(--main_gradient-color);
  color: var(--textW);
  border-radius: 35px;
  margin: 60px auto;
  font-size: 30px;
  text-align: center;
}
:deep(.dialog__container-footer) {
  flex-direction: column;
  height: fit-content;
  margin-top: 80px;
  .dialogBtn {
    width: 500px;
    height: 80px;
    flex: none;
    border-radius: 40px;
    line-height: 80px;
    background: var(--main_gradient-color);
    color: var(--textW);
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    & + .dialogBtn {
      border: 1px solid var(--main-color);
      color: var(--main-color);
      background: var(--bg_color_L2);
      text-shadow: none;
      box-shadow: none;
      font-weight: 400;
    }
  }
}
:deep(.userInfo__container-content__avatar) {
  border-width: 4px;
}
</style>
