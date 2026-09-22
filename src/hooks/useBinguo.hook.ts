import { Bingo18Betting, GetBingo18BetAmount, GetBingo18Last50Result, GetBingo18LastGameResult, GetBingo18OddsList, GetBinguoGameConfig, GetGameBingo18Issue } from "@/api/modules/games/bingo";
import router from "@/router";
import { BinguoOptions, BetNumberItem, BinguoConfigType, BinguoGameList, BinguoIssueType, BinguoResult, BinguoAmountResult, BinguoBetParams } from "@/types/api/interface/binguo";
import { AwaitApiResult, formatTime } from "@/utils";
import { showSuccessToast } from "vant";
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue"
import { useI18n } from "vue-i18n";
import i18n from "@/languages";
import dice1 from '@public/home/AllLotteryGames/binguo/dice_1.png'
import dice2 from '@public/home/AllLotteryGames/binguo/dice_2.png'
import dice3 from '@public/home/AllLotteryGames/binguo/dice_3.png'
import dice4 from '@public/home/AllLotteryGames/binguo/dice_4.png'
import dice5 from '@public/home/AllLotteryGames/binguo/dice_5.png'
import dice6 from '@public/home/AllLotteryGames/binguo/dice_6.png'


const store = ref<BinguoOptions>({
  odds: 1.5,
  money_list: [100, 1000, 200, 5000, 10000],
  bet_money: 0,
  binguoType: 1,
  currentNumber: "20230610858776",
  award_result: '246',
  bet_item: '',
  trend_result: ['6', '7', '8', '9', '10', '12', '13', '14', '15', '16', '17', '18', '5'],
  trend_result2: ['123', '245', '532', '666'],
  currentMoneyIndex: 0,
  bet_number: '',
  beishu: 1,
  beishuList: [1, 5, 10, 20, 50, 100],
  currentBeishuIndex: 0,
  currentBetType: undefined,
  currentPlayId: 0,
  currentSelectType: '',
  currentOdds: '',
  drawIssnum: ''
})

const timer = ref<NodeJS.Timer>() // 计时器
const isShowBetMoney = ref(false) // 是否显示金额
const betSheetVisible = ref(false) // 是否显示投注弹窗
const checkRule = ref(true) // 是否同意预售规则
const overVisble = ref(false) // 未在售票期弹窗
const playerRuleVisble = ref(false) // 规则说明弹窗
const timeText = ref('00:00')
const betPopTXT = ref(false)
const isSell = ref(true) // 是否在售票期
const {t} = i18n.global
const binguoGameList = ref<BinguoGameList>([])
const betSizeList = ref<BetNumberItem[]>([
  {
    value: t('small'),
    type: 1,
    range: '3-9',
    beishu: '2.0',
    bet_amount: 0,
    key: 'Small',
    groupId: 1,
    playId: 0,
    hot: false
  },
  {
    value: t('binguoHe'),
    type: 2,
    range: '10-11',
    beishu: '3.0',
    bet_amount: 0,
    key: 'Drawn',
    groupId: 1,
    playId: 0,
    hot: false
  },
  {
    value: t('k3Big'),
    type: 3,
    range: '12-18',
    beishu: '5.0',
    bet_amount: 0,
    key: 'Big',
    groupId: 1,
    playId: 0,
    hot: false
  }
])
const betNumberList = ref<BetNumberItem[]>(Array.from({ length: 16 }, (_, index) => {
  const value = index + 3;
  return {
    value,
    type: value < 10 ? 1 : (value > 11 ? 3 : 2),
    beishu: '2.0',
    bet_amount: 0,
    hot: false,
    groupId: 1,
    playId: 0
  };
}));
const oddObject = ref({
  third: {
    amount1: 0,
    amount2: 0
  },
  two: 0,
  one: {
    amount1: 0,
    amount2: 0,
    amount3: 0
  }
})

