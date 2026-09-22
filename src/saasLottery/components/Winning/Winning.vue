<template>
  <transition name="van-fade">
    <div class="winning"   v-show="show">
      <div  class="winning-animation" ref="animation" />
      <div class="winning-body" :class="{isWin}">
        <div class="winning-main">
          <div class="winning-head" ref="animationHead">
            <img v-show="!isWin" src="./assets/lose.png" alt="">
          </div>
          <div class="winning-body-bg">
            <svg width="509" height="582" viewBox="0 0 509 582" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.738281 62.7163C0.738281 28.5373 29.2476 1.26272 63.3932 2.77507L470.508 20.8067C491.89 21.7538 508.738 39.3645 508.738 60.7676V522C508.738 555.137 481.875 582 448.738 582H60.7383C27.6012 582 0.738281 555.137 0.738281 522V62.7163Z" fill="url(#paint0_radial_7824_24649)"/>
              <mask id="mask0_7824_24649" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="2" width="509" height="580">
                <path d="M0.738281 62.7163C0.738281 28.5373 29.2476 1.26272 63.3932 2.77507L470.508 20.8067C491.89 21.7538 508.738 39.3645 508.738 60.7676V522C508.738 555.137 481.875 582 448.738 582H60.7383C27.6012 582 0.738281 555.137 0.738281 522V62.7163Z" fill="url(#paint1_radial_7824_24649)"/>
              </mask>
              <g mask="url(#mask0_7824_24649)">
                <circle cx="476.925" cy="62.2881" r="101.288" fill="url(#paint2_linear_7824_24649)"/>
                <circle cx="374.188" cy="51.6692" r="24.7971" fill="url(#paint3_linear_7824_24649)"/>
                <circle cx="477.238" cy="169" r="49.5" fill="url(#paint4_linear_7824_24649)"/>
              </g>
              <defs>
                <radialGradient id="paint0_radial_7824_24649" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.7383 21) rotate(50.6189) scale(725.797 642.343)">
                  <stop stop-color="#FFFAF5"/>
                  <stop offset="1" stop-color="#FFF5E9"/>
                </radialGradient>
                <radialGradient id="paint1_radial_7824_24649" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35.7383 21) rotate(51.852) scale(699.374 618.958)">
                  <stop stop-color="#FFFCF7"/>
                  <stop offset="1" stop-color="white"/>
                </radialGradient>
                <linearGradient id="paint2_linear_7824_24649" x1="346.758" y1="-59.9647" x2="517.157" y2="133.179" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#8B9092" stop-opacity="0.2"/>
                  <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="paint3_linear_7824_24649" x1="349.391" y1="59.7255" x2="398.985" y2="42.5072" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#8B9092" stop-opacity="0.1"/>
                  <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="paint4_linear_7824_24649" x1="477.238" y1="119.5" x2="477.238" y2="218.5" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#8B9092" stop-opacity="0.12"/>
                  <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="winning-wrap">
            <div class="winning-title" :class="{isWin}">
              <p>{{isWin?$t('common.win'):$t('common.loseTips')}}</p>
              <h1> {{isWin?currency(store.amount):$t('common.nowin')}}</h1>
            </div>
            <div class="winning-name winning-row">
              {{currentGame?.gameName}}
            </div>
            <div class="winning-desc winning-row">
              <span>{{ $t('common.issue') }}</span>
              <span>{{store.issueNumber}}</span>
            </div>
            <div class="winning-desc winning-row" >
              <span> {{ $t('common.result') }}</span>
              <span v-if="store.result">
              <slot :data="store.result"></slot>
            </span>
            </div>
            <div class="winning-foot" :class="{isWin}" @click.stop="show=false">
              {{ $t('common.i_kenow') }}
            </div>
          </div>
          <div class="winning-close">
            <div class="winning-acitveBtn" @click.stop="onAutoClose">
              <svg v-if="autoClose" xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.5949 0.648595C24.1235 1.16122 24.1365 2.00534 23.6239 2.53399L9.40164 17.2007C9.15052 17.4596 8.80518 17.6058 8.44444 17.6058C8.08371 17.6058 7.73837 17.4596 7.48724 17.2007L0.376134 9.86732C-0.136494 9.33867 -0.123507 8.49455 0.40514 7.98193C0.933787 7.4693 1.77791 7.48229 2.29053 8.01093L8.44444 11.6905L21.7095 0.677601C22.2221 0.148954 23.0662 0.135967 23.5949 0.648595Z" fill="white"/>
              </svg>
            </div>
            {{ $t('common.autoClose') }}
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>
<script setup lang="ts">
import {currency, lazyCachedFunction} from '@/saasLottery/utils';
import { reactive,ref,onMounted } from 'vue';
import LottieJson from '@/saasLottery/assets/lottie/winTip.json?url';
import win_explode from '@/saasLottery/assets/common/wingo/win_explode.mp3?url';
import lost_explode from '@/saasLottery/assets/common/wingo/lost_explode.mp3?url';
import WinAnimation from '@/saasLottery/assets/lottie/win_animation.json?url'
import {useGlobalContext, useLotteryContext} from "@/saasLottery/hooks";
interface Winnner{
  isWin:boolean
  issueNumber:string
  amount:number
  result:Record<string, any>
}
const {currentGame}=useGlobalContext();
const {soundEffects}=useLotteryContext()
const animation = ref();
const animationHead = ref();
const show = ref(false);
const winSound = new Howl({
  src: [win_explode],
  loop: false,
  preload:false
});
const loseSound = new Howl({
  src: [lost_explode],
  loop: false,
  preload:false
})
const autoClose=ref(false)
const autoTimer=ref<any>(null)
const store=reactive({
  issueNumber:'',
  amount:0,
  result:null
});
const isWin= ref(false)
let animat:any=null;
let animatHead:any=null;
const getLottie=lazyCachedFunction(async ()=>{
  return import('lottie-web')
})
const onAutoClose=()=>{
  autoClose.value=!autoClose.value;
  if (autoClose.value){
    clearTimeout(autoTimer.value);
    autoTimer.value=setTimeout(()=>{
      autoClose.value=false;
      show.value=false
      animat.stop();
      animatHead.stop();
    },3000)
  }else {
    clearTimeout(autoTimer.value);
  }
}

