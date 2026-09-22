<template>
  <div class="my_r">
    <div class="my_r-body">
      <!-- 更多：跳转投注记录页，图标/文案/样式沿用本文件已有的 MyGameRecord__C-head；长龙等嵌入场景 hasHead=false 隐藏 -->
      <div v-if="hasHead" class="MyGameRecord__C-head">
        <div class="MyGameRecord__C-head-moreB" @click="goRecord">
          {{ $t('more') }}
          <svg-icon name="rightCircle" />
        </div>
      </div>
      <div v-if="mayrecord.length" class="list">
        <div v-for="(item, index) in mayrecord" :key="index">
          <div class="list-item" @click.stop.prevent="Emerd(index)">
            <div :class="['list-item-l', betColorClass(item)]">
              <div :class="['list-item-l-color']">
                {{ formatBet(item) }}
              </div>
            </div>
            <div class="list-item-m">
              <div class="list-item-m-top">
                {{ item.issueNumber }}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :class="{ r: index == showIndexRe }"
                    width="9"
                    height="8"
                    viewBox="0 0 9 8"
                    fill="none"
                >
                  <path
                      d="M5.21907 7.57895C4.89494 8.14035 4.08463 8.14035 3.7605 7.57895L0.114077 1.26316C-0.210049 0.701754 0.195109 -5.66721e-08 0.843362 0L8.13621 6.37561e-07C8.78446 6.94233e-07 9.18962 0.701755 8.86549 1.26316L5.21907 7.57895Z"
                      fill="#323536"
                  />
                </svg>
              </div>
              <div class="list-item-m-bottom">{{ fromTime(item.betTime) }}</div>
            </div>
            <div  v-if="item.state != 2" class="list-item-r" :class="{ success: item.state }">
              <div  :class="{ success: item.state }">
                {{ item.state ? $t('success') : $t('fail') }}
              </div>
              <span>{{ `${item.state ? '+' : ''}${currency(item.state?(item.winLoseAmount+item.amount):item.winLoseAmount)}` }}</span>
            </div>
          </div>
          <div v-if="index == showIndexRe" class="list-detail">
            <div class="list-detail-text">{{ $t('detailMay') }}</div>
<!--            <div class="list-detail-line" >-->
<!--              <span>{{ $t('orderNoMay') }}</span>-->
<!--              <div >-->