const alikeList = ref([
  {
    value: '1',
    amount1: 0,
    amount2: 0,
    amount3: 0,
    hot1: false,
    hot2: false,
    hot3: false,
  },
  {
    value: '2',
    amount1: 0,
    amount2: 0,
    amount3: 0,
    hot1: false,
    hot2: false,
    hot3: false,
  },
  {
    value: '3',
    amount1: 0,
    amount2: 0,
    amount3: 0,
    hot1: false,
    hot2: false,
    hot3: false,
  },
  {
    value: '4',
    amount1: 0,
    amount2: 0,
    amount3: 0,
    hot1: false,
    hot2: false,
    hot3: false,
  },
  {
    value: '5',
    amount1: 0,
    amount2: 0,
    amount3: 0,
    hot1: false,
    hot2: false,
    hot3: false,
  },
  {
    value: '6',
    amount1: 0,
    amount2: 0,
    amount3: 0,
    hot1: false,
    hot2: false,
    hot3: false,
  },
  {
    value: '*',
    amount1: 0,
    amount2: 0,
    amount3: 0,
    hot1: false,
    hot2: false,
    hot3: false,
  }
])

const diceIconMap: Record<string, string> = {
  '1': dice1,
  '2': dice2,
  '3': dice3,
  '4': dice4,
  '5': dice5,
  '6': dice6
}

const getDiceIcon = (value?: string | number) => {
  return diceIconMap[String(value)] || ''
}


