<template>
    <div class="winner_91">
        <div class="title"><svg-icon name="91-winner" />{{ $t('winningDetal') }}</div>
        <div class="winner_91-wrapper">
            <div class="head">
                <div>{{ $t('game') }}</div>
                <div>{{ $t('winner') }}</div>
                <div>{{ $t('winningAmount') }}</div>
            </div>
            <div class="body" ref="wrapperRef">
                <div class="winner_91-wrapper__item" v-for="item in getWinInfo.slice(0, 10)" :key="JSON.stringify(item)" @click="onWinInfoClick(item)">
                    <div class="game"><svg-icon name="91-winner" />{{ item.typeName.replace('_',' ') }}</div>
                    <div class="name">{{ desensitizeString(item['nickName']) }}</div>
                    <div class="amount">{{ currency(item['amount'] || 0) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'
    import { currency, desensitizeString } from '@/utils'
    import autoAnimate from '@formkit/auto-animate'
    import { WinInfoType, useHome } from '@/hooks'
    const { homeState, getWinInfoDetail, getWinInfo, onWinInfoClick } = useHome()
    const timer = ref(null as unknown as NodeJS.Timeout)
    const wrapperRef = ref<HTMLElement>(null as unknown as HTMLElement)
    onMounted(async () => {
        await getWinInfoDetail()
        autoAnimate(wrapperRef.value as any)
        if (homeState.winInfoList.length > 0) {
            timer.value = setInterval(async () => {
                homeState.winInfoList.unshift(homeState.winInfoList.pop() as WinInfoType)
            }, 3000)
        }
    })
    onUnmounted(() => {
        clearInterval(timer.value)
    })
</script>

<style lang="scss" scoped>
    .winner_91 {
        color: #1E2637;

        .title {
            height: 40px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 24px;
            font-family: "Alibaba PuHuiTi 3.0";

            svg {
                width: 40px;
                height: 40px;
            }
        }

        &-wrapper {
            height: fit-content;
            border-radius: 10px;
            overflow: hidden;
            font-family: "Alibaba PuHuiTi 3.0";
            font-size: 24px;
            border-radius: 24px;
            background: #FFF;
            box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);

            .head {
                display: flex;
                padding: 32px 24px 24px 24px;
                border-bottom: 2px solid #F1F2F4;
                font-weight: 500;
                font-size: 28px;
                color: #1E2637;
                &>div {
                    flex: 1;

                    &:nth-child(2) {
                        text-align: center;
                    }

                    &:nth-child(3) {
                        text-align: end;
                    }
                }
            }

            .body {
                padding: 0 24px 24px 24px;
            }

            &__item {
                display: flex;
                align-items: center;
                width: 100%;
                height: 88px;
                border-bottom: 2px solid #F1F2F4;
                &:last-child {
                    border-bottom: none;
                }
                &>div {
                    flex: 1;
                    overflow: hidden;
                }

                .game {
                    display: flex;
                    align-items: center;
                    gap: 18px;

                    svg {
                        width: 40px;
                        height: 40px;
                    }
                }

                .name {
                    color: #7D889D;
                    text-align: center;
                }

                .amount {
                    text-align: end;
                    color: #FB5755;
                }
            }
        }
    }
</style>
