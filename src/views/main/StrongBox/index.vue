<template>
  <div class="StrongBox__container">
    <NavBar :title="$t('vault')" :placeholder="false" left-arrow @click-left="onClick" />
    <div class="StrongBox__container-dailyRate">
      <!-- {{ $t('dailyRate1percent', [(dayShareRate && numFilter2(dayShareRate * 100, 3, 1)) + '%']) }} -->
      {{
        $t("dailyRate1percent", [isOpenNewSetting ? numFilter2((dayShareRate * 100) /48, 3, 3) + "%": (dayShareRate && numFilter2(dayShareRate * 10000 / 100, 2, 2)) + "%",])
      }}
    </div>
    <TotalAssets :safeAmount="safeAmount" :maxSafeAmount="maxSafeAmount" :isOpenNewSetting="isOpenNewSetting" :income="userDayShareRate|| 0" :willSafeEarnings="willSafeEarnings" />
    <div class="StrongBox__container-income">
      <div class="StrongBox__container-income-header">
        <div class="StrongBox__container-income-header-left">
          <div class="StrongBox__container-income-header-left-num">
            {{ currency(safeEarnings || 0) }}
          </div>
          <div class="StrongBox__container-income-header-left-text">
            {{ $t("generatedRevenue") }}
          </div>
          <div class="StrongBox__container-income-header-left-myrale">
            {{
              $t("tipMyrate1percent", [isOpenNewSetting ? numFilter2(dayShareRate * 100 /48, 3, 1)+ "%": (userDayShareRate ? numFilter2(userDayShareRate * 10000 / 100, 2, 1) : 0) ,])
            }}
          </div>
        </div>
        <div class="StrongBox__container-income-header-right">
          <div class="StrongBox__container-income-header-right-num">
            {{ currency(safeTotalAmount || 0) }}
          </div>
          <div class="StrongBox__container-income-header-right-text">
            {{ $t("cumulativeRevenue") }}
          </div>
        </div>
      </div>
      <div class="StrongBox__container-income-buttom">
        <div @click="transferOutBtn(safeEarnings)">{{ $t("transferOut") }}</div>
        <div @click="transferInBtn">{{ $t("transferIn") }}</div>
      </div>
      <div class="StrongBox__container-income-tip">
        <errorTipIcon class="StrongBox__container-errorTip" />
        {{ $t("tipFundEnsuredNtransferOutfreely") }}
      </div>
      <div v-if="safeBoxCodeAmount" class="StrongBox__container-income-tip pl">
        {{ $t("safeT",[safeBoxCodeAmount]) }}
      </div>
      <div
        class="StrongBox__container-income-godetail"
        @click="goPath('StrongBox-StrongBoxAbout')"
      >
        {{ $t("learnAboutVault") }}
        <img src="@public/main/nextIcon.png" alt="" />
      </div>
    </div>
    <div class="StrongBox__container-record">
      <svg-icon name="historyHead" />
      {{ $t("historyRecourds") }}
    </div>
    <StrongBoxRecordCard
		:isOpenNewSetting="isOpenNewSetting"
      class="StrongBox__container-record-card"
      v-for="(item, index) in SafeList"
      :key="index"
      :detail="item"
    />
    <div
      class="StrongBox__container-allRecord"
      @click="goPath('StrongBox-StrongBoxRecord')"
    >
      {{ $t("allRecords") }}
    </div>
    <Dialog
      v-model:show="transferOutTip"
      @confirm="enterTransferOut"
      :show-cancel-btn="true"
      :title="$t('noRevenue')"
      :confirmText="$t('transferOut')"
    >
      <template #content>
        <div class="tipText">{{ $t("tipNoIncomeYetWeatherTransferout") }}</div>
      </template>
    </Dialog>

    <van-popup v-model:show="transferOut" round position="bottom" class="popupStyle">
      <div class="popup__header">{{ $t("transferOut") }}</div>
      <div class="popup__amount">
        <div>{{ $t("amountUnit") }}</div>
        <div>{{ shareAmount }}</div>
      </div>
      <div class="popup__container">
        <van-field
          class="popup__container-input"
          maxlength="6"
          v-model="outDigit"
          :clearable="!isOpenNewSetting"
          :disabled="isOpenNewSetting"
          @update:model-value="outNumber"
          type="digit"
          :placeholder="$t('plsEnterQuantity')"
          clear-icon="close"
          clear-trigger="always"
        >
        </van-field>
        <div class="popup__container-slider" v-if="!isOpenNewSetting">
          <van-slider
            v-model="outDigit"
            bar-height="7px"
            button-size="18px"
            :min="minAmount"
            :max="maxAmount"
          >
            <template #button>
              <div class="popup__container-slider-button"></div>
            </template>
          </van-slider>
          <div class="popup__container-slider-foot">
            <div @click="outDigit = minAmount">{{ minAmount }}</div>
            <div @click="outDigit = maxAmount">{{ maxAmount }}</div>
          </div>
        </div>
        <div class="popup__container-numLine">
          <div>{{ $t("amountAvaliable") }}</div>
          <div class="popup__container-numLine-num">{{ currency(outInfo.balance) }}</div>
        </div>
        <div class="popup__container-numLine">
          <div>{{ $t("amountTransferedOut") }}</div>
          <div class="popup__container-numLine-num red">{{ currency(outAmount) }}</div>
        </div>
        <div class="popup__container-numLine">
          <div>{{isOpenNewSetting?$t("dailyRate2"): $t("dailyRate") }}</div>
          <div class="popup__container-numLine-num">
		    {{isOpenNewSetting ? numFilter2(dayShareRate * 100 /48, 3, 1)+ "%": (userDayShareRate ? `${numFilter2(userDayShareRate * 10000 / 100, 2, 1)}%` : 0)}}
          </div>
        </div>
        <div class="popup__container-numLine">
          <div>{{ $t("revenue") }}</div>
          <div class="popup__container-numLine-num red">
            {{ currency(safeEarnings || 0) }}
          </div>
        </div>
      </div>
      <div
        class="popup__container-sumbit"
        :class="{ disabled: !inDigit || outAmount > outInfo.balance }"
        v-throttle-click="{ handler: outSend, wait: 5000 }"
      >
        {{ $t("transferOut") }}
      </div>
    </van-popup>
    <van-popup v-model:show="transferIn" round position="bottom">
      <div class="popup__header">{{ $t("transferIn") }}</div>
      <div class="popup__amount">
        <div>{{ $t("amountUnit") }}</div>
        <div>{{ shareAmount }}</div>
      </div>
      <div class="popup__container">
        <van-field
          class="popup__container-input"
          maxlength="6"
          v-model="inDigit"
          @update:model-value="outNumber"
          type="digit"
          :placeholder="$t('phEnter') + $t('quantity')"
          clear-icon="close"
          clear-trigger="always"
        >
          <template #button>
            <div class="popup__container-allBtn" @click="inAll">{{ $t("all") }}</div>
          </template>
        </van-field>
        <div v-if="inDigit * shareAmount > inInfo" class="popup__container-errorTip">
          <errorTipIcon class="StrongBox__container-errorTip" />{{
            $t("amountAvaliableInsufficient")
          }}
        </div>
        <div class="popup__container-multiple">
          <div
            v-for="(item, index) in multipleList"
            :key="index"
            :class="{ active: inDigit == item }"
            @click="inDigit = item"
          >
            {{ item + "x" }}
          </div>
        </div>
        <div class="popup__container-numLine">
          <div>{{ $t("amountAvaliable") }}</div>
          <div class="popup__container-numLine-num refreshBalance">
			 <span> {{ currency(inInfo || 0) }}</span>
			  <svg-icon
				  name="refreshBalance"
				  v-throttle-click="{ handler: getRecoverBalance, wait: 500 }"
			  />
		  </div>

        </div>
        <div v-if="amountOfCode > 0" class="betTip">
          {{ $t("instructionDesc12") }}<span>{{ currency(amountOfCode) }}</span
          >{{ $t("afterTransferIn") }}
        </div>
        <div class="popup__container-numLine">
          <div>{{ $t("amountTransferedIn") }}</div>
          <div class="popup__container-numLine-num red">
            {{ currency(inDigit * shareAmount) }}
          </div>
        </div>
        <div class="betTip">
          {{ $t("descTotalAssets") }} <span>{{ currency(inDigit * shareAmount *dayShareRate) }}</span>
        </div>
      </div>
      <div
        class="popup__container-sumbit"
        :class="{
          disabled:
            amountOfCode > 0 || !Number(inDigit) || inDigit * shareAmount > inInfo,
        }"
        v-throttle-click="{ handler: setSafeIntoData, wait: 5000 }"
      >
        {{ $t("transferIn") }}
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import {
	getSafeAmount,
	getSafeInfo,
	getSafeList,
	getSafeUserAmount, RecoverBalance,
	setSafeBack,
	SetSafeIntopage,
} from "@/api";
import TotalAssets from "@/components/Main/TotalAssets/index.vue";
import StrongBoxRecordCard from "@/components/Main/StrongBoxRecordCard/index.vue";
import Dialog from "@/components/common/Dialog.vue";
import { useRouter } from "vue-router";
import { AwaitApiResult, currency, numFilter2 } from "@/utils";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import {showDialog, showFailToast, showSuccessToast, showToast} from "vant";
import type { ResGetSafeAmount, ResGetSafeList } from "@/types/api";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const errorTipIcon = defineAsyncComponent(() => import("@/svg/main/errorTip.vue"));
const router = useRouter();
const transferOutTip = ref(false);
const transferOut = ref(false);
const transferIn = ref(false);
const dayShareRate = ref(0); // 日利率
const userDayShareRate = ref(0);
const willSafeEarnings = ref('0')
const safeAmount = ref("0"); // 总金额
const safeEarnings = ref("0"); //已产生收益
const safeTotalAmount = ref("0"); //累计收益
const shareAmount = ref(0); //每份金额
const shareTime = ref(1); //每天金额
const amountOfCode = ref(0); //打码量
const safeBoxCodeAmount = ref(0); // 本金打码量倍数
const SafeList = ref<ResGetSafeList[]>([]); //历史记录
const maxSafeAmount = ref("0"); // 最大总收益
const outInfo = ref<ResGetSafeAmount>({
  balance: 0,
  dayShareRate: 0,
  safeEarnings: "0",
});
const inInfo = ref(0);
const outDigit = ref<any>(0);
const outAmount = ref(0);
const outCopiesType = ref(-1);
const isOpenNewSetting = ref(false)
const multipleList = [2, 5, 10, 50, 100, 200, 500, 1000];
const inDigit = ref(2);
const maxAmount = computed(() => {
  if (outInfo.value.balance && shareAmount.value) {
    return Math.floor(outInfo.value.balance / shareAmount.value);
  }
  return 0;
});
const minAmount = computed(() => {
  return maxAmount.value ? 1 : 0;
});

