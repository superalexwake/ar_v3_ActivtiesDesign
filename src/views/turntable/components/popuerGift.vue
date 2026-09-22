<template>
  <div class="popuer-gift" v-if="visible">
    <!-- <svg-icon name="icon_return_01" icon-class="icon_return_01" @click="onClickLeft" /> -->
    <van-icon class="icon_return_01" name="arrow-left" @click="onClickLeft" />
    <div class="gift_content">
      <div class="title">
        <span>{{$t('t578')}}</span>
      </div>

      <div class="gift_list">
        <div class="gift_item" @click="handleOpenAward(1)">
          <div ref="giftRef1" class="item_f" v-if="!giftList[0].isOpen"></div>
          <div class="activeDiv1 active_item"></div>
          <div class="amount" v-if="isOpenAward && giftList[0].amount">
            <span>{{ dollarSign + giftList[0].amount }}</span>
          </div>
        </div>
        <div class="gift_item" @click="handleOpenAward(2)">
          <div ref="giftRef2" class="item_f" v-if="!giftList[1].isOpen"></div>
          <div class="activeDiv2 active_item"></div>
          <div class="amount" v-if="isOpenAward && giftList[1].amount">
            <span>{{ dollarSign + giftList[1].amount }}</span>
          </div>
        </div>
        <div class="gift_item" @click="handleOpenAward(3)">
          <div ref="giftRef3" class="item_f" v-if="!giftList[2].isOpen"></div>
          <div class="activeDiv3 active_item"></div>
          <div class="amount" v-if="isOpenAward && giftList[2].amount">
            <span>{{ dollarSign + giftList[2].amount }}</span>
          </div>
        </div>
        <div class="gift_item" @click="handleOpenAward(4)">
          <div ref="giftRef4" class="item_f" v-if="!giftList[3].isOpen"></div>
          <div class="activeDiv4 active_item"></div>
          <div class="amount" v-if="isOpenAward && giftList[3].amount">
            <span>{{ dollarSign + giftList[3].amount }}</span>
          </div>
        </div>
      </div>

      <div class="tip">{{ $t('t579') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTurntables } from "@/hooks";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import activeUrl from "../assets/json/active.json?url";
import openUrl from "../assets/json/open.json?url";
import { useRouter } from "vue-router";
import { SettingStore } from "@/stores";

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
function lazyCachedFunction<T=any> (fn: () => Promise<T>): () => Promise<T> {
    let res: Promise<T> | null = null
    return () => {
        if (res === null) {
            res = fn().catch((err) => { res = null; throw err })
        }
        return res
    }
}
const settingS  = SettingStore() as any
const dollarSign = computed(() => settingS.getDollarSign)
const emit = defineEmits(["update:visible"]);
const getLottieWeb=lazyCachedFunction(async ()=>{
  return import('lottie-web')
})
const isActiveReward = ref(false);
const giftRef1 = ref(null);
const giftRef2 = ref(null);
const giftRef3 = ref(null);
const giftRef4 = ref(null);
const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const { getTurntableReward, firstReward, firstInvitedWheelDatas, isOpenAward, restBgcontainer } = useTurntables();

const giftList = ref<any>([
  {
    id: 1,
    isOpen: false,
    animat: undefined,
    amount: 0,
  },
  {
    id: 2,
    isOpen: false,
    animat: undefined,
    amount: 0,
  },
  {
    id: 3,
    isOpen: false,
    animat: undefined,
    amount: 0,
  },
  {
    id: 4,
    isOpen: false,
    animat: undefined,
    amount: 0,
  },
]);

const isReady = computed(() => {
  return giftRef1.value && giftRef2.value && giftRef3.value && giftRef4.value;
});

const giftRefArr = [giftRef1, giftRef2, giftRef3, giftRef4];

const handleOpenAward = async (id: number) => {
  if (isActiveReward.value) return
  await getTurntableReward();
  isActiveReward.value = true;
  giftList.value[id - 1].amount = firstReward.value
  let giftItem = giftList.value.find((item: any) => item.id === id);
  giftList.value[id - 1].isOpen = true
  if (giftItem) {
    const lottie = await getLottieWeb()
    giftItem.animat = null;
    const element = document.getElementsByClassName('activeDiv' + id)[0];
    // @ts-ignore
    giftItem.animat = lottie.loadAnimation({
      container: element,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: activeUrl,
    })
    giftItem.animat.play();
    giftItem.isOpen = true;
  }
  let openItem = giftList.value.filter((item: any) => item.id !== id);
  const amountArr = firstInvitedWheelDatas.value.filter(item => !item.isSelected)

  setTimeout(() => {
    openItem.forEach((item: any, index: number) => {
      item.animat.play();
      item.amount = amountArr[index].amount
    });
    setTimeout(() => {
        emit('update:visible', false);
      restBgcontainer()
    }, 1500)
  }, 2000);

};

watch(() => isReady.value, async (val) => {
  if (val) {
    const lottie = await getLottieWeb()
    giftList.value.forEach((item: any, index:number) => {
      // @ts-ignore
      item.animat = lottie.loadAnimation({
      container: giftRefArr[index].value as any,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: openUrl,
    });
    item.animat.stop();
  });
  }
}, { immediate: true });

onMounted(async () => {

});

onUnmounted(() => {
  giftList.value.forEach((item: any) => {
    if (item.animat) {
      item.animat.destroy();
    }
  });
})
</script>

<style lang="scss" scoped>
@media (min-width: 501px) {
  .popuer-gift {
		max-width: 750px;
		left: 50%;
		transform: translateX(-50%);
	}
}
.popuer-gift {
  /* Your styles here */
  position: fixed;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  z-index: 999;
  transform:translateX(-50%);
  .icon_return_01 {
    width: 48px;
    height: 48px;
    font-size: 48px;
    position: absolute;
    top: 2%;
    left: 3%;
    color: rgba(255, 255, 255, 1);
  }

  .gift_content {
    padding-top: 380px;
    width: 100%;
    .title {
      min-width: 340px;
      text-align: center;
      margin-bottom: 102px;
      span {
        position: relative;
        font-size: 44px;
        font-weight: bold;
        background: linear-gradient(
          180deg,
          #fffa7b 22.55%,
          #fffb5e 44.98%,
          #ffe770 59.26%,
          #ffb06a 73.53%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: relative;
      }
      span::after {
        content: "";
        position: absolute;
        left: -94px;
        top: 10px;
        display: block;
        width: 88px;
        height: 46px;
        background: url("../assets/img/icon_left.png") no-repeat center center;
        background-size: 88px 46px;
      }
      span::before {
        content: "";
        position: absolute;
        right: -94px;
        top: 10px;
        display: block;
        width: 88px;
        height: 46px;
        background: url("../assets/img/icon_right.png") no-repeat center center;
        background-size: 88px 46px;
      }
    }

    .gift_list {
      padding: 0 110px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 98px;
      .gift_item {
        width: 216px;
        height: 216px;
        position: relative;
        .item_f {
          width: 216px;
          height: 216px;
          position: relative;
          z-index: 1;
        }
        .active_item {
            width: 414px;
            height: 434px;
            margin: -100px 0 0 -100px;
            position: relative;
            z-index: 1;
        }
        .amount {
            position: absolute;
            z-index: 2;
            left: 41px;
            top: 216px;
            width: 180px;
            height: 48px;
            border-radius: 50px;
            border: 2px solid #F95959;
            background: rgba(63, 8, 4, 1);
            text-align: center;
            font-size: 28px;
            font-weight: 600;
            line-height: 48px;;
            margin: -18px auto 0;
            span {
                /* text-shadow: 0px 1px 0px #925009; */
                background: linear-gradient(180deg, #FFEB88 , #FFB62F );
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
      }
    }

    .tip {
      text-align: center;
      font-size: 28px;
      font-weight: 500;
      line-height: normal;
      padding-top: 60px;
      color: #FFF;
    }
  }
}
</style>
