<template>
  <div class="timer-cards">
    <div v-for="(option) in currentGameList" :key="option.gameCode" class="timer-card"
      :class="{ active: currentGame?.gameCode === option.gameCode }" @click="handleSelect(option)">
      <div class="clock-icon">
        <img v-if="currentGame?.gameCode === option.gameCode" src="@icon/home/time_a.png" class="timeIcon" alt="active" />
        <img v-else src="@icon/home/time.png" class="timeIcon" alt="default" />
      </div>
      <div class="card-title" :class="{ noActive: option.state === 2 }">{{ option.gameName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useGlobalContext } from "@/saasLottery/hooks";
  import { GetGameListRspItem } from "@/saasLottery/api";
  const { gameList, currentGame, lotteryCode } = useGlobalContext();
  const emit = defineEmits<{
    (e: 'changeSelectGame',option:GetGameListRspItem): Promise<void>;
  }>();

const currentGameList = computed(() => {
  let code = lotteryCode.value === 'D5' ? '5D' : lotteryCode.value;
  const item=gameList.value.find((game) => game.gameTypeName === code);
  if (!item) return [];
  //@ts-ignore
  return item.gameList.sort((a, b) => b.sort - a.sort);
});

  const handleSelect = async (option: GetGameListRspItem) => {
     if (currentGame?.value?.gameCode === option.gameCode) return;
     emit('changeSelectGame',option)
  };


</script>

<style lang="scss" scoped>
  $inactive-color: #b2b2b2;
  $transition-duration: 0.2s;

  // Mixins
  @mixin flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timer-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--bg_color_L3);
    border-radius: 24px;
    box-shadow: 0 4px 8px rgba(197, 197, 218, 0.25);
    position: relative;
    z-index: 1;
  }

  .timer-card {
    @include flex-center;
    flex-direction: column;
    width: 175px;
    height: 180px;
  	background: var(--bg_color_L3);
    border-radius: 24px;
    border: none;
    cursor: pointer;

    &.active {
      background: var(--main_gradient-color2,linear-gradient(180deg, #FF8080 0%, rgba(255, 128, 128, 0.00) 100%));

      .clock-icon .clock-circle {
        border-color: var(--text_color_L2,#e6393b);
      }

      .card-title,
      .card-duration {
        color: var(--text_color_L4, #E6393B);
      }
    }

    .clock-icon {
      width: 88px;
      height: 88px;
      margin: 14px 0 0;

      .timeIcon {
        width: 88px;
        height: 88px;
      }
    }

    .card-title {
      font-size: 24px;
      font-weight: 400;
      color: var(--text_color_L2, #E6393B);
      text-align: center;
      padding: 0 38px;
      transition: color $transition-duration;
    }

    .noActive {
      color: $inactive-color;
    }

  }
</style>
