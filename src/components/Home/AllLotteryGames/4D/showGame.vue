<template>
    <div class="gameBox" v-if="myHistory?.list.length > 0">
        <div class="items">
            <template v-for="(item, index) in myHistory.list">
                <div class="itemBox" :class="{ active: showIndex === index }">
                    <div class="item" @click="onOrder(index)">
                        <div class="left">
                            <div class="name" :class="{bold:showIndex === index}">{{ $t(`d4LType${item.type}`) }}</div>
                            <div class="time">{{ item.createTime }}</div>
                        </div>
                        <div class="right">
                            <div class="state" :class="`state${item.state}`">{{ setState(item.state) }}</div>
                            <div class="amount" :class="item.state==3?'green':'red'" v-if="[2, 3].includes(item.state)">{{ item.profitAmount }}</div>
                        </div>
                    </div>
                    <div class="info" v-if="showIndex === index">
                        <div class="order">
                            <div class="li" @click="copy(item.orderNumber)">
                                <span>
									<svg-icon name="Circle1" class="svg1" />
									{{ $t('orderNo') }}
								</span>
                        		<h6 class="copy">
									{{ item.orderNumber }}
									<i><svg-icon name="copy" class="svg2" /></i>
								</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li" @click="copy(item.issueNumber)">
                                <span>
									<svg-icon name="Circle2" class="svg" />
									{{ $t('betNumber') }}
								</span>
                                <h6 class="copy">
									{{ item.issueNumber }}
									<svg-icon name="copy" class="svg2" />
								</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span>
									<svg-icon name="Circle2" class="svg" />
									{{ $t('ColorSpecies') }}
								</span>
                                <h6 class="otherTip">{{ $t(`d4LType${item.type}`) }}</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span>
									<svg-icon name="Circle2" class="svg" />
									{{ $t('gamePlay') }}
								</span>
                                <h6 class="otherTip">{{ $t(`d4gamePay${item.gameType}`) }}</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span>
									<svg-icon name="Circle2" class="svg" />
									{{ $t('betAmounts') }}
								</span>
                                <h6 class="otherTip">{{ currency(item.amount) }}</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span><svg-icon name="Circle2" class="svg" />
									{{ $t('xosoTxt79') }}</span>
                                <h6 class="otherTip">{{ item.betNumber }} {{ $t('note') }}</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span><svg-icon name="Circle2" class="svg" />{{ $t('multiple') }}</span>
                                <h6 class="otherTip">{{ item.multiple }}</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span><svg-icon name="Circle2" class="svg" />{{ $t('xosoTxt78') }}</span>
                            </div>
                            <div class="type">
                                <template v-for="i in item.betType.split(',')">
                                    <span>{{ $t(`d4gameType${i}`) }}</span>
                                </template>
                            </div>
                            <div class="line1">
                                <p></p>
                            </div>
                        </div>
                        <div class="order">
                            <template v-if="item.betMethod == 1">
                                <div class="li">
                                    <span class="numTit"><svg-icon name="Circle1" class="svg1" />{{ $t('bettingnumber') }} ({{ $t('EnterBet') }}) </span>
                                </div>
                                <div class="num type">
                                    <span>{{ item.betContent }}</span>
                                </div>
                            </template>
                            <template v-if="item.betMethod == 2">
                                <div class="li">
                                    <span class="numTit"><svg-icon name="Circle1" class="svg1" />{{ $t('bettingnumber') }} ({{ $t('SelectBet') }})</span>
                                </div>
                                <div class="num select">
                                    <div v-for="(i, index) in item.betContent.split('|')" :key="index">
                                        <h6>{{ tabList[index].name }}</h6>
                                        <div class="n">
                                            <span v-for="(j, index_1) in i.split(',')" :key="index_1">
                                                {{ j }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div class="li">
                                <span><svg-icon name="Circle2" class="svg" />{{ $t('statusMay') }}</span>
                                <h6 class="stateInfo" :class="`state${item.state}`">{{ setState(item.state) }}</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span><svg-icon name="Circle2" class="svg" />{{ $t('winOrLose') }}</span>
                                <h6 class="amountInfo" :class="item.state==3?'green':'red'" v-if="[2, 3].includes(item.state)">{{ item.profitAmount }}</h6>
                                <h6 class="otherTip" v-else>--</h6>
                            </div>
                            <div class="line"></div>
                            <div class="li">
                                <span><svg-icon name="Circle2" class="svg" />{{ $t('createTime') }}</span>
                                <h6 class="otherTip">{{ item.createTime }}</h6>
                            </div>
                        </div>
                        <template v-if="[2, 3].includes(item.state)">
                            <div class="reTitle">{{ $t('betResult') }}</div>
                            <ShowResult :data="item"></ShowResult>
                        </template>
                        <div class="btn" @click="showCancelOrder(item.orderNumber)" v-if="item.state == 1">{{
                            $t('xosoTxt82') }}</div>
                    </div>
                </div>
            </template>
        </div>
        <div class="foot">
            <div class="previous" :class="{ disabled: myHistory.pageNo <= 1 }" @click="pPage">
                <van-icon name="arrow-left" size="20" />
            </div>
            <div class="page">{{ myHistory.pageNo }}/{{ myHistory?.totalPage }}</div>
            <div class="next" :class="{ disabled: myHistory.pageNo >= myHistory?.totalPage }" @click="nPage">
                <van-icon name="arrow" size="20" />
            </div>
        </div>
    </div>
    <Empty v-else />
    <Dialog v-model:show="cancellationShow" :title="$t('xosoTxt99')" @confirm="onCancelOrder()"></Dialog>
</template>
<script setup lang="ts">
import ShowResult from '@/components/Home/AllLotteryGames/4D/showResult.vue'
import Dialog from '@/components/common/Dialog.vue'
import { useI18n } from 'vue-i18n'
import { currency, copy } from '@/utils'
import { useVModels } from '@vueuse/core'
import { ref } from 'vue'
import { use4D } from '@/hooks/use4D.hook'
import Empty from '@/components/Empty/index.vue'
import { showSuccessToast } from 'vant'
interface pageQueryT {
    type: number,
    date: string,
    pageSize: number,
    pageNo: number
}
const props = withDefaults(
    defineProps<{
        pageQuery: pageQueryT
    }>(),
    {
    }
)
const emit = defineEmits(['update:pageQuery'])
const { pageQuery } = useVModels(props, emit);
const { gameCancelOrder, myHistory,tabList, getMy4DHistory } = use4D();
const { t } = useI18n()
const cancellationShow = ref(false)
const orderNumber = ref('')
// 展示详情
const showIndex = ref(-1)
//1待开奖, 2未中奖, 3已中奖4 取消期号5 已撤销6 开奖中
function setState(state: number) {
    switch (state) {
        case 1:
            return t('bettingResultState1')
        case 2:
            return t('bettingResultState3')
        case 3:
            return t('hasWon')
        case 4:
            return t('xosoTxt74')
        case 5:
            return t('xosoTxt75')
        case 6:
            return t('xosoTxt76')
        default:
            return state
    }
}

//处理数据
const pPage = () => {
    pageQuery.value.pageNo--
    showIndex.value = -1
    getMy4DHistory(pageQuery.value)
}
// 下一页
const nPage = () => {
    pageQuery.value.pageNo++
    showIndex.value = -1
    getMy4DHistory(pageQuery.value)
}

const onOrder = (index: number) => {
    if (showIndex.value === index) {
        showIndex.value = -1
    } else {
        showIndex.value = index
    }
}
function showCancelOrder(orderN: string) {
    cancellationShow.value = true
    orderNumber.value = orderN
}
function onCancelOrder() {
    cancellationShow.value = false
    gameCancelOrder({ orderNumber: orderNumber.value })
        .then((res: any) => {
            if (res) {
                showSuccessToast(t('xosoTxt96'))
                getMy4DHistory(pageQuery.value)
            }
        })
        .catch((err) => {
            console.log(err)
        })
}
</script>
<style lang="scss" scoped>
.gameBox {
	margin-top:24px;
    >div {
        background: var(--bg_color_L2);
        border-radius: 10px;
    }
    .items {
        .itemBox.active {
            border-radius: 10px;
            border: 1px solid var(--main-color);
			.item {
                border-bottom: none;
                padding: 30px 20px 0;
            }
        }

		$list: (
			1: var(--norm_bule-color),
			2: var(--norm_red-color),
			3: var(--norm_green-color),
			4: var(--text_color_L1),
			5: var(--text_color_L1),
			6: var(--norm_secondary-color),
		);

        @each $key, $color in $list {
            .state#{$key} {
                color: $color;
            }
        }
        .green{
            color: var(--norm_green-color);
        }
        .red{
            color: var(--norm_red-color);
        }

        .item {
            padding: 30px 20px;
            border-bottom: 1px solid  var(--Dividing-line_color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .name {
                font-size: 28px;
                color: var(--text_color_L1);
                &.bold{
                    font-size: 30px;
                    font-weight: 700;
                }
            }

            .time {
                color: var(--text_color_L2);
                font-size: 24px;
            }

            .state {
                font-size: 28px;
            }

            .amount {
                font-size: 30px;
                font-weight: 700;
            }
        }

        .info {
            margin: 10px 20px 20px;
            border-top: solid 1px var(--Dividing-line_color);
            padding-top: 20px;

            .order {
                .li {
                    display: flex;
                    justify-content: space-between;
                    color: var(--text_color_L2);
                    display: flex;
                    justify-content: space-between;
					align-items: center;
                    >span {
						.svg{
							width:25px;
							height:25px;
							margin-right: 25px;
						}
                    }

                    .numTit {
                        color: var(--text_color_L2);
                        font-size: 28px;
                    }

                    .copy {
                        color: var(--text_color_L1);
						.svg2{
							width:24px;
							height: 24px;
						}
                    }
					.otherTip{
						color: var(--text_color_L1);
					}

                }

                .li:first-child>span {
					.svg1{
						width:25px;
						height:25px;
						margin-right: 25px;
					}
                }

                .line {
                    height: 15px;
                    border-left: dashed 1px var(--main-color);
                    margin-left: 10px;
                }

                .type {
                    padding: 20px 0 20px 35px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 7px;

                    >span {
                        background: var(--bg_color_L3);
                        width: calc((100% / 3) - 7px);
                        text-align: center;
                        color: var(--text_color_L2);
                        font-size: 22px;
                        border-radius: 10px;
                        padding: 10px 0;
                        margin-bottom: 5px;
                    }
                }

                .num {
                    border-left: dashed 1px var(--main-color);
                    margin-left: 10px;

                    >span {
                        width: auto;
                        padding: 10px 20px;
                        color: var(--text_color_L2);
                    }
                }

                .select {
                    padding: 20px 0 20px 35px;

                    >div {
                        display: flex;
                        margin-bottom: 10px;
                        align-items: center;

                        h6 {
                            width: 110px;
                            color: var(--text_color_L2);
                        }

                        .n {
                            width: calc(100% - 110px);
                            display: flex;
                            gap: 10px;
                            flex-wrap: wrap;
                            span {
                                border-radius: 6px;
                                background: var(--bg_color_L3);
                                padding: 2px 14px;
                                text-align: center;
                                color: var(--text_color_L1);
                                font-size: 22px;
                            }
                        }
                    }
                }

                .line1 {
                    margin: 20px -22px;
                    background-color: var(--bg_color_L2);
                    height: 43px;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    >p {
                        width: 85%;
                        border-bottom: 1px dashed var(--Dividing-line_color);
                    }

                    &::after,
                    &::before {
                        content: '';
                        display: block;
                        width: 40px;
                        height: 40px;
                        border-radius: 40px;
                        border: 1px solid var(--main-color);
                        position: absolute;
                        top: 0;
                    }

                    &::after {
                        left: -20px;
                        html:lang(ar) &{
                            right: -20px;
                            left: unset;
                        }
                    }

                    &::before {
                        right: -20px;
                        html:lang(ar) &{
                            left: -20px;
                            right: unset;
                        }
                    }
                }
                .stateInfo{
                    font-size: 26px;
                }
                .amountInfo{
                    font-weight: 700;
					color:var(text_color_L1);
                }
            }

            .reTitle {
                color: var(--text_color_L1);
                font-size: 30px;
                font-weight: 700;
                margin: 20px 0;
            }

        }

        .btn {
            margin: 50px 0 40px;
            background:  var(--main_gradient-color);
            border-radius: 50px;
            color: var(--text_color_L4);
            font-size: 30px;
            
            font-weight: 700;
            text-align: center;
            padding: 10px 0;
        }
    }

    .foot {
        padding: 10px 0;
        margin-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 50px;
        .page {
            color: var(--text_color_L2);
        }

        .previous,
        .next {
            width: 70px;
            height: 70px;
            border-radius: 10px;
            background-color: var(--main-color);
            display: flex;
            align-items: center;
            justify-content: center;

            &.disabled {
                background: var(--bg_color_L3);
                pointer-events: none;
				color:#7F7F7F;
                :deep(.van-icon) {
                    color: var(--saveTextColor-7);
                }
            }

            :deep(.van-icon) {
                color:var(--text_color_L4);
            }
        }
    }

}
</style>