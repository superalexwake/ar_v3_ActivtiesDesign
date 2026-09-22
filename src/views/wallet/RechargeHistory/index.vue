<template>
  <div class="rechargeh__container">
    <NavBar
      class="white"
      :title="$t('rechargeRecords')"
      left-arrow
      @click-left="onClick"
    />

    <div class="rechargeh__header_box">
      <NavTab
        :list="store.rechargeType"
        :is-auto-load="true"
        v-model:active="store.currentMenu"
        tabClassName="tabs"
        v-slot="{ item, index }"
        activeClassName="tab_active"
        ref="tabRefs"
        tabItemClassName="funtab_item"
      >
        <div class="tab_item" :class="{ tab_active: index === store.currentMenu }">
          <svg-icon v-if="item.payID == -1" name="all" />
          <img v-else
            :src="store.currentMenu === index ? item.payNameUrl2 : item.payNameUrl"
            alt=""
          />
          <span>{{ item.typeName }}</span>
        </div>
      </NavTab>

      <div class="state_box" v-if="isC2C">
        <div
          class="state_item"
          :class="{ state_item_active: query_state === 1 }"
          @click="handleChangeState(1)"
        >
          {{ $t("inTransaction") }}
        </div>
        <div
          class="state_item"
          :class="{ state_item_active: query_state === 2 }"
          @click="handleChangeState(2)"
        >
          {{ $t("completed") }}
        </div>
      </div>

      <div class="query_select">
        <div class="ar-searchbar__selector">
          <div @click="onClickSelectS" :class="{ selectorA: !dropdownClickS }">
            <span class="ar-searchbar__selector-default">
              {{ typeLable }}
            </span>
            <van-icon name="arrow-down" />
          </div>
        </div>

        <!--日期选择组件-->
        <Calendar ref="calendar" @confirm="onConfirmDateC" />
      </div>
    </div>

    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns-field-names="{ text: 'key', value: 'value', children: 'children' }"
        :columns="getState"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>

    <List
      v-model:list="RechargeRList"
      v-model:page-query="getPageQuery"
      :api="getRecordApi"
      :distance="100"
      ref="listRef"
      @pageChange="getChange"
      :isAutoLoad="true"
    >
      <template #content>
        <div class="rechargeh__container-content">
          <div
            class="rechargeh__container-content__item"
            v-for="(item, index) in RechargeRList"
            :key="index"
            @click.stop="handleGoDetail(item)"
          >
            <div class="rechargeh__container-content__item-header">
              <span class="recharge_tit">{{ $t("recharge") }}</span>
              <div class="recharge_right" :class="getStateColorAndText(item)">
                {{
					  getArrayKey(
						  rootConfig.RechargeState,
						  item.state
					  )
				  }}
              </div>
            </div>
            <van-divider class="divier" />
            <div class="rechargeh__container-content__item-body" v-if="isC2C">
              <div>
                <span>{{ $t("amount") }}</span>
                <span class="price">{{ currency(item.orderAmount) }}</span>
              </div>
              <div>
                <span>UTR</span>
                <span>{{ item.transactionNo || "-" }}</span>
              </div>
              <div>
                <span>{{ $t("time") }}</span>
                <span>{{ item.createTime }}</span>
              </div>
              <div>
                <span>{{ $t("orderNo") }}</span>
                <div class="order">
                  <span>{{ item.orderNo }}</span>
                  <svg-icon name="copy" @click.stop="copy(item.orderNo)"></svg-icon>
                </div>
              </div>
            </div>
            <div class="rechargeh__container-content__item-body" v-else>
              <div>
                <span>{{ $t("orderAmountLabel") }}</span>
                <span class="price">{{ currency(item.orderAmount ?? item.price) }}</span>
              </div>
              <RechargeOrderDetail :item="item" />
              <div>
                <span>{{ $t("type") }}</span>
                <span>{{ item?.payName }}</span>
              </div>
              <div>
                <span>{{ $t("time") }}</span>
                <span>{{ item.addTime }}</span>
              </div>
				<div v-if="[0,2].includes(item.state)&&arUpiPayTypeList.includes(item.payTypeId)&&(item.groupID & 16384) ===  16384">
					<span>{{ $t("remarksContent") }}</span>
					<span style="color:red;">{{ $t('arupiRemark') }}</span>
				</div>

				<div>
                <span>{{ $t("orderNo") }}</span>
                <div class="order">
                  <span>{{ item.rechargeNumber }}</span>
                  <svg-icon
                    name="copy"
                    @click.stop="copy(item.rechargeNumber)"
                  ></svg-icon>
                </div>
              </div>

            </div>
                  <!-- GroupID :
                    未申诉 = 32,
                    申诉中 = 64,
                    申诉失败 = 128,
                    申诉成功 = 256
                    提交utr = 512,
                    补单成功 = 1024,
                    超时取消= 2048,
                    可以申诉：4096
                    补提UTR = 8192,
                    联系客服 = 16384,
                     -->
            <template v-if="[0,2].includes(item.state)">
				<div class="report" style="margin-bottom: 10px"  v-if="showUtr(item)" @click.stop="openPopup(item)">
					{{ $t('submitUtr') }}
				</div>
				<div class="report report-b" v-if="(item.groupID & 16384) ===  16384 ||[21].includes(item.payID)" @click.stop="handleOpen">
					{{$t('contactServicer')}}
				</div>
				<div class="report report-b" v-if="showBank(item)" @click.stop="gotoBanklist(item)">
					{{showBankText(item)}}
				</div>
              <div class="report" v-if="showeRportUtr(item)" @click.stop="goToOrderAppeal(item)">
                {{ [32,544,4096].includes(item.groupID) ?$t('appeal') : $t('compDetails') }}
              </div>
              <!-- 已有关联工单时展示「查看工单进度」，否则引导提交存款凭证；均跳工单H5（由其按订单状态自动路由） -->
              <div class="report" v-else-if="!arUpiPayTypeList.includes(item.payTypeId) && isCenterServer" @click.stop="goToTictek(item, isC2C)">{{ item.workOrderIds ? $t('viewWorkOrderProgress') : $t('report') }}</div>
            </template>
          </div>
        </div>
      </template>
    </List>
	  <van-popup
		  v-model:show="showBottom"
		  position="bottom"
		  :style="{ height: '30%' }"
	  >


		  <div class="rechargeh__header">
			  <van-button round size="small" @click="()=>{showBottom=false;utr=''}">{{$t('cancel')}}</van-button>
			   <span>{{$t('submitUtr')}}</span>
			  <van-button round size="small" :loading="loading" :loading-text="$t('submit')" type = "primary" @click="onUpiSubmitUtr">{{$t('submit')}}</van-button>
		  </div>
		  <div class="rechargeh__container-content__item-body" >
			  <div>
				  <span>{{ $t("utr") }}</span>
				  <van-field
					  v-model="utr"
					  placeholder="Input 12 digits here"
					  :clearable="true"
					  :maxlength="12"
					  type="digit"
					  autocomplete="off"
				  ></van-field>
			  </div>
			  <div>
				  <span>{{ $t("amount") }}</span>
				  <span class="price">{{ currency(order.price) }}</span>
			  </div>

			  <div>
				  <span>{{ $t("type") }}</span>
				  <span>{{ order?.payName }}</span>
			  </div>
			  <div>
				  <span>{{ $t("time") }}</span>
				  <span>{{ order.addTime }}</span>
			  </div>
			  <div>
				  <span>{{ $t("orderNo") }}</span>
				  <div class="order">
					  <span>{{ order.rechargeNumber }}</span>
				  </div>
			  </div>

		  </div>
	  </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch,h } from "vue";