// 获取保险箱参数
const getSafeInfoData = async () => {
  const res = await AwaitApiResult(getSafeInfo());
  if (res) {
    dayShareRate.value = res.data.dayShareRate || 0;
    safeAmount.value = res.data.safeAmount || 0;
    safeEarnings.value = res.data.safeEarnings;
    maxSafeAmount.value = res.data.maxSafeAmount || 0;
    safeTotalAmount.value = res.data.safeTotalAmount;
    shareAmount.value = res.data.shareAmount;
    shareTime.value = res.data.shareTime;
    userDayShareRate.value = res.data.userDayShareRate || 0;
    safeBoxCodeAmount.value = res.data.safeBoxCodeAmount || 0;
	  willSafeEarnings.value = res.data.willSafeEarnings || 0
    isOpenNewSetting.value = res.data.isOpenNewSetting === '1' ? true : false
  }
};
// 获取历史记录
const getSafeListData = async () => {
  const res = await AwaitApiResult(getSafeList({ pageSize: 10, pageNo: 1 }));
  if (res) {
    SafeList.value = res.data.list;
  }
};
//获取余额
const getSafeAmountData = async () => {
  const res = await AwaitApiResult(getSafeAmount());
  if (res) {
    outInfo.value = res.data;
    if (!isOpenNewSetting.value) outDigit.value = minAmount.value;
  }
};
// 调用转出接口
const setSafeBackData = async () => {
  console.log(outAmount.value);
  if (outAmount.value < 1) {
    showToast($t("amountAvaliableInsufficient"));
    return;
  }
  const res = await AwaitApiResult(setSafeBack({ amount: outAmount.value }));
  if (res) {
    transferOut.value = false;
    showToast($t("code0"));
    await getSafeInfoData();
	await getSafeListData();
  }
};
// 确认可转入
const setSafeIntoData = async () => {
  const res = await SetSafeIntopage({ amount: inDigit.value * shareAmount.value });

  if (res.code===0) {
    showToast($t("code0"));
    transferIn.value = false;
    getSafeInfoData();
    getSafeListData();
  }else if(res.msgCode === 1008){
	  showDialog({ message: $t('code1008') })
  }else {
	  showFailToast({
		  message: `${res.msgCode ? res.msgCode : ''} \n ` + res.msg,
		  wordBreak: 'break-word'
	  })
  }
};
// 查询可转入金额
const getSafeUserAmountData = async () => {
  const res = await AwaitApiResult(getSafeUserAmount());
  if (res) {
    inInfo.value = Number(res.data.balance);
    amountOfCode.value = res.data.amountOfCode;
  }
};
// 转出金额
const outNumber = (e: any) => {
  outCopiesType.value = -1;
  if (e) {
    outAmount.value = parseInt(e) * shareAmount.value;
  } else {
    outAmount.value = 0;
  }
};
// 全部转入
const inAll = () => {
  inDigit.value = Number(Math.floor(inInfo.value / shareAmount.value));
};
// 确认转出
const outSend = () => {
  if (!outDigit.value) {
    return;
  }
  setSafeBackData();
};
// 返回上一页
function onClick() {
  router.go(-1);
}
// 无收益确认转出
async function enterTransferOut() {
  await getSafeAmountData();
  transferOutTip.value = false;
  transferOut.value = true;
}
//跳转路由
const goPath = (name: string) => {
  router.push({ name ,query: {isNew: isOpenNewSetting.value}});
};
// 点击转出按钮
const transferOutBtn = (num: string) => {
	outDigit.value = Number(Math.floor(Number(safeAmount.value) / shareAmount.value)) || 0
  if (Number(num) > 0) {
    getSafeAmountData();
    transferOut.value = true;
  } else {
    transferOutTip.value = true;
  }
};
// 点击转入按钮
const transferInBtn = () => {
  transferIn.value = true;
  getSafeUserAmountData();
};
async function getRecoverBalance(tips=true) {
	try {
		const res = await RecoverBalance()
		if (res.code===0) {
			inInfo.value = Number(res.data.amount);
			tips&&showSuccessToast($t('refreshSuccess'))
		}
	}catch (e) {

	}
}
onMounted(async () => {
	await getRecoverBalance(false);
  getSafeInfoData();
  getSafeListData();
});
</script>