const getAnimation=async ()=>{
  if (animat) return animat;

  try {
	  winSound.load();
	  loseSound.load();
	  const lottie:any=await getLottie()
     animat = lottie.loadAnimation({
      container: animation.value, // the dom element
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: LottieJson,
    });
    animatHead = lottie.loadAnimation({
      container: animationHead.value, // the dom element
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: WinAnimation,
    });
  }catch (e){
    console.log(e)
  };
}
const open=async (options:Winnner)=>{
  autoClose.value=false;
  show.value=true;
  isWin.value=options.isWin;
  store.issueNumber=options.issueNumber;
  store.amount=options.amount;
  // @ts-ignore
  store.result=options.result
  await getAnimation();
  if (options.isWin) {
    //
    animat.play();
    animatHead.play();
    soundEffects.value&&winSound.play();
  } else {
    soundEffects.value&&loseSound.play();
  }
  onAutoClose()
}
defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.winning {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  html:lang(ar) & {
    right: 0;
    left: unset;
  }
  &-main{
    position: relative;
    width: 100%;
    height: fit-content;
    min-height: 100%;
    padding: 48px 34px 24px 34px;
  }
  &-body {
    position: absolute;
    width: 520px;
    height: fit-content;
    left: 50%;
    top: 50%;
    z-index: 11;
    border-radius: 64px;
    background: linear-gradient(90deg, rgba(189, 186, 174, 0.00) 1.75%, rgba(55, 77, 81, 0.40) 99.57%), linear-gradient(180deg, #78888C 0%, #B9C6C9 100%);
    transform: translateX(-50%) translateY(-50%);

    &.isWin {
      background: linear-gradient(90deg, rgba(255, 222, 88, 0.00) 1.75%, rgba(194, 0, 84, 0.40) 99.57%), linear-gradient(180deg, #E52D2D 0%, #FFB0C0 100%);
    }
    &-bg{
      position: absolute;
      width: 508px;
      height: 582px;
      bottom:6px ;
      right: 6px;
      left:6px;
      svg{
        width: 100%;
        height: 100%;
      }
    }
  }
  &-title{
    color: #929292;
    font-family: "PingFang SC";
    font-weight: 600;
    margin-bottom: 50px;
    &.isWin{
      color:#FD565C;
    }
    p{
      font-size: 32px;
      font-weight: 600;
    }
    h1{
      font-size: 64px;
      font-weight: 800;
      margin-top: 10px;
      
    }
  }
  &-wrap{
    position: relative;
    z-index: 1;
  }
  &-head{
    width: 356px;
    height: 102px;
    position: absolute;
    right: 0;
    top:-30px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  &-name{
    color: #323536;
    text-align: left;
    font-family: Poppins;
    font-size: 32px;
    font-weight: 600;
  }
  &-row{

    border-bottom: 1px solid #E1E3F2;
    padding: 20px 0;
  }
  &-desc{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #6B6B6B;
    font-family: "PingFang SC";
    font-size: 24px;
    font-weight: 400;
    span{
      display: flex;
      align-items: center;
    }
  }
  &-foot{
    display: flex;
    width: 380px;
    height: 80px;
    padding: 10px;
    font-size: 28px;
    margin: 32px  auto 0 auto;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 64px;
    background: #929292;
    color: #fff;
    &.isWin{
      background:#FD565C;
    }
  }
  &-close{
    position: absolute;
    width: 100%;
    bottom:-70px;
    left:0;
    right:0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    font-family: "PingFang SC";
    font-size: 24px;
  }
  &-acitveBtn {
    height: 42px;
    width: 42px;
    border-radius: 50%;
    background: rgba(255,255,255,0.6);
    border: 2px solid #FFFFFF;
    margin-right: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg{
      width: 24px;
      height: 24px;
    }
  }
  &-animation{
    pointer-events: none;
    position: absolute;
    width: 750px;
    height: 1660px;
    top: 50%;
    left: 0;
    right: 0;
    z-index: 10;
    transform: translateY(-50%)
  }
}
</style>