import { useRouter } from "vue-router";
import { rootConfig } from "@/utils/selectArr/rootConfig";
import {copy, getArrayKey, currency, AwaitApiResult} from "@/utils";
import {arUpiSubmitUtr, GetC2CRechargeRecord, GetRechargeRecord} from "@/api";
import type {
  C2CRechargeRecord,
  C2CReqchargeRecord,
  chargeRecordList,
} from "@/types/api";
import Calendar from "@/components/common/Calendar.vue";
import List from "@/components/common/List.vue";
import dayjs from "dayjs";
import NavTab from "@/components/FunTab/NavBar.vue";
import RechargeOrderDetail from "@/components/Wallet/Recharge/RechargeOrderDetail.vue";

import { useI18n } from "vue-i18n";
import { arUpiPayTypeList } from "@/utils";
import { useRecharge } from "@/hooks/useRecharge";
import { useServer } from "@/hooks/useServe.hook";
import {showFailToast, showDialog, showSuccessToast} from "vant";
import {useCustomService} from "@/hooks";
const { t } = useI18n();

const { store, getRechargeTypeName, currentPayId, historyToDetail, goToOrderAppeal,gotoBanklist } = useRecharge();
const {handleOpen}=useCustomService({type: 3})
store.currentPayId = 0;
getRechargeTypeName(true);
const router = useRouter();
function onClick() {
  if (router.currentRoute.value.query.type) {
    router.replace({
      name: "Recharge",
    });
  } else {
    router.back();
  }
}

