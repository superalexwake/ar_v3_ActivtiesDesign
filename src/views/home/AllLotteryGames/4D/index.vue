<template>
    <div class="x-4d" >
        <NavBar left-arrow @click-left="router.go(-1)" class="main" title="4D">
			<template #right>
				<div class="x-4d-more">
					<svg-icon name="howpay" class="svg" @click="() => router.push({name: 'AllLotteryGames-4DPlay'})" />
					<svg-icon name="odds" class="svg" @click="() => router.push({name: 'AllLotteryGames-4DOdds'})" />
				</div>
			</template>
		</NavBar>
        <!-- 头部彩种 -->
        <LotteryList @on-time="onTime" :lottery-tab="lotteryTab" :time-index="timeIndex" @on-lottery-tab="lotterTab" :time-week="getTimeWeek" :lottery-list="lotteryList" v-model="timeShow" :time-val="timeVal"></LotteryList>
        <div class="x-4d-body">
            <div class="x-4d-tab">
                <div @click="onTab(1)" :class="[tabId==1?'active':'']">{{t('EnterBet')}}</div>
                <div @click="onTab(2)" :class="[tabId==2?'active':'']" >{{t('SelectBet')}}</div>
            </div>
            <div class="x-4d-content">
                <div class="enter" v-if="tabId === 1">
                    <input :class="num.length>0?'input fz24':'input'" v-if="betPay != 5" oninput="value=value.replace(/\D/g,'')" v-model="num" type="text" :placeholder="t('PenterNumber')" maxlength="4" @input="getInput" @blur="getBlur" />
                    <input :class="num.length>0?'input fz24':'input'" v-else oninput="value=value.replace(/[^A-Z0-9]/g,'').toUpperCase()" v-model="num" type="text" :placeholder="t('PenterNumber')" maxlength="4" @input="getInput" @blur="getBlur" />
                    <van-button class="btn" v-show="betPayList.includes(5)" @click="onRoll">ROll</van-button>
                </div>
                <!-- 投注类型 -->
                <BetType class="mb30" :bet-type="betType" :bet-type-list="betTypeList" @on-bet-type="onBetType"></BetType>
                <!-- 选择投注 下注盘 -->
                <DuplexBet v-if="tabId === 2" :tab-list="tabList" :all-active="allActive" :num-list="dupleList" @add-number="addNumber" @all-addnum="allAddnum"></DuplexBet>
                <!-- 玩法 -->
                <BetPay class="mb30" :roll-num="rollNum" :ban-bet-pay="banbetpay" :bet-pay-list="betPayList" :bet-pay-id="betPay" :duplex="duplex" @on-betpay="onBetpay"></BetPay>
                <!-- 投注金额 -->
                <BetAmount :count="count" :list="betAmountList" @on-amount="onAmount"></BetAmount>
            </div>
        </div>
        <!-- 开奖记录 && 我的比赛记录 -->
        <GameList></GameList>
        <NavFoot :total-amount="totalAmount" :bet-quantity="betQuantity" @on-bet="onClickBet"></NavFoot>
        <!-- 投注弹窗 -->
        <BetPopup v-model:betShow="betShow" :bet-quantity="betQuantity" :lottery-tab="lotteryTab" :time-index="timeIndex" :total-amount="totalAmount" :balance="balance" :lottery-list="lotteryList" :bet-type="betType" :multiple-list="multipleList" 
        v-model:count-val="countVal" v-model:checked="checked" v-model:pre-sale-rule="preSaleRule" @checkbox-change="checkboxChange" @on-cancel="betShow = false" @get-clear="getClear" @on-stepper="onStepper" @on-mltiple="onMltiple" @change-step="changeStep" @on-bet="onBet">
            <BetContent :num="num" :tab-id="tabId" :bet-pay="betPay" :duple-list="dupleList" :tab-list="tabList"></BetContent>
        </BetPopup>
        <!-- 投注成功提示 -->
        <van-popup v-model:show="promptShow" position="center" class="x-4d-prompt" :style="{ borderRadius: '10px',width:'8rem',height:'80px' }">
            <div class="box">
				<svg-icon name="success" class="svg" />
                {{ $t('code402') }}
            </div>
        </van-popup>
        <!-- 预售规则 -->
        <van-popup v-model:show="preSaleRule" class="PreSaleRule" :close-on-click-overlay="false" round>
            <div class="PreSale">
                <div class="head">{{ t('presaleRules') }}</div>
                <div class="body">
                    {{ $t('betPopTXT') }}
                </div>
                <div class="foot">
                    <div class="btn" @click="preSaleRule = false">{{ t('iKonw') }}</div>
                </div>
            </div>
        </van-popup>
        <!-- <van-popup v-model:show="preSaleRule" position="center" class="x-4d-prompt" :style="{ borderRadius: '10px',width:'8rem',height:'80px' }">
            <div class="box">
                
                预售规则
            </div>
        </van-popup> -->
    </div>
