<template>
    <van-popup v-model:show="betShow" position="bottom" :close-on-click-overlay="false" :style="{ borderRadius: '15px 15px 0 0' }">
        <div class="x-bet">
            <div class="x-bet-sub">
                {{$t('betting')}}
                <div class="clear" @click="getClear(1)"><van-icon class="icon" name="delete-o" />{{$t('Clear')}}</div>
            </div>
            <!--  -->
            <!-- <div class="x-bet-maxbet" v-if="tipShow"><span class="tip"> {{ $t('d4BetTip',[7000]) }}</span></div> -->
            <div class="x-bet-lottery">
                <h5 class="x-bet-title">{{$t('ColorSpecies')}}</h5>
                <ul class="box">
                    <li class="item" v-for="(item, index) in lotteryList" :key="index">
                        <img class="img" v-lazy="getLottery(item)" />
                    </li>
                </ul>
            </div>
            <div class="x-bet-type">
                <h5 class="x-bet-title">{{$t('xosoTxt78')}}</h5>
                <ul class="box">
                    <li class="item" v-for="(item,index) in betType" :key="index">{{ $t('d4gameType'+item)}}</li>
                </ul>
            </div>
            <!-- 投注 -->
            <slot></slot>
            <div class="x-bet-multiple">
                <div class="tit">{{$t('multiple')}}</div>
                <div class="box">
                    <div class="li minus" @click="onStepper(1)"><van-icon name="minus" /></div>
                    <van-field class="digit" v-model="countVal" type="digit" :maxlength="5" @input="changeStep" />
                    <div class="li plus" @click="onStepper(2)"><van-icon name="plus" /></div>
                </div>
            </div>
            <div class="multiple-list">
                <div class="box">
                    <div v-for="(item, index) in multipleList" :key="index" :class="countVal == item ? 'active item' : 'item'" @click="onMltiple(item)">
                        X{{ item }}
                    </div>
                </div>
            </div>
            <div class="x-bet-list">
                <div class="item">
                    <div class="lab">{{$t('quantity')}}</div>
                    <div class="number">{{betQuantity}}{{$t('note')}}</div>
                </div>
                <div class="item">
                    <div class="lab">{{$t('walletBalance')}}</div>
                    <div class="balance">{{ currency(balance) }}</div>
                </div>
                <div class="item">
                    <div class="lab">{{$t('betAmounts')}}</div>
                    <div class="amount">{{ digitalCarry(totalAmount) }}</div>  <!--K-->
                </div>
            </div>
            <div class="x-bet-wallet" v-if="totalAmount>balance">
                <div class="tip">
					<van-icon name="warning-o" color="var(--norm_red-color)" size="17" />
					{{ $t('insufficientWallet') }}
                </div>
                <div class="txt" @click="router.push({name:'Recharge'})">{{ $t('torecharge') }} >></div>
            </div>
            <div class="x-bet-agree">
                <van-checkbox v-model="checked" checked-color="var(--main-color)" @change="checkboxChange">
                    <div class="agree">{{ $t('agree') }}</div>
                </van-checkbox>
                <span class="txt" @click="preSaleRule = true">{{ $t('presaleRules') }}</span>
            </div>
        </div>
        <div class="x-bet-foot">
            <div class="cancel" @click="onCancel">{{$t('cancel')}}</div>
            <div class="bet" @click="onBet">{{$t('betting')}}</div>
        </div>
    </van-popup>
</template>
<script lang="ts" setup>
import { D4 } from '@/types/api';
import { useRouter } from 'vue-router'
import { currency, digitalCarry } from '@/utils'
import { useVModels } from '@vueuse/core';
const router = useRouter()
interface propsTs {
    betShow:boolean,  //判是否显示弹窗
    betQuantity:number, //总数量
    timeIndex:number, //选中时间下标
    totalAmount: number,//总金额
    balance:number //钱包余额
    lotteryList:number[]//选中彩种
    betType:number[] //选中投注类型
    countVal:string|number //默认倍数
    multipleList:number[] //默认倍数集合
    checked:boolean,//是否同意 预售规则
    preSaleRule:boolean //预售规则弹窗
    lotteryTab:D4.GameIssueRes[]
}
const props = withDefaults(defineProps<propsTs>(),{
    betShow: false,
    betQuantity:0,
    timeIndex:0,
    totalAmount:0,
    balance:0,
    checked: false,
    preSaleRule:false
})

const emits = defineEmits<{
	(e: 'getClear',type:number): void
    (e: 'onStepper',type:number): void
    (e: 'changeStep',type:any): void
    (e: 'onMltiple',count:number): void
    (e: 'checkboxChange',item:number): void
    (e: 'onCancel'): void
    (e: 'update:checked',value:boolean): void
    (e: 'update:betShow',value:boolean): void
    (e: 'update:countVal',value:number): void
    (e: 'update:preSaleRule',value:number): void
    (e: 'onBet'): void
}>()
//清空选中数据
const getClear = (type:number) => {
	emits('getClear',type)
}
//倍数加减
const onStepper = (type:number) => {
	emits('onStepper',type)
}
//倍数输入
const changeStep = (type:any) => {
	emits('changeStep',type)
}
//快捷倍数
const onMltiple = (count:number) => {
	emits('onMltiple',count)
}
//是否同意预售
const checkboxChange = (item:any) => {
	emits('checkboxChange',item)
}
const onCancel = () =>{
    emits('onCancel')
}
// 下注
const onBet = () =>{
    emits('onBet')
}
// 获取彩种图片
const getLottery = (type:number) =>{
    const {lotteryTab,timeIndex} = props;
    let data = lotteryTab[timeIndex].games.find((item)=>item.type == type)
    return data?.typeImg;
}
const { checked ,betShow,countVal,preSaleRule} = useVModels(props, emits)


