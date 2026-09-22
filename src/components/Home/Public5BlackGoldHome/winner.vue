<template>
    <div class="winner_91">
        <div class="winner_91-wrapper">
            <div class="head">
                <div>{{ $t('winningDetal') }}</div>
            </div>
            <div class="body" ref="wrapperRef">
                <div class="winner_91-wrapper__item" v-for="item in getWinInfo.slice(0, 10)" :key="JSON.stringify(item)" @click="onWinInfoClick(item)">
                    <div class="game">
						<img :src="item['imgUrl']" alt="" />
					</div>
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
		height:316px;
		background-image:url('@/assets/p5BlackGoldStyle/icons/home/wardInfo.png');
		background-size:100%;
		background-repeat: no-repeat;
		margin-bottom:16px;
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
			//height: 316px;
            border-radius: 10px;
            overflow: hidden;
            font-family: "Alibaba PuHuiTi 3.0";
            font-size: 24px;
            .head {
                display: flex;
				justify-content:center;
                padding:24px 0;
                font-weight: 600;
                font-size:30px;
				color: var(--text_color_L1, #FDE4BC);
            }

            .body {
				display: flex;
				gap: 10px;
				padding: 0 0 0 24px;
				width: calc(750px - 60px);
				overflow: hidden;
            }

            &__item {
                display: flex;
				flex-direction: column;
                align-items: center;
                width: 100%;
                &:last-child {
                    border-bottom: none;
                }
                &>div {
                    overflow: hidden;
                }

                .game {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    img {
                        //width: 100%;
                        height: 135px;
                    }
                }

                .name {
					color: var(--text_color_L2, #B79C8B);
					font-family: Poppins;
					font-size: 20px;
					text-align: left;
                }

                .amount {
					text-align: left;
					color: var(--main-color, #FED358);
					font-family: Poppins;
					font-size: 20px;
                }
            }
        }
    }
</style>
