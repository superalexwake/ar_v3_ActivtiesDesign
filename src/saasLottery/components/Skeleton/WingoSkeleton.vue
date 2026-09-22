<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import {onBeforeUnmount} from "vue";
const isLocked = useScrollLock(document.body)
isLocked.value = true // lock
onBeforeUnmount(()=>{
  isLocked.value = false;
})
</script>

<template>
<div class="wingo-skeleton">
  <div style="display: flex; align-items: center ;justify-content: space-between">
    <div class="top van-skeleton--animate">

    </div>
    <div class="top van-skeleton--animate">

    </div>
  </div>
  <div class="box issue">
    <div class="van-skeleton--animate"></div>
    <div class="van-skeleton--animate"></div>
  </div>
  <div class="box bet">
    <div class="van-skeleton--animate"></div>
    <div class="van-skeleton--animate"></div>
    <div class="van-skeleton--animate"></div>
    <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <ul>
      <li></li>
      <li></li>
    </ul>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
  <div class="box list">
    <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
</template>

<style scoped lang="scss">
:global(:root){
  --van-skeleton-paragraph-background:#EBE7E7;
}
.wingo-skeleton{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: #FFF;
  z-index: 100;
  overflow: hidden;
  height: 100vh;
  padding: 30px;
  .top{
    height: 60px;
    width: 240px;
    background: var(--van-skeleton-paragraph-background);
    border-radius: 8px;
  }
  .box{
    display: flex;
    width: 690px;
    padding: 24px;
    border-radius: 32px;
    border: 1px solid #E3D9D9;
    box-shadow: 0px 16px 40px 0px rgba(27, 37, 49, 0.03);
    margin-top: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .issue{
    div{
      width: 100%;
      height: 56px;
      background: var(--van-skeleton-paragraph-background);
      border-radius: 8px;
      &:first-child{
        width: 360px;
      }
    }
  }
  .bet{
    div{
      width: 100%;
      height: 56px;
      background: var(--van-skeleton-paragraph-background);
      border-radius: 8px;
      &:first-child{
        width:400px;
      }
      &:nth-child(3){
        width: 642px;
        height: 304px;
      }
    }
    ul{
      display: flex;
      align-items: flex-end;
      gap: 10px;
      &:nth-last-child(2){
        li{
          width: 317px;
        }
      }
      &:nth-last-child(1){
        li{
          width: 72px;
          height: 72px;
          &:first-child{
            width: 154px;
            height: 72px;
          }
        }
      }
      li{
        width: 208px;
        height: 96px;
        background: var(--van-skeleton-paragraph-background);
        border-radius: 8px;
      }
    }

  }
  .list{
    ul {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 10px;
      li{
        width: 140px;
        height: 64px;
        background: var(--van-skeleton-paragraph-background);
        border-radius: 8px;
      }
    }
    div{
      width: 100%;
      height: 56px;
      background: var(--van-skeleton-paragraph-background);
      border-radius: 8px;
    }
  }
}
</style>