type RecordList = Partial<chargeRecordList & C2CRechargeRecord>;

const { goToTictek, isCenterServer } = useServer({ServerType: 2})
//#region 下拉框部分
const showPicker = ref(false); //下拉框显示
const typeLable = ref(t("all")); //下拉框默认显示
const dropdownClickS = ref(false); //判断状态下拉框是否被点击
const isAutoLoad = ref(false); //是否自动加载
const query_state = ref(1); // 1:交易中 2:已完成
const calendar = ref(); // 日历组件
const pageQuery = reactive<C2CReqchargeRecord>({
  startDate: "",
  endDate: "",
  state: -1,
  payId: -1,
});
const showBottom=ref(false); //底部弹窗
const order=ref({})
const utr=ref();
const loading=ref(false)
/**
 * @description: 获取当前状态数据
 * @param {*} computed
 * @return {*}
 */
const getState = computed(() => {
  if (!isC2C.value) return rootConfig.RechargeState;
  let arr = [{ key: t("all"), value: -1 }];
  let RechargeC2CState = rootConfig.RechargeC2CState;
  if (query_state.value === 1) return arr.concat(RechargeC2CState.slice(0, 4));
  return arr.concat(RechargeC2CState.slice(4, 7));
});

const isC2C = computed(
  () => store.rechargeType[store.currentMenu]?.payID === 20 || false
);
// 显示确认到账 = 1,         显示自动确认中 = 2,         显示KYC重连 = 4 这四个状态都走这个接口吗
const showBank=(item:any)=>{
	if(!arUpiPayTypeList.includes(item.payTypeId)) return  false;
	if((item.groupID & 1) === 1) return  true;
	if((item.groupID & 2) === 2) return  true;
	if((item.groupID & 4) === 4) return  true;
}
const showBankText=(item:any)=>{
	if((item.groupID & 1) === 1) return  t('arupiBank');
	if((item.groupID & 2) === 2) return  t('arupiKycTip');
	if((item.groupID & 4) === 4) return  t('arupiKyc');
}
const showUtr=(item:any)=>{
	if(!arUpiPayTypeList.includes(item.payTypeId)) return  false;
	if((item.groupID & 2048) === 2048) return  true;
	if((item.groupID & 8192) === 8192) return  true;

	return false
}
const showeRportUtr=(item:any)=>{
	if(!arUpiPayTypeList.includes(item.payTypeId)) return  false;
	if((item.groupID & 32) === 32) return  true;
	if((item.groupID & 64) === 64) return  true;
	if((item.groupID & 4096) === 4096&&!((item.groupID & 16384) ===  16384)) return  true;

	return false
}
/**
 * @description: 交易状态改变事件
 * @param {*} state
 * @return {*}
 */
const handleChangeState = (state: number) => {
  if (state === query_state.value) return;
  typeLable.value = t("all");
  pageQuery.state = -1;
  query_state.value = state;
  pageQuery.type = state;
  listRef.value.resetRefresh();
};

// 状态改变事件
const onConfirm = async ({ selectedOptions }: any) => {
  showPicker.value = false;
  typeLable.value = selectedOptions[0].key;
  pageQuery.state = selectedOptions[0].value;
  listRef.value.resetRefresh();
};

//状态下拉框点击事件
function onClickSelectS() {
  showPicker.value = true;
  dropdownClickS.value = true;
}

/**
 * @description: 确认日期
 * @return {*}
 */
async function onConfirmDateC() {
  let newEndDate =
    calendar.value.endDateValue !== "" ? `${calendar.value.endDateValue} 23:59:59` : "";
  pageQuery.startDate = dayjs(calendar.value.startDateValue).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  pageQuery.endDate = dayjs(newEndDate).format("YYYY-MM-DD HH:mm:ss");
  listRef.value.resetRefresh();
}