</template>
<script lang="ts" setup>
import LotteryList from './components/lotterylist.vue'
import BetType from './components/bettype.vue'
import BetPay from './components/betpay.vue'
import BetAmount from './components/betamount.vue'
import DuplexBet from './components/duplexbet.vue'
import NavFoot from './components/navfoot.vue'
import BetPopup from './components/betpopup.vue'
import BetContent from './components/betcontent.vue'
import { use4D } from '@/hooks/use4D.hook'
import { useRouter } from 'vue-router'
import GameList from './components/gameList.vue'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const {t} = useI18n()

const router = useRouter()


const {getTimeWeek,onTime,lotterTab, onTab,getClear,onRoll,getInput,getBlur,onBetType,onBetpay,onAmount,onClickBet,addNumber,allAddnum,onStepper,changeStep,onMltiple,checkboxChange,onBet,getWinsUserAmount,getGameConfig,getGameIssue,
    tabList,timeVal,lotteryTab,timeIndex,lotteryList,timeShow, betShow,tabId,num ,rollNum,banbetpay,betType,betTypeList,betPay,betPayList,count,totalAmount,betQuantity,dupleList,allActive,countVal,checked,preSaleRule,multipleList,betAmountList,duplex,balance,promptShow} = use4D();

onMounted(() => {
    getWinsUserAmount()
    getGameConfig();
    getGameIssue();
})

</script>
<style lang="scss" scoped>
    .mb30{
        margin-bottom: 30px;
    }
    .x-4d{
        width: 100%;
        min-height: 100vh;
        padding-bottom: 140px;
        &-more{
            display: flex;
            .svg{
                display: block;
                height: 48px;
                width: 48px;
                margin-left: 15px;
            }
        }
        &-body{
            padding: 20px 24px 0;
        }
        &-tab{
            display: flex;
            height: 80px;
            line-height: 80px;
            background-color: var(--bg_color_L3);
            border-radius: 10px;
            font-size: 32px;
            color: var(--text_color_L2);
            overflow: hidden;
            &>div{
                width: 50%;
                text-align: center;
                &.active{
                    color:var(--text_color_L4);
                    background: var(--main_gradient-color);
                    box-shadow: 0px 8px 16px rgba(208, 208, 237, 0.36);

                }
            }
        }
        &-content{
            background-color: var(--bg_color_L2);
            padding:20px;
            margin-top: 20px;
            
            border-radius: 10px;
            .enter{
                position: relative;
                margin-bottom: 30px;
                .input{
                    height: 80px;
                    line-height: 80px;
                    width: 100%;
                    background-color: var(--bg_color_L3);
                    /*border: 1px solid var(--main-color);*/
                    border-radius: 80px;
                    padding: 0 80px 0 20px;
                    font-size: 24px;
                    color: var(--text_color_L1);
                    &.fz24{
                        font-size: 42px;
                    }
                    &::placeholder{
                        color: var(--main_gradient-color);
                    }
                }
                .btn{
                    position: absolute;
                    right: 0;
                    top: 0;
                    height: 80px;
                    width: 180px;
                    border-radius:0 80px 80px 0;
                    border: none;
                    background: linear-gradient(98deg, transparent 15px, var(--main-color) 0);
                    color: #fff;
					font-size: 32px;
					font-weight: 600;
                }
            }
           
        }
        &-gamelist{
            margin-top: 30px;
            padding: 0 24px;
        }
        &-prompt{
            border: 1px solid var(--borderColor-5);
            .box{
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                color: var(--text_color_L1);
                font-weight: 600;
				background: var(--bg_color_L3);
				.svg{
                    width:60px;
                    height:60px;
                    display: block;
                    margin-right: 20px;
                }
            }
        }
        .PreSaleRule {
            width: 528px;
        
            .head {
                height: 90px;
                line-height: 90px;
                color: #fff;
                font-size: 30px;
                text-align: center;
                background: var(--main_gradient-color);
            }
        
            .body {
                max-height: 600px;
                overflow-y: auto;
                padding: 30px;
                font-size: 24px;
                line-height: 60px;
        		color:var(--text_color_L2);
                :deep(p) {
                    margin-bottom: 15px;
                    line-height: 40px;
                }
            }
        
            .foot {
                height: 140px;
                display: flex;
                justify-content: center;
                align-items: center;
        
                .btn {
                    width: 60%;
                    background: var(--main_gradient-color);
                    border-radius: 40px;
                    height: 70px;
                    line-height: 70px;
                    text-align: center;
                    font-size: 28px;
                    color: #fff;
                }
            }
        }
    }
</style>