<style lang="scss" scoped>
.StrongBox__container {
  position: relative;
  width: 100%;
  font-family: "Inter", sans-serif;
  overflow: hidden;
  padding: 24px 26px 24px;

  :deep(.navbar__content-left) {
    .van-icon {
      line-height: 120px;
      font-size: 36px;
    }
  }

  &-dailyRate {
    margin: auto;
    width: 312px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: var(--norm_red-color);
    background: var(--bg_color_L2, var(--bg_color_L3));
    border-radius: 40px;
    font-weight: 400;
    font-size: 24px;
    font-style: normal;
    box-shadow: var(--BoxShadowColor-9);
    margin-bottom: 20px;
  }

  &-income {
    margin-top: 20px;
    min-height: 385px;
    background: var(--bg_color_L2);
    border-radius: 10px;
    padding: 30px 14px 8px 14px;

    &-header {
      display: flex;

      &-left,
      &-right {
        text-align: center;
        padding-top: 9px;
        width: 50%;
        padding: 9px 20px 0 20px;

        &-text {
          height: 28px;
          font-size: 24px;
          color: var(--text_color_L2);
          margin: 12px 0;
        }

        &-myrale {
          height: 36px;
          border: 1px solid var(--text_color_L3);
          border-radius: 40px;
          min-width: 220px;
          font-size: 22px;
          color: var(--text_color_L3);
          margin: auto;
        }
      }

      &-left {
        &-num {
          color: var(--textBlueLight, var(--norm_red-color));
          height: 36px;
          line-height: 36px;
          font-size: 36px;
        }
      }

      &-right {
        border-left: 1px solid var(--bg_color_L3);

        &-num {
          color: var(--text_color_L1);
          height: 36px;
          line-height: 36px;
          font-size: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    &-buttom {
      margin-top: 25px;
      display: flex;
      justify-content: space-between;

      & > div {
        width: 326px;
        height: 70px;
        line-height: 70px;
        border: 1px solid var(--main-color);
        border-radius: 10px;
        font-size: 28px;
        font-weight: 400;
        color: var(--main-color);
        text-align: center;

        & + div {
          background: var(--main-color) !important;
          color: var(--text_color_L4);
        }
      }
    }

    &-tip {
      font-size: 22px;
      color: var(--textBlueLight, var(--norm_red-color));
      margin-top: 25px;
      display: flex;
      align-items: center;
      text-align: left;
      &.pl {
        padding-inline-start: 40px;
      }
    }

    &-godetail {
      text-align: center;
      height: 30px;
      line-height: 30px;
      font-size: 24px;
      color: var(--text_color_L2);
      margin-top: 35px;
      display: flex;
      justify-content: center;

      img {
        width: 32px;
        height: 32px;
      }
    }
  }

  &-record {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 32px;
    color: var(--darkTextW, var(--text_color_L1));
    margin-top: 60px;
    margin-bottom: 37px;

    & > svg {
      width: 48px;
      height: 48px;
      margin-inline-end: 10px;
    }

    &-card {
      margin-bottom: 20px;
    }
  }

  &-allRecord {
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px solid var(--main-color);
    border-radius: 60px;
    font-weight: 400;
    font-size: 28px;
    color: var(--main-color);
    margin-top: 60px;
  }

  &-errorTip {
    width: 30px;
    height: 30px;
    margin-right: 9px;
  }
}

:deep(.cancelOrderDialog) {
  padding: 40px 20px;
  border-radius: 20px;

  .van-dialog__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      margin-top: 26px;
      font-size: 36px;
      font-weight: bold;
    }

    .tipText {
      margin-top: 20px;
      font-weight: 400;
      font-size: 24px;
      color: var(--text_color_L2);
    }
  }

  .dialog-btnWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    margin-top: 3rem;
    padding: 0 1rem;

    button {
      width: 234px;
      height: 80px;
      color: var(--main-color);
      font-size: 32px;
      text-align: center;
      border-radius: 9rem;
      border: 1px solid var(--main-color);
      background: transparent;

      &:last-of-type {
        width: 326px;
        color: var(--text_color_L4);
        background: var(--main_gradient-color);
      }
    }
  }

  &.cancelOrderDialogSuccess {
    .dialog-btnWrapper {
      justify-content: center;
    }
  }
}

