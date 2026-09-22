<template>
  <div class="item">
    <div class="item__media" :style="`width:${bgImgWidth};height:${bgImgHeight};`">
      <img v-if="itemD.iconUrl" :src="itemD.iconUrl" alt="" />
    </div>
    <div class="right">
      <slot name="content">
        <div class="head" :class="`type${state}`">
          <h1 v-if="state == 1">{{ $t("cpsTip3") }}</h1>
          <h1 v-else-if="state == 0">{{ $t("startTime") }}</h1>
          <h1 v-else-if="state == 2">{{ $t("ended") }}</h1>
          <div v-if="state == 1" class="time">
            <p v-html="$t('fifteenDays', [current.days])"></p>
            <h6>{{ formatD(current) }}</h6>
          </div>
          <div v-if="state == 0" class="time">
            {{ itemD?.startTime }}
          </div>
          <div v-if="state == 2" class="time">00:00:00</div>
        </div>
        <div class="foot">
          <h1>{{ $t("winTips5") }}</h1>
          <div class="amount">{{ currency(itemD?.sumBonus || 0) }}</div>
        </div>
      </slot>
    </div>
    <slot name="footer"> </slot>
  </div>
</template>
<script setup lang="ts">
import { useChampionship } from "@/hooks";
import { computed, ref, watch } from "vue";
import { useVModels } from "@vueuse/core";
import { currency } from "@/utils";
import { CurrentTime, useCountDown } from "@vant/use";
function onLoad() {
  if (props.state == 1) {
    const startTime = serviceNowTime.value.replace(/-/g, "/");
    const endTime = props.itemD.endTime.replace(/-/g, "/");
    countDownTime.value = new Date(endTime).getTime() - new Date(startTime).getTime();

    if (countDownTime.value > 0) {
      countDown.value = useCountDown({
        time: countDownTime.value,
        onChange: change,
      });
      countDown.value.start();
    }
  }
}
const { serviceNowTime } = useChampionship();
const props = withDefaults(
  defineProps<{
    bgImgWidth?: string;
    bgImgHeight?: string;
    itemD?: any;
    state?: number;
    isRefresh?: boolean;
  }>(),
  {
    bgImgWidth: "100%",
    bgImgHeight: "150px",
    itemD: {},
    isRefresh: false,
  }
);
const emit = defineEmits(["update:isRefresh"]);
const { isRefresh } = useVModels(props, emit);
const countDownTime = ref(0);
const countDown = ref();
watch(
  () => props.itemD.id,
  (val) => {
    onLoad();
  },
  { immediate: true }
);

const current = computed(() => {
  return countDown.value.current;
});

function change(current: CurrentTime) {
  if (current.total == 0) isRefresh.value = true;
  else isRefresh.value = false;
}

function formatD(obj: any) {
  const hours = String(obj.hours).padStart(2, "0");
  const minutes = String(obj.minutes).padStart(2, "0");
  const seconds = String(obj.seconds).padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
}
</script>
<style lang="scss" scoped>
.item {
  margin-top: 24px;
  min-height: 279px;
  border-radius: 20px;
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;

  &__media {
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  :deep(.right) {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    min-width: 280px;

    .head {
      margin-bottom: 10px;
    }

    .head,
    .foot {
      h1 {
        background: linear-gradient(90deg, #ff3134 0%, #f97450 100%);
        border-radius: 20px 20px 0 0;
        color: #fff;
        font-size: 22px;
        padding: 10px 20px;
      }

      > div {
        border-radius: 0 0 20px 20px;
        padding: 0 20px;
        min-height: 50px;
        line-height: 50px;

        &.time {
          background: rgba(253, 86, 92, 0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;

          span {
            font-size: 36px;
            font-weight: 700;
          }
        }

        &.amount {
          background: #fff;
          color: var(--norm_red-color);
          font-weight: 700;
          text-align: center;
        }
      }
    }

    .head.type2 {
      h1 {
        border-top: 1px solid var(--norm_red-color);
      }

      .time {
   //     background: rgba(186, 191, 224, 0.5);
      }
    }
  }
}
</style>
