<template>
  <div class="bet-container" ref="containerRef">
    <NavBar :title="$t('betrecords')" left-arrow @click-left="onClickLeft" />
    <van-sticky :offset-top="46" :container="containerRef" class="bet-container-sticky">
      <div style="background: var(--bg_color_L1);">
        <NavTab 
          :list="gameBetRecordList"
          v-model:active="active"
          :is-auto-load="true"
          tabClassName="tabs"
          v-slot="{ item, index }"
          @onClickTab="onClickTab"
          activeClassName="tab_active"
          ref="tabRefs"
          tabItemClassName="funtab_item"
        >
          <div class="tab_item" :class="{ tab_active: index === active }">
            <svg-icon :name="item.img" />
            <span>{{ item.name }}</span>
          </div>
        </NavTab>
        <div class="bet-container-searchBar">
          <div class="ar-searchbar">
            <ArSelect
              @click-select="showPicker = true"
              :selectName="getSlotTitle(typeValue.key)"
            ></ArSelect>
            <ArSelect
              @click-select="showDataPick = true"
              :selectName="dateValue || $t('datePick')"
            >
            </ArSelect>
          </div>
        </div>
        <div>
          <!-- 日期选择 -->
          <van-popup v-model:show="showDataPick" round position="bottom">
            <van-date-picker
              v-model="currentDate"
              :title="$t('pickDate')"
              @cancel="cancelDataPick"
              @confirm="onConfirmDataPick"
              @change="changeDataPick"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>
        </div>
      </div>
    </van-sticky>
    <div class="bet-content__box">
      <List
        v-model:list="listData"
        :distance="1000"
        v-model:page-query="pageQuery"
        :api="getNewMyEmerdList"
        ref="listRef"
        :is-auto-load="isAutoLoad"
      >
        <template #content>
          <!-- 彩票 -->
          <div class="bet-container-items" v-if="gameBetRecordList[active].type === 0">
            <div class="bet-container-lottery">
              <XoSoRecord
                v-if="['XOSO', 'FXOSO'].includes(typeValue.value.toString())"
                :listData="listData"
                :typeValue="typeValue.value"
              ></XoSoRecord>
              <D4Record
                v-else-if="['4D'].includes(typeValue.value.toString())"
                :listData="listData"
                :typeValue="typeValue.value"
              />
				<MotoRace v-else-if="[17].includes(typeValue.value)" :listData="listData" />
				<VideoWingo v-else-if="[23].includes(typeValue.value)" :listData="listData"></VideoWingo>
              <div
                class="bet-container-lottery-items"
                v-for="item in listData"
                :key="item.orderNumber"
                v-else
              >
                <div class="bet-container-lottery-card">
                  <div class="bet-container-lottery-card-header ar-1px-b">
                    <h1>
                      <h2>{{ getArrayKey(lotteryCode, typeValue.value) }}</h2>
                      <span :class="[item.state == 1 ? 'color40C592' : 'colorE98613']">
                        {{ getArrayKey(rootConfig.bettingResult, item.state) }}
					  </span>
                    </h1>
                    <p>{{ item.addTime }}</p>
                  </div>
                  <div class="bet-container-lottery-card-info">
                    <ul>
                      <li v-if="pageQuery.gameType === 'BINGO'">
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("gamePlay") }}</h2>
                        </span>
                        <span>{{
                          filterGameType(Number(item.gameType), item.selectType)
                            .playerName
                        }}</span>
                      </li>
                      <li v-else>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("type") }}</h2>
                        </span>
                        <span>{{ getTypeText(item.typeID) || "" }}</span>
                      </li>

                      <li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betNumber") }}</h2>
                        </span>
                        <span>{{ item.issueNumber }}</span>
                      </li>
                      <li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("orderNo") }}</h2>
                        </span>
                        <span>{{ item.orderNumber }}</span>
                      </li>
                      <li
                        v-if="
                          typeValue.value == 1 ||
                          typeValue.value == 13 ||
                          typeValue.value == 'XOSO'
                        "
                      >
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betPick") }}</h2>
                        </span>
                        <p>
                          {{ getArrayKey(rootConfig.gameSelectType, item.selectType) }}
                        </p>
                      </li>
                      <li v-else-if="pageQuery.gameType === 'BINGO'">
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betPick") }}</h2>
                        </span>
                        <div
                          v-if="(item.gameType as unknown as string) === '1'"
                          :class="
                            filterGameType(Number(item.gameType), item.selectType)
                              .className + '_binguo'
                          "
                        >
                          {{ computeSelectType(item.selectType) }}
                        </div>
                        <div v-else style="overflow: inherit">
                          <div
                            v-for="text in ((item.gameType as unknown as string) === '3' ? 2 : item.selectType.split(''))"
                            class="binguo_select"
                          >
                            {{
															(item.gameType as unknown as string) === '3' ? item.selectType : text
                            }}
                          </div>
                        </div>
                      </li>
                      <li v-else>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betPick") }}</h2>
                        </span>
                        <div>
                          <div
                            v-for="(ball, index) in replaceDash(item.selectType)"
                            :key="index"
                          >
                            {{ getArrayKey(rootConfig.gameSelectType, ball) }}
                          </div>
                        </div>
                      </li>
                      <li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betAmount") }}</h2>
                        </span>
                        <span>{{ currency(item.amount) }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <img src="@icon/main/moonBar.png" />
                <div class="bet-container-lottery-note">
                  <div class="bet-container-lottery-note-result">
                    <div v-if="typeValue.value === 1 || typeValue.value == 13">
                      <h1><svg-icon name="round"/>{{ $t("betResult") }}</h1>
                      <h2 v-if="item.state !== 2">
                        <svg-icon name="round"/>
                        <p :class="['w'+ item.number]"></p>
                        <span :class="Number(item.number) > 4 ? 'bigClass' : 'small'">{{
                          Number(item.number) > 4 ? $t("big") : $t("small")
                        }}</span>
                        <span :class="item.colour?.split(',').join('_')">{{
                          tipColorTextMap[item.colour]
                        }}</span>
                      </h2>
                      <h2 v-else><svg-icon name="round"/>- -</h2>
                    </div>
                    <div v-else-if="typeValue.value === 'BINGO'">
                      <h1><svg-icon name="round"/>{{ $t("betResult") }}</h1>
                      <div class="binguo_result">
                        <svg-icon name="round"/>
                        <div
                          class="result_item"
                          v-for="n in item.premium ? item.premium.split('') : []"
                        >
                          {{ n }}
                        </div>
                        <div class="binguo_sum">
                          {{ item.sumCount }}
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <h1><svg-icon name="round"/>{{ $t("betResult") }}</h1>
                      <h2 v-if="item.state !== 2 && typeValue.value == 5">
                        <svg-icon name="round"/>
                        <p v-for="(ball, index) in item.premium" :key="index">
                          {{ ball }}
                        </p>
                      </h2>
                      <h2 v-else-if="item.state !== 2 && typeValue.value == 9">
                        <svg-icon name="round"/>
                        <p
                          v-for="(ball, index) in item.premium"
                          :key="index"
                          :class="'n' + ball"
                        ></p>
                      </h2>
                      <h2 v-else><svg-icon name="round"/>- -</h2>
                    </div>
                  </div>
                  <div class="bet-container-lottery-note-box">
                    <div>
                      <div class="bet-container-lottery-note-box-para">
                        <h3>{{ currency(item.realAmount) }}</h3>
                        <span>{{ $t("actualAmount") }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="bet-container-lottery-note-box-para">
                        <h3 v-if="typeValue.value === 'BINGO'">
                          {{ currency(item.profitAmount <= 0 ? 0 : item.profitAmount) }}
                        </h3>
                        <h3 v-else>{{ currency(item.winAmount) }}</h3>
                        <span>{{ $t("lotteryAmount") }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="bet-container-lottery-note-box-para">
                        <h3>{{ currency(item.serviceCharge) }}</h3>
                        <span>{{ $t("serviceCharge") }}</span>
                      </div>
                    </div>

                    <div>
                      <div
                        class="bet-container-lottery-note-box-para"
                        v-if="typeValue.value === 'BINGO'"
                      >
                        <h4
                          :class="
                            item.profitAmount > 0 && item.state !== 2
                              ? 'h4_green'
                              : 'h4_red'
                          "
                        >
                          {{ item.state !== 2 ? currency(item.profitAmount) : "-" }}
                        </h4>
                        <span>{{ $t("profitNloss") }}</span>
                      </div>
                      <div class="bet-container-lottery-note-box-para" v-else>
                        <h4
                          :class="
                            item.winAmount - item.amount > 0 && item.state !== 2
                              ? 'h4_green'
                              : 'h4_red'
                          "
                        >
                          {{
                            item.state !== 2
                              ? currency(item.winAmount - item.amount)
                              : "-"
                          }}
                        </h4>
                        <span>{{ $t("profitNloss") }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 捕鱼 -->
          <div class="bet-container-items" v-if="gameBetRecordList[active].type === 3">
            <div class="bet-container-lottery">
              <div
                class="bet-container-lottery-items"
                v-for="item in listData as unknown as GameOtherData[]"
                :key="item.orderNo"
              >
                <div class="bet-container-lottery-card electric-card">
                  <div class="bet-container-lottery-card-header ar-1px-b">
                    <h1>
                      <h2>{{ item.venderCode }}</h2>
                      <span>{{
                        $t(getArrayKey(rootConfig.bettingOrderStatus, item.orderStatus)||'')
                      }}</span>
                    </h1>
                    <p>{{ item.betTime }}</p>
                  </div>
                  <div class="bet-container-lottery-card-info">
                    <ul>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("type") }}</h2>
                        <span>{{ item.gameName }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("orderNo") }}</h2>
                        <span>{{ item.orderNo }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("betAmount") }}</h2>
                        <span>{{ currency(item.betAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("lotteryAmount") }}</h2>
                        <span>{{ currency(item.winAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("profitNloss") }}</h2>
                        <span
                          :class="[
                            item.winLossAmount <= 0 ? 'colorF95959' : 'color2AAB79',
                          ]"
                        >
                          <span v-if="item.winLossAmount > 0" class="color2AAB79">+</span
                          >{{ currency(item.winLossAmount) }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 小游戏 -->
          <div class="bet-container-items" v-if="gameBetRecordList[active].type === 6">
            <div class="bet-container-lottery">
              <div
                class="bet-container-lottery-items"
                v-for=" item  in  listData as unknown as GameOtherData[] "
                :key="item.orderNo"
              >
                <div class="bet-container-lottery-card electric-card">
                  <div class="bet-container-lottery-card-header ar-1px-b">
                    <h1>
                      <h2>{{ item.venderCode }}</h2>
                      <span>{{
                        getArrayKey(rootConfig.bettingOrderStatus, item.orderStatus)
                      }}</span>
                    </h1>
                    <p>{{ item.betTime }}</p>
                  </div>
                  <div class="bet-container-lottery-card-info">
                    <ul>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("type") }}</h2>
                        <span>{{ item.gameName }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("orderNo") }}</h2>
                        <span>{{ item.orderNo }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("betAmount") }}</h2>
                        <span>{{ currency(item.betAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("lotteryAmount") }}</h2>
                        <span>{{ currency(item.winAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("profitNloss") }}</h2>

                        <span
                          :class="[
                            item.winLossAmount <= 0 ? 'colorF95959' : 'color2AAB79',
                          ]"
                        >
                          <span v-if="item.winLossAmount > 0" class="color2AAB79">+</span
                          >{{ currency(item.winLossAmount) }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 视讯 -->
          <div class="bet-container-items" v-if="gameBetRecordList[active].type === 1">
            <div class="bet-container-lottery">
              <div
                class="bet-container-lottery-items"
                v-for=" item  in  listData as unknown as GameOtherData[] "
                :key="item.orderNo"
              >
                <div class="bet-container-lottery-card electric-card">
                  <div class="bet-container-lottery-card-header ar-1px-b">
                    <h1>
                      <h2>{{ item.venderCode }}</h2>
                      <span>{{
                        getArrayKey(rootConfig.bettingOrderStatus, item.orderStatus)
                      }}</span>
                    </h1>
                    <p>{{ item.betTime }}</p>
                  </div>
                  <div class="bet-container-lottery-card-info">
                    <ul>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("type") }}</h2>
                        <span>{{ item.gameName }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("orderNo") }}</h2>
                        <span>{{ item.orderNo }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("betAmounts") }}</h2>
                        <span>{{ currency(item.betAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("lotteryAmount") }}</h2>
                        <span>{{ currency(item.winAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("profitNloss") }}</h2>
                        <span
                          :class="[
                            item.winLossAmount <= 0 ? 'colorF95959' : 'color2AAB79',
                          ]"
                        >
                          <span v-if="item.winLossAmount > 0" class="color2AAB79">+</span
                          >{{ currency(item.winLossAmount) }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 棋牌 -->
          <div class="bet-container-items" v-if="gameBetRecordList[active].type === 5">
            <div class="bet-container-lottery">
              <div
                class="bet-container-lottery-items"
                v-for=" item  in  listData as unknown as GameOtherData[] "
                :key="item.orderNo"
              >
                <div class="bet-container-lottery-card electric-card">
                  <div class="bet-container-lottery-card-header ar-1px-b">
                    <h1>
                      <h2>{{ item.venderCode }}</h2>
                      <span>{{
                        $t(getArrayKey(rootConfig.bettingOrderStatus, item.orderStatus)||'')
                      }}</span>
                    </h1>
                    <p>{{ item.betTime }}</p>
                  </div>
                  <div class="bet-container-lottery-card-info">
                    <ul>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("type") }}</h2>
                        <span>{{ item.gameName }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("orderNo") }}</h2>
                        <span>{{ item.orderNo }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("betAmount") }}</h2>
                        <span>{{ currency(item.betAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("serviceCharge") }}</h2>
                        <span>{{ currency(item.serviceFeeAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("actualAmount") }}</h2>
                        <span>{{ currency(item.validBetAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("lotteryAmount") }}</h2>
                        <span>{{ currency(item.winAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("profitNloss") }}</h2>

                        <span
                          :class="[
                            item.winLossAmount <= 0 ? 'colorF95959' : 'color2AAB79',
                          ]"
                        >
                          <span v-if="item.winLossAmount > 0" class="color2AAB79">+</span
                          >{{ currency(item.winLossAmount) }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 电子 -->
          <div class="bet-container-items" v-if="gameBetRecordList[active].type === 2">
            <div class="bet-container-lottery">
              <div
                class="bet-container-lottery-items"
                v-for=" item  in  listData as unknown as GameOtherData[] "
                :key="item.orderNo"
              >
                <div class="bet-container-lottery-card electric-card">
                  <div class="bet-container-lottery-card-header ar-1px-b">
                    <h1>
                      <h2>{{ getSlotTitle(item.venderCode) }}</h2>
                      <span>{{
                        $t(getArrayKey(rootConfig.bettingOrderStatus, item.orderStatus))
                      }}</span>
                    </h1>
                    <p>{{ item.betTime }}</p>
                  </div>
                  <div class="bet-container-lottery-card-info">
                    <ul>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("type") }}</h2>
                        <span>{{ item.gameName }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("orderNo") }}</h2>
                        <span class="electric-orderNo">{{ item.orderNo }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("betAmount") }}</h2>
                        <span>{{ currency(item.betAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("serviceCharge") }}</h2>
                        <span>{{ currency(item.serviceFeeAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("actualAmount") }}</h2>
                        <span>{{ currency(item.validBetAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("lotteryAmount") }}</h2>
                        <span>{{ currency(item.winAmount) }}</span>
                      </li>
                      <li>
                        <h2><svg-icon name="round"/>{{ $t("profitNloss") }}</h2>

                        <span
                          :class="[
                            item.winLossAmount <= 0 ? 'colorF95959' : 'color2AAB79',
                          ]"
                        >
                          <span v-if="item.winLossAmount > 0" class="color2AAB79">+</span
                          >{{ currency(item.winLossAmount) }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </List>
    </div>
    <SelectList
      :show-popup="showPicker"
      :tabId="active"
      :selectId="tabActive"
      :list="lotteryList"
      @onOverlay="onBack"
      @onClick="onConfirm"
      @onBack="onBack"
    ></SelectList>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import List from "@/components/common/List.vue";
import SelectList from "@/components/Main/BetRecords/SelectList.vue";
import { rootConfig } from "@/utils/selectArr/rootConfig";
import {
  fixDateStr,
  formatTimeDay,
  dateRange,
  currency,
  getArrayKey,
  AwaitApiResult,
	getSlotTitle
} from "@/utils";
import type {
  GameBetRecord,
  GameOtherData,
  HomeGameList,
  MyEmerdListData,
  MyEmerdParms,
} from "@/types/api";
import { getGameBetRecordType, getNewMyEmerdList, GetLotteryCategoryList } from "@/api";
import { useI18n } from "vue-i18n";
import { nextTick } from "vue";
import { LorreryStore, useCommonStore } from "@/stores";
import NavTab from "@/components/FunTab/NavBar.vue";
import XoSoRecord from "@/components/Main/BetRecords/XoSoRecord.vue";
import D4Record from "@/components/Main/BetRecords/D4Record.vue";
import { useBinguoCount } from "@/hooks/useBinguoCount";
import MotoRace from './components/MotoRace.vue'
import VideoWingo from './components/VideoWingo.vue'

const { setLoading } = useCommonStore();
const { t } = useI18n();
const router = useRouter();
const lottery = LorreryStore()
interface lotteryData {
  key: string;
  value: number | string;
  img?: string;
}

const { filterGameType } = useBinguoCount();
let lotteryList = reactive<lotteryData[]>([]);
//本地游戏数据
const lotteryCode = reactive<lotteryData[]>([
  { key: "Win Go", value: 1, img: "" },
  { key: "Trx Win Go", value: 13, img: "" },
  { key: "5D", value: 5, img: "" },
  { key: "K3", value: 9, img: "" },
  { key: "XOSO", value: "XOSO", img: "" },
  { key: "Bingo18", value: "BINGO", img: "" },
  { key: "FXOSO", value: "FXOSO", img: "" },
  { key: "4D", value: "4D", img: "" },
	{ key: "MotoRace", value: 17, img: "" },
	{ key: "VideoWinGo", value: 23, img: "" },
]);
//电子即其他三方
const otherCode = ref<{ key: string; value: number }[]>([]);

//tab数据
const active = ref(0);
const gameBetRecordList = reactive([
  {
    name: t("lottery"),
    img: "lottery",
    type: 0,
    reqType: 0,
  },
  {
    name: t("live"),
    img: "video",
    type: 1,
    reqType: 1,
  },
  {
    name: t("fishing"),
    img: "fish",
    type: 3,
    reqType: 3,
  },
  // {
  // 	name: t('sport'),
  // 	img: 'sport',
  // 	type: 4,
  // 	reqType: 2
  // },
  {
    name: t("chess"),
    img: "chess",
    type: 5,
    reqType: 4,
  },
  {
    name: t("miniGame"),
    img: "flash",
    type: 6,
    reqType: 6,
  },
  {
    name: t("electric"),
    img: "slot",
    type: 2,
    reqType: 0,
  },
]);
const containerRef = ref<HTMLElement>(null as any);
const listRef = ref();

const pageQuery = ref<MyEmerdParms>({
  startDate: "",
  endDate: "",
  type: 0,
  gameType: "1",
});
let listData = ref<MyEmerdListData[]>([]);
const isAutoLoad = ref(true);
const typeList = ref<any>([]);
const getLotteryTypeList = (value: number | string) => {
  switch (value) {
    case 1:
      return lottery.getWingo;
    case 13:
      return lottery.getTrx;
    case 5:
      return lottery.get5D;
    case 9:
      return lottery.getK3;
    default:
      return [];
  }
};
const tipColorTextMap = ref<{
  [key: string]: string;
}>({
  red: t("redColor"),
  green: t("green"),
  "red,violet": t("winColor3"),
  "green,violet": t("winColor4"),
  violet: t("purpleColor"),
});
function onClickLeft(): void {
  console.log('router', router)
  router?router.go(-1) : history.go(-1);
}

const computeSelectType = (text: string) => {
  switch (text) {
    case "Big":
      return t("big");
    case "Drawn":
      return t("binguoHe");
    case "Small":
      return t("small");

    default:
      return text;
  }
};

//
const tabActive = ref(0);
const onBack = () => {
  showPicker.value = false;
  tabActive.value = 0;
};

//切换游戏重新加载数据
const onClickTab = async () => {
  tabActive.value = 0;
  let type = gameBetRecordList[active.value].type;
  if (type === pageQuery.value.type) return false;
  pageQuery.value.type = type;
  setLoading(true);
  if (type !== 0) {
    await getBetRecordType(gameBetRecordList[active.value].reqType);
    if (otherCode.value.length < 1) {
      listData.value = [];
      setLoading(false);
      return;
    }
    otherCode.value.unshift({ key: t("all"), value: -1 });
    lotteryList = otherCode.value;
    // console.log('电子tab', otherCode.value)
    typeValue.value = otherCode.value[0];
    pageQuery.value.gameType = otherCode.value[0].key;
    if (pageQuery.value.gameType == t("all")) {
      pageQuery.value.gameType = "-1";
    }
  } else {
    // console.log('彩票tab')
    //pickerData.value = rootConfig.lotteryTypes
    lotteryList = lotteryCode;
    getGameList();
    typeValue.value = lotteryCode[0];
  }
  await listRef.value.resetRefresh();
  setLoading(false);
};
// 配合弹窗层使用
const typeValue = ref(lotteryCode[0]);
const showPicker = ref(false);

//选择彩票下拉
const onConfirm = (selectedOptions: any, index: number) => {
  // console.log(selectedOptions,index)
  tabActive.value = index;
  showPicker.value = false;
  typeValue.value = selectedOptions;
  typeList.value = getLotteryTypeList(typeValue.value.value);
  if (active.value == 0) {
    pageQuery.value.gameType = typeValue.value.value.toString();
  } else {
    if (index == 0) {
      //全部的时候传vale,不是全部传key
      pageQuery.value.gameType = typeValue.value.value.toString();
    } else {
      pageQuery.value.gameType = typeValue.value.key;
    }
  }

  listRef.value.resetRefresh();
};

// 日期选择
const { value: dateVal } = fixDateStr();
const dateValue = ref("");
const currentDate = ref(dateVal);
const { minDate, maxDate } = dateRange(0);
const showDataPick = ref(false);

const cancelDataPick = () => {
  console.log("cancelDataPick");
  showDataPick.value = false;
};

//选择日期
const onConfirmDataPick = ({ selectedOptions }: any) => {
  showDataPick.value = false;
  const [{ value: year }, { value: month }, { value: day }] = selectedOptions;
  let date = year + "-" + month + "-" + day;
  pageQuery.value.startDate = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss");
  pageQuery.value.endDate = dayjs(date).endOf("day").format("YYYY-MM-DD HH:mm:ss");
  dateValue.value = formatTimeDay(year, month, day);
  listRef.value.resetRefresh();
};
const changeDataPick = () => {
  console.log("changeDataPick");
};

/**
 * @description: 获取游戏投注记录类型
 * @param {*} type
 * @return {*}
 */
const getBetRecordType = async (type: number): Promise<void> => {
  const result = await AwaitApiResult<ObjResNull<GameBetRecord[]>>(
    getGameBetRecordType({ categoryType: type })
  );
  if (result) {
    nextTick(() => {
      otherCode.value = result.data.map((item) => {
        return {
          key: item.slotsName,
          value: item.slotsTypeID,
        };
      });
    });
  }
};
//获取彩票分类图标
const getGameList = async () => {
  const res = await AwaitApiResult(GetLotteryCategoryList());
  if (res) {
    const gamelist = res.data;
    getLotteryType(gamelist);
  }
};
getGameList();
const getLotteryType = (list: HomeGameList[]) => {
  // 使用 map 方法匹配符合条件的对象并生成新的数组
  const newArray = lotteryCode
    .map((obj) => {
      const arr = list.find((item) => item.categoryCode === obj.key); // 根据条件查找匹配的对象
      if (arr) {
        return { value: obj.value, key: arr.categoryCode, img: arr.categoryImg }; // 合并匹配的对象属性并返回
      } else {
        return null; // 如果没有匹配的对象，则返回 null
      }
    })
    .filter((obj) => obj !== null); // 过滤掉没有匹配的对象
  lotteryList = (newArray as unknown) as lotteryData[];
};

const getTypeText = (type: number): string => {
  if (typeList.value.length === 0) return "";
  return typeList.value
    .find((item: any) => item.typeID === type)
    ?.typeName.replace("<br />", " ");
};
const replaceDash = (item: any) => {
  return item.match(/[0-9]+|[A-Za-z]+/g);
};
typeList.value = getLotteryTypeList(typeValue.value.value);
void lottery.getWinGoData().then(() => {
  if (typeValue.value.value === 1) {
    typeList.value = lottery.getWingo;
  }
});
</script>

<style>
:root {
  --van-tabs-card-height: auto;
}
</style>

<style lang="scss" scoped>
.bet-container {
  overflow: hidden;
  padding: 0 24px;

  :deep(.van-nav-bar) {
    background-color: #f6f6f6;

    .van-nav-bar__content {
      .van-nav-bar__left {
        .van-icon {
          color: var(--text_color_L1);
        }
      }
    }
  }
  .bet-container__header {
    background-color: #f6f6f6;
    position: relative;
  }

  &-searchBar {
    margin-top: -10px;
    padding-bottom: 18px;
  }

  .tabs {
    background: var(--bg_color_L1);
  }

  .tab_item {
    width: 190px;
    height: 100px;
    margin-inline: 5px;
    padding: 0;
    color: var(--text_color_L2) !important;
    border-radius: 10px;
    background: var(--bg_color_L2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    svg {
      height: 50px;
      width: 50px;
    }

    span {
      font-size: 24px;
    }
  }

  .tab_active {
    color: var(--text_color_L4) !important;
    background: var(--main_gradient-color);
  }

  ::v-deep(.fun-tabs .fun-tab-item) {
    padding: 14px 0;
  }

  &-tabBar {
    padding-inline: 24px;

    :deep(.van-tabs__nav--card) {
      height: 140px;
      margin: 0;

      .van-tab--card {
        width: 190px;
        height: 100px;
        margin-inline: 5px;
        padding: 0;
        color: var(--text_color_L2) !important;
        border-radius: 10px;
        background: var(--bgDark-2, var(--bg_color_L2));

        & > span {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;

          img {
            width: 50px;
            height: auto;
          }

          span {
            font-size: 24px;
          }
        }

        &.van-tab--active {
          color: var(--text_color_L4)  !important;
          background: var(--main_gradient-color);
        }
      }
    }
  }

  &-items {
    padding-bottom: 24px;
    margin: 0 auto;
  }

  .colorE98613 {
    color: #e98613 !important;
  }

  .color40C592 {
    color: #40c592 !important;
  }

  .colorF95959 {
    color: var(--norm_red-color) !important;
  }

  .color2AAB79 {
    color: var(--norm_green-color) !important;
  }

  &-lottery {
    &-items {
      margin-bottom: 24px;

      img {
        display: block;
        width: 100%;
        height: 44px;
      }
    }

    .electric-card {
      border-radius: 10px !important;
      padding: 26px 24px !important;
    }

    &-card {
      background:var(--bg_color_L2);
      width: 100%;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding: 26px 24px 26px;

      &-header {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-bottom: 12px;

        h1 {
          display: flex;
          justify-content: space-between;
          align-items: center;

          h2 {
            font-weight: bold;
            font-size: 30px;
            color: var(--text_color_L1);
            padding-bottom: 8px;
          }

          span {
            font-size: 28px;
            color: #e98613;
          }
        }

        p {
          font-size: 22px;
          color: var(--text_color_L2);
        }
      }

      &-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 25px;

        &-chessimg {
          height: 307px !important;
        }

        ul {
          width: 100%;
          display: flex;
          flex-direction: column;

          li {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 24px;
            color: var(--text_color_L2);
            padding-bottom: 10px;
            position: relative;
            gap: 10px;
					  &:first-child{
					  	&::after{
					  		display: none;
					  	}
					  }
            svg {
              z-index: 10;
              width: 20px;
              height: 20px;
            }
					  &::after{
					  	content: "";
					  	position: absolute;
					  	border-left: 1px dashed var(--darkLight,var(--main-color));
					  	height: 100%;
					  	top: -50%;
					  	left: 9px;
              z-index: 1;
					  	html:lang(ar) &{
					  		left: unset;
					  		right: 8px;
					  	}
					  }

            &:last-of-type {
              padding-bottom: 0 !important;
            }

            span {
              display: flex;
              gap: 10px;
              color: var(--text_color_L1);
				&:last-child{
					max-width:436px;
					word-break: break-all;
				}
            }
            h2 {
              width: fit-content;
              flex: none;
              display: flex;
              gap: 10px;
            }
            h3 {
              display: inline-block;
              text-align: center;
              width: 100px;
              height: 50px;
              line-height: 50px;
              color: var(--text_color_L1);
              border-radius: 10px;
              margin-left: 12px;
              background: var(--norm_green-color);
            }

            div {
              color: var(--main-color);
              height: 50px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              text-align: center;
              font-weight: bold;
              font-size: 30px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

              & > div {
                margin-right: 10px;
              }

              & > div:last-child {
                margin-right: 0;
              }
            }
          }
        }
      }
    }

    &-note {
      background:  var(--bg_color_L2);

      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      padding: 0 24px 26px;

      &-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0 0 0;
        flex-wrap: wrap;

        &-para {
          font-size: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;

          h3 {
            font-size: 28px;
            color: var(--text_color_L2);
          }

          h4 {
            font-size: 28px;
            color: var(--norm_green-color);
          }

          .h4_green {
            color: var(--norm_green-color);
          }

          .h4_red {
            color: var(--norm_red-color);
          }
        }

        & > div {
          width: 48%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px 0;
          background: var(--bg_color_L3);
          border-radius: 10px;
          height: 120px;

          span {
            font-size: 24px;
            color: var(--text_color_L2);
            display: inline-block;
            margin-top: 12px;
          }
        }
      }

      &-result {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        padding-top: 10px;

        &-sportimg {
          height: 410px !important;
        }

        div {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          font-size: 28px;
          color: var(--text_color_L1);
          h1,h2 {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 10px;
          }
          svg {
            width: 20px;
            height: 20px;
          }

          h1 {
            padding-bottom: 42px;
          }

          h2 {
            color: var(--text_color_L3);
            position: relative;
					  &::after{
					  	content: "";
					  	position: absolute;
					  	border-left: 1px dashed var(--darkLight,var(--main-color));
					  	height: 100%;
					  	top: -80%;
					  	left: 9px;
					  	html:lang(ar) &{
					  		left: unset;
					  		right: 13px;
					  	}
					  }
            p {
              color: #e93333;
              width: 50px;
              height: 50px;
              display: inline-block;
              line-height: 50px;
              text-align: center;
              border-radius: 50px;
              background: url("@/assets/icons/main/numberBG.png") no-repeat
                right/contain;
              font-weight: bold;
              font-size: 30px;
              
			        $alist: 0 1 2 3 4 5 6 7 8 9;

			        @each $ai in $alist {
			  	      &.w#{$ai} {
			  	      	background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/n#{$ai}.png');
			  	      }
              }
            }

            $list: 1 2 3 4 5 6;

            @each $i in $list {
              .n#{$i} {
                background-image: url("@icon/AllGames/n#{$i}.png");
                border-radius: 0;
              }
            }

            span {
              display: inline-block;
              text-align: center;
              min-width: 100px;
              height: 50px;
              line-height: 46px;
              color: #fff;
              border-radius: 10px;
              margin-left: 12px;
            }

            .bigClass {
              background: var(--norm_secondary-color);
            }

            .small {
              background: var(--norm_bule-color);
            }

            .BG-FCCC52 {
              background: var(--lotterybtnColor);
            }

            .BG-49CE9B {
              background: var(--norm_green-color);
            }

            .BG-C57AFF {
              background: var(--norm_Purple-color);
            }
          }

          ul {
            margin-top: -12px;

            li {
              display: flex;
              flex-direction: column;
              align-items: flex-start;

              h3 {
                font-size: 28px;
                color: var(--text_color_L1);
              }

              p {
                font-size: 24px;
                color: var(--text_color_L3);
                padding-top: 13px;
                padding-bottom: 22px;
              }

              &:last-of-type {
                p {
                  padding-bottom: 0 !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
.red {
  background: #fb4e4e;
}

.green {
  background: #49ce9b;
}

.violet {
  background: #c57aff;
}

.red_violet {
  background-image: linear-gradient(to bottom right, #fb4e4e 50%, #eb43dd 0);
}

.green_violet {
  background-image: linear-gradient(to bottom right, #40ad72 50%, #eb43dd 0);
}

.big_binguo,
.small_binguo,
.sum_binguo {
  font-size: 24px !important;
  min-width: 42px !important;
  height: 42px !important;
  border-radius: 8px !important;
  line-height: 42px !important; /* 100% */
  padding: 0 4px;
  display: block !important;
}
.big_binguo {
  color: var(--textW) !important;
  background-color: var(--LotteryBingoTextColor) !important;
}

.small_binguo {
  color: var(--LotteryBingoTextColor) !important;
  background-color: var(--textW) !important;
}
.sum_binguo {
  color: var(--LotteryBingoTextColor) !important;
  background-color: var(--colorText-25) !important;
}
.binguo_select {
  width: 42px !important;
  height: 42px !important;
  border-radius: 50%;
  border: 1px solid var(--LotteryBingoTextColor);
  color: var(--LotteryBingoTextColor) !important;
  text-align: center !important;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 42px !important; /* 100% */
  display: block !important;
}
.binguo_result {
  display: flex;
  flex-direction: row !important;
  align-items: center;
  gap: 10px;
  position: relative;
	&::after{
		content: "";
		position: absolute;
		border-left: 1px dashed var(--darkLight,var(--main-color));
		height: 100%;
		top: -80%;
		left: 13px;
		html:lang(ar) &{
			left: unset;
			right: 13px;
		}
	}
  div {
    width: 42px !important;
    height: 42px !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .result_item {
    margin-right: 8px;
    border-radius: 50%;
    border: 1px solid var(--text_color_L1);
    color: var(--text_color_L1) !important;
    font-size: 30px;
  }
  .binguo_sum {
    background: var(--norm_red-color);
    color: var(--LotteryBingoTextColor);
    border-radius: 8px;
  }
}
.electric-orderNo{
	justify-content: flex-end;
	text-align: right;
	width: 100%;
	word-break:break-all;
}
</style>