export const useBinguo = () => {

  const { t } = useI18n()
  const timer2 = ref()

  /**
   * @description: 骰子图片计算
   */
  const resultImgList = computed(() => {
    const awardResult = store.value.award_result.toString()
    return [
      getDiceIcon(awardResult[0]),
      getDiceIcon(awardResult[1]),
      getDiceIcon(awardResult[2]),
    ]
  })

  /**
   * @description: 计算和值class类型
   */
  const filterNumberSize = computed(() => {
    if (store.value.currentBetType === 1) {
      return 'small'
    }
    if (store.value.currentBetType === 2) {
      return 'and'
    }
    return 'big'
  })


  /**
   * @description: 获取投注配置
   * @return {BinguoConfigType}
   */
  const getBinguoConfig = async () => {
    const result = await AwaitApiResult<ObjResNull<BinguoConfigType>>(GetBinguoGameConfig())
    if (result?.data) {
      store.value.money_list = result.data.betAmount
      store.value.beishuList = result.data.betMultiplier
      store.value.bet_money = result.data.betAmount[0]
    }
  }

  /**
   * @description: 获取赔率列表
   * 0: 和值，和值可以分为 num,big,small,sum
      2: 1个相同，中了几个，可以分为 1， 2， 3
      3： 2个相同，不做区分
      4：3个相同，可以分为 1,2 1代表数字相同，2代表任意相同
   * @return {BinguoGameList}
   */
  const getBinguoOddsList = async () => {
    const result = await AwaitApiResult<ObjResNull<BinguoGameList>>(GetBingo18OddsList())

    if (result?.data) {
      binguoGameList.value = result?.data
      let data = result?.data
      let sumPlayList = data.filter(item => item.groupId === 1)
      sumPlayList.forEach(item => {
        if (Number(item.betType)) {
          betNumberList.value.forEach(betItem => {
            if (item.betType === betItem.value + '') {
              betItem.beishu = item.odds
              betItem.playId = item.playId
            }
          })
        } else {
          betSizeList.value.forEach(betItem => {
            if (betItem.key === item.betType) {
              betItem.beishu = item.odds
              betItem.playId = item.playId
            }
          })
        }
      })
      let alike = data.filter(item => item.groupId !== 1)
      alike.forEach(item => {
        if (item.groupId === 4) {
          // 三个相同
          if (item.betType === '1') {
            oddObject.value.third.amount1 = item.odds
          } else {
            oddObject.value.third.amount2 = item.odds
          }
        }

        if (item.groupId === 3) {
          // 2个相同
          oddObject.value.two = item.odds
        }
        if (item.groupId === 2) {
          // 1个相同
          if (item.betType === '1') {
            oddObject.value.one.amount1 = item.odds
          } else if (item.betType === '2') {
            oddObject.value.one.amount2 = item.odds
          } else {
            oddObject.value.one.amount3 = item.odds
          }
        }
      })
    }
  }

  /**
   * @description: 获取投注金额，添加火热标志和桌面金额
   * @return {*}
   */
  const getBingo18BetAmount = async () => {
    const result = await AwaitApiResult<ObjResNull<BinguoAmountResult[]>>(GetBingo18BetAmount({ issueNumber: store.value.currentNumber as string }))
    if (result?.data) {
      result.data.forEach(item => {
        betSizeList.value.forEach(betItem => {
          if (item.playId === betItem.playId) {
            betItem.bet_amount = item.amount
          }
        })
        betNumberList.value.forEach(betItem => {
          if (item.playId === betItem.playId) {
            betItem.bet_amount = item.amount
          }
        })

        switch (item.playId) {
          case 28:
            alikeList.value[Number(item.selectType[0]) - 1].amount1 = item.amount
            break;
          case 29:
            alikeList.value[6].amount1 = item.amount
            break;
          case 27:
            alikeList.value[Number(item.selectType[0]) - 1].amount2 = item.amount
            break;
          case 24:
            alikeList.value[Number(item.selectType[0]) - 1].amount3 = item.amount
            break;
          default:
            break;
        }
      })
      await restFn(0)

      nextTick(() => {
        const sortedData = result.data.sort((a, b) => b.amount - a.amount);
        const topThree = sortedData.slice(0, 3);
        topThree.forEach(item => {
          let n1 = betSizeList.value.findIndex(betItem => item.playId === betItem.playId)
          n1 > -1 ? betSizeList.value[n1].hot = true : ''

          let n2 = betNumberList.value.findIndex(betItem => item.playId === betItem.playId)
          n2 > -1 ? betNumberList.value[n2].hot = true : ''

          switch (item.playId) {
            case 28:
              alikeList.value[Number(item.selectType[0]) - 1].hot1 = true
              break;
            case 29:
              alikeList.value[6].hot1 = true
              break;
            case 27:
              alikeList.value[Number(item.selectType[0]) - 1].hot2 = true
              break;
            case 24:
              alikeList.value[Number(item.selectType[0]) - 1].hot3 = true
              break;
            default:
              break;
          }
        })
      })


    }
  }

  /**
   * @description: 重置桌面数据
   * @param {number} type
   * @return {*}
   */
  const restFn = async (type: number) => {
    alikeList.value.forEach(item => {
      item.hot1 = false
      item.hot2 = false
      item.hot3 = false
      if (type === 1) {
        item.amount1 = 0
        item.amount2 = 0
        item.amount3 = 0
      }
    })
    betSizeList.value.forEach(item => {
      if (type === 1) { item.bet_amount = 0 }
      item.hot = false
    })
    betNumberList.value.forEach(item => {
      if (type === 1) { item.bet_amount = 0 }
      item.hot = false
    })
  }

  /**
   * @description: 获取开奖期号
   * @return {BinguoIssueType}
   */
  const getGameBingo18Issue = async () => {
    const result = await AwaitApiResult<ObjResNull<BinguoIssueType>>(GetGameBingo18Issue())
    if (result) {
      if (result.data) {
        if (result.data.startTime && result.data.endTime) {
          store.value.currentNumber = result?.data.issueNumber
          countdownTimeFun(result.data.serviceTime, result.data.endTime, async () => {
            timeText.value = '10:00'
            await getGameBingo18Issue()
            clearInterval(timer2.value)
            // 1分钟后拉取开奖结果，循环10次
            setTimeout(() => {
              refershIssnum()
            }, 60 * 1000)
            restFn(1)
          })
        }
      } else {
        isSell.value = false
      }
      await getBingo18BetAmount()
    }

  }

  const refershIssnum = async () => {
    let a = 1
    timer2.value = setInterval(async () => {
      if (a === 10) {
        clearInterval(timer2.value)
      } else {
        await getBingo18LastGameResult()
        await getBingo18Last50Result()
        a++
      }
    }, 10000)
  }

  /**
   * @description: 获取开奖结果
   * @return {BinguoResult}
   */
  const getBingo18LastGameResult = async () => {
    const result = await AwaitApiResult<ObjResNull<BinguoResult>>(GetBingo18LastGameResult())
    if (result) {
      store.value.award_result = result?.data.result
      store.value.drawIssnum = result?.data.issueNo
    }
  }

  /**
   * @description: 获取近50 期结果
   * @return {*}
   */
  const getBingo18Last50Result = async () => {
    const result = await AwaitApiResult<ObjResNull<BinguoResult[]>>(GetBingo18Last50Result())
    if (result) {
      store.value.trend_result = result?.data.map(item => item.resultSum + '').slice(0, 13).reverse()
      store.value.trend_result2 = result?.data.map(item => item.result + '').slice(0, 4).reverse()
    }
  }


  /**
   * @description: 点击投注
   * @param {BetNumberItem} item
   * @return {*}
   */
  const handleBet = (item: BetNumberItem) => {
    betSheetVisible.value = true
    store.value.bet_number = item.value + ''
    store.value.currentBetType = item.type
    store.value.currentPlayId = item.playId
    store.value.currentOdds = item.beishu + ''
  }

  /**
   * @description: 点击全桌的几个相同玩法
   * @param {string} item
   * @param {number} type
   * @return {*}
   */
  const handleAlike = (item: string, type: number) => {
    if (type === 1) {
      store.value.bet_number = item
      store.value.currentBetType = type
      store.value.currentPlayId = binguoGameList.value.find(item => item.betType === '1' && item.groupId === 2)?.playId as number
      store.value.currentOdds = oddObject.value.one.amount1 + ''
    } else if (type === 2) {
      store.value.bet_number = item + ',' + item
      if (item.includes('6')) {
        store.value.currentBetType = 3
      } else if (item.includes('5')) {
        store.value.currentBetType = 2;
      } else {
        store.value.currentBetType = 1
      }
      store.value.currentOdds = oddObject.value.two + ''
      store.value.currentPlayId = binguoGameList.value.find(item => item.betType === '2' && item.groupId === 3)?.playId as number
    } else if (type === 3) {
      store.value.bet_number = item + ',' + item + ',' + item
      if (/[123]/.test(item)) {
        store.value.currentBetType = 1
      } else {
        store.value.currentBetType = 3
      }
      if (item.includes('*')) {
        store.value.currentOdds = oddObject.value.third.amount2 + ''
        store.value.currentPlayId = binguoGameList.value.find(item => item.betType === '2' && item.groupId === 4)?.playId as number
      } else {
        store.value.currentOdds = oddObject.value.third.amount1 + ''
        store.value.currentPlayId = binguoGameList.value.find(item => item.betType === '1' && item.groupId === 4)?.playId as number
      }

    }

    betSheetVisible.value = true
  }


  /**
   * @description: 发起投注
   * @return {*}
   */
  const handleBetSubmit = async () => {
    if (!isSell.value) {
      betSheetVisible.value = false
      overVisble.value = true
      return
    }
    if (!checkRule.value) return
    let curItem = binguoGameList.value.find(item => item.playId === store.value.currentPlayId)
    let selectType = ''
    if (curItem?.groupId === 2 || curItem?.groupId === 3) {
      selectType = store.value.bet_number.split(',')[0]
    } else if (curItem?.groupId === 4) {
      selectType = store.value.bet_number.includes('*') ? '***' : store.value.bet_number.split(',').join('')
    } else {
      selectType = Number(store.value.bet_number) ? store.value.bet_number : betSizeList.value.find(item => item.value === store.value.bet_number)?.key as string
    }
    let params: BinguoBetParams = {
      issueNumber: store.value.currentNumber as string,
      amount: store.value.bet_money * store.value.beishu,
      figure: Number(store.value.beishu),
      gameType: curItem?.groupId as number + '',
      selectType: selectType,
      playId: store.value.currentPlayId
    }
    const result = await AwaitApiResult(Bingo18Betting(params))
    if (result.data) {
      showSuccessToast(t('code402'))
      betSheetVisible.value = false
      getBingo18BetAmount()
    }
  }

  /**
   * @description: 获取时间戳
   * @param {string} start
   * @param {string} end
   * @return {*}
   */
  const getDownTime = (start: string, end: string) => {
    let BirthDay = new Date(start.replace(/-/g, '/'))
    //获取当前时间
    let today = new Date(end.replace(/-/g, '/'))
    let timeold = today.getTime() - BirthDay.getTime() //总豪秒数
    return timeold
  }

  /**
   * @description: 倒计时
   * @param {string} startTime
   * @param {string} endTime
   * @param {function} callBack
   * @return {*}
   */
  const countdownTimeFun = (startTime: string, endTime: string, callBack: () => void) => {
    clearInterval(timer.value)
    timer.value = undefined
    let countdownTimestamp = getDownTime(startTime, endTime)
    if (countdownTimestamp <= 1000) {
      throw new Error('时间不正确')
    }
    timer.value = setInterval(() => {
      countdownTimestamp -= 1000

      if (countdownTimestamp <= 1000) {
        clearInterval(timer.value)
        callBack()
        return
      }
      console.log(countdownTimestamp, formatTime(countdownTimestamp, 'mm:ss'))
      timeText.value = formatTime(countdownTimestamp, 'mm:ss')

    }, 1000)
  }

  /**
   * @description: 切换显示金额图标
   */
  const handleToggleShwoMoney = () => isShowBetMoney.value = !isShowBetMoney.value

  const handleStep = (type: string) => {
    if (type === 'add') {
      store.value.beishu = Number(store.value.beishu) + 1
    } else {
      store.value.beishu = Number(store.value.beishu) - 1
    }
  }

  const handleCancel = () => {
    betSheetVisible.value = false
    store.value.currentBeishuIndex = 0
    store.value.currentMoneyIndex = 0
  }

  const goBack = () => router.back()

  /**
   * @description: 将超过1000的数字转换为1K
   */
  const formatNum = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return num + '';
    }
  };


  watch(() => store.value.currentMoneyIndex, (val: number) => {
    store.value.bet_money = Number(store.value.money_list[val])
  },
    {
      immediate: true
    })

  watch(() => store.value.bet_number, () => {
    store.value.currentMoneyIndex = 0
    store.value.currentBeishuIndex = 0
  }, {
    immediate: true
  })

  watch(() => store.value.currentBeishuIndex, (val: number) => {
    store.value.beishu = Number(store.value.beishuList[val])
  },
    {
      immediate: true
    })

  onBeforeUnmount(() => {
    // 取消定时器
    clearInterval(timer.value)
  })


  return {
    store,
    timer,
    isShowBetMoney,
    filterNumberSize,
    handleToggleShwoMoney,
    handleBet,
    goBack,
    handleStep,
    handleCancel,
    isSell,
    handleAlike,
    getBinguoConfig,
    getBinguoOddsList,
    getGameBingo18Issue,
    countdownTimeFun,
    getBingo18LastGameResult,
    getBingo18BetAmount,
    handleBetSubmit,
    getBingo18Last50Result,
    formatNum,
    checkRule,
    resultImgList,
    betSizeList,
    betNumberList,
    betSheetVisible,
    overVisble,
    alikeList,
    timeText,
    oddObject,
    playerRuleVisble,
    betPopTXT
  }
}
