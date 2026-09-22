<template>
  <div class="myCps">
    <NavBar :title="$t('cpsTip6')" left-arrow @click-left="() => router.back()" />
    <List
      v-model:list="list"
      :api="getMyChampionTaskList"
      :distance="100"
      ref="listRef"
      :is-auto-load="true"
    >
      <template #content>
        <Card
          :itemD="item"
          v-for="item in list"
          :key="item?.id"
          @click="onDetail(item.id)"
        >
          <template v-slot:content>
            <div class="head">
              <h1>{{ $t("cpsTip7") }}</h1>
              <div class="time">
                <span>{{ item.ranking }}</span>
              </div>
            </div>
            <div class="foot">
              <h1>{{ $t("winTips5") }}</h1>
              <div class="amount">{{ currency(item?.sumBonus || 0) }}</div>
            </div>
          </template>
          <template v-slot:footer>
            <div class="state" :class="`state${item.bonusState}`">
              {{ item.bonusState == 1 ? $t("cpsTip23") : $t("cpsTip24") }}
            </div>
          </template>
        </Card>
      </template>
    </List>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import Card from "@/components/Activity/Championship/card.vue";
import List from "@/components/common/ListSimply.vue";
import { currency } from "@/utils";
import { getMyChampionTaskList } from "@/api";
import { ref } from "vue";

const router = useRouter();
const list = ref<any[]>([]);
function onDetail(championId: number) {
  router.push({ name: "Championship-ChampionshipDetail", query: { championId } });
}
</script>
<style lang="scss" scoped>
.myCps {
  padding: 0 20px;

  .state {
    width: 170px;
    position: absolute;
    bottom: -2px;
    left: -1px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text_color_L1);
    font-size: 22px;
    font-weight: 500;
    padding: 15px 10px;

    &.state1 {
      background: url("@/assets/icons/activity/PointMall/orderPending.png") no-repeat
        center;
      background-size: 100% 100%;
    }

    &.state2 {
      background: url("@/assets/icons/activity/PointMall/orderCanceled.png") no-repeat
        center;
      background-size: 100% 100%;
    }
  }
}
</style>
