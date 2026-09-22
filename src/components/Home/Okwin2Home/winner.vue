<template>
    <div class="ok_winner">
        <div class="title">{{ $t('winningDetal') }}</div>
        <div class="ok_winner-wrapper">
            <div ref="wrapperRef">
                <div class="ok_winner-wrapper__item" v-for="item in getWinInfo.slice(0, 6)" :key="item as any" @click="onWinInfoClick(item)">
                    <img v-lazy="item.imgUrl" />
                    <div class="info">
                        <div class="name">
                            <img v-lazy="getAvatarUrl(item.userPhoto) || defaultAvatar"  />{{ desensitizeString(item['nickName']) }}
                        </div>
                        <div>
                            {{ $t('winningAmount') }}<span class="amount">{{ currency(item['amount'] || 0) }}</span>
                        </div>
                    </div>
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
import { useAssets } from '@/hooks/useAssets'

const { getAvatarUrl, defaultAvatar } = useAssets()
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
.ok_winner {
    color: var(--text_color_L1);
    margin-top: 40px;
    .title {
        color: var(--text_color_L1, #e3efff);
        font-family: Poppins;
        font-size: 28px;
        font-style: normal;
        font-weight: 600;
        height: 42px;
        display: flex;
        align-items: center;
        margin: 40px 0 20px 0;
        padding-inline-start: 52px;
        gap: 12px;
        background-image: url('./assets/icon_win.svg');
        background-repeat: no-repeat;
        background-size: 40px;
    }

    &-wrapper {
        height: calc((140px * 5) - 1px);
        border-radius: 10px;
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid var(--bg_HomeModule_Stroke, #224ba2);
        background: var(--bg_HomeModule_Padding, linear-gradient(180deg, #001c54 0%, #000c33 100%));
		padding: 0 20px;
        &__item {
            display: flex;
            align-items: center;
            width: 100%;
            height: 140px;
            padding: 20px 18px;
            border-bottom: 1px solid var(--Dividing-line_color);
            gap: 16px;
            img {
                width: 72px;
                height: 92px;
                object-fit: contain;
                object-position: center;
            }
            .info {
                flex: 1;
                & > div {
                    display: flex;
                    height: 30px;
                    font-size: 24px;
                    color: var(--text_color_L2);
					gap: 8px;
                    & + div {
                        margin-top: 18px;
                    }
                }
                .name {
                    color: var(--text_color_L1);
					font-size: 26px;
					display: flex;
					align-items: center;
					gap: 12px;
					img {
						border-radius: 50%;
						width: 48px;
						height: 48px;
					}
                }
                .amount {
                    color: var(--main-color);
                }
            }
        }
    }
}
</style>
