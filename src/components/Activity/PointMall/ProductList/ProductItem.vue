<template>
  <div class="pointMall__container-products__content-item">
    <div class="pointMall__container-products__content-item__header">
      <img v-lazy="product.productImg" />
      <div class="pointMall__container-products__content-item__header-left">
        {{ $t("productLeft") }}:
        <span>{{ product.stock > 9999 ? "9999+" : product.stock }}</span>
      </div>
      <div class="pointMall__container-products__content-item__header-redeemed">
        <span>{{ product.grandTotal > 9999 ? "9999+" : product.grandTotal }}</span>
        ({{ $t("pointsExchanged") }})
      </div>
    </div>
    <div class="pointMall__container-products__content-item__footer">
      <span class="product-title">{{ formatString(product.productName, 40) }}</span>
      <div>
        <svg-icon name="point"/>
        <span>{{ product.integral }}.00</span>
      </div>
      <button @click="onRedeemClick">{{ $t("exchange") }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {formatString} from '@/utils'
import {defineAsyncComponent, type PropType} from 'vue'
import {useRouter} from 'vue-router'
import type {Product} from '@/types/api'
import {useActivityStore} from '@/stores/modules/activity'

const router = useRouter()
const activityStore = useActivityStore()

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true
	}
})

const diamondRedSm = defineAsyncComponent(() => import('@/svg/activity/diamondRedSm.vue'))

function onRedeemClick() {
	activityStore.setRedeemItem(props.product)
	router.push({
		name: `${String(router.currentRoute.value.name)}-Redeem`
	})
}
</script>

<style lang="scss" scoped>
.pointMall__container-products__content-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 330px;
  // height: 456px;

  &__header,
  &__body {
    position: relative;
    width: 100%;
  }

  &__header {
    height: 456px-208px;
    color: var(--text_color_L4);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: var(--main_gradient-color);

    &-left,
    &-redeemed,
    & > img {
      position: absolute;
    }

    img {
      left: 50%;
      transform: translate(-50%, 0);
      height: 247.5px;
      width: 330px;
      object-fit: cover;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
    }

    &-left {
      bottom: 0;
      width: 100%;
      height: 40px;
      padding: 9px 6px;
      font-size: 22px;
      line-height: 24px;
      background: var(--main-color);
      color: var(--text_color_L4);
      z-index: 1;

      & > span {
        font-size: 30px;
      }
    }

    &-redeemed {
      bottom: 0;
      right: 0;
      display: flex;
      width: 126px;
      height: 75px;
      flex-direction: column;
      align-items: center;
      padding-block: 7px;
      font-size: 22px;
      background: url("@icon/activity/PointMall/redeemdBg.png") no-repeat right/contain;
      z-index: 2;
      color: var(--text_white, var(--text_color_L4));

      & > span {
        font-size: 30px;
        font-weight: 700;
        line-height: 1;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    // height: 208px;
    padding: 18px 14px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background: var(--bg_color_L2);

    & > span {
      color: var(--text_color_L1);
      font-size: 28px;
      line-height: 36px;
      font-weight: 700;
    }

    .product-title {
      height: 60px;
      width: 100%;
      line-height: 30px;
      // white-space: nowrap;
      padding-right: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    div {
      display: flex;
      align-items: center;
      gap: 21px;
      margin-top: 28px;
      color: var(--norm_secondary-color);
      img {
        width: 30px;
        height: 30px;
      }

      span {
        font-size: 26px;
        line-height: 26px;
        font-weight: 500;
      }
    }

    button {
      width: 299px;
      height: 60px;
      margin-top: 22px;
      margin-inline: auto;
      color: var(--text_color_L4);
      font-weight: 28px;
      border: none;
      border-radius: 9rem;
      background: var(--main_gradient-color);
      cursor: pointer;
      font-size: 28px;
    }
  }
}
</style>
