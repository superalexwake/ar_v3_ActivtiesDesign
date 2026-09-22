<template>
    <div class="my_r">
        <div class="my_r-body">
            <div v-if="mayrecord.length" class="list">
				<ResultItem v-for="(item) in mayrecord" :key="item?.orderNo" :info="item"/>
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
import { ref, onActivated, onDeactivated,watch,onMounted } from 'vue'
import { Empty } from '@/saasLottery/components'
import ResultItem from './ResultItem.vue';
import { getLotteryRecord } from '@/saasLottery/api'
import { useGlobalContext } from '@/saasLottery/hooks'
const { gameCode, trigger } = useGlobalContext()
const totalPage = ref(4)
const pageSize = ref(10)
const pageNo = ref(1)
const mayrecord = ref<any>([])
const loading=ref(false)

watch(()=>gameCode.value,(value)=>{
	if(value){
		getData()
	}
})

// 上一页
const pPage = () => {
    pageNo.value--
    getData()
}
// 下一页
const nPage = () => {
    pageNo.value++
    getData()
}

// 获取参数
const getData = async () => {
	try {
		mayrecord.value =[]
		loading.value = true
		const { result, data } = await getLotteryRecord({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			gameCode: gameCode.value
		})
		if (result) {
			mayrecord.value = data?.list || []
			totalPage.value = data?.totalPage || 0
		}
	}catch (e){

	}finally {
		loading.value = false
	}
}

const lock = ref(false)

onDeactivated(() => {
    lock.value = true
    trigger.reset()
})
onMounted(() => {
	getData()
})
onActivated(() => {
    lock.value = false
    getData()
    trigger.on(() => {
        getData()
    })
})
</script>
<style lang="scss" scoped>
.my_r {
    padding-bottom: 20px;
    &-body {
        padding: 0 20px 10px 20px;
        margin-bottom: 36px;
        background:var(--darkBg, var(--bg_color_L2));

        .list {
            & > div {
                //border-bottom: 0.01333rem solid #e1e1e1;
                //& + div {
                //  border-top: 1px solid #e1e1e1;
                //}
            }
            & > div:last-child {
                border-bottom: none;
            }
            &-item {
                height: 132px;
                display: flex;
                align-items: center;

                &-l {
                    height: 72px;
                    width: 72px;
                    line-height: 72px;
                    text-align: center;
                    border-radius: 20px;
                    color: #fff;
                    font-size: 48px;
                    margin-right: 22px;
                    flex: none;
                    overflow: hidden;
                    & > div {
                        height: 100%;
                        width: 100%;
                    }
                    &-red,
                    &-2,
                    &-4,
                    &-6,
                    &-8 {
                        background-color: var(--norm_red-color);
                    }

                    &-violet {
                        background-color: var(--norm_Purple-color);
                    }

                    &-green,
                    &-1,
                    &-3,
                    &-7,
                    &-9 {
                        background-color: var(--norm_green-color);
                    }

                    &-0 {
                        background-image: linear-gradient(
                            to bottom right,
                            var(--norm_red-color) 50%,
                            var(--norm_Purple-color) 0
                        ) !important;
                    }

                    &-5 {
                        background-image: linear-gradient(
                            to bottom right,
                            var(--norm_green-color) 50%,
                            var(--norm_Purple-color) 0
                        ) !important;
                    }

                    &-small {
                        background: var(--norm_bule-color);
                        font-size: 24px;
                    }

                    &-big {
                        background: var(--norm_secondary-color);
                        font-size: 24px;
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
                        color: var(--darkTextW, var(--text_color_L1));
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
                        border-radius: 10px;
                        height: 36px;
                        line-height: 36px;
                        font-size: 22px;
                        padding: 0 36px;
                        margin-bottom: 6px;
                    }

                    &.success {
                        color: #13c164;
                        div {
                            color: var(--norm_green-color);
                            border-color: var(--norm_green-color);
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
                    color: #f8b460;
                }

                &.small {
                    color: #609dec;
                }

                &.green {
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
                &-text {
                    font-size: 28px;
                    color: var(--darkTextW, var(--text_color_L1));
                    font-weight: 500;
                    line-height: 39px;
                    padding-bottom: 12px;
                }

                &-copy {
                    svg {
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
                    font-size: 28px;
                    border-radius: 10px;
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;

                    & > span {
                        color: var(--text_color_L1);
                    }

                    & > div {
                        display: flex;
                        align-items: center;
                    }

                    img {
                        width: 30px;
                        height: 30px;
                        margin-left: 5px;
                    }

                    .red {
                        color: var(--norm_red-color);
                    }

                    .green {
                        color: var(--norm_green-color);
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
        padding: 0 178px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--darkBg, var(--bg_color_L2));
        margin-bottom: 70px;

        &-page {
            font-size: 24px;
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
                background:var(--bg_color_L3);
                pointer-events: none;
                color: var(--text_color_L2);
            }
        }
    }
}
</style>
