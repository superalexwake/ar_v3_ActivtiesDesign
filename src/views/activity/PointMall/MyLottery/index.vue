<template>
    <div class="myLottery__container">
        <NavBar :title="$t('mydraw')" z-index="99" fixed left-arrow @click-left="onClick" />

        <van-tabs
            v-model:active="pointTabActive"
            line-width="0"
            line-height="0"
            title-active-color="#fff"
            title-inactive-color="#fff"
        >
            <van-tab v-for="(item, index) in myPointTabs" :name="item.value" :key="index" :title="item.label" />
        </van-tabs>
        <List
            :distance="300"
            :api="GetPointsLotteryOrderList"
            v-model:list="myPointList"
            v-model:page-query="myPointQuery"
            :isAutoLoad="true"
            ref="listRef"
        >
            <template #content>
                <div class="myLottery__container-products">
                    <div class="myLottery__container-products__item" v-for="(item, index) in myPointList">
                        <div class="myLottery__container-products__item-header">
                            <div class="myLottery__container-products__item-header__left">
                                <span
                                    :style="{
                                        background: getStatusBackground(item.orderInfo.orderStatus, 1)
                                    }"
                                    >{{ getStatus(item.orderInfo.orderStatus) }}</span
                                >
                                <span
                                    :style="{
                                        background: getStatusBackground(item.orderInfo.orderStatus, 2)
                                    }"
                                    >{{ getStatus(item.orderInfo.orderStatus) }}</span
                                >
                                <img v-lazy="images(item.lotteryInfo)[0]" />
                            </div>
                            <div class="myLottery__container-products__item-header__right">
                                <h1>{{ item.lotteryInfo.name }}</h1>
                                <div>{{ $t('betNumber') }}: {{ item.lotteryInfo.issueNumber }}</div>
                                <div>
                                    <span class="left"> {{ item.lotteryInfo.redeemedNumber }} </span>/{{
                                        item.lotteryInfo.totalNumber
                                    }}
                                    {{ $t('sheets') }}
                                    <span class="right">
                                        <svg-icon name="point" />
                                        {{ item.lotteryInfo.unit }}.00
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="myLottery__container-products__item-footer">
                            <div class="myLottery__container-products__item-footer__header">
                                <div>
                                    {{ $t('gross') }}<span>{{ item.ticketsInfo.length }}</span
                                    >{{ $t('raffleticket') }}
                                </div>
                                <div>
                                    <svg-icon name="point" />
                                    {{ item.ticketsInfo.length * item.lotteryInfo.unit }}
                                </div>
                            </div>
                            <div class="myLottery__container-products__item-footer__body">
                                <div
                                    class="myLottery__container-products__item-footer__body-item"
                                    v-for="subItem in item.ticketsInfo"
                                    :key="index"
                                >
                                    <svg-icon name="ticket" />
                                    <span>
                                        {{ subItem.ticketNumber }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            class="myLottery__container-products__item-button"
                            :class="{ boxShadow4px: true }"
                            v-if="item.orderInfo.orderStatus === 2 && item.orderInfo.shippingStatus == 0"
                            @click="onReceiveClick(item.lotteryInfo.pointsLotteryID, item.orderInfo.pointsLotteryOrdersID)"
                        >
                            <span> {{ $t('claimtreasure') }} </span>
                        </div>
                        <div
                            class="myLottery__container-products__item-button"
                            :class="{ boxShadow4px: false }"
                            v-if="item.orderInfo.shippingStatus > 0 && item.orderInfo.orderStatus === 2"
                        >
                            <span> {{ $t('claimed') }} </span>
                        </div>
                    </div>
                </div>
            </template>
        </List>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { currency } from '@/utils'
import { useI18n } from 'vue-i18n'
import { usePointLottery } from '@/hooks'
import { GetPointsLotteryOrderList } from '@/api'
import List from '@/components/common/List.vue'

const { t: $t } = useI18n()

const router = useRouter()
const { myPointTabs, pointTabActive, myPointList, myPointQuery, listRef, pointRest } = usePointLottery()

const images = (item: any) => [item.img_Five, item.img_Four, item.img_One, item.img_Three, item.img_Two].filter(Boolean)

function onClick() {
    router.back()
}
watch(pointTabActive, () => {
    myPointQuery.value.orderStatus = pointTabActive.value
    pointRest()
    listRef.value.resetRefresh()
})
function getStatusBackground(isOngoing: number, type: number) {
    if (type === 1) {
        switch (isOngoing) {
            case 0:
                return 'linear-gradient(270deg, #FF5353 27.64%, #FF4141 91%, #FF9495 96.88%, #EB2426 100%)'
            case 2:
                return 'linear-gradient(270deg, #FABB2A 18.36%, #EB9315 89.84%, #FBE571 96.48%, #ED8B19 100%)'
            case 1:
                return 'linear-gradient(270deg, #9FAAD2 18.36%, #A3B0DE 89.84%, #D5E1FF 96.48%, #7884B0 100%)'
        }
    } else {
        switch (isOngoing) {
            case 1:
                return 'linear-gradient(90deg, #BDC9F4 -3.24%, #FFF 4.63%, #C9D5FB 13.43%, #D9E3FF 76.75%)'
            case 2:
                return 'linear-gradient(90deg, #FF9C3A -3.24%, #FFE55C 4.63%, #FFB936 13.43%, #FFF962 76.75%)'
            default:
                return 'linear-gradient(90deg, #FF9C3A -3.24%, #FFE55C 4.63%, #FFB936 13.43%, #FFF962 76.75%)'
        }
    }
}

function getStatus(status: number) {
    switch (status) {
        case 0:
            return $t('ongoing')
        case 2:
            return $t('winTheLottery')
        case 1:
            return $t('winTips4')
    }
}

function onReceiveClick(id: number, orderId: number) {
    router.push({
        name: `PointMall-ReceiveLottery`,
        query: {
            pointsLotteryID: id,
            orderId
        }
    })
}
</script>

<style scoped lang="scss">
.myLottery__container {
    font-family: $font-family;

    .boxShadow4px {
        background: var(--main_gradient-color2);
    }

    :deep(.van-nav-bar) {
        background-color: var(--bg_color_L3);

        .van-nav-bar__content {
            .van-nav-bar__left {
                .van-icon {
                    color: var(--text_color_L1);
                }
            }

            .van-nav-bar__title {
                color: var(--text_color_L1);
            }
        }
    }

    :deep(.van-tabs__nav) {
        background: var(--light-main_gradient-color,var(--bg_color_L3));
    }
    :deep(.van-tabs__line) {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid var(--text_white, var(--text_color_L1));
        background-color: unset !important;
    }

    &-products {
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 30px 12px 0;

        &__item {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 14px;
            border-radius: 10px;
            background: var(--darkBg, var(--bg_color_L2));

            &-header {
                display: flex;
                align-items: stretch;
                gap: 15px;

                &__left {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 0;
                    color: var(--text_color_L1);
                    font-size: 0.75em;
                    border-radius: 10px;
                    width: 320px;
                    height: 240px;
                    background: var(--linerGradien-94, var(--bg_color_L3));

                    & > span {
                        position: absolute;
                        top: 10px;
                        left: 0;
                        padding: 3px 20px 3px 20px;
                        border-top-right-radius: 9rem;
                        border-bottom-right-radius: 9rem;
                        // background: linear-gradient(270deg, #FF5353 18.36%, #FF4141 89.84%, #FF9495 96.48%, #EB2426 100%);
                        z-index: 2;
                        html:lang(ar) & {
                            left: unset;
                            right: 0;
                        }

                        &:last-of-type {
                            top: 7px;
                            padding: 6px 20px 6px 23px;
                            color: transparent;
                            white-space: nowrap;
                            // background: linear-gradient(90deg, #FF9C3A -3.24%, #FFE55C 4.63%, #FFB936 13.43%, #FFF962 76.75%);
                            z-index: 1;
                        }
                    }

                    & > img {
                        width: 212px;
                        height: 212px;
                    }
                }

                &__right {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    font-size: 0.75rem;

                    h1 {
                        margin-bottom: 30px;
                        font-size: 28px;
                        font-weight: 600;
                        color: var(--text_color_L1);

                        & > span {
                            color: var(--main-color);
                        }
                    }

                    & > div {
                        display: flex;
                        align-items: center;
                        padding: 16px 10px;
                        color: #8c90a9;
                        border-radius: 10px;
                        background-color: var(--bg_color_L3);
                        font-size: 22px;
						
                        svg {
                            width: 24px;
                            height: 24px;
                            margin-inline-end: 3px;
                        }

                        &:last-of-type {
                            span {
                                font-size: 28px;
                            }

                            span.left {
                                color: var(--text_color_L1);
                            }

                            span.right {
                                position: relative;
                                display: flex;
                                align-items: baseline;
                                margin-left: auto;
								column-gap: 12px;
                                color: var(--norm_secondary-color);

                                &::before {
                                    content: '';
                                    position: absolute;
                                    left: -25%;
                                    width: 1px;
                                    padding-block: 7px;
                                    background: #bdcadd;
                                    html:lang(ar) & {
                                        left: unset;
                                        right: -25%;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            &-footer {
                color: var(--text_color_L1);
                font-size: 26px;
                border-radius: 10px;
                background: var(--bg_color_L1);
                overflow: hidden;

                &__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 10px;
                    background: var(--light-main_gradient-color,var(--bg_color_L3));
                    font-size: 30px;

                    svg {
                        width: 30px;
                        height: 30px;
                        flex-shrink: 0;
                    }

                    & > div {
                        display: flex;
                        align-items: center;
						column-gap: 10px;
                        color: var(--text_white, var(--text_color_L1));
                        &:last-of-type {
                            margin-inline-start: 50px;
                            color: var(--text_white,var(--text_color_L1));
                        }
                    }
                }

                &__body {
                    display: flex;
                    flex-wrap: wrap;
                    row-gap: 0.5rem;
                    padding: 20px 5px;

                    &-item {
                        flex: 40%;
                        display: flex;
                        align-items: center;
                        font-size: 26px;

                        svg {
                            width: 78px;
                            height: 42px;
                            margin-right: 5px;
                        }
                    }
                }
            }

            &-button {
                width: 100%;
                margin-block: 20px;
                color: var(--text_color_L1);
                text-align: center;
                border-radius: 9rem;
                height: 70px;
                line-height: 70px;
                font-size: 30px;
                background: var(--main_gradient-color);
            }
        }

        &__empty {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding-top: 6rem;
            color: var(--text_color_L2);
            font-size: 0.875rem;

            img {
                width: 150px;
                max-width: 300px;
            }
        }
    }
}
</style>
