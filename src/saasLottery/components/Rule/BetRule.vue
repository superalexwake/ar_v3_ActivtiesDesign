<script setup lang="ts">
import {PropType} from "vue";
defineProps({
  title:{
    type:String as PropType<string>
  },
})
const emit=defineEmits(['close'])
</script>

<template>
  <div class="bet-rule">
    <div class="bet-rule-head">
      <div class="sound-dot"></div>
      <span>· {{ title }} ·</span>
      <div class="sound-dot"></div>
    </div>

    <div class="bet-rule-body">
     <slot></slot>
    </div>
    <div class="bet-rule-foot">
      <slot name="foot">
        <div class="bet-rule-foot-btn" @click="emit('close')">
          {{$t('close')}}
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bet{
  &-rule {
    width: 600px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    &-head {
      height: 88px;
      line-height: 88px;
      color: #fff;
      font-size: 32px;
      text-align: center;
      background: var(--main_gradient-color);
      background-size: contain;
      span{
        margin: 0 10px;
      }
    }
    &-dot{
      height: 6px;
      width: 6px;
      background: #fff;
      border-radius: 50%;
    }

    &-body {
      position: relative;
      height: 700px;
      overflow-y: auto;
      overflow-x: hidden;
      color: var(--text_color_L1);
      padding: 20px 20px 0 20px;
      font-weight: 500;
      font-size: 28px;
      line-height: 40px;
      :deep(p) {
        line-height: 40px;
        color: var(--text_color_L1);
      }
    }

    &-foot {
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;

      &-btn {
        width: 320px;
	  	background: var(--main-color);
        border-radius: 40px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 28px;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}
</style>