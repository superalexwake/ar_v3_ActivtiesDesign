<template>
  <div
    class="userInfo__container"
    :class="{
      'setting-page-container': isSettingPage,
    }"
  >
    <NavBar
      v-show="isSettingPage"
      :title="$t('settingCenter')"
      class="main"
      :placeholder="false"
      left-arrow
      @click-left="onClick"
    />

    <div v-show="!isSettingPage" class="userInfo__container-content">
      <div class="userInfo__container-content-wrapper">
        <div
          class="userInfo__container-content__avatar"
          @click="showEditAvatarDialog(true)"
        >
          <img
            :src="avatarUrl"
            class="userAvatar"
            @error="fixIcons(avatarUrl, 'userAvatar')"
          />
        </div>
        <div class="userInfo__container-content__name">
          <div class="userInfo__container-content-nickname">
            <h3>{{ userInfo.nickName?.toUpperCase() }}</h3>
            <div :class="['n' + vipUsersData?.vipLevel]"></div>
            <img
              class="editPencil"
              v-show="isSettingPage"
              @click="showEditNameDialog(true)"
              src="@public/main/editPencil.png"
            />
          </div>
          <div class="userInfo__container-content-uid">
            <span>UID</span>
            <span>|</span>
            <span>{{ userInfo.userId }}</span>
            <svg-icon
              @click="copy(userInfo.userId.toString())"
              name="copy"
            />
          </div>
          <div v-show="!isSettingPage" class="userInfo__container-content-logintime">
            <span>{{ $t("lastLoginTime") }}&nbsp;</span>
            <span v-show="userInfo.userLoginDate">{{ userInfo.userLoginDate }}</span>
          </div>
          <div v-show="isSettingPage" class="userInfo__container-content-logintime">
            <span>&nbsp;</span>
          </div>
        </div>
      </div>

      <div
        v-show="isSettingPage"
        class="userInfo__container-content-right"
        @click="showEditAvatarDialog(true)"
      >
        <h5>{{ $t("changeAvatar") }}</h5>
      </div>
    </div>
    <div v-show="isSettingPage" class="userInfo__container-setting-center">
      <div
        class="userInfo__container-setting-center-header"
        @click="showEditAvatarDialog(true)"
      >
        <div class="userInfo__container-content__avatar">
          <img v-lazy="avatarUrl" :data-img="defaultImgAvatar1" />
        </div>
        <div
          class="userInfo__container-setting-center-header-edit"
          @click="showEditAvatarDialog(true)"
        >
          <span>{{ $t("changeAvatar") }}</span>
          <van-icon name="arrow" color="#888" />
        </div>
      </div>
      <div
        class="userInfo__container-setting-center-content ar-1px-b"
        @click="showEditNameDialog(true)"
      >
        <h5>{{ $t("nickName") }}</h5>
        <div @click="showEditNameDialog(true)">
          <span>{{ userInfo.nickName }}</span>
          <van-icon name="arrow" color="#888" @click="showEditNameDialog(true)" />
        </div>
      </div>
      <div class="userInfo__container-setting-center-content">
        <h5>UID</h5>
        <div>
          <span>{{ userInfo.userId }}</span>
          <svg-icon name="copy" @click="copy(userInfo.userId.toString())"/>
        </div>
      </div>
    </div>

    <DiaLogOther
      v-model:show="showEditName"
      @confirm="onSaveName"
      :title="$t('editNickname')"
    >
      <template #content>
        <div class="info-dialog-content-title">
          <svg-icon name="dialogNickname" />
          <span>{{ $t("nickName") }}</span>
        </div>
        <input
          type="text"
          auto-complete="new-password"
          autocomplete="off"
          name="username"
          v-model="nickNameDraft"
          :placeholder="$t('tipEnterNickname')"
        />
        <h4 v-show="isTips">{{ $t("tipDoNotEnterUnvalideNickname") }}</h4>
      </template>
    </DiaLogOther>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from "@/types/api";
import { copy, AwaitApiResult } from "@/utils";
import { useAssets } from "@/hooks/useAssets";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import DiaLogOther from "@/components/common/DiaLogOther.vue";
import { EditNickName, GetVipUsers } from "@/api";

import { GlobalStore, useCommonStore } from "@/stores";
const { getAvatarUrl, defaultImgAvatar1 } = useAssets();
const globalStore = GlobalStore();
const userInfo = globalStore.getUserInfo as UserInfo;
//console.log('用户数据', globalStore.getUserInfo)
const { setLoading } = useCommonStore();
const router = useRouter();

const props = withDefaults(
  defineProps<{
    userInfo: UserInfo;
  }>(),
  {}
);
const showEditName = ref(false);
const isSettingPage = ref(false);
// 草稿态：输入直接写 store 的 userInfo 会让取消/保存失败后展示已被改脏
const nickNameDraft = ref("");

//如果获取不到用户数据，则刷新页面

function showEditNameDialog(type: boolean) {
  if (type) nickNameDraft.value = props.userInfo.nickName ?? "";
  showEditName.value = type;
}
function showEditAvatarDialog(type: boolean) {
  router.push({ name: "Avatar" });
}

