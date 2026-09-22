import { GetBingo18Last50Result, GetLotteryRankList, GetLotteryResult7Day, GetTrendstatistics, GetUserRankList } from "@/api/modules/games/bingo";
import { CustomTabColumn } from "@/components/table/index.vue";
import i18n from "@/languages";
import { GlobalStore } from "@/stores";
import { Bingo18Last50Result, BinguoResult, Trend, Trendstatistics } from "@/types/api/interface/binguo";
import { AwaitApiResult } from "@/utils";
import { computed, reactive, ref } from "vue"

interface BinguoTabProps {
  currentTabIndex: number;
  resultSumTrend: Trendstatistics['resultSumTrend'],
  smallAndBigTrend: Trendstatistics['smallAndBigTrend'] | undefined
  threeSameTrend: Trendstatistics['threeSameTrend']
  twoSameTrend: Trendstatistics['twoSameTrend']
  isTrend: boolean
  trendList: Trend[]
  last50List: BinguoResult[]
  userRank: number
  last7Day: Bingo18Last50Result[]
}

const store = reactive<BinguoTabProps>({
  currentTabIndex: 0,
  resultSumTrend: [],
  smallAndBigTrend: undefined,
  threeSameTrend: [],
  twoSameTrend: [],
  isTrend: false,
  trendList: [],
  last50List: [],
  userRank: 0,
  last7Day: []
})

const {t} = i18n.global

const columnOptions = ref<CustomTabColumn[]>([
  {
    title: t('time'),
    key: 'issueEndTime',
    isLockColumn: true,
    isSlot: true,
    width: '50px',
    cusTdClass: 'column_time'
  },
])

