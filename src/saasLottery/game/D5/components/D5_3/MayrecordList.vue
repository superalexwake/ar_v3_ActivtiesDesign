<template>
  <div class="my_r">
    <div class="my_r-body">
      <div v-if="mayrecord.length" class="list">
        <div v-for="(item, index) in mayrecord" :key="index">
          <div class="list-item" @click.stop.prevent="Emerd(index)">
            <div :class="['list-item-l', betColorClass(item)]">
              <div :class="`list-item-l-${betLabel(item)}`">
                {{ betLabel(item) }}
              </div>
            </div>
            <div class="list-item-m">
              <div class="list-item-m-top">
                {{ item.issueNumber }}
                <svg xmlns="http://www.w3.org/2000/svg" :class="{'r': index == showIndexRe}" width="9" height="8" viewBox="0 0 9 8" fill="none">
                  <path d="M5.21907 7.57895C4.89494 8.14035 4.08463 8.14035 3.7605 7.57895L0.114077 1.26316C-0.210049 0.701754 0.195109 -5.66721e-08 0.843362 0L8.13621 6.37561e-07C8.78446 6.94233e-07 9.18962 0.701755 8.86549 1.26316L5.21907 7.57895Z" fill="#323536"/>
                </svg>
              </div>
              <div class="list-item-m-bottom">{{ fromTime(item.betTime) }}</div>
            </div>
            <div  class="list-item-r" v-if="item.state != 2" :class="{ success: item.state==1 }">
              <div  :class="{ success: item.state==1 }">
				  {{ item.state==1 ? $t('success') : $t('fail') }}
              </div>
              <div>{{ `${item.state==1 ? '+' : ''} ${currency(item.state?(item.winLoseAmount+item.amount):item.winLoseAmount)}` }}</div>
            </div>
          </div>
          <div v-if="index == showIndexRe" class="list-detail">
            <div class="list-detail-text">{{ $t('detailMay') }}</div>
<!--            <div class="list-detail-line" v-if="item.orderNo">-->
<!--              <span>{{ $t('orderNoMay') }}</span>-->
<!--            </div>-->
            <div class="list-detail-line">
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
              <div >{{ item.betMultiple }}</div>
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
              <div v-if="item.premium">
                <div class="numList" v-for="(a, b) in [...item.premium]" :key="b">{{a}}</div>
              </div>
              <div v-else>--</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('selectMay') }}</span>
              <div>{{ t(`${removeBeforeSubstring(item?.playType)}：`+formatSelect(item)) }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('statusMay') }}</span>
              <div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
				  {{ item.state==1 ? $t('success') : $t('fail') }}
              </div>
              <div v-else>{{ $t('unsettled') }}</div>
            </div>
            <div class="list-detail-line">
              <span>{{ $t('winOrLose') }}</span>
              <div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
                {{ `${item.state ? '+' : ''}${currency(item.state?(item.winLoseAmount+item.amount):item.winLoseAmount)}` }}
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
      <div v-else class="my_r-body-empty">
        <Empty />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import { currency,  copy, fromTime } from '@/saasLottery/utils'
import { useI18n } from 'vue-i18n'
import {Empty} from '@/saasLottery/components'
const { t } = useI18n()
const props = withDefaults(defineProps<{ gameCode: any,mayrecord:any }>(), {})
const mayrecord = ref<any>(props.mayrecord||[]) // 游戏记录列表

watch(() => props.mayrecord, (newGameCode) => {
  if (newGameCode) {
    mayrecord.value = props.mayrecord
  }
})

const formatBet=(data:any)=>{
  if (!data?.betContent) return '';
  const playBet = data.betContent.split(",")[0]?.split("_")[1];
	if (['Big', 'Small', 'Even', 'Odd'].includes(playBet)) {
		return betMap[playBet]?.name
	}
  return playBet
}

const betColorClass=(data:any)=>{
  if (!data?.betContent) return '';
  const parts = data.betContent.split(',');
  const first = parts[0]?.split('_').pop();
  if (['Big', 'Small', 'Even', 'Odd'].includes(first)) return `list-item-l-${first}`;
  // 号码投注:取所有数字判断奇偶
  const nums = parts.map((p:any) => p.split('_').pop()).filter((v:any) => /^\d+$/.test(v)).map(Number);
  if (!nums.length) return '';
  if (nums.length === 1) return nums[0] % 2 === 0 ? 'list-item-l-evenNum' : 'list-item-l-oddNum';
  const hasOdd = nums.some((n:number) => n % 2 === 1);
  const hasEven = nums.some((n:number) => n % 2 === 0);
  if (hasOdd && hasEven) return 'list-item-l-multiMixed';
  return hasOdd ? 'list-item-l-multiOdd' : 'list-item-l-multiEven';
}

// 左侧标签文案:大小单双→名称;单个号码→号码;多个号码→Multi
const betLabel=(data:any)=>{
  const bc = data?.betContent || '';
  if (!bc.includes(',')) return formatBet(data);
  const vals = bc.split(',').map((p:any) => p.split('_').pop());
  return vals.every((v:any) => /^\d+$/.test(v)) ? t('betMulti') : formatBet(data);
}


/*移除指定字段*/
const removeBeforeSubstring=(str:any) =>{
  const replacements:any = { First: 'A', Second: 'B', Third: 'C', Fourth: 'D', Fifth: 'E',Sum:'Sum' };
  const data = replacements[str?.replace(/Num|OddEven|BigSmall/g,'')] || str // 去掉指定字符串
  return data;
}