.popupStyle {
  overflow-y: "initial";
}

.popup__header {
  height: 44px;
  font-weight: 400;
  font-size: 36px;
  line-height: 44px;
  margin-top: 35px;
  color: var(--text_color_L1);
  text-align: center;
}

.popup__amount {
  width: 440px;
  height: 40px;
  background: var(--bg_color_L3);
  border-radius: 60px;
  color: var(--text_color_L2);
  margin: auto;
  display: flex;
  align-items: center;
  margin-top: 17px;
  margin-bottom: 29px;

  div {
    height: 27px;
    line-height: 27px;
    font-size: 22px;
    width: 50%;
    text-align: right;
    padding-right: 30px;

    & + div {
      border-inline-start: 1px solid var(--Dividing-line_color);
      color: var(--norm_secondary-color);
      text-align: left;
      padding-left: 30px;
    }
  }
}

.popup__container {
  padding: 0 25px;

  &-sumbit {
    height: 80px;
    line-height: 80px;
    color: var( --text_white,var(--main-color));
    background: var( --light-main_gradient-color,var(--bg_color_L3));
    text-align: center;
    font-weight: 700;
    font-size: 34px;
    margin-top: 28px;

    &.disabled {
      background: var(--button_dis_color);
      color: var( --text_white,var(--text_color_L2));
      pointer-events: none;
    }
  }

  &-closeBtn {
    width: 48px;
    height: 48px;
    position: absolute;
    top: 0px;
    right: 22px;
  }

  &-input {
    border: 1px solid var(--bg_color_L3);
    height: 70px;
    border-radius: 12px;
    padding: 0 20px;
    align-items: center;
    background: unset;
    color: var(--text_color_L1);
    :deep(.van-field__clear) {
      font-size: 42px;
    }
  }

  &-allBtn {
    height: 36px;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    color: var(--norm_red-color);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 39px;
  }

  &-errorTip {
    height: 36px;
    line-height: 36px;
    font-weight: 400;
    font-size: 22px;
    color: var(--norm_red-color);
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
  .van-cell:after {
    display: none;
  }

  &-multiple {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 28px 0 15px 0;

    & > div {
      width: calc(25% - 21px);
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: var(--bg_color_L3);
      border-radius: 10px;
      font-weight: 400;
      font-size: 32px;
      color: var(--text_color_L1);
      margin-bottom: 16px;

      &.active {
        background: var(--main_gradient-color);
        color: var(--text_color_L4);
      }
    }
  }
  .betTip {
    font-size: 24px;
    font-weight: 400;
    color: var(--text_color_L2);
    margin-top: 20px;
    margin-bottom: 44px;
    span {
      color: var(--norm_red-color);
    }
  }

  &-numLine {
    height: 60px;
    line-height: 60px;
    border: 1px solid var(--bg_color_L3);
    display: flex;
    font-size: 26px;

    &-num {
      font-weight: 400;
      font-size: 30px;
      color: var(--text_color_L1);

      &.red {
        color: var(--norm_red-color);
        font-weight: 500;
      }
    }

    & > div {
      width: 50%;
      padding-left: 56px;

      &:first-child {
        background: linear-gradient(298deg, transparent 35px, var(--bg_color_L3) 0) 0 0;
        color: var(--text_color_L2);
        padding-left: 20px;
      }
    }

    & + .popup__container-numLine {
      margin-top: 19px;
    }
  }
	.refreshBalance{
		display: flex;
		justify-content: center;
		align-items: center;
		& > svg{
			margin-left: 10px;
			width: 46px;
			height: 46px;
		}
	}

  &-slider {
    height: 140px;
    padding-top: 32px;

    &-button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--main-color);
      position: relative;
      &::before {
        content: "";
        display: block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--main-color);
        position: relative;
        top: 2px;
        left: 2px;
      }
    }

    &-foot {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 23px;

      & > div {
        height: 40px;
        line-height: 40px;
        border: 1px solid var(--norm_red-color);
        border-radius: 6px;
        min-width: 80px;
        padding: 0 15px;
        color: var(--norm_red-color);
        text-align: center;
      }
    }
  }
}
</style>
