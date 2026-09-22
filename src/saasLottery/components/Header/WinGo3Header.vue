<template>
  <div class="head">
    <div class="l">
      <div class="head-beck" @click="onGoBeck">
        <backIcon class="bIcon"/>
      </div>
      <logoIcon class="lIcon"/>
    </div>
    <div class="r">
      <span>{{ dollarSign }}</span>
      <span>{{currency(animatedAmount) }}</span>
      <refreshIcon class="rIcon" :class="{ rotate: balanceLoading }" @click="updateBalance"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, watch, computed, onMounted} from "vue";
import { useRafFn } from '@vueuse/core'
import backIcon from '@/saasLottery/svg/back.svg';
import logoIcon from '@/saasLottery/svg/logo.svg';
import refreshIcon from '@/saasLottery/svg/refreshIcon.svg';
import {currency} from '@/saasLottery/utils';
import {useGlobalContext} from "@/saasLottery/hooks";
import {useRouter} from "vue-router";
const currentAmount = ref(0) // 当前金额
const targetAmount = ref(0)  // 目标金额
const duration = 800 // 动画持续时间
const startValue = ref(0) // 动画起始值
const elapsedTime = ref(0)
const {dollarSign, balance, balanceLoading, updateBalance} = useGlobalContext();
const router=useRouter()
const animatedAmount = computed(() => {
  const progress = Math.min(elapsedTime.value / duration, 1)
  return startValue.value + (targetAmount.value - startValue.value) * progress
})
const { pause,resume } = useRafFn(() => {
  if (elapsedTime.value < duration) {
    elapsedTime.value += 16.66;
    currentAmount.value = animatedAmount.value;
  } else {
    pause(); // 动画结束时停止
  }
});
const onGoBeck=()=>{
	router.push('/')
}
watch(balance,()=>{
  currentAmount.value=targetAmount.value;
  targetAmount.value=balance.value;
  elapsedTime.value = 0;
  resume()
})
watch(targetAmount, () => {
  elapsedTime.value = 0;
});
onMounted(()=>{
  targetAmount.value = balance.value;
})
</script>
<style lang="scss" scoped>
.head {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 36px;
  color: #fff;
  position: relative;
  z-index: 2;

  .bIcon {
    width: 17px;
    height: 30px;
  }
  &-beck{
    display: flex;
    align-items: center;
    width: 55px;
    height: 50px;
  }

  .l {
    display: flex;
    align-items: center;
    //gap: 16px;
    .lIcon{
      width:155px;
      height:80px
    }
  }

  .r {
    font-weight: 700;
    font-size: 32px;
    display: flex;
    align-items: center;
    gap: 10px;

    .rIcon {
      width: 40px;
      height: 40px;
    }
  }
}

.rotate {
  animation: rotate 1s ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>