<!--              </div>-->
<!--            </div>-->
            <div class="list-detail-line" >
              <span>{{ $t('orderNoMay') }}</span>
              <div class="list-detail-copy" @click="copy(item.orderNo)">
                {{ item.orderNo }}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 12V6H34V29H28" stroke="#929292" stroke-width="2" stroke-linejoin="round"/>
                  <rect x="6" y="12" width="22" height="22" stroke="#929292" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('issueMay') }}</span>
              <div>{{ item.issueNumber }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('amountMay') }}</span>
              <div>{{ currency(item.amount) }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('numMay') }}</span>
              <div>{{ item.betMultiple }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('afterTaxAmount') }}</span>
              <div class="red">{{ currency(item.realAmount) }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('tax') }}</span>
              <div>{{ currency(item.fee) }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('resultMay') }}</span>
              <div class="list-premium" v-if="item.number">
                <div v-for="(num, index) in item.premium" :key="index" :class="'number' + num"></div>
              </div>
              <div v-else>--</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('selectMay') }}</span>
              <div :class="{ 'list-detail-row': formatSelect(item)?.length > 1 }" class="itemEnd">
                <span class="list-detail-bet" v-for="text of formatSelect(item)">
                  {{text}}
                </span>
              </div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('statusMay') }}</span>
              <div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
                {{ item.state ? $t('success') : $t('fail') }}
              </div>
              <div v-else>{{ $t('notOpen') }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('winOrLose') }}</span>
              <div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
                {{ `${item.state ? '+' : ''} ${currency(item.state?(item.winLoseAmount+item.amount):item.winLoseAmount)}` }}
              </div>
              <div v-else>--</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('createTime') }}</span>
              <div>{{ fromTime(item.betTime) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!mayrecord.length&&!loading" class="my_r-body-empty">
        <Empty />
      </div>
		<section class="flex-center " style="height: 4rem" v-if="loading">
			<van-loading  type="spinner" color="var(--main-color)" />
		</section>
    </div>

    <div v-if="mayrecord.length" class="my_r-foot">
      <div class="my_r-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
        <van-icon name="arrow-left" class="my_r-icon" size="20" />
      </div>
      <div class="my_r-foot-page">{{ pageNo }}/{{ totalPage }}</div>
      <div class="my_r-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
        <van-icon name="arrow" class="my_r-icon" size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, onDeactivated, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { copy, fromTime} from '@/saasLottery/utils';
import {currency} from "@/utils";
import Empty from '@/components/Empty/index.vue'
import {getLotteryRecord} from '@/saasLottery/api'
import {useGlobalContext} from "@/saasLottery/hooks";
const { t } = useI18n();
const router = useRouter()
// hasHead：是否显示头部「更多」入口。K3 游戏内 MyRecord tab 默认显示；长龙等嵌入场景传 false 隐藏
withDefaults(defineProps<{ hasHead?: boolean }>(), { hasHead: true })
const {gameCode,trigger}=useGlobalContext()
const totalPage = ref(4);
const pageSize = ref(10);
const pageNo = ref(1);
const mayrecord = ref<any>([]);
const loading=ref(false)
const  betMap={
  SumOddEven:{
    name:`${t('common.even')}${t('common.odd')}`,
    code:"SumOddEven",
  },
  SumBigSmall:{
    name:`${t('common.big')} ${t('common.small')}`,
    code:"SumBigSmall",
  },
  SumNum:{
    name:t('totalBet'),
    code:"SumNum",
  },
  NumSame2:{
    name:t('sameNum'),
    code:"NumSame2",
  },
  NumSame2Mult:{
    name:t('sameNum'),
    code:"NumSame2Mult",
  },
  NumSame3:{
    name:t('k3RecordDesc4'),
    code:"NumSame3",
  },
  NumSame3All:{
    // 待特殊处理
    name:t('k3bet3Desc4'),
    code:"NumSame3All",
  },
  NumDiff3:{
    name:t('trendTXT1'),
    code:"NumDiff3",
  },
  NumNear3All:{
    name:t('trendTXT2'),
    code:"NumNear3All",
  },
  NumDiff2:{
    name:t('k3RecordDesc8'),
    code:"NumDiff2",
  },
	Odd:{
		name:t('betOdd'),
		code:"Odd",
	},
	Even:{
		name:t('betEven'),
		code:"Even",
	},
	Big:{
		name:t('betBig'),
		code:"Big",
	},
	Small:{
		name:t('betSmall'),
		code:"Small",
	}
}
// 跳转投注记录页
const goRecord = () => {
  router.push({ name: 'K3Record' })
}
// 上一页
const pPage = () => {
  pageNo.value--;
  getData();
};
// 下一页
const nPage = () => {
  pageNo.value++;
  getData();
};
// 获取参数
const getData = async () => {
  try {
	  loading.value=true;
	  mayrecord.value =[];
	  const {result,data}=await getLotteryRecord({
		  pageSize:pageSize.value,
		  pageNo:pageNo.value,
		  gameCode:gameCode.value,
	  })
	  if (result) {
		  mayrecord.value = data?.list ||[] ;
		  totalPage.value = data?.totalPage || 0;
	  }
  }catch (e) {

  }finally {
	  loading.value=false;
  }
};
const showIndexRe = ref(-1);


// 指定号码类（紫色）：值为单注的号码段数，二不同选 2 个号、三不同选 3 个号仍是一注
const PURE_NUM:Record<string, number> = { NumSame2: 1, NumSame3: 1, NumDiff2: 2, NumDiff3: 3 }
const parseBet=(betContent:string)=>{
  const content=betContent.split(',');
  const [playType,...bets]=content[0].split('_');
  const types=content.map((s:string)=>s.split('_')[0]);
  return {
    playType,
    playBet: bets[0],
    bets,
    types,
    isPureNum: types.every((t:string)=>PURE_NUM[t]!==undefined),
    // 二同一不同(NumSame2Mult)一条 betContent 即一注,显号码拼接;含逗号才多注
    single: content.length===1 && (playType==='NumSame2Mult' || bets.length===(PURE_NUM[playType]??1))
  }
}
// NumSame2Mult_22_3 → [22,3]；对子/豹子与其单号奇偶一致
const betNums=(betContent:string):number[]=>betContent.split(',').flatMap((s:string)=>s.split('_').slice(1)).filter((v:string)=>/^\d+$/.test(v)).map(Number)
const multiColor=(nums:number[]):string=>{
  const hasOdd = nums.some((n:number) => n % 2 === 1);
  const hasEven = nums.some((n:number) => n % 2 === 0);
  if (hasOdd && hasEven) return 'betClMultiMixed';
  return hasOdd ? 'betClMultiOdd' : 'betClMultiEven';
}
const formatBet=(item:Record<string, any>)=>{
  if (!item?.betContent) return '';
  const { playBet, bets, single }=parseBet(item.betContent);
  if (!single) return t('betMulti');
  if (['Big', 'Small', 'Even', 'Odd'].includes(playBet)) return betMap[playBet]?.name;
  return bets.join('');
}

const betColorClass=(item:Record<string, any>)=>{
  if (!item?.betContent) return '';
  const { playType, playBet, types, isPureNum, single }=parseBet(item.betContent);
  if (isPureNum) return 'betClSame';
  if (types.includes('NumSame2Mult')) return 'betClMultiMixed'; // 二同一不同(单注或混合)→ 红绿
  // 纯和值多选按奇偶；跨类混合 → 红绿混色
  if (!single) return types.every((t:string)=>t==='SumNum') ? multiColor(betNums(item.betContent)) : 'betClMultiMixed';
  if (['Big', 'Small', 'Even', 'Odd'].includes(playBet)) return `betCl${playBet}`;
  if (playType === 'SumNum') return Number(playBet) % 2 === 0 ? 'betClEvenNum' : 'betClOddNum';
  // 任意三同（AAA）/三连号（ABC）→ 红
  return 'betClCombo';
}
const formatSelect=(item:Record<string, any>)=>{
  if (!item)return '';
  const list:string[]=[]
   const content=item.betContent.split(',');
  content.forEach((item:string)=>{
    const [key,...other]=item.split('_');
	if (['Big', 'Small', 'Even', 'Odd'].includes(String(other))) {
		list.push(`${betMap[key]?.name} | ${betMap[other.join(',')]?.name}`)
	} else {
		list.push(`${betMap[key]?.name} | ${other.join(',')}`)
	}

  })
  return  list;

}
// 点击展示详情
const Emerd = (index: number) => {
  if (showIndexRe.value == index) {
    showIndexRe.value = -1;
  } else {
    showIndexRe.value = index;
  }
};
const lock = ref(false);
watch(()=>gameCode.value,(value)=>{
	if(value){
		getData()
	}
})
onMounted(() => {
	getData()
})
onDeactivated(() => {
  lock.value = true;
  trigger.reset()
});
onActivated(() => {
  lock.value = false;
  getData();
  trigger.on(()=>{
    getData();
  })
});

</script>
<style lang="scss" scoped>
.my_r {
  padding-bottom: 20px;
  &-body {
    padding: 0 20px 24px;
    background: var(--darkBg, var(--bg_color_L2));
    color: var(--darkTextW, var(--text_color_L1));
    .list {
      & > div {
          //border-bottom: 1px solid #e1e1e1;
      }
      &-premium{
        display: flex;
        align-items: center;
        gap: 10px;
        div{
          width: 32px;
          height: 32px;
        }
      }
      &-item {
        height: 132px;
        display: flex;
        align-items: center;

        &-l {
          height: 72px;
          width: 72px;
          line-height: normal;
          text-align: center;
          border-radius: 20px;
          color: #fff;
          font-size: 48px;
          margin-right: 22px;
          flex: none;
          background-color: var(--main-color);
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          word-wrap: break-word;
          word-break: break-all;
          &.betClBig {
            background-color: var(--norm_secondary-color);
          }

          &.betClSmall {
            background-color: var(--norm_bule-color);
          }

          &.betClOdd {
            background: var(--norm_red-color);
          }

          &.betClEven {
            background: var(--norm_green-color);
          }
          &-num {
            font-size: 24px;
          }
			&.betClSame {
				background: var(--norm_Purple-color);
			}
			&.betClOddNum {
				background: var(--norm_red-color);
			}
			&.betClEvenNum {
				background: var(--norm_green-color);
			}
			&.betClCombo {
				background: var(--norm_red-color);
				font-size: 20px;
				font-weight: 400;
			}
			&.betClMultiOdd {
				background: var(--norm_red-color);
				font-size: 20px;
				font-weight: 400;
			}
			&.betClMultiEven {
				background: var(--norm_green-color);
				font-size: 20px;
				font-weight: 400;
			}
			&.betClMultiMixed {
				background: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_green-color) 50%);
				font-size: 20px;
				font-weight: 400;
			}

        }

        &-m {
          flex: none;
          height: fit-content;
          &-top {
            height: 42px;
            line-height: 42px;
            font-size: 28px;
            font-weight: 500;
            color:var(--text_color_L1);
            display: flex;
            gap: 10px;
            align-items: center;
            svg {
              width: 9px;
              height: 9px;
              &.r {
                transform: rotateZ(180deg);
              }
            }
          }

          &-bottom {
            height: 36px;
            line-height: 36px;
            font-size: 24px;
            color: #929292;
          }
        }

        &-r {
          flex: 1;
          font-size: 24px;
          height: fit-content;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          flex-direction: column;
          color: var(--norm_red-color);
          span {
            word-wrap: break-word;
            word-break: break-all;
            height: 36px;
            line-height: 48px;
          }
          div {
            color: var(--norm_red-color);
            border: 1px solid var(--norm_red-color);
            border-radius: 8px;
			  width: 150px;
			  text-align: center;
            height: 48px;
            line-height: 48px;
            font-size: 24px;
            min-width: 116px;
          }
            &.success {
              span{
                color: var(--norm_green-color);
              }
              
          }

          .success {
            color: var(--norm_green-color);
            border: 1px solid var(--norm_green-color);;
            // div {
            //   background: #13c164;
            // }
          }
        }
      }

      &-inlineB {
        display: inline-block;

        & + div {
          margin-left: 16px;
        }

        &.big {
          color: #f8b460;
        }

        &.small {
          color: #609dec;
        }

        &.green{
          color: #13c164;
        }

        &.red {
          color: #f23f3f;
        }

        &.violet {
          color: #a043e8;
        }
      }

      &-detail {
        display: flex;
        flex-direction: column;
        &-row{
          flex-direction: column;
          
          &.itemEnd{
            align-items: end;
          }
        }
        &-bet{
          line-height: 44px;
          text-align: right;
        }
        &-text {
          font-size: 28px;
			color: var(--text_color_L2);
          font-weight: 500;
          line-height: 39px;
          padding-bottom: 10px;
        }
        &-copy{
			color: var(--text_color_L2);
          svg{
            width: 40px;
            height: 40px;
          }
        }


        &-line {
          height: auto;
          line-height: 50px;
			padding: 0 5px;
			background-color: var(--bgDark-3, var(--bg_color_L3));
			color: var(--text_color_L2);
          font-size: 24px;
			border-radius: 10px;
			margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
			flex-wrap: wrap;
          //border-top: 1px solid #ebebeb;
          & > span {
            //color: #929292;
			  color: var(--text_color_L1);
          }

          & > div {
            display: flex;
            align-items: center;
          }
          .red {
            color: #f23f3f;
          }

          .green {
            color: #13c164;
          }
        }
      }
    }
    &-empty {
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &-foot {
		height: 140px;
		background: var(--darkBg,var(--bg_color_L2));
		color: var(--text_color_L2);
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-page {
			font-size: 24px;
			color:var(--text_color_L1);
		}

		&-previous,
		&-next {
			width: 70px;
			height: 70px;
			border-radius: 10px;
			background: var(--main-color);
			display: flex;
			align-items: center;
			justify-content: center;
      
			&.disabled {
				background: var(--button_dis_color);
				pointer-events: none;

				.my_r-icon {
					color: var(--text_color_L2);
				}
			}

			.my_r-icon {
				color: #fff;
			}
		}
	}
}
.MyGameRecord__C-head {
		display: flex;
		justify-content: flex-end;
		// 去掉左右 padding，避免与父级 .my_r-body 的 20px 叠加导致「更多」不右对齐
		padding: 24px 0 0;

		&-moreB {
			border: 1px solid var(--main-color);
			height: 60px;
			line-height: 60px;
			border-radius: 20px;
			padding: 0 18px 0 18px;
			color: var(--main-color);
			font-size: 24px;
			position: relative;
      svg{
        width: 30px;
        height: 30px;
      }
		}
	}
</style>
