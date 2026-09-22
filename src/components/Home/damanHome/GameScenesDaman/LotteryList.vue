<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, PropType, reactive} from "vue";
import days from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {useIntervalFn} from '@vueuse/core'
import {GetHotLotteryList} from "@/api";
import {LorreryStore, SettingStore} from "@/stores";
import {HomeGameList} from "@/types";
import { currency } from '@/utils'
import {useGameContext, useHome} from "@/hooks";
import {useI18n} from "vue-i18n";
import Dragon from './Dragon.vue';
import DamanTitle from './Title.vue';

const { isAlowGame} = useHome()

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
days.extend(utc)
days.extend(timezone)
function parseTime(time: number) {
    const days = Math.floor(time / DAY);
    const hours = Math.floor((time % DAY) / HOUR);
    const minutes = Math.floor((time % HOUR) / MINUTE);
    const seconds = Math.floor((time % MINUTE) / SECOND);
    const milliseconds = Math.floor(time % SECOND);

    return {
        total: time,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
    };
}
const props = defineProps({
	platformList: {
		type: Array as PropType<HomeGameList[]>,
		default: []
	},
	type:{
		type: String as PropType<'line'|'card'>,
		default:'line'
	}
})
interface HotItem{
    categoryId: number
    endTime: string;
    startTime:string
	serverTime:string
    typeId: number,
    expireSeconds:number
}
const {t}=useI18n();
const settingS = SettingStore()
const showChanglong = computed(() => settingS.getIsShowLotteryDragon)
const store=reactive<{hot:HotItem[],loading:boolean}>({
	hot:[

	],
	loading:false,
});
const hotList=computed(()=>store.hot.map((item)=>{
	const tabName=(Lorrery[item.typeId]||{}).tabName||'';
	return Object.assign({tabName,current:parseTime(item.expireSeconds*1000)},item);
}))
const Lorrery=LorreryStore();
const colors={
	0:"#2AC1FA",
	1:"#FFC56D",
	2:"#FF6DC5",
}
const {gameType, currentGame,onItemLottery,lotteryRoutes } = useGameContext();
let timers:any[]=[];
const clearTimer=()=>{
    timers.forEach((cb)=>{
        cb&&cb()
    });
    timers=[];
}
const getLottery=async ()=>{
    if (store.loading) return;
    store.loading=true;
    try {
        const {data=[],result}=await GetHotLotteryList();
        if (!result) return;
        const list=data||[]
       store.hot=list.map((item)=>Object.assign(item,{expireSeconds:0})).sort((a,b)=>b.typeId-a.typeId);
      if (timers.length) clearTimer();
        const now=days.tz(Date.now(),"IST").format('YYYY-MM-DD HH:mm:ss');
        store.hot.forEach((item)=>{
            // 总开奖时间
            const time=days(item.endTime).unix()-days(item.startTime).unix();
            // 一开始多少秒
            const expireSecond=days(item.serverTime||now).unix()-days(item.startTime).unix();
            item.expireSeconds=time-expireSecond;
            const { pause, resume, isActive } = useIntervalFn(() => {
                if (item.expireSeconds==1) {
                    resume();
                    item.expireSeconds=time;
                    return;
				};
                item.expireSeconds-=1;
            }, 1000);
            timers.push(pause)
        })
    }finally {
		store.loading=false;
    }
}
onMounted(async ()=>{
    await getLottery();
})
onBeforeUnmount(()=>{
    clearTimer();
})
</script>

