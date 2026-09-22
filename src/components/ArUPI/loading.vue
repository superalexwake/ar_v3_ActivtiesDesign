<template>
    <div class="mask" v-if="msg.show">
    <div class="com__box" v-if="msg.show">
        <!-- loading -->
        <Vue3Lottie :animationData="loadingJson" :height="size" :width="size" />
        <!-- 说明：组件名 -->
        <!-- <h4 class="explain mt10">{{msg.title}}</h4> -->
    </div>
  </div>
  </template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Vue3Lottie } from 'vue3-lottie'
import loadingJson from '../assets/Json/loading.json'
const props = withDefaults(defineProps<{
  msg:{
    show:boolean
    title:string 
  }
}>(),{
  
})
const size = ref(200)

watch(props.msg,(newVal)=>{
  if(newVal.show){
        document.body.style.overflow = 'hidden';
    }else{
        document.body.style.overflow = 'auto';
    }
})

  </script>
  
  <style scoped lang="scss">
  .mask{
    position: fixed;
    inset: 0;
    background-color: #0000004d;
    z-index: 9999;
    height: 100%;
    width: 100%;
  }
  .com__box{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: var(size);
    height: var(size);
    // box-shadow:  0 0 0 1000px rgba(0, 0, 0, 0.5) ,inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }

  </style>
  