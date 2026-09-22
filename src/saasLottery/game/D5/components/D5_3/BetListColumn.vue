<template>
    <BettingBody
        :navList="navList"
        :actNav="actNav"
        :bigSmallEven="bigSmallEven"
        :numList="numList"
        @changeType="changeType"
        :numberChack="numberChack"
        :onTabID="onTabID"
        @onTab="onTab"
        @numberTab="numberTab"
    />
    <Popup
        :currentGame="currentGame"
        :bettingPopupShow="bettingPopupShow"
        :betTypeList="betTypeList"
        :selectInfo="selectInfo"
        @computedCoin="computedCoin"
        @clearBetting="clearBetting"
        @submitBetting="submitBettingData"
    >
      <BettingBody
          :navList="navList"
          :actNav="actNav"
          :bigSmallEven="bigSmallEven"
          :numList="numList"
          @changeType="changeType"
          :onTabID="onTabID"
          :numberChack="numberChack"
          @numberTab="numberTab"
          @onTab="onTab"
      />
    </Popup>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { showFailToast, showToast } from 'vant'
import { ref, computed, watch, nextTick } from 'vue'
import {getD5Bet} from "@/saasLottery/api";
import BettingBody from './BettingBody.vue'
import Popup from './BettingPopup.vue'
import {FDHook} from "@game/D5/hooks/5d.hook";
const {actNav,navList,showType } = FDHook();
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'betting', val: string): void
  (e: 'changeBettingP', val: boolean): void
}>()

const props = defineProps({
	bigSmallEven:{
		type: Array,
		default: () => []
	},
	numList:{
		type: Array,
		default: () => []
	},
  currentInfo: {
    // 当期游戏期号，以及倒计时时间等参数。
    type: Object,
    default: () => ({})
  },
  ProhibitBuyTime: {
    // 倒计时判断时间，单位秒，判断倒数几秒展示倒计时框
    type: Number,
    default: 5
  },
  currentGame: {
    // 当前选中游戏
    type: Object,
    default: () => ({})
  },
	issueData:{
		type: Object,
		default: () => ({})
	},
  issueNum:{
    type: String,
    default: 0
  },
  gameCode:{
    type: String,
    default: 0
  },
  time:{
    type: Object,
    default: () => ({})
  }
})

// 是否展示彈窗
const bettingPopupShow = ref(false)

watch(() => bettingPopupShow.value,(value) => {
    if (value) {
      selectInfo.value.coin = betTypeList.value[0]
    }
  }
)

/*监听停止投注清空投注*/
watch(()=>props.time.seconds,async ()=>{
  if (props.time.seconds == 5) {
    clearBetting()
  }
})

/*新奇偶大小选择*/
const onTabID = ref<number>(0)
// 切换大小，奇偶
const onTab = (id:number,data:any) => {
  console.log("点击奇偶大小",id,data)
  // selectBox(data)
  numberNoChack() //清空数字选中
  // selectBox(data)
  if (onTabID.value == id) {
    onTabID.value = 0
    bettingPopupShow.value = true
  } else {
    onTabID.value = id
    bettingPopupShow.value = true
  }

  console.log("获取当前选中的值",actNav.value,data)
  /*计算总金额*/
  computedCoin()
}
// 切换数字
const numberTab = (num: number,data:any) => {
  onTabID.value = 0
  // console.log("点击选中数字球",num,data)
  // toggleItem(item)
  if (numberChack.value[num]) {
    numberChack.value[num] = false
    const hasIndex = selectBall.value.indexOf(num)
    if (hasIndex > -1) {
      //大于0 代表存在，
      selectBall.value.splice(hasIndex, 1) //存在就删除
    }
    bettingPopupShow.value = true
  } else {
    selectBall.value.push(num)
    numberChack.value[num] = true
    bettingPopupShow.value = true
  }
  console.log("点击选中数字球",num,data,selectBall.value)
  /*计算总金额*/
  computedCoin()
}


// 选中投注类型
const betType = ref(0)

// 选中参数
const selectBall = ref<any[]>([])

// 数字是否选中
const numberChack = ref<boolean[]>([false, false, false, false, false, false, false, false])


/*初始化投注信息*/
const selectInfo = ref<any>({
  coin: 0, //下注金额
  count: 1, //下注倍数
  allCoin: 0, //下注总额
  gametype: 0, //类型 1A，2B，3C，4D，5E，6SUM
  typeid: 1, //台号1Min 3Min 5Min 10Min
  issuenumber: '2020', //期号
  selecttype: '' //下注内容
})

// 解析后端返回参数，展示每份金额列表
const betTypeList = computed(() => {
  return props.currentGame?.betScopes ? props.currentGame?.betScopes.map((sc: string): number => Number(sc)) : []
})

// 切换投注类型
const changeType = (value: number,data:any) => {
  console.log("拿到的切换的彩种的值",value)
  betType.value = value
  showType(data)
  if (value == 5) {
    numberNoChack()
  }
}

//计算总金额
const computedCoin = () => {
  nextTick(() => {
    if (selectBall.value.length > 0) {
      selectInfo.value.allCoin = selectInfo.value.coin * selectInfo.value.count * selectBall.value.length
    } else if (onTabID.value) {
      selectInfo.value.allCoin = selectInfo.value.coin * selectInfo.value.count
    } else {
      selectInfo.value.allCoin = 0
    }
  })
}

/**
 * 清空数字选中
 */
const numberNoChack = () => {
  selectBall.value = []
  for (let i = 0; numberChack.value.length > i; i++) {
    numberChack.value[i] = false
  }
  /*计算金额*/
  computedCoin()
}
// 关闭投注弹窗，并清理相关数据。
const clearBetting = () => {
  selectInfo.value.count = props.currentGame.betMultiples?.[0] || 1
  bettingPopupShow.value = false
  clearData()
}
/**
 * 清理参数
 */
const clearData = () => {
  selectBall.value = []
  numberChack.value = [false, false, false, false, false, false, false, false]
  onTabID.value = 0
}

// 提交投注参数。
const submitBettingData = async () => {
  if (props.gameCode!==props.issueData?.gameCode) return ;
  if (selectInfo.value.count == 0) {
    return showFailToast(t('bteNoCount'))
  }
  let selecttype
  if (selectBall.value.length > 0) {
    selecttype = selectBall.value.map((item)=>{
      return `${actNav.value.code}Num_${item}`
    })
  } else {
    /*选择奇偶大小*/
    switch (onTabID.value) {
      case 1:
        selecttype = [`${actNav.value.code}BigSmall_Big`]
        break
      case 2:
        selecttype = [`${actNav.value.code}BigSmall_Small`]
        break
      case 3:
        selecttype = [`${actNav.value.code}OddEven_Odd`]
        break
      case 4:
        selecttype = [`${actNav.value.code}OddEven_Even`]
        break
      default:
    }
  }
  if (!selecttype) {
    return showFailToast(t('common.betContent'))
  }
  const params:any = {
    issueNumber: props.issueNum,
    gameCode:props.gameCode,
    amount: selectInfo.value.coin,
    betMultiple: Number(selectInfo.value.count),
    betContent:selecttype,
  }
  const res = await getD5Bet(params)
  if (res?.code === 0) {
    showToast(t('common.betSuccessful'))
    bettingPopupShow.value = false
    clearData()
    emit('betting',res.data)
  }
}

defineExpose({
  bettingPopupShow
})
</script>