<template>
  <div class="pointMall__container-products">
    <div class="pointMall__container-products__tabs" ref="productTabsRef">
      <div
        v-for="item in productTypes"
        :key="item.typeID"
        :class="{
          active: activeProductType === item.typeID,
        }"
        @click="onTabClick(item.typeID)"
      >
        {{ item.typeName }}
      </div>
    </div>
    <List
      v-if="activeProductType === '1000'"
      :distance="300"
      :api="GetPointsLotteryList"
      v-model:list="list"
      :page-query="{ pageNo: 1, status: 1, pageSize: 5 }"
      :isAutoLoad="true"
      :showNoM="false"
      ref="listRef"
    >
      <template #content>
        <div class="pointMall__container-products-point">
          <Treasure v-for="item of list" :item="item" :key="item.pointsLotteryID" />
        </div>
        <div
          class="pointMall__container-products-all"
          v-show="list.length"
          @click="onLotteryActivityClick"
        >
          {{ $t("allActivity") }}
        </div>
      </template>
    </List>
    <List
      v-else
      :distance="300"
      :api="GetProductList"
      v-model:list="productList"
      v-model:page-query="productListQuery"
      :isAutoLoad="true"
      ref="productRef"
    >
      <template #content>
        <div class="pointMall__container-products__content">
          <ProductItem
            v-for="(item, index) in productList"
            :key="index"
            :product="item"
          />
        </div>
      </template>
    </List>
  </div>
  <div class="pointMall__container-cart" @click="onCartClick">
    <div v-if="activeProductType === '1000'">
      <span> {{ $t("MyTreasure") }} </span>
    </div>
    <div v-else>
      <svg-icon name="cart"></svg-icon>
      <span> {{ $t("myOrder") }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetBannerTypeList, GetPointsLotteryList, GetProductList } from "@/api";
import List from "@/components/common/List.vue";
import type { Product } from "@/types/api";
import { AwaitApiResult } from "@/utils";
import { onMounted, ref } from "vue";
import ProductItem from "./ProductItem.vue";
import Treasure from "../Treasure.vue";
import { useRouter } from "vue-router";
import { usePointLottery } from "@/hooks";
import { useI18n } from "vue-i18n";

const productRef = ref();
const router = useRouter();
interface ProductType {
  typeID: number;
  typeName: string;
}
interface ProductListRes {
  productList: Array<Product>;
}
const { listRef, list } = usePointLottery();
const activeProductType = ref<any>(1);
const { t } = useI18n();
const productTypes = ref<Array<ProductType>>([]);

const productList = ref<ProductListRes["productList"]>([]);
const productListQuery = ref({
  typeId: activeProductType.value,
  pageNo: 1,
  pageSize: 10,
});

const productTabsRef = ref<HTMLElement>();
function onLotteryActivityClick() {
  router.push({
    name: `${String(router.currentRoute.value.name)}-LotteryActivity`,
  });
}
function onCartClick() {
  const name = activeProductType.value === "1000" ? "MyLottery" : "MyOrders";
  router.push({
    name: `${String(router.currentRoute.value.name)}-${name}`,
  });
}
function onTabClick(id: any) {
  activeProductType.value = id;
  if (id == 1000) {
    return;
  }
  productListQuery.value.pageNo = 1;
  productListQuery.value.typeId = parseInt(id);
  productList.value = [];
  productRef.value.resetRefresh();
}

async function getProductTypes() {
  const result = await AwaitApiResult(GetBannerTypeList());
  if (result) {
    const list = result.data?.productTypeList;
    productTypes.value = list.map((item: any) => {
      if (item.typeID == "1000")
        return Object.assign(item, {
          typeName: t("MyTreasure"),
        });
      return item;
    });
    if (productTypes.value.length > 0)
      activeProductType.value = productTypes.value[0].typeID;
  }
}

onMounted(async () => {
  await getProductTypes();
});
</script>

<style lang="scss" scoped>
.pointMall__container-products {
  position: sticky;
  top: 400px;
  margin-block: 48px 112px;
  padding-inline: 24px;

  &__tabs {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    & > div {
      flex: 1;
      color: var(--text_color_L1);
      font-size: 30px;
      white-space: nowrap;
      &:first-of-type {
        position: relative;
        padding-left: 30px;

        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0px;
          transform: translateY(-50%);
          display: block;
          width: 6px;
          height: 30px;
          background: var(--main-color);
          html:lang(ar) & {
            right: 0;
            left: unset;
          }
        }
      }

      &.active {
        color: var(--darkTextW, var(--text_color_L1)) !important;
        font-weight: bold;
      }
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 30px;
    column-gap: 42px;
    justify-items: center;
    width: 100%;
    margin-bottom: 50px;
  }
  &-point {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    row-gap: 30px;
    column-gap: 42px;
    justify-items: center;
    width: 100%;
    margin-bottom: 50px;
  }
  &-all {
    height: 80px;
    line-height: 80px;
    border: 1px solid var(--main-color);

    border-radius: 50px;
    color: var(--main-color);
    text-align: center;
    font-size: 28px;
  }
}
.pointMall__container {
  &-cart {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: center;
    max-width: 750px;
    padding: 15px 0;
    color: var(--main-color);
    font-size: 34px;
    text-align: center;
    background: var(--pop_bg-color, var(--bg_color_L3));
    z-index: 1000;

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 26px;
      width: 100%;
      color: var(--main-color);
      background: var(--pop_bg-color, var(--bg_color_L3));

      img,
      svg {
        width: 50px;
        height: 50px;
      }
      span {
        color: var(--text_white, var(--main-color));
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .pointMall__container {
    &-cart {
      max-width: none;
    }
  }
}
</style>