const formatSelect=(data:any)=>{
  if (!data.betContent) return '';
  if(data.betContent.indexOf(",")!==-1){
    const aa = data.betContent.split(",");
    return aa.map((item: any)=>{
      const parts = item.split("_")
      return parts[parts.length-1]
    })
  }
	if (['Big', 'Small', 'Even', 'Odd'].includes(data.betContent?.split('_')[1])) {
		return betMap[data.betContent?.split('_')[1]]?.name
	}
  return data.betContent?.split('_')[1]
}

// 点击展示详情
const showIndexRe = ref(-1)
const Emerd = (index: number) => {
  if (showIndexRe.value == index) {
    showIndexRe.value = -1
  } else {
    showIndexRe.value = index
  }
}
const  betMap={
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
</script>
<style lang="scss" scoped>
.my_r {
  padding-bottom: 20px;
  &-body {
    //padding: 0 20px 24px 20px;
    .list {
      &>div {
        //border-bottom: 1px solid #E1E1E1;
        //& + div {
        //  border-top: 1px solid #E1E1E1;
        //}
      }
      &-item {
        height: 132px;
        display: flex;
        align-items: center;

        &-l {
          height: 84px;
          width: 94px;
          line-height: 84px;
          text-align: center;
          border-radius: 8px;
          border: 1px var(--main-color);
          background: var(--main-color);

          font-size: 28px;
          font-weight: 900;
          margin-right: 22px;
          flex: none;
          overflow: hidden;
          color: var(--text_color_L4);
          &-Odd,
          &-Even,
          &-Small,
          &-Big,
		  &-Chance,
		  &-Pequeno,
		  &-Grande
		  {
            font-size: 22px;
            font-weight: 400;
          }
          
          &-Odd {
            background: var(--norm_red-color);
            color: #fff;
          }

          &-Even{
            background: var(--norm_green-color);
            color: #fff;
          }

          &-Small {
            background: var(--norm_bule-color);
            color: #fff;
          }

          &-Big {
            background: var(--norm_secondary-color);
            color: #fff;
          }

          &-oddNum {
            background: var(--norm_red-color);
            color: #fff;
          }

          &-evenNum {
            background: var(--norm_green-color);
            color: #fff;
          }

          &-Multi {
            font-size: 22px;
            font-weight: 400;
          }

          &-multiOdd {
            background: var(--norm_red-color);
            color: #fff;
          }

          &-multiEven {
            background: var(--norm_green-color);
            color: #fff;
          }

          &-multiMixed {
            background: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_green-color) 50%);
            color: #fff;
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
		    color: var(--text_color_L2);
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
		    color: var(--text_color_L3);
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
          color: #F0484B;
			div{
				width:150px;
				text-align: center;
			}
          div:nth-child(1) {
            color: #F0484B;
            //background: #F0484B;
		  	border: 1px solid #F0484B;
            border-radius: 8px;
            height: 48px;
            line-height: 48px;
            font-size: 24px;
          }
          div:nth-child(2) {
            word-wrap: break-word;
            word-break: break-all;
            height: 36px;
            line-height: 48px;
          }
          &.success {
            color: #13C164;
            div:nth-child(1) {
				color: #13C164;
			   border: 1px solid #13C164;
              //background: #13C164;
            }
          }
        }
      }

      &-inlineB {
        display: inline-block;

        & + div {
          margin-left: 16px;
        }

        &.big {
          color: #F8B460;
        }

        &.small {
          color: #609DEC;
        }

        &.greenColor {
          color: #13C164;
        }

        &.redColor {
          color: #F23F3F;
        }

        &.purpleColor {
          color: #A043E8;
        }
      }

      &-detail {
        display: flex;
        flex-direction: column;
        &-text {
          font-size: 28px;
          color: #323536;
          font-weight: 500;
          line-height: 39px;
          padding-bottom: 10px;
        }
        &-copy svg{
          width: 40px;
          height: 40px;
        }
        &-line {
          height:auto;
          line-height: 50px;
			padding: 0 5px;
			background-color: var(--bgDark-3, var(--bg_color_L3));
			color: var(--text_color_L2);
          //color: #323536;
          font-size: 28px;
			border-radius: 10px;
			margin-bottom: 16px;
          display: flex;
			flex-wrap: wrap;
          justify-content: space-between;
          //border-top: 1px solid #EBEBEB;
          &>span {
            //color: #929292;
			  color: var(--text_color_L1);
          }

          & > div {
            display: flex;
            align-items: center;
          }
          .red {
            color: #F23F3F;
          }

          .green {
            color: #13C164;
          }
          .numList{
            display: inline-block;
            color: #323536;
            text-align: center;
            font-family: Poppins;
            font-size: 28px;
            font-style: normal;
            font-weight: 400;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            line-height: 40px; /* 142.857% */
            background: rgb(240, 241, 247);
            margin-right: 4px;
          }
        }
      }
    }
    &-empty {
      height: 400px;
    }
  }

  &-foot {
    height: 70px;
    padding: 0 178px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-page {
      font-size: 24px;
      color: #323536;
    }

    &-previous,
    &-next {
      width: 70px;
      height: 70px;
      border-radius: 10px;
      background: #FD565C;
      display: flex;
      align-items: center;
      justify-content: center;

      &.disabled {
        background: #F0F0F0;
        pointer-events: none;

        .my_r-icon {
          color: #D3D3D3;
        }
      }
      .my_r-icon {
        color: #fff;
      }
    }
  }
}
</style>
