<template>
  <div class="settingPanel__container">
    <div class="settingPanel__container-items">
      <div
        v-for="item in settingPanelItems"
        :key="item.title"
        @click="handleItem(item)"
        class="settingPanel__container-items__item ar-1px-b"
        v-show="item.isopen == '1'"
        v-haspermission="item.haspermission"
      >
        <div class="settingPanel__container-items__title">
          <svg-icon :name = "(`${item.name}`)" />
          <span>{{ item.title }}</span>
        </div>
        <div class="settingPanel__container-items-right">
          <h5 v-show="badgeCount(item) > 0">{{ badgeCount(item) }}</h5>
          <span v-show="item.name=== 'language'">{{
            globalStore.getLanguageName
          }}</span>
          <van-icon name="arrow" color="#666" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GlobalStore } from "@/stores";
import { computed, ref } from "vue";

import { useRouter } from "vue-router";
import type { UserInfo } from "@/types/api";
import { useI18n } from "vue-i18n";
import { useSessionStorage } from "@vueuse/core";
import { showToast } from "vant";
const { t } = useI18n();
const router = useRouter();
const globalStore = GlobalStore();
//查询是否开启积分商城
const userInfo = computed(() => {
  return globalStore.userInfo as UserInfo;
});
// 菜单项 name → userInfo 计数字段；新增角标只加一行映射，不在模板堆 name 判断
const BADGE_FIELDS: Record<string, keyof UserInfo> = {
  notification: "unRead",
  login_list_icon: "unUsedRechargeCouponCount",
};
const badgeCount = (item: { name: string }) =>
  Number(userInfo.value?.[BADGE_FIELDS[item.name]] ?? 0);
let permission: any = useSessionStorage("permission", null);
permission && (permission = JSON.parse(permission.value));
const isOpenChampion = computed(() => {
  return userInfo.value.isOpenChampion;
});
const settingPanelItems = ref([
  {
    name: "notification",
    title: t("notifications"),
    link: "Messages",
    isopen: "1",
  },
  {
    name: "gifts",
    title: t("giftExchange"),
    link: "RedeemGift",
    isopen: "1",
  },
  {
    name: "login_list_icon",
   title: t("myRechargeCoupon"),
    link: "RechargeCoupon",
    isopen: "1",
  },
  {
    name: "tournament",
    title: t("cpsTip6"),
    link: "MyCps",
    isopen: isOpenChampion,
  },
  {
    name: "productCode",
    title: t("productOrder"),
    link: "PointMall-MyOrders",
    isopen: userInfo.value.isOpenPointMall,
  },
  {
    name: "myDraw",
    title: t("MyLottery"),
    link: "PointMall-MyLottery",
    isopen: userInfo.value.isOpenPointMall,
  },
  {
    name: "statsIcon",
    title: t("gameStatistics"),
    link: "GameStats",
    isopen: "1",
    haspermission: 17,
  },
  {
    name: "language",
    title: t("switchLanguages"),
    link: "Language",
    isopen: "1",
  },
]);

function handleItem(item: any) {
  if (!item.link) {
    showToast("敬请期待");
    return;
  }
  router.push({
    name: item.link,
  });
}
</script>

<style lang="scss" scoped>
.settingPanel__container {
	padding: 0 20px 10px;
	border-radius: 20px;
	background: var(--darkBg,var(--bg_color_L2));

  h1 {
    margin-bottom: 20px;
    color: var(--darkTextW, var(--text_color_L1));
    font-size: 30px;
  }

	&-items {
		display: flex;
		flex-direction: column;
		color: var(--text_color_L1);
		padding-bottom: 20px;
    
    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28px;
      padding: 25px 0;
      
      svg {
        width: 60px;
        height: 60px;

      }
      span {
        color: var(--text_color_L1);
      }
      &:last-child{
        &.ar-1px-b{
          &::after {
            content: none;
          }
        }
      }
    }

    &__title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap:12px;
      svg {
        color: var(--main-color);
      }
    }

    &-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      span {
        font-size: 28px;
        padding-right: 30px;
        color: var(--text_color_L1);
      }

      h5 {
        font-size: 24px;
        color: #fff;
        border-radius: 32px;
        margin-right: 30px;
        background: var(--norm_red-color);
        height: 32px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