//#endregion

const RechargeRList = ref<RecordList[]>([]);
const listRef = ref();

const getPageQuery = computed(() => {
  if (store.currentMenu === 0 || !isC2C.value) {
    if (pageQuery.category) delete pageQuery.category;
    return pageQuery;
  } else {
    return {
      ...pageQuery,
    };
  }
});

const getChange = (obj: any) => {
  //console.log(obj)
};

/**
 * @description: 进入详情
 * @param {*} item
 * @return {*}
 */
const handleGoDetail = async (item: RecordList) => {
  historyToDetail(
    (item.payID || item.category) as number,
    item.type as number,
    item.price as number,
    item.state as number,
    item.id
  );
  // const detail = await AwaitApiResult(GetBankOrderInfo({ rechargeNumber: item.rechargeNumber }))
};

const getRecordApi = computed(() => {
  if (!isC2C.value) {
    return GetRechargeRecord;
  } else {
    return GetC2CRechargeRecord;
  }
});

const getStateColorAndText = (item: RecordList) => {
  let className = "";
  switch (item.state) {
    case 0:
      className = "recharge";
      break;
    case 1:
      if (currentPayId.value !== 20) {
        className = "success";
      } else {
        className = "check";
      }
      break;
    case 2:
      if (currentPayId.value !== 20) {
        className = "fail";
      } else {
        className = "timeout";
      }
      break;
    case 3:
      className = "representation";
      break;
    case 4:
      className = "success";
      break;
    case 5:
      className = "fail";
      break;
    case 6:
      className = "cancel";
      break;
    case 7:
      className = "timeout";
      break;
    default:
      className = "#FFB800";
      break;
  }
  return className;
};

const openPopup = (item: any) => {
	if (((item.groupID & 2048) === 2048)&&((item.groupID & 1024) === 1024)){
		return showDialog({
			title: t('tips'),
			message: ()=>h('p',[
				h('span', t('submitUtrtip')+' '),
				h('span',{
					style:{color:'red'},
					onClick: handleOpen,

				}, t('pServer')),
			]),
			theme: 'round-button',
		})
	}
  order.value = item;
  showBottom.value = true;
};
const onUpiSubmitUtr=async ()=>{
	if (!utr.value || `${utr.value}`.length < 12) {
		return showFailToast('UTR format is incorrect!')
	}
	if (loading.value) return;
	try {
		loading.value = true;
		const data=await AwaitApiResult(arUpiSubmitUtr({
			orderNumber: order.value.rechargeNumber,
			utr:utr.value
		}));
		if (data){
			showSuccessToast(t('submitSuccess'))
			showBottom.value = false;
			utr.value='';
			listRef.value.resetRefresh();
		}
	}catch (e) {

	}finally {
		loading.value = false;
	}


}
watch(
  () => store.currentMenu,
  async () => {
    if (store.currentMenu === 0) {
      store.currentPayId = 0;
    }
    typeLable.value = t("all");
    pageQuery.state = -1;
    isAutoLoad.value = false;
    if (isC2C.value) {
      pageQuery.type = 1;
      pageQuery.category = -1;
      delete pageQuery.payId;
    } else {
      delete pageQuery.type;
      pageQuery.payId = store.rechargeType[store.currentMenu].payID;
    }
    await listRef.value.resetRefresh();
  }
);
// onMounted(async () => {
// 	init()
// })
</script>