<template>
	<div class="daman-lottery-list">
	<DamanTitle :icon="true" :title="$t('lottery')" v-if="showChanglong" />
    <Dragon/>
    <DamanTitle  v-if="hotList.length" :title="`${t('hot')} ${t('lottery')}`" />
    <div class="daman-hot" v-if="hotList.length">
      <div class="daman-hot-item" v-for="(item,index) of hotList" @click="isAlowGame(item, onItemLottery)">
        <h3>{{item.tabName}}</h3>
        <p>{{t('countdownLottery')}}</p>
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="160" height="57" viewBox="0 0 160 57" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M52 5H4C1.79086 5 0 6.79086 0 9V53C0 55.2091 1.79086 57 4 57H156C158.209 57 160 55.2091 160 53V9C160 6.79086 158.209 5 156 5H108V8C108 9.65685 106.657 11 105 11C103.343 11 102 9.65685 102 8V5H58V8C58 9.65685 56.6569 11 55 11C53.3431 11 52 9.65685 52 8V5Z" fill="white"/>
            <path d="M52 5H4C1.79086 5 0 6.79086 0 9V14H160V9C160 6.79086 158.209 5 156 5H108V8C108 9.65685 106.657 11 105 11C103.343 11 102 9.65685 102 8V5H58V8C58 9.65685 56.6569 11 55 11C53.3431 11 52 9.65685 52 8V5Z" :fill="colors[index]"/>
            <path d="M53 2C53 0.89543 53.8954 0 55 0C56.1046 0 57 0.895431 57 2V8C57 9.10457 56.1046 10 55 10C53.8954 10 53 9.10457 53 8V2Z" :fill="colors[index]"/>
            <path d="M103 2C103 0.89543 103.895 0 105 0C106.105 0 107 0.895431 107 2V8C107 9.10457 106.105 10 105 10C103.895 10 103 9.10457 103 8V2Z" :fill="colors[index]"/>
            <path d="M80 26V46" stroke="#E8E8E8" stroke-linecap="round"/>
          </svg>
          <p :style="{color:colors[index]}">
			  <span>{{item.current.minutes>9?'':'0'}}{{item.current.minutes}}</span>
			  <span>{{item.current.seconds>9?'':'0'}}{{item.current.seconds}}</span>
		  </p>
        </div>
      </div>
    </div>
    <DamanTitle :icon="true" :title="$t('lottery')" />
	<div v-for="item in platformList" :key="item.categoryCode" class="daman-item" @click="isAlowGame(item, onItemLottery)">
			<div class="daman-item-left">
        <h3>{{item.categoryCode}}</h3>
        <img  v-lazy="item.categoryImg" alt=""/>
      </div>
      <div class="daman-item-right">
        <div class="top">
          <h3>{{item.categoryCode}}</h3>
          <div class="daman-btn"><span>GO</span> <van-icon name="arrow" size="20" /></div>
        </div>
        <div class="pool">
          <span>{{t('topPrize')}}</span>
          <span class="line"></span>
          <span class="num">{{currency(item.fiveDAmount||item.k3Amount||item.trxWingoAmount||item.wingoAmount||0)}}</span>
        </div>
        <p class="tips" v-if="lotteryRoutes.get(item.id)&&lotteryRoutes.get(item.id)?.rule">{{t(lotteryRoutes.get(item.id)?.rule||'')}}</p>
      </div>
		</div>
	</div>

</template>

<style scoped lang="scss">
.daman-lottery-list{

	.daman-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200px;
		height: 50px;
		border-radius: 100px;
		line-height: 50px;
		color: #FFF;
		font-size: 30px;
		font-style: normal;
		font-weight: 700;
		background: var(--main_gradient-color);
    
		span:first-child{
			margin-right: 4px;
			margin-top: 4px;
		}
	}
  .daman-item{
    display: flex;
    border-radius: 20px;
    background: var(--bg_color_L2);
    padding: 20px 10px;
    margin-bottom: 20px;
    &-left{
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 160px;
      height: 220px;
      background: var(--main_gradient-color2);
      border-radius: 20px;
      img{
		  margin-top: 10px;
		  width:140px;
		  height: 140px;
      }
      h3{
        color: var(--text_color_L4);
        font-family: Inter;
        font-size: 24px;
        font-weight: 700;
        line-height: 50px;
        height: 50px;
        text-align: center;
        margin-top: 10px;
      }
    }
    &-right{
      flex: 1;
      padding-left: 9px;
      .top{
        display: flex;
        justify-content: space-between;
      }
      h3{
        color: var(--darkTextW,var(--text_color_L1));
        text-align: center;
        font-size: 32px;
        font-weight: 700;
        line-height: 40px; /* 125% */
        letter-spacing: 1.28px;
      }
      .pool{
        background: var(--bg_color_L1);
        border-radius: 12px;
        color: #666;
        font-weight: 400;
        padding: 18px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
      }
      .line{
        height: 36px;
        width: 2px;
        background: #DADADA;
        display: inline-block;
      }
      .num{
        color: #FF8310;
        font-family: Roboto;
        font-size: 26px;
        font-style: normal;
        font-weight: 500;
        line-height: 26px;
      }
      .tips{
        color: #888;
        font-family: Inter;
        font-size: 22px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px;
        margin-top:20px;
        &:before{
          content: '';
          width: 6px;
          height: 20px;
          background: var(--main-color);
          display: inline-block;
          margin-right: 10px;
          border-radius: 12px;
        }
      }
    }
  }
  .daman-hot{
    display: grid;
    grid-template-columns: 340px 1fr;
    grid-template-rows: 200px 200px;
    grid-gap: 20px;
    grid-auto-flow: column;
    margin-bottom:30px;
    &-item{
      padding:20px;
      &:first-child{
        grid-column: 1/2;
        background: url("./assets/1.png") no-repeat center top/106%;
      }
      &:nth-child(2){
        grid-column: 1/2;
        background: url("./assets/2.png") no-repeat center top/106%;
      }
      &:last-child{
        background: url("./assets/3.png") no-repeat center top/106%;
        grid-row: 1/3;
      }
      &>p{
        color: #FFF;
        font-family: Inter;
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-bottom: 28px;
      }
    }

    h3{
      color: #FFF;
      font-family: Inter;
      font-size: 28px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    .icon{
      width: 160px;
      height: 57px;
      position: relative;
      svg{
        width: 100%;
        height: 100%;
      }
		p{
			position: absolute;
			top: 20px;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-between;
			font-family: Inter;
			font-size: 28px;
			font-style: normal;
			font-weight: 500;
			line-height: 28px;
			padding: 2px 10px;
		}
		span{
			display: block;
		}
    }
  }
}
</style>
