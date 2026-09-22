<template>
  <!-- 投注内容 begin -->
  <van-popup
      v-model:show="showPopup"
      position="bottom"
      class="betPopup"
      :round="true"
      :close-on-click-overlay="false"
  > 
    <div class="bet_p-body">
      <slot></slot>
      <div class="bet_p-body-line">
		  {{ t('amount') }}
        <div class="bet_p-body-line-list">
          <div
              v-for="(item, index) in betTypeList"
              :key="index"
              class="bet_p-body-line-item"
              :class="{ bgcolor: props.selectInfo.coin == item }"
              @click="changeCoin(item)"
          >
            {{ formatNum(item) }}
          </div>
        </div>
      </div>
      <div class="bet_p-body-line">
		  {{ t('numbers') }}
        <div class="bet_p-body-line-btnL">
          <div class="bet_p-btn" :class="{ bgcolor: props.selectInfo.count > 0 }" @click="Stepper(1)">-</div>
          <van-field
              class="bet_p-input"
              v-model.number="props.selectInfo.count"
              type="digit"
              :maxlength="8"
              @input="changeStep"
          />
          <div class="bet_p-btn bgcolor" @click="Stepper(2)">+</div>
        </div>
      </div>
      <div class="bet_p-body-line">
        <div></div>
        <div class="bet_p-body-line-list ">
          <div
              v-for="(item, index) in multipleList"
              :key="index"
              class="bet_p-body-line-item setBorder"
              @click="TaskCount(item)"
              :class="{ bgcolor: props.selectInfo.count == item }"
          >
            X{{ item }}
          </div>
        </div>
      </div>

      <div class="bet_p-body-line">
		  <!-- <span class="bet_p-agree" :class="{ active: agreePreSale }" @click="agreePreSale = !agreePreSale">{{ t('agree') }}</span>
		  <span @click="isShowPreSale = true" class="bet_p-preSaleShow">{{ t('presaleRules') }}</span> -->
            <van-checkbox v-model="agreePreSale" checked-color="var(--main-color)">
                {{ $t('agree') }}
                <span class="bet_p-preSaleShow" @click.stop="isShowPreSale = true">{{ $t('presaleRules') }}</span>
            </van-checkbox>
      </div>
    </div>
    <div class="bet_p-foot">
      <div class="bet_p-foot-c" @click="emits('clearBetting')">{{ t('cancel') }}</div>
      <div class="bet_p-foot-s bgcolor" :class="{ disabled: !canSubmit }" @click="submitBetting">
		  {{ t('totalAmount') }}{{ currency(props.selectInfo.allCoin || 0) }}
      </div>
    </div>
  </van-popup>

  <!-- 预售规则弹层 begin-->
  <van-popup v-model:show="isShowPreSale" :close-on-click-overlay="false" round>
    <div class="bet_p-PreSale">
      <div class="bet_p-PreSale-head">{{ t('presaleRules') }}</div>
      <div class="bet_p-PreSale-body">
		  {{ $t('betPopTXT') }}
      </div>
      <div class="bet_p-PreSale-foot">
        <div class="bet_p-PreSale-foot-btn" @click="knowPreSale">{{ t('iKonw') }}</div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// import { showToast } from 'vant'
import {currency, formatNum, clampBetCountInput} from '@/saasLottery/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import {useD5Context} from "@game/D5/hooks/useD5_3";
import {useToast} from "@/saasLottery/hooks";
const {agreePreSale}=useD5Context()
const toast=useToast();

const emits = defineEmits<{
  (e: 'update:bettingPopupShow', val: boolean): void
  (e: 'update:selectInfo', val: any): void
  (e: 'clearBetting'): void
  (e: 'computedCoin'): void
  (e: 'submitBetting'): void
}>()

// 是否展示预售规则
const isShowPreSale = ref(false)

// 是否同意预售规则
// const isCheckPreSale = ref(true)

// 倍数份数快捷选项按钮
const multipleList = computed(() => {
  return props.currentGame?.betMultiples
})

const props = withDefaults(
    defineProps<{
      currentGame: any
      bettingPopupShow: any
      betTypeList: any
      selectInfo: any
    }>(),
    {}
)

watch(
    () => multipleList,
    () => {
      props.selectInfo.count = multipleList?.value?.[0]
    },
    { deep: true, immediate: true }
)
/**
 * 是否展示弹窗
 */
let showPopup = computed({
  get(): boolean {
    return props.bettingPopupShow || false
  },
  set(val: boolean) {
    emits('update:bettingPopupShow', val)
  }
})

