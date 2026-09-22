<template>
    <div class="t">
        <!-- 类型切换 -->
        <div class="t-outBox">
            <div class="t-head">
                <div
                    v-for="(item, index) in checkBox"
                    :key="index"
                    :class="{ active: checkData.name == `${item}` }"
                    @click="checkShow(item, index)"
                >
                    {{ item }}
                </div>
            </div>
            <!--投注助手-->
            <div class="t-b1">
                <div class="t-b1-l w">
                    <!--            <span class="w">{{ $t('w8') }}</span>-->
                    <!--            <span>{{$t('w9')}}</span>-->
                    <span>{{ $t('trendDesc1') }}</span>
                </div>
                <!--        <div class="t-b1-l lottery">-->
                <!--          <div>{{$t('w11')}}</div>-->
                <!--          <div class="t-b1-l-n">-->
                <!--            <div v-for="item in 10" :key="item">{{ item - 1 }}</div>-->
                <!--          </div>-->
                <!--        </div>-->
                <div class="t-b1-l">
                    <div>{{ $t('trendDesc3') }}</div>
                    <div class="t-b1-l-n">
                        <div v-for="(item, r4I) in statistics.slice(0, 10)" :key="'4' + r4I">{{ item.missingCount }}</div>
                    </div>
                </div>
                <div class="t-b1-l">
                    <div>{{ $t('trendDesc4') }}</div>
                    <div class="t-b1-l-n">
                        <div v-for="(item, r2I) in statistics.slice(0, 10)" :key="'2' + r2I">{{ item.avgMissing }}</div>
                    </div>
                </div>
                <div class="t-b1-l">
                    <div>{{ $t('trendDesc5') }}</div>
                    <div class="t-b1-l-n">
                        <div v-for="(item, r5I) in statistics.slice(0, 10)" :key="'5' + r5I">{{ item.openCount }}</div>
                    </div>
                </div>
                <div class="t-b1-l">
                    <div>{{ $t('trendDesc6') }}</div>
                    <div class="t-b1-l-n">
                        <div v-for="(item, r3I) in statistics.slice(0, 10)" :key="'3' + r3I">{{ item.maxContinuous }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="t-new">
            <div class="Trend__C-head">
                <van-row>
                    <van-col span="9">{{ $t('betIssue') }}</van-col>
                    <van-col span="15">{{ $t('number') }}</van-col>
                </van-row>
            </div>

            <div class="t-b2">
                <div
                    v-for="(item, index) in ChartList"
                    :key="index"
                    :IssueNumber="item.issueNumber"
                    :Number="item.number"
                    :Colour="item.colour"
                    :rowId="item.rowId"
                    class="t-b2-item"
                >
                    <van-row>
                        <van-col span="9">
                            <div class="t-b2-i">{{ item.issueNumber }}</div>
                        </van-col>
                        <van-col span="15">
                            <div class="t-b2-Num">
                                <canvas canvas :id="'myCanvas' + index" ref="canvas" class="line-canvas"></canvas>
                                <div
                                    class="t-b2-Num-item"
                                    :class="{ action: Number(item.number) == num - 1 }"
                                    v-for="num in 10"
                                    :key="num"
                                >
                                    {{ num - 1 }}
                                </div>
                                <div class="t-b2-Num-BS" :class="{ isB: Number(item.number) > 4 }">
                                    {{ Number(item.number) > 4 ? 'B' : 'S' }}
                                </div>
                                <div class="t-b2-Num-OE" :class="{ isE: Number(item.number) % 2 }">
                                    {{ Number(item.number) % 2 ? 'O' : 'E' }}
                                </div>
                            </div>
                        </van-col>
                    </van-row>
                </div>
                <div class="flex-center t-b2-loading" style="height: 100%" v-if="loading">
                    <van-loading type="spinner" color="#FD565C" />
                </div>
                <div v-if="ChartList.length === 0 && !loading" class="t-b2-empty flex-center">
                    <Empty />
                </div>
            </div>
        </div>

        <div v-if="ChartList.length" class="t-foot">
            <div class="t-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
                <van-icon name="arrow-left" class="t-icon" size="20" />
            </div>
            <div class="t-foot-page">{{ pageNo }}/{{ totalPage }}</div>
            <div class="t-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
                <van-icon name="arrow" class="t-icon" size="20" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed, onMounted, onActivated } from 'vue'
