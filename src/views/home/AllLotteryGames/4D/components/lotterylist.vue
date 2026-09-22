<template>
    <div class="x-4d-head">
        <div class="time" ref="target">
            <div class="box" @click="toggle">
                {{ timeVal.replace(/-/g, '/')}}  {{ timeWeek(timeVal) }}
            </div>
            <div class="menu" v-show="timeShow">
                <h3 @click="close">{{$t('Drawdate')}}</h3>
                <ul>
                    <li :class="[timeVal==item.date?'active':'']" v-for="(item,index) in lotteryTab" :key="index" @click="onTime(item,index)">{{ item.date.replace(/-/g, '/')}} {{ timeWeek(item.date) }}</li>
                </ul>
            </div>
        </div>
        <div class="main">
            <van-skeleton :loading="!lotteryTab[timeIndex]?.games" class="flex">
                <template #template>
                    <div class="item" v-for=" in 10"><div class="box"><div></div></div></div>
                </template>
                <!-- 热门 -->
                <div class="mask" v-show="timeShow"></div>
                <div class="item" v-for="(item,index) in lotteryTab[timeIndex]?.games" :key="index" @click="onLotteryTab(item,index)">
                    <div class="box" :class="[ lotteryList.includes(item.type)?'active':'']">
                        <img class="img" v-lazy="item.typeImg" />
                    </div>
                </div>
            </van-skeleton>
        </div>
        
    </div>
</template>

<script setup lang='ts'>
import { ref} from 'vue';
import { onClickOutside,useVModel } from '@vueuse/core'
import { D4 } from '@/types/api';
import dayjs from 'dayjs';
interface propsTs {
    modelValue:boolean,
    timeIndex:number,
    timeVal:string,
    lotteryList: number[]
    lotteryTab:D4.GameIssueRes[]
    timeWeek:(data:string)=>string
}
const props=withDefaults(defineProps<propsTs>(),{
    // 投注金额
	modelValue: false,
    timeIndex:0,
    timeVal:dayjs().format('YYYY-MM-DD'),
    timeWeek:()=>''
})
const emits = defineEmits<{
	(e: 'onLotteryTab',item:D4.gamesList,index:number): void
    (e: 'onTime',item:D4.GameIssueRes,index:number): void
    (e: 'update:modelValue',value:boolean): void
}>()
const timeShow = useVModel(props, 'modelValue', emits)
const onLotteryTab = (item:D4.gamesList,index:number) => {
	emits('onLotteryTab',item,index)
}
const onTime = (item:D4.GameIssueRes,index:number) => {
	emits('onTime',item,index)
}
const open = () => {
    timeShow.value = true
}
const close = () => {
    timeShow.value = false
}
const toggle = () => {
    timeShow.value ? close() : open()
}


const target = ref(null)
onClickOutside(target, (event) => {
    timeShow.value=false;
    // toggle();
})


</script>

<style scoped lang='scss'>
.x-4d-head{
    display: block;
    padding-top: 10px;
    background: var(--bg_color_L2);
    .time{
        text-align: center;
        height: 54px;
        line-height: 54px;
        max-width: 60%;
        margin: 0 auto 26px;
        font-size: 28px;
        color: #fff;
        border-top: 1px solid #fff;
        border-bottom: 1px solid #fff;
        position: relative;
        &::after,&::before{
            position: absolute;
            top: -2px;
            content: "";
            height: 54px;
            width: 19px;
        }
        &::after{
            left: -19px;
            background: url(@/assets/icons/home/AllLotteryGames/4D/arr-left.svg) no-repeat left top;
            background-size: cover;
        }
        &::before{
            right: -19px;
            background: url(@/assets/icons/home/AllLotteryGames/4D/arr-right.svg) no-repeat left top;
            background-size: cover;
        }
        .menu{
            position: absolute;
            top: 54px;
            left: 0;
            background: #FFF;
            color: var(--text_color_L1);
            width: 100%;
            border-radius: 10px;
            border: 1px solid var(--text_color_L1);
            font-size: 28px;
            line-height: 70px;
            z-index: 99;
            h3{
                height: 70px;
                color: var(--text_color_L4);
                background-color: #F6F6F6;
            }
            ul{
                li{
                    height: 70px;
                    color: var(--text_color_L2);
                    &.active{
                        color: var(--text_color_L4);
                        background: var(--main-color);
                    }
                    
                }
            }
        }
       
    }
    .main{
        display: flex;
        flex-wrap: wrap;
        position: relative;
        min-height:280px;
        padding: 0;
        .item{
            width: 20%;
            .box{
                height: 120px;
                width: 120px;
                overflow: hidden;
                text-align: center;
                margin: 0 auto;
                font-size: 40px;
                color: #fff;
                margin-bottom: 12px;
                border-radius: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                .img{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 80%;
                    background-color: #fff;
                    filter: grayscale(100%);
                }
                &.active{
                    background: var(--main_gradient-color2);
                    .img{
                        filter: grayscale(0%);
                    }
                }
            }
        }
    }
}
</style>