</script>
<style lang="scss" scoped>
.x-bet{
    padding: 24px;
    &-sub{
        text-align: center;
        color: var(--text_color_L1);
        font-size: 32px;
        position: relative;
        height: 60px;
        line-height: 60px;
        .clear{
            position: absolute;
            right: 0;
            top: 0;
            font-size: 24px;
            color: var(--text_color_L2);
            .icon{
                color: var(--main-color);
                font-size: 30px;
            }
        }
    }
    &-maxbet{
        text-align: center;
        .tip{
            color: #FF7172;
            display: inline-block;
            padding:0 20px;
            height: 50px;
            line-height: 50px;
            border: 1px solid #ff7172;
            border-radius: 50px;
        }
    }
    &-title{
        font-size: 28px;
        color: var(--text_color_L1);
        margin-bottom: 10px;
    }
    &-lottery{
        .box{
            display: flex;
            .item{
                height: 62px;
                line-height: 62px;
                text-align: center;
                color: var(--textW);
                font-size: 40px;
                width: 62px;
                margin: 0 4px;
                border-radius: 62px;
                background-color: #FFBD9F;
                display: flex;
                align-items: center;
                justify-content: center;
                .img{
                    width: 50px;
                    height: 50px;
                    display: block;
                }
             }
        }
    }
    &-type{
        .box{
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            margin-right: -10px;
            .item{
                width: calc(25% - 10px);
                margin:0 10px 10px 0;
                height: 60px;
                line-height: 60px;
                border: 1px solid var(--text_color_L2);
                border-radius: 10px;
                color: var(--text_color_L2);
            }
        }
		.x-bet-title{
			color: var(--text_color_L2);
			margin: 20px 0 10px 0;
		}
    }

    &-multiple{
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tit{
            font-size: 28px;
            color: var(--text_color_L2);
        }
        .box{
            display: flex;
            .li{
                width: 50px;
                height: 50px;
                font-size:30px;
                font-weight: 600;
                color: #fff;
                text-align: center;
                border-radius: 50px;
                background:var(--bg_color_L3);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .digit{
                height: 50px;
                border-radius: 50px;
                width: 180px;
                padding: 0;
                margin: 0 5px;
				background:var(--bg_color_L3);
                :deep(.van-field__control){
                    text-align: center;
                }
            }
        } 
    }
    .multiple-list{
        display: flex;
        justify-content: flex-end;
        .box{
            display: flex;
            height: 60px;
            line-height: 60px;
            margin: 30px 0;
            .item{
                text-align: center;
                min-width: 90px;
				border: 1px solid var(--text_color_L2);
                color: var(--text_color_L2);
                font-size: 28px;
                border-radius:10px;
                margin: 0 4px;
                &.active{
                    border: none;
                    background: var(--norm_green-color);
                    color: var(--text_color_L1);
                }
            }
        }
    }

    &-list{
        display: flex;
        flex-direction: column;
        .item{
            height: 60px;
            line-height: 60px;
            background-color: var(--bg_color_L3);
            margin-bottom: 12px;
            padding: 0 20px;
            display: flex;
            .lab{
                min-width: 200px;
                color: var(--text_color_L2);
                font-size: 26px;
            }
            .number{
                font-size: 30px;
				font-weight: 400;
                color: var(--norm_red-color);
            }
            .balance,.amount{
                font-weight: 400;
				font-size: 28px;
                color: var(--text_color_L1);
            }
            .amount{
                color: var(--norm_secondary-color);
            }
        }
    }
    &-wallet{
        display: flex;
        justify-content: space-between;
		margin-top: 12px;
        .tip{
            display:flex;
            color: var(--norm_red-color);
            font-size: 22px;
            img{
                height: 30px;
                width: 30px;
                display: block;
                margin-right: 10px;
            }
        }
        .txt{
            font-size: 24px;
            color: var(--text_color_L1);
        }
    }
    &-agree{
        display: flex;
        align-items: center;
        font-size: 24px;
        margin-top: 20px;
        .txt{
            color: var(--norm_red-color);
        }
    }
    &-foot{
        display: flex;
        height: 120px;
        line-height: 120px;
        text-align: center;
        font-size: 34px;
        .cancel{
            flex: 1;
            background-color: var(--bg_color_L3);
            color: var(--text_color_L2);
			font-weight: 400;
        }
        .bet{
            flex: 1.5;
            background-color: var(--main-color);
            color: var(--text_color_L4);
			font-weight: 700;
        }
    }
 }
</style>