export const useBinguoCount = () => {
  // const {t} = useI18n()

  
const BinguoGroup = {
  1: {
    player: t('xosoTxt60'),
    "Big": {
      class: 'big'
    },
    "Small": {
      class: 'small'
    },
    "Drawn": {
      class: 'sum'
    }
  },
  2: {
    player: t('same'),
    class: 'small'
  },
  3: {
    player: t('sameNum'),
  },
  4: {
    player: t('numbersMatch'),
  }
}


  const last50Result = computed(() => {
    let arr = []
    let arr2 = []
    for (let i = 0; i < store.last50List.length; i++) {
      if (arr2.length < 5) {
        arr2.push(store.last50List[i].resultSum)
      } else {
        arr.push(arr2)
        arr2 = []
        arr2.push(store.last50List[i].resultSum)
      }
      if (i === store.last50List.length - 1) {
        arr.push(arr2)
      }
    }
    return arr
  })

  const last50Record = computed(() => {
    let arr = store.last50List.map(item => item.resultSum);
    let arr2 = transformArray(arr).slice(0, 10).reverse();
    arr2.forEach(item => {
      if (item.length < 5) {
        let len = 5 - item.length;
        for (let i = 0; i < len; i++) {
          item.push('');
        }
      }
    });
    return arr2;
  });

  const last50RecordResult = computed(() => {
    return store.last50List.map(item => {
      const result = item.result.split('');
      const resultCount = {} as any;
      for (let i = 1; i <= 6; i++) {
        resultCount['num' + i] = result.filter(item => item === i.toString()).length;
      }
      return {
        issueNo: item.issueNo,
        sum: item.resultSum,
        ...resultCount,
      };
    });
  });



  /**
   * @description: 获取过去7天数据
   * @return {*}
   */
  const getLotteryResult7Day = async () => {
    const result = await AwaitApiResult<ObjResNull<Bingo18Last50Result[]>>(GetLotteryResult7Day())
    if (result?.data) {
      columnOptions.value = [{
        title: t('time'),
        key: 'issueEndTime',
        isLockColumn: true,
        isSlot: true,
        width: '50px',
        cusTdClass: 'column_time'
      },]
      let data = result.data.reverse()
      let test = [...new Set(result.data.map(item => item.startDate))].slice(0, 7);

      test.reverse().forEach((item, index) => {
        columnOptions.value.push({
          key: 'time_index_' + index ,
          title: item,
          isSlot: true,
        })
      })

      let aa = groupByName(data, 'issueEndTime')
      let arr: any[] = []
      Object.entries(aa).forEach(([key, value]) => {
        let pp: any = {};
        (value as any[]).forEach((_: any, index: number) => {
          let n = columnOptions.value.find(x => x.title === _.startDate)?.key as string
          pp[`${n}`] = _
        })
        arr.push({
          issueEndTime: key,
          ...pp
        })
      });
      store.last7Day = arr.sort((a, b) => {
        const timeA = a.issueEndTime.split(":");
        const timeB = b.issueEndTime.split(":");
        
        const hourA = parseInt(timeA[0]);
        const minuteA = parseInt(timeA[1]);
        const hourB = parseInt(timeB[0]);
        const minuteB = parseInt(timeB[1]);
    
        if (hourA === hourB) {
            return minuteA - minuteB;
        } else {
            return hourA - hourB;
        }
      })
    }
  }

  function groupByName(arr: any[], name: string | number) {
    const groups: any = {};
    arr.forEach((item: { [x: string]: any; }) => {
      const key: any = item[name];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }

  /**
   * @description: 获取排行数据
   * @return {*}
   */
  const getLotteryRankList = async () => {
    const result = await AwaitApiResult<ObjResNull<Trend[]>>(GetLotteryRankList())
    if (result?.data) {
      store.trendList = result.data
    }
    const userInfoStore = GlobalStore()
    const userInfo = userInfoStore.getUserInfo
    const info = await AwaitApiResult<ObjResNull<number>>(GetUserRankList(userInfo.userId))
    if (info?.data) {
      if (info.data < 100) {
        store.isTrend = true
      }
      store.userRank = info.data
    }
  }

  /**
   * @description: 获取近50期数据
   * @return {*}
   */
  const getBingo18Last50Result = async () => {
    const result = await AwaitApiResult<ObjResNull<BinguoResult[]>>(GetBingo18Last50Result())
    if (result?.data) {
      store.last50List = result.data
    }
  }


  /**
   * @description: 获取开奖统计
   * @return {*}
   */
  const getTrendstatistics = async () => {
    const result = await AwaitApiResult<ObjResNull<Trendstatistics>>(GetTrendstatistics())
    console.log(result)
    if (result) {
      store.resultSumTrend = result.data.resultSumTrend
      store.smallAndBigTrend = result.data.smallAndBigTrend
      store.threeSameTrend = result.data.threeSameTrend
      store.twoSameTrend = result.data.twoSameTrend
    }
  }

  /**
   * @description: 获取玩法名称，样式名称
   * @param {number} groupId
   * @param {string} selectType
   * @return {*}
   */
  const filterGameType = (groupId: number, selectType: string): { className: string, playerName: string } => {
    let className = ''
    let playerName = ''
    if (groupId === 1) {
      if (!Number(selectType)) {
        className = BinguoGroup[1][selectType as 'Big' | 'Small' | 'Drawn'].class
      } else {
        className = filterStyle(Number(selectType))
      }
      playerName = BinguoGroup[1].player
    } else if (groupId === 2) {
      className = BinguoGroup[2].class
      playerName = BinguoGroup[2].player
    } else if (groupId === 3) {
      if (Number(selectType) < 5) {
        className = 'small'
      } else if (Number(selectType) === 5) {
        className = 'sum'
      } else {
        className = 'big'
      }
      playerName = BinguoGroup[3].player
    } else if (groupId === 4) {
      if (selectType.includes('*')) {
        className = 'big'
      } else if (/[123]/.test(selectType)) {
        className = 'small'
      } else {
        className = 'big'
      }
      playerName = BinguoGroup[4].player
    }
    return {
      className,
      playerName
    }
  }

  function transformArray(arr: any[]) {
    const result: any[][] = [];
    const tagList: string[] = [];
    let lastTag = '';

    const fn2 = (n: number) => {
      if (n < 10) {
        return 'small';
      } else if (n > 11) {
        return 'big';
      } else {
        return 'sum';
      }
    };

    const tagFilter = (tag: string, arr: string[]) => {
      let a = 0;
      if (tag !== arr[arr.length - 1]) return 0;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (tag === arr[i]) {
          a += 1;
        } else {
          return a;
        }
      }
      return a;
    };

    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const currentTag = fn2(current);

      if (result.length === 0 || currentTag !== lastTag) {
        result.push([current]);
        lastTag = currentTag;
        tagList.push(lastTag);
        continue;
      }

      if (result[result.length - 1].length < 5) {
        result[result.length - 1].push(current);
      } else {
        let tagNumber = tagFilter(currentTag, tagList);
        let last = result[result.length - tagNumber].length;
        if (last === 5) {
          result.splice(result.length - tagNumber, 0, [current]);
          tagList.push(currentTag);
        } else if (last > 5) {
          result[result.length - tagNumber].unshift(current);
        } else {
          result[result.length - tagNumber].unshift(current);
        }
      }
      lastTag = currentTag;
    }

    // console.log(result, tagList);
    return result;
  }

  const filterStyle = (n: number) => {
    if (Number(n) < 10) {
      return 'small'
    }
    if (Number(n) > 11) {
      return 'big'
    }
    return 'sum'
  }

  return {
    store,
    last50Result,
    last50Record,
    last50RecordResult,
    columnOptions,
    filterStyle,
    filterGameType,
    getTrendstatistics,
    getLotteryRankList,
    getLotteryResult7Day,
    getBingo18Last50Result
  }
}