import { Empty } from '@/saasLottery/components'
import {
    getLotteryTrendStatistics,
    GetHistoryIssuePageRsp,
    getLotteryHistoryIssue,
    GetTrendStatisticsRsp
} from '@/saasLottery/api'
import { useD5Context } from '@game/D5/hooks/useD5'
import { useDebounceFn } from '@vueuse/core'
const { historyIssues, gameCode, historyIssuesTotalPage } = useD5Context()
const statistics = ref<Record<string, any>[]>([])
const pageNo = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const totalPage = ref(historyIssuesTotalPage.value)

const checkBox = ref(['A', 'B', 'C', 'D', 'E'])
const checkData = ref({
    name: checkBox.value[0],
    index: 1
})

const checkShow = async (data: any, index: number) => {
    checkData.value.name = data
    checkData.value.index = index + 1
    await getTrend(checkData.value.index)
}
const InitList = ref<GetHistoryIssuePageRsp[]>([])
const ChartList = computed(() => {
    const list = InitList.value.length ? InitList.value : historyIssues.value
    return list.map((item: GetHistoryIssuePageRsp) => {
        return {
            ...item,
            number: item?.premium?.split('')[checkData.value.index - 1]
        }
    })
})

// 遍历元素，划线
function getReport() {
    nextTick(() => {
        for (let i = 0; i < ChartList.value.length; i++) {
            if (ChartList.value[i + 1]) {
                getCanvas(i, ChartList.value[i], ChartList.value[i + 1])
            }
        }
    })
}
// canvas画图
function getCanvas(a: number, el: any, number: any) {
    //获取Canvas对象(画布)
    const currentNum = parseInt(el.number) //当前
    const termNum = parseInt(number.number) //上一期
    const canvas: any = document.getElementById('myCanvas' + a)
    //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height) //清除画线从新画
        ctx.beginPath()
        //定义直线的起点坐标为(10,10)
        ctx.moveTo(currentNum == 0 ? 14 : currentNum * 27 + 14, 0)
        //定义直线的终点坐标为(50,10)
        ctx.lineTo(termNum == 0 ? 14 : termNum * 27 + 14, canvas.height)
        ctx.strokeStyle = 'red'
        //沿着坐标点顺序的路径绘制直线
        ctx.stroke()
        // //关闭当前的绘制路径
        ctx.closePath()
    }
}
// 上一页
const pPage = () => {
    if (pageNo.value < 2) {
        return
    }
    pageNo.value--
    getData()
}
// 下一页
const nPage = () => {
    pageNo.value++
    if (pageNo.value > totalPage.value) return
    getData()
}

const getTrend = async (d: number) => {
    const { result, data } = await getLotteryTrendStatistics({
        gameCode: gameCode.value,
        pageNo: pageNo.value,
        pageSize: 10
    })

    if (result) {
        statistics.value = data?.filter((item: GetTrendStatisticsRsp) => {
            return item?.position === d
        })
    }
}

// 获取开奖相关数据
const getData = async () => {
    loading.value = true
    try {
        const { result, data } = await getLotteryHistoryIssue({
            gameCode: gameCode.value,
            pageNo: pageNo.value,
            pageSize: pageSize.value
        })
        if (result) {
            InitList.value = data?.list || []
            pageNo.value = data.pageNo || 1
            totalPage.value = data.totalPage || 0
        }
    } catch (e) {
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    if (ChartList.value.length) {
        getReport()
    }
    await getTrend(checkData.value.index)
})

onActivated(() => {
    nextTick(() => getReport())
})

// 创建防抖的异步函数
const debouncedUpdate = useDebounceFn(async () => {
    try {
        getReport()
        await getTrend(checkData.value.index)
    } catch (error: any) {
        if (error?.name === 'CanceledError') {
            console.log('Request canceled')
            return
        }
        console.error('Error in watch handler:', error)
    }
}, 300)

