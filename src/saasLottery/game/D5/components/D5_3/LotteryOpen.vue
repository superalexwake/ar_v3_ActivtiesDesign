<template>
  <div class="FDTL__C">
    <div class="FDTL__C-l1">
      <div class="left">
        <div>{{ $t('betIssue') }}</div>
        <div class="FDTL__C-rule" @click="handleRule()">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8.5484 25.8291L8.54089 25.8366L8.53366 25.8444C7.97797 26.4409 7.47942 26.802 7.06631 26.9804C6.65908 27.1562 6.37147 27.1416 6.17169 27.0556C5.96753 26.9677 5.74252 26.7566 5.56263 26.3155C5.38195 25.8725 5.26602 25.2383 5.26602 24.4V9.38666C5.26602 6.69084 5.59509 5.24007 6.36083 4.42157C7.11326 3.6173 8.44055 3.26666 10.9593 3.26666H21.0393C23.5584 3.26666 24.8852 3.61741 25.6358 4.42118C26.3997 5.23909 26.726 6.68929 26.7193 9.38518V9.38666V24.3867C26.7193 25.2254 26.6041 25.8598 26.4242 26.3031C26.2451 26.7444 26.0211 26.9549 25.8182 27.0425C25.6198 27.1281 25.3328 27.1431 24.9244 26.967C24.5105 26.7884 24.0102 26.4271 23.4512 25.8305C22.7918 25.1231 21.9328 24.7739 21.0701 24.8209C20.2074 24.8679 19.3916 25.3082 18.8127 26.08L18.8123 26.0806L17.4676 27.8779C17.4673 27.8783 17.467 27.8787 17.4667 27.8791C17.0231 28.4644 16.4844 28.71 15.9927 28.71C15.501 28.71 14.9623 28.4644 14.5187 27.8791C14.5184 27.8787 14.5181 27.8783 14.5177 27.8779L13.1733 26.0808C13.1732 26.0807 13.1732 26.0806 13.1731 26.0806C12.0033 24.5156 9.90283 24.3999 8.55577 25.8217L8.5484 25.8291ZM8.43935 14.6667C8.43935 15.7314 9.30798 16.6 10.3727 16.6C11.4374 16.6 12.306 15.7314 12.306 14.6667C12.306 13.602 11.4374 12.7333 10.3727 12.7333C9.30798 12.7333 8.43935 13.602 8.43935 14.6667ZM8.43935 9.33333C8.43935 10.398 9.30798 11.2667 10.3727 11.2667C11.4374 11.2667 12.306 10.398 12.306 9.33333C12.306 8.26863 11.4374 7.4 10.3727 7.4C9.30798 7.4 8.43935 8.26863 8.43935 9.33333ZM14.306 16.2667H21.6393C22.5174 16.2667 23.2393 15.5447 23.2393 14.6667C23.2393 13.7886 22.5174 13.0667 21.6393 13.0667H14.306C13.428 13.0667 12.706 13.7886 12.706 14.6667C12.706 15.5447 13.428 16.2667 14.306 16.2667ZM14.306 10.9333H21.6393C22.5174 10.9333 23.2393 10.2114 23.2393 9.33333C23.2393 8.45529 22.5174 7.73333 21.6393 7.73333H14.306C13.428 7.73333 12.706 8.45529 12.706 9.33333C12.706 10.2114 13.428 10.9333 14.306 10.9333Z" stroke="currentColor" stroke-width="1.2"/>
          </svg>
			{{ $t('winTrxIndicate') }}
        </div>
      </div>
      <div>{{ $t('k3TimeLeftToBuy') }}</div>
    </div>
    <div class="FDTL__C-l2">
      <div>{{ issue }}</div>
      <div class="FDTL__C-time">
        <div>{{ countdownTime[0]||0 }}</div>
        <div>{{ countdownTime[1]||0 }}</div>
        <div>:</div>
        <div>{{ countdownTime[3]||0 }}</div>
        <div>{{ countdownTime[4]||0 }}</div>
      </div>
    </div>
    <div class="FDTL__C-l3">
      <div class="box">
        <div v-for="(item, index) in resultNew" :key="index" class="slot-column">
          <div :class="['slot-transform', 'transform' + index, top1 == 1 && 'slot-scroll']">
            <div class="slot-num" v-for="(num1, index2) in item.arr" :num="item" :key="'2' + index2">{{ num1 }}</div>
            <div class="slot-num">1</div>
            <div class="slot-num">2</div>
            <div class="slot-num">0</div>
            <div class="slot-num">1</div>
            <div class="slot-num">2</div>
            <div class="slot-num">3</div>
            <div class="slot-num">4</div>
            <div class="slot-num">5</div>
            <div class="slot-num">6</div>
            <div class="slot-num">7</div>
            <div class="slot-num">8</div>
            <div class="slot-num">9</div>
            <div class="slot-num">0</div>
            <div class="slot-num">1</div>
            <div class="slot-num">2</div>
            <div class="slot-num">3</div>
            <div class="slot-num">4</div>
            <div class="slot-num">5</div>
            <div class="slot-num">6</div>
            <div class="slot-num">7</div>
            <div class="slot-num">8</div>
            <div class="slot-num">9</div>
            <div class="slot-num">0</div>
            <div class="slot-num">1</div>
            <div class="slot-num">2</div>
            <div class="slot-num">3</div>
            <div class="slot-num">4</div>
            <div class="slot-num">5</div>
            <div class="slot-num">6</div>
            <div class="slot-num">7</div>
            <div class="slot-num">8</div>
            <div class="slot-num">9</div>
            <div class="slot-num" v-for="(num1, index2) in item.arr" :num="item" :key="'2' + index2">{{ num1 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const resultNew = ref<any>([{ arr: [] }, { arr: [] }, { arr: [] }, { arr: [] }, { arr: [] }])
const top1 = ref(0)

const props= defineProps({
	/*期号*/
	issue: {
		type: String,
		default: ''
	},
	/*上期开奖结果*/
	premium: {
		type: Array,
		default: () => [0, 0, 0, 0, 0]
	},
	/*倒计时*/
	countdownTime: {
		type: Array,
		default: ['0', '0',':', '0', '0']
	},
	/*玩法规则事件*/
	handleRule:{
		type: Function,
		default: () => {}
	}
})

watch(
    () => props.premium,
    (value) => {
      if (!value) return
      resultNew.value = remdon(value)
    }
)

// 开启随机数动画
const animationShow = () => {
  top1.value = 1
  setTimeout(() => {
    top1.value = 0
  }, 3000)
}

/*修改优化处理*/
const control=()=>{
	top1.value = 0
}

/*开奖动画倒计时开放外部组件调用*/
defineExpose({
	control,
	animationShow
})

/**
 * 随机数动画
 * @param list 期望最终结果
 */
const remdon = (list: any[]) => {
  let resultList = []
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    let arr = []
    switch (item) {
      case 9:
        arr.push(1, 0, item)
        break
      case 0:
        arr.push(item + 8, item + 9, item)
        break
      default:
        if (item < 2) {
          arr.push(1, 0, item)  // 当数字小于2时，用8,9替代负数
        } else {
          arr.push(item - 2, item - 1, item)
        }
    }
    resultList.push({ arr })
  }
  return resultList
}
</script>

<style lang="scss" scoped>
.FDTL__C {
  width: calc(100% - 52px);
  margin: 26px auto 0;
  background-color: var(--darkBg,var(--bg_color_L2));
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 1px center;
  padding: 32px 22px 34px;
  border-radius: 20px 20px 0 0;

  &-rule {
    height: 46px;
    padding: 0 10px;
    font-size: 22px;
    border: 1px solid var(--main-color);
    border-radius: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--main-color);
    gap:0 5px;
    svg{
      color: var( --secondary);
      height: 32px;
      width: 32px;
    }
  }

  &-l1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    color: var(--text_color_L2);
    font-size: 24px;

    .left {
      display: flex;
      align-items: center;
      height: 46px;
      gap: 0 5px;
    }

    & > div:not(.left) {
      align-self: flex-start;
    }
  }

  &-l2 {
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 36px;
    color: var(--text_color_L1);
  }

  &-l3 {
    height: 232px;
    margin-top: 36px;
    background: #00B977;
    border-radius: 14px;
    position: relative;
    padding: 20px;

    &::after,
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 52px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 0;
      background: #008B59;
    }

    &::before {
      border-radius: 10px 0px 0px 10px;
      left: -10px;
    }

    &::after {
      border-radius: 0px 10px 10px 0px;
      right: -10px;
    }

    .box {
      background: #003c26;
      border-radius: 10px;
      height: 100%;
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;

      &::after,
      &::before {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 14px solid transparent;
        border-bottom: 14px solid transparent;
        content: '';
        z-index: 3;
      }

      &::before {
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border-right: 40px solid transparent;
        border-left: 40px solid #00B977;
      }

      &::after {
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        border-left: 40px solid transparent;
        border-right: 40px solid #00B977;
      }

      .slot-column {
        display: inline-block;
        width: calc((100% - 40px) / 5);
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        background: #727272;
        vertical-align: bottom;
        position: relative;
        text-align: center;

        @-webkit-keyframes slotScroll {
          0% {
            -webkit-transform: translateY(-108px);
            transform: translateY(-108px);
          }

          to {
            -webkit-transform: translateY(-3200px);
            transform: translateY(-2200px);
          }
        }

        @keyframes slotScroll {
          0% {
            -webkit-transform: translateY(-108px);
            transform: translateY(-108px);
          }

          to {
            -webkit-transform: translateY(-3200px);
            transform: translateY(-2200px);
          }
        }

        .slot-transform {
          -webkit-transform: translateY(-205px);
          transform: translateY(-205px);

          &.slot-scroll {
            -webkit-animation: slotScroll 3s cubic-bezier(0.65, 0.02, 0.65, 1.06);
            animation: slotScroll 3s cubic-bezier(0.65, 0.02, 0.65, 1.06);
            -webkit-animation-fill-mode: forwards;
            animation-fill-mode: forwards;

            &.transform1 {
              -webkit-animation-delay: 0.12s;
              animation-delay: 0.12s;
            }

            &.transform2 {
              -webkit-animation-delay: 0.24s;
              animation-delay: 0.24s;
            }

            &.transform3 {
              -webkit-animation-delay: 0.36s;
              animation-delay: 0.36s;
            }

            &.transform4 {
              -webkit-animation-delay: 0.48s;
              animation-delay: 0.48s;
            }
          }

          &.transform0 {
            .slot-num {
              background: #17B15E;
              color: #fff;
            }
          }

          .slot-num {
            width: 110px;
            height: 110px;
            line-height: 110px;
            background: #E1E1EC;
            border-radius: 50%;
            font-size: 60px;
            color: var(--text_color_L2);
            font-weight: 700;
            margin: 0 auto 8px;
          }
        }
      }
    }
  }

  &-time {
    height: 60px;
    line-height: 60px;
    bottom: 22px;
    right: 24px;
    display: flex;
    html:lang(ar) & {
      direction: ltr;
    }
    & > div {
      background: var(--bg_color_L3);
      border-radius: 10px;
      color: var(--main-color);
      font-weight: 700;
      font-size: 36px;
      text-align: center;
      padding: 0 10px;
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;

      &[notime] {
        background-color: transparent !important;
      }

      & + div {
        margin-left: 9px;
      }
    }
  }
}
</style>