// 份数加减
const Stepper = (e: number) => {
  const cur = clampBetCountInput(props.selectInfo.count) ?? 0
  switch (e) {
    case 1:
      if (cur > 1) props.selectInfo.count = cur - 1
      break
    case 2:
      props.selectInfo.count = clampBetCountInput(cur + 1) as number
      break
    default:
  }
  emits('computedCoin')
}
// 输入框设置数量:只保留正整数,输入过程允许清空以便重新输入
const changeStep = (e: any) => {
  const val = clampBetCountInput(e)
  if (val !== null) props.selectInfo.count = val
  emits('computedCoin')
}
const canSubmit = computed(() => Number(props.selectInfo.count) >= 1)

// 购买份数切换
const TaskCount = (item: number) => {
  props.selectInfo.count = item
  emits('computedCoin')
}
 // 购买金额切换
const changeCoin = (item: any) => {
  props.selectInfo.coin = item
  emits('computedCoin')
}

// 知道预售规则
const knowPreSale = () => {
  isShowPreSale.value = false
  // isCheckPreSale.value = true
}

// 点击提交金额
const submitBetting =  () => {
  if (!canSubmit.value) return
  if (!agreePreSale.value) return  toast.error(t('agreePresaleRules'))
  emits('submitBetting')
}
</script>

<style lang="scss" scoped>
.bet_p {

  &-body {
    padding: 38px 26px 40px 26px;
    background: var(--bg_color_L2);
    &-line {
      font-size: 32px;
      color:var(--text_color_L1);
      height: 56px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;

      &-list {
        display: flex;
        justify-content: space-between;
      }

      &-item {
        padding: 0 16px;
        background:var(--bg_color_L3);
        color: var(--text_color_L2);
        border-radius: 6px;

        & + div {
          margin-left: 12px;
        }
      }

      & + div {
        margin-top: 30px;
      }

      &-btnL {
        justify-content: center;
        display: flex;
      }

      &:last-child {
        justify-content: flex-start;
      }
    }
  }

  &-foot {
    height: 72px;
    display: flex;
    text-align: center;
    line-height: 72px;
    font-size: 28px;

    &-c {
      flex: 1;
      background:var(--bg_color_L3);
      color:var(--text_color_L2);
    }

    &-s {
      flex: 2;
      background: var(--main-color);
      color:var(--text_color_L4);

      &.disabled {
        opacity: 0.6;
      }
    }
  }

  &-btn {
    width: 56px;
    height: 56px;
    pointer-events: none;
    text-align: center;
    font-size: 50px;
    padding: 0;
    background: linear-gradient(90deg, #CCCEDC 15.38%, #CDCFDD 98.73%);
    color:var(--text_color_L4);
    flex: none;
    border-radius: 6px;
  }

  &-input {
    padding: 2px 20px;
    width: 158px;
    margin: 0 12px;
    background-color: var(--bg_color_L1);
    color: var(--text_color_L4);
    &::after {
      content: none;
    }

    :deep(.van-field__control) {
      text-align: center;
      font-size: 28px;
      line-height: 54px;
    }
  }

  &-preSaleShow {
    margin-left: 26px;
    font-size: 24px;
    color: var(--norm_red-color);
  }

  &-PreSale {
    width: 528px;

    &-head {
      height: 90px;
      line-height: 90px;
      color: var(--text_color_L4);
      font-size: 30px;
      text-align: center;
      background:  linear-gradient(90deg, var(--main-color) 0%, var(--main-color) 100%);
    }

    &-body {
      max-height: 600px;
      overflow-y: auto;
      color: var(--text_color_L1);
      padding: 30px;
      font-size: 24px;
      line-height: 60px;

      :deep(p) {
        margin-bottom: 15px;
        line-height: 40px;
      }
    }

    &-foot {
      height: 140px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-btn {
        width: 60%;
        background: linear-gradient(90deg, var(--main-color) 0%, var(--main-color) 100%);
        border-radius: 40px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 28px;
        color:var(--text_color_L4);
      }
    }
  }
}

.bgcolor {
  pointer-events: all;
  color:var(--text_color_L4);
  background: var(--main-color);
}
.betPopup{
  //left: 0;
  //right: 0;
  bottom: 0;
  margin: auto;
  max-width: 750px;
  box-shadow: 0px -18px 40px rgba(37, 37, 60, 0.26);
  background: #fff
}
</style>