watch(
    ChartList,
    () => {
        debouncedUpdate()
    },
    { deep: true }
)
</script>
<style lang="scss" scoped>
.t {
    width: 100%;
    text-align: center;
    font-size: 24px;
    padding-bottom: 24px;

    &-outBox {
        background-color: var(--darkBg, var(--bg_color_L2));
        box-shadow: var(--boxShadowColor-35);
        margin: 24px 24px 38px 24px;
        padding: 20px;
        border-radius: 20px;
    }

    &-new {
        margin: 24px;
    }

    .Trend__C-head {
        height: 80px;
        line-height: 80px;
        background: var(--sheet_nva_color);
        border-radius: 10px 10px 0px 0px;
        font-weight: 700;
        font-size: 26px;
        color: #fff;
    }

    &-head {
        display: flex;
        border-bottom: 1px solid var(--Dividing-line_color);
        overflow: hidden;
        & > div {
            width: 80px;
            height: 80px;
            line-height: 80px;
            background: var(--bg_color_L3);
            font-size: 36px;
            font-weight: 700;
            color: var(--text_color_L2);
            border-radius: 19px 19px 0 0;
            position: relative;
            margin-right: 20px;
            text-align: center;
            border-radius: 19px 19px 0 0;

            &:last-child {
                font-size: 32px;
            }

            &.active {
                background-color: var(--main-color);
                color: var(--text_color_L4);
                &::after {
                    background: radial-gradient(circle at 100% 0, var(--bg_color_L2) 20px, var(--main-color) 20px);
                }

                &::before {
                    content: '';
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    bottom: 0;
                    left: -20px;
                    z-index: 9;
                    html:lang(ar) & {
                        right: -20px;
                        left: unset;
                    }
                }
            }

            &::after {
                content: '';
                width: 20px;
                height: 20px;
                position: absolute;
                bottom: 0;
                right: -20px;
                z-index: 9;
                background: var(--linerGradient-70);
                html:lang(ar) & {
                    left: -20px;
                    right: unset;
                }
            }
        }
    }

    &-b1 {
        background: var(--bgDark-2, var(--bg_color_L2));
        //padding-bottom: 28px;
        &-l {
            display: flex;
            font-size: 26px;
            color: var(--text_color_L1);
            height: 31px;
            align-items: center;
            .w {
                font-weight: 500;
                font-size: 28px;
            }

            & > div {
                &:first-child {
                    width: 278px;
                    //padding-left: 20px;
                    text-align: left;
                }
            }

            &-n {
                display: flex;
                justify-content: space-between;
                flex: 1;
                padding-right: 15px;

                & > div {
                    width: 36px;
                    height: 36px;
                    line-height: 36px;
                    font-size: 26px;
                    color: #9da7b3;
                    text-align: center;
                }
            }

            &.lottery {
                .t-b1-l-n {
                    & > div {
                        border-radius: 50%;
                        border: 1px solid #fd565c;
                        color: #fd565c !important;
                    }
                }
            }
            & + .t-b1-l {
                margin-top: 20px;
            }

            &:first-child {
                padding-top: 26px;
                height: 57px;
                //padding-left: 20px;
            }

            &-lottery {
                height: 36px;
            }
        }
    }

    &-b2-item:first-child {
        //border-top: 1px solid #e1e3f2;
    }
    &-b2 {
        position: relative;
        font-size: 24px;
        background-color: var(--bg_color_L2, var(--text_color_L1));
        padding: 0 10px;
        &-item {
            height: 100px;
            padding: 34px 0;
            border-bottom: 0.01333rem solid #e1e3f2;
        }
        &-empty {
            height: 400px;
        }
        &-loading {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
        }

        &-i {
            color: var(--text_color_L1);
            text-align: left;
        }

        &-Num {
            display: flex;
            position: relative;
            height: 32px;

            & > div {
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-radius: 50%;
            }

            &-item {
                border: 1px solid #e1e3f2;
                color: #bbb;
                margin-right: 5px;

                &.action {
                    position: relative;
                    z-index: 10;
                    border: none;
                    color: var(--text_white);
                    background: var(--norm_red-color);
                }
            }

            &-BS {
                color: #fff;
                border: 1px solid #6ea8f4;
                background-color: #6ea8f4;
                margin-left: 12px;

                &.isB {
                    border: 1px solid #feaa57;
                    background: #feaa57;
                    color: #fff;
                }
            }

            &-OE {
                color: #fff;
                border: 1px solid var(--norm_green-color);
                background-color: var(--norm_green-color);
                margin-left: 6px;

                &.isE {
                    background: var(--norm_red-color);
                    border: 1px solid var(--norm_red-color);
                    color: #fff;
                }
            }
        }

        .line-canvas {
            position: absolute;
            top: 50%;
            left: 0;
            height: 100px;
            width: calc(100% - 48px);
            z-index: 9;
            html:lang(ar) & {
                left: unset;
                right: 0;
                transform: scaleX(-1);
            }
        }
    }

    &-foot {
        height: 140px;
        color: #323536;
        padding: 24px 178px;
        background: var(--bg_color_L2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24px;
        &-page {
          color: var(--text_color_L2);
        }
        &-previous,
        &-next {
            width: 70px;
            height: 70px;
            border-radius: 10px;
            background: var(--main-color);
            color: var(--text_color_L4);
            display: flex;
            align-items: center;
            justify-content: center;

            &.disabled {
                background: var(--bg_color_L3);
                pointer-events: none;
                color: var(--text_color_L2);
            }
        }
    }
}
</style>