<style lang="scss" scoped>
.rechargeh__container {
  padding-inline: 24px;
  padding-block: 0 112px;
  font-family: $font-family;
  position: relative;
  .rechargeh__header_box {
    background: var(--bg_color_L1);
    position: fixed;
    z-index: 99;
    width: 700px;
    overflow: hidden;
	 top:110px;
  }
  :deep(.navbar__content-left > .van-icon) {
    font-size: 40px;
  }

  .selectorA {
    color: var(--text_color_L2);
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 220px;
    margin-bottom: 30px;
    &__item {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px 10px;
      border-radius: 10px;
      background-color: var(--darkBg, var(--bg_color_L2));

      &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .recharge_tit {
          min-width: 150px;
          margin-left: 10px;
          color: #fff;
          background: var(--norm_green-color);
          border-radius: 10px;
          font-size: 28px;
          line-height: 50px;
          height: 50px;
          text-align: center;
        }

        .recharge_right {
          font-size: 26px;
        }

        .success {
          color: var(--norm_green-color);
        }

        .timeout {
          color: var(--norm_secondary-color);
        }

        .check {
          color: var(--norm_red-color);
        }

        .representation {
          color: var(--main-color);
        }

        .recharge {
          color: var(--norm_bule-color);
        }

        .cancel {
          color: var(--text_color_L2);
        }

        .fail {
          color: var(--norm_red-color);
        }
      }

      &-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 24px;
        color: var(--text_color_L2);

        .price {
          color: var(--norm_secondary-color)
        }
        // 订单明细组件根节点被上面的 & > div 命中，恢复其自身布局
        :deep(.order-detail) {
          display: block;
          padding: 20px;
        }
        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          padding: 0 20px;

          > span:first-of-type {
            color: var(--text_color_L2);
            font-size: 26px;
          }

          .order {
            display: flex;
            align-items: center;
            font-size: 24px;
            color: var(--text_color_L2);

            span {
              margin-right: 16px;
            }

            img {
              width: 32px;
              height: 32px;
            }
          }
        }
      }
		  .report {
		  	height: 64px;
		  	line-height: 64px;
		  	color: #fff;
		  	background-color: var(--main-color);
		  	border-radius: 66px;
		  	text-align: center;
		  	font-size: 30px;
		  	font-weight: 500;
			  &.report-b{
				  margin-bottom: 10px;
			  }
		  }
    }
  }

  .query_select {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .selectorA {
      font-size: 28px;
    }
  }
  ::v-deep(.ar-searchbar__selector) {
    & > div .noSelect {
      font-size: 28px;
    }
  }

  ::v-deep(.ar-searchbar__selector-default) {
    font-size: 26px;
  }

  .state_box {
    width: 100%;
    background-color: var(--textW);
    height: 88px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 30px;
    margin-top: 30px;

    .state_item {
      width: 50%;
      line-height: 88px;
      font-size: 26px;
      font-weight: 600;
      color: var(--text_color_L2);
      text-align: center;
      background-color: var(--textW);
      border-radius: 10px;
    }

    .state_item_active {
      background: var(--main_gradient-color2);
      box-shadow: var(--BoxShadowColor-20);
      color: var(--textW);
    }
  }

  .divier {
    margin: 2px 0;
  }

  &-empty {
    margin-top: 50px;
  }
	.rechargeh__header{
		display: flex;
		padding:20px;
		justify-content: space-between;
		align-items: center;
		span{
			font-size: 28px;
			color: var(--text_color_L1);
		}
	}
	.van-field{
		background: var(--bg_color_L1);
		border-radius: 50px;
		margin-left:20px;
	}
}

.gameTabBar {
  margin-bottom: 29px;
  margin-bottom: 20px;

  :deep(.van-tabs__wrap) {
    height: 80px;
  }

  :deep(.van-tabs__nav--card) {
    height: 80px;
    margin: 0;

    .van-tab--card {
      min-width: 198px;
      height: 80px;
      margin-inline: 5px;
      padding: 0;
      color: var(--text_color_L2) !important;
      padding: 0 0px;
      border-radius: 10px;
      background: var(--bgDark-2, var(--bg_color_L2));
      // .tab_item {
      // width: 100%;
      // height: 80px;
      // display: flex;
      // flex-direction: row;
      // align-items: center;
      // justify-content: center;
      // }

      & > span {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        img {
          width: 42px;
          height: auto;
          margin-right: 10px;
        }

        span {
          font-size: 26px;
        }
      }

      &.van-tab--active {
        color: var(--textW) !important;
        background: var(--main-color);
      }
    }
  }
}

.tab_item {
  min-width: 190px;
  height: 80px;
  margin-inline: 5px;
  padding: 0;
  color: var(--text_color_L2) !important;
  border-radius: 10px;
  background: var(--bgDark-2, var(--bg_color_L2));

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 8px;

  img,svg {
    height: 42px;
    width: 42px;
    margin-right: 20px;
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
  padding: 0 0 !important;
}
::v-deep(.fun-tabs) {
  background: transparent;
}
</style>
