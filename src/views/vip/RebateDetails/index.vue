<template>
  <div class="vip-RebateDetails">
    <NavBar :title="$t('RebateDetailTip1')" left-arrow @click-left="router.go(-1)" />
    <h1>{{ $t("RebateDetailTip2") }}</h1>
    <div class="vip-RebateDetails-items" v-for="item in vipLevelList" :key="item.id">
      <div class="header ar-1px-b" :class="`bg${item.id}`">VIP {{ item.id }}</div>
      <div class="item">
        <div>
          <span><svg-icon name="vipRebateDark" />{{ $t("RebateDetailTip3") }}</span
          ><span>{{ accMul(item.electronic || 0, 100) }} %</span>
        </div>
        <div class="line"></div>
        <div>
          <span><svg-icon name="vipRebateLight" />{{ $t("RebateDetailTip4") }}</span
          ><span>{{ accMul(item.realPerson || 0, 100) }} %</span>
        </div>
        <div class="line"></div>
        <div>
          <span><svg-icon name="vipRebateLight" />{{ $t("RebateDetailTip6") }}</span
          ><span>{{ accMul(item.lottery || 0, 100) }} %</span>
        </div>
        <div class="line"></div>
        <div>
          <span><svg-icon name="vipRebateLight" />{{ $t("RebateDetailTip7") }}</span
          ><span>{{ accMul(item.chess || 0, 100) }} %</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { GetAllVipLevelList } from "@/api";
import type { ResGetAllVipLevelList } from "@/types/api";
import { onMounted, ref } from "vue";
import { useCommonStore } from "@/stores";
import { AwaitApiResult, accMul } from "@/utils";

const { setLoading } = useCommonStore();
const router = useRouter();

const vipLevelList = ref<ResGetAllVipLevelList[]>([]);
async function getListVipUserRewards() {
  setLoading(true);
  const res = await AwaitApiResult(GetAllVipLevelList());
  if (res) {
    vipLevelList.value = res.data;
    vipLevelList.value.sort(function (a, b) {
      return a.id - b.id;
    });
  }
  setLoading(false);
}
onMounted(() => {
  getListVipUserRewards();
});
</script>
<style lang="scss" scoped>
.vip-RebateDetails {
  padding: 20px 20px;

  > h1 {
    color: var(--main-color);
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 30px;
  }

  &-items {
    color: var(--text_color_L2);
    border-radius: 10px;
    padding: 30px 20px;
    margin-bottom: 20px;
    background: var(--bg_color_L2);

    .header {
      height: 50px;
      margin-bottom: 20px;
      color: var(--main-color);
      font-style: oblique;
      font-size: 36px;
      font-weight: 600;
      // $list: 0 1 2 3 4 5 6 7 8 9 10;

      // @each $i in $list {
      // 	&.bg#{$i} {
      // 		background: url('@icon/main/RebateDetails/#{$i}.png') no-repeat left top;
      // 		background-size: 98px 30px;
      // 	}
      // }
    }

    .item {
      > div:not(.line) {
        display: flex;
        justify-content: space-between;
        height: 30px;
        line-height: 30px;
        font-size: 24px;
        
        > span:first-child {
          color: var(--text_color_L2);
          display: flex;
          gap:10px;
          opacity: .8;
          
          svg{
            width: 20px;
            height: 20px;
          }
        }
      }

      > div:first-child > span:first-child {
        display: flex;
        gap:10px;
        opacity: 1;
        
      }

      .line {
        height: 25px;
        border-left: dashed 1px var(--main-color);
        margin-left: 9px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
