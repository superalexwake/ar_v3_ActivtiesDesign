<template>
  <transition name="van-fade">
    <div class="winning" v-show="show">
      <div class="winning-animation" ref="animation" />
      <div class="winning-body" :class="{isWin, noWin: !isWin}">
        <div class="winning-main">
          <div class="winning-wrap">
            <div v-if="isWin" class="winning-wrap-l1" :class="{ isWin }">
              {{ $t('k3WarningTip2') }}</div>
            <div v-else class="winning-wrap-l1">{{ $t('k3WarningTip1') }}</div>
            <div class="winning-wrap-l2">
				<template v-if="store.result">
					<slot :data="store.result" ></slot>
				</template>
            </div>
            <div class="winning-wrap-l3">
              <div v-if="!isWin" class="isLose">{{ $t('k3WarningTip3') }}</div>
              <template v-else>
                <div class="head">{{ $t('k3WarningTip4') }}</div>
                <div class="bonus">{{ currency(store.amount) }}</div>
              </template>
              <div class="gameDetail">
                {{ $t('k3WarningTip5') }}
                {{ currentGame?.gameName }}
                <p>
                  {{ store.issueNumber }}
                </p>
                
              </div>
            </div>
          </div>
        </div>
        <div class="winning-wrap-l4">
              <div class="acitveBtn" :class="{ active: autoClose }" @click.stop="onAutoClose"></div>
              {{ $t('autoShutOff3s') }}
            </div>
        <div class="closeBtn" @click.stop="show = false"></div>
      </div>
    </div>
  </transition>

</template>
<script setup lang="ts">
import { currency, lazyCachedFunction } from '@/saasLottery/utils';
import { reactive, ref, onMounted } from 'vue';
import {Howl} from 'howler';
import LottieJson from '@/saasLottery/assets/lottie/winTip.json?url';
import win_explode from '@/saasLottery/assets/common/wingo/win_explode.mp3?url';
import lost_explode from '@/saasLottery/assets/common/wingo/lost_explode.mp3?url';
import WinAnimation from '@/saasLottery/assets/lottie/win_animation.json?url'
import { useGlobalContext, useLotteryContext } from "@/saasLottery/hooks";
interface Winnner {
  isWin: boolean
  issueNumber: string
  amount: number
  result: Record<string, any>
}
const { currentGame } = useGlobalContext();
const { soundEffects } = useLotteryContext()
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
const autoClose = ref(false)
const autoTimer = ref<any>(null)
const store = reactive({
  issueNumber: '',
  amount: 0,
  result: null
});
const isWin = ref(false)
let animat: any = null;
let animatHead: any = null;
const getLottie = lazyCachedFunction(async () => {
  return import('lottie-web')
})
const onAutoClose = () => {
  autoClose.value = !autoClose.value;
  if (autoClose.value) {
    clearTimeout(autoTimer.value);
    autoTimer.value = setTimeout(() => {
      autoClose.value = false;
      show.value = false
      animat.stop();
      animatHead.stop();
    }, 3000)
  } else {
    clearTimeout(autoTimer.value);
  }
}

const getAnimation = async () => {
  if (animat) return animat;
	winSound.load();
	loseSound.load();
  const lottie: any = await getLottie()
  try {
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
  } catch (e) {
    console.log(e)
  };
}
const open = async (options: Winnner) => {
  autoClose.value = false;
  show.value = true;
  isWin.value = options.isWin;
  store.issueNumber = options.issueNumber;
  store.amount = options.amount;
  // @ts-ignore
  store.result = options.result;
  await getAnimation();
  if (options.isWin) {
    animat.play();
    animatHead.play();
    soundEffects?.value && winSound?.play();
  } else {
    soundEffects?.value && loseSound?.play();
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

  &-main {
    position: relative;
    width: 100%;
    height: fit-content;
    min-height: 100%;
    padding: 0 34px 24px 34px;
  }

  &-body {
    position: absolute;
    width: 580px;
    height: 820px;
    background-image: url('./assets/missningLBg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding-top: 250px;
    animation: fade-in-fwd .5s cubic-bezier(.39, .575, .565, 1.000) both;
    color: #fff;

    &.isWin {
      background-image: url('./assets/missningBg.png');
    }
    &.noWin {
      color: #7190B4;
    }

    &-bg {
      position: absolute;
      width: 508px;
      height: 582px;
      bottom: 6px;
      right: 6px;
      left: 6px;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  &-title {
    color: #929292;
    font-family: "PingFang SC";
    font-weight: 600;
    margin-bottom: 50px;

    &.isWin {
      color: #FD565C;
    }

    p {
      font-size: 32px;
      font-weight: 600;
    }

    h1 {
      font-size: 64px;
      font-weight: 800;
      margin-top: 10px;

    }
  }

  &-wrap {
    position: relative;
    z-index: 1;

    &-l1 {
      font-weight: 700;
      font-size: 38px;
      line-height: 1.2;
      text-align: center;
      min-height: 92px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    &-l2 {
      height: 100px;
      font-size: 22px;
      margin-bottom: 48px;
    }

    &-l3 {
      height: 130px;

      .isLose {
        font-weight: 700;
        font-size: 48px;
        line-height: 58px;
        color: var(--text_color_L2);
        text-align: center;
        margin-bottom: 26px;
        // padding-top: 20px;
      }

      .head {
        height: 30px;
        line-height: 30px;
        font-weight: 700;
        font-size: 26px;
        color: #FB5B5B;
        text-align: center;
        margin-bottom: 8px;
      }

      .bonus {
        height: 48px;
        line-height: 48px;
        font-weight: 700;
        font-size: 40px;
        color: #FB5B5B;
        text-align: center;
        // margin-bottom: 20px;
      }

      .gameDetail {
        height: 28px;
        line-height: 28px;
        font-size: 22px;
        text-align: center;
        color: var(--text_color_L2);
      }
    }
    &-l4 {
			height: 48px;
			line-height: 48px;
			font-size: 24px;
			color: #fff;
			position: absolute;
			left: 56px;
			bottom: 56px;
			display: flex;
			align-items: center;
			html:lang(ar) &{
				right: 56px;
				left: unset;
			}
			.acitveBtn {
				height: 42px;
				width: 42px;
				border-radius: 50%;
				background: var(--winTips);
				border: 1px solid #fff;
				margin-right: 14px;
				position: relative;

				&.active {
					&::before {
						content: '';
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translateX(-50%) translateY(-50%);
						height: 18px;
						width: 24px;
						display: block;
						background-image: url('./assets/vector.png');
						background-repeat: no-repeat;
						background-size: 24px 18px;
						background-position: center;
					}
				}
			}
		}
  }

  &-head {
    width: 356px;
    height: 102px;
    position: absolute;
    right: 0;
    top: -30px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &-name {
    color: #323536;
    text-align: left;
    font-family: Poppins;
    font-size: 32px;
    font-weight: 600;
  }

  &-row {

    border-bottom: 1px solid #E1E3F2;
    padding: 20px 0;
  }

  &-desc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #6B6B6B;
    font-family: "PingFang SC";
    font-size: 24px;
    font-weight: 400;

    span {
      display: flex;
      align-items: center;
    }
  }

  .closeBtn {
    width: 60px;
    height: 60px;
    background-image: url('./assets/close.png');
    background-repeat: no-repeat;
    background-size: 60px;
    background-position: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    bottom: -20px;
  }

  &-close {
    position: absolute;
    width: 100%;
    bottom: -70px;
    left: 0;
    right: 0;
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
    background: rgba(255, 255, 255, 0.6);
    border: 2px solid #FFFFFF;
    margin-right: 14px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &-animation {
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