onMounted(() => {
  if (router.currentRoute.value.name === "SettingCenter") {
    isSettingPage.value = true;
  } else {
    isSettingPage.value = false;
    getVipUsers();
  }
});

const isTips = ref(false);
const vipUsersData = ref(); //vip初始信息
async function getVipUsers() {
  setLoading(true);
  const res = await AwaitApiResult(GetVipUsers());
  if (res) {
    vipUsersData.value = res.data;
  }
  setLoading(false);
}

//修改昵称
async function onSaveName() {
  const nickName = nickNameDraft.value.trim();
  if (nickName === "" || nickName.length > 12) {
    isTips.value = true;
    showEditName.value = true;
    return false;
  }
  isTips.value = false;
  showEditName.value = false;

  const res = await AwaitApiResult(
    EditNickName({
      nikeName: nickName,
    })
  );
  // 只有保存成功才落到 store，失败保持原昵称
  if (res) {
    globalStore.setUserInfo({
      ...props.userInfo,
      nickName,
    });
  }
}

function onClick() {
  router.go(-1);
}

function onSaveAvatar() {}

const fixIcons = (url: any, className: string) => {
  url = defaultImgAvatar1;

  let dom: any = document.querySelector(`.${className}`);
  dom.src = url;
};

const avatarUrl = ref(getAvatarUrl(props.userInfo.userPhoto));
</script>

<style lang="scss" scoped>
.userInfo__container {
  width: 100%;
  height: 420px;
  padding-bottom: 218px;
  display: flex;
  align-items: flex-end;
  border-radius: 0 0 60px 60px;
  background: var(--light-main_gradient-color, var(--bg_color_L2));

  &-nav {
    color: #fff;
    font-size: 36px;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 30px;
    width: 100%;
    background: var(--main_gradient-color);
    z-index: 99;

    span {
      flex: 1;
    }

    &-title {
      text-align: center;
      color: var(--text_color_L1);
    }
  }

  &-setting-center {
    width: 702px;
    background: var(--bg_color_L3);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 22px 30px;
    position: relative;
    top: 370px;
    z-index: 99;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-edit {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--text_color_L2);

        span {
          font-size: 26px;
          padding-right: 26px;
        }
      }
    }

    &-content {
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      color: var(--text_color_L1);
      padding: 47px 0;
    

      div {
        display: flex;
        align-items: center;
      }
      h5{
        color: var(--text_color_L2);
      }

      span {
        padding-inline-end: 12px;
      }

      svg {
        width: 34px;
        color: var(--main-color);
      }
    }
  }
  $list: 0 1 2 3 4 5 6 7 8 9 10;

  @each $i in $list {
    .n#{$i} {
      width: 100px;
      height: 44px;
      margin: 0 10px;
      background-image: url("@/assets/icons/vip/grade/#{$i}.png");
      background-size: 100px 44px;
    }
  }
  .userInfo_dialog_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--bg_color_L2);
    border-radius: 5px;
    padding: 10px;

    input {
      height: 88px;
      width: 80%;
      border: none;
      border-radius: 60px;
      background: var(--bg_color_L1);
      font-size: 28px;
      padding: 0 40px;
      color: var(--text_color_L1);
      &::placeholder{
        color: var(--text_color_L3);
      }
    }
  }

  &-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 34px;
    color: #fff;

    &-wrapper {
      display: flex;
      justify-content: flex-start;
    }

    &__avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      margin-right: 15px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        // object-fit: contain;
      }
    }

    &__name {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    &-nickname {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 30px;
      color: #fff;

      img {
        width: 100px;
        margin: 0 10px;
      }

      .editPencil {
        width: 30px;
      }
    }

    &-uid {
      width: 230px;
      border-radius: 40px;
      padding: 5px 0;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background-color: var(--norm_secondary-color);
      img {
        width: 24px;
      }
    }

    &-logintime {
      font-size: 22px;
      color: #fff;
    }

    &-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        width: 66px;
      }

      span {
        font-size: 24px;
        color: #ffee87;
      }

      h5 {
        width: 160px;
        height: 40px;
        border-radius: 20px;
        text-align: center;
        font-size: 26px;
      }
    }
  }

  .info-dialog {
    &-content {
      &-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 24px;
        column-gap:16px;
        svg {
          width: 48px;
          height: 48px;
        }
        span {
          font-size: 32px;
          color: var(--text_color_L1);
        }

        img {
          width: 48px;
          margin-right: 15px;
        }
      }

      input {
        width: 610px;
        height: 88px;
        background: var(--bg_color_L1);
        border-radius: 60px;
        border: none;
        padding-left: 45px;
        color: var(--text_color_L1);
        &::placeholder{
          color: var(--text_color_L3);
        }
      }

      h4 {
        font-size: 24px;
        color: var(--norm_red-color);
        padding-left: 45px;
        padding-top: 22px;
      }

      &-avatar-list {
        padding-top: 90px;

        img {
          width: 200px;
        }
      }
    }
  }
}

.setting-page-container {
  height: 388px;
  display: flex;
  justify-content: center;
}

:deep(.van-icon) {
  font-size: 28px;
}
</style>
