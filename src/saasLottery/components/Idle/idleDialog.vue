<script setup lang="ts">
import { watch,ref } from 'vue'
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:show'])
const idleDialog=ref(false)

watch(() => props.show, (newValue) => {
  idleDialog.value=newValue;
});
const onGo=()=>{
  emit('update:show',false);
  location.reload();
}
</script>

<template>
  <van-popup v-model:show="idleDialog"
             round
             :close-on-click-overlay="false"
             @close="emit('update:show',false)"
  >
    <div class="idle">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="60" fill="#F95959"/>
          <path d="M60 33.75V71.25" stroke="white" stroke-width="8" stroke-linecap="round"/>
          <circle cx="60" cy="88.125" r="3.75" fill="white" stroke="white" stroke-width="3.75"/>
        </svg>
      </div>
      <p>{{$t('common.idle')}}</p>
      <div class="idle-btn" @click="onGo">{{$t('common.refresh')}}</div>
    </div>

  </van-popup>
</template>

<style scoped lang="scss">
.idle{
  width: 600px;
  padding: 40px 120px;
  border-radius: 32px;
  display: flex;
  background: #FFF;
  flex-direction: column;
  align-items: center;
  gap: 44px;
  svg{
    width: 120px;
    height: 120px;
  }
  p{
    color: #383A4C;
    text-align: center;
    font-family: "PingFang SC";
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: 40px
  }
  &-btn{
    width: 320px;
    height: 80px;
    padding: 10px;
    border-radius: 44px;
    background: #F3F4FA;
    text-align: center;
    line-height: 60px;
    color: #323536;
    font-family: "PingFang SC";
    font-size: 28px;
    font-weight: 500;
    cursor: pointer;
  }
}
</style>