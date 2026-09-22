<template>
    <div class="x-bet">
        <!-- 输入投注 -->
        <div class="x-bet-box" v-if="tabId === 1">
            <div class="item">
                <span class="pay"> {{ $t('d4gamePay'+betPay) }} </span>
                <p class="txt">{{$t('gamePlay')}}</p>
            </div>
            <div class="item">
                <span class="num">{{ num }}</span>
                <p class="txt">{{$t('bettingnumber')}}</p>
            </div>
        </div>
        <!-- 选择投注 -->
        <div class="x-bet-pay" v-if="tabId === 2">
            <h5 class="x-bet-title">{{$t('gamePlay')}}</h5>
            <div class="name">{{ $t('d4gamePay'+betPay) }}</div>
        </div>
        <div class="x-bet-dupleList" v-if="tabId ===2">
            <div class="box" v-for="(item,index) in dupleList" :key="index">
                <div class="digits">
                    <div class="sub">{{tabList[index].name}}</div>
                    <div class="list">
                        <div class="num" v-for="(xitem,xindex) in item.list" :key="xindex">
                            <div class="item" >{{ xitem }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
interface propsTs {
    tabId:number,  //投注类型
    betPay:number, //选中玩法
    num: string,//选中号码
    dupleList:{
        list: number[];
    }[],//复式选中投注数字
    tabList:{name:string}[] //个十百千集合
}
withDefaults(defineProps<propsTs>(),{
    tabId:0,
    betPay:0,
})
</script>
<style lang="scss" scoped>
.x-bet{
    padding: 0;
    &-box{
        display: flex;
        justify-content: space-between;
        .item{
            width: calc(50% - 10px);
            border: 1px solid var(--text_color_L2);
            text-align: center;
            height: 110px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-radius: 10px;
            .pay{
                color: var(--main-color);
                font-size: 24px;
            }
            .num{
                font-size: 36px;
                color: var(--main-color);
                font-weight: 600;
            }
            .txt{
                margin-top: 5px;
                font-size: 28px;
                color: var(--text_color_L2);
            }
        }
    }
    &-pay{
        display: flex;
        height: 60px;
        line-height: 60px;
        border: 1px solid var(--text_color_L2);
		color:var(--text_color_L2);
        border-radius: 10px;
        padding: 0 20px;
		.x-bet-title{
			font-size: 28px;
			font-weight: 400;
		}
        .name{
            margin: 0 20px;
            color: var(--main-color);
            font-size: 24px;
			font-weight: 500;
        }
    }
    &-dupleList{
        max-height: 355px;
        overflow-y: auto;
        margin: 24px 0;
        .box{
            display: flex;
            .sub{
                color: var(--text_color_L2);
                font-size: 32px;
                min-width: 180px;
            }
            .digits{
                display: flex;
                width: 100%;
                align-items: center;
                margin-bottom: 20px;
                .list{
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    .num{
                        width: 20%;
                        .item{
                            margin: 0 auto;
                            text-align: center;
                            height: 70px;
                            width: 70px;
                            line-height: 70px;
                            background: url('@icon/public/anbg.svg') no-repeat center center;
                            background-size: cover;
                            color: var(--norm_red-color);
                            font-size: 30px;
                            font-style: normal;
                            font-weight: 700;
                        }
                    }
                }
            }
        }
    }
}
</style>