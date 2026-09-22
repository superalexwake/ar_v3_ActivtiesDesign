<template>
    <div class="rank">
        <div class="title"><svg-icon name="91-rank" />{{ $t('earningsRankingToday') }}</div>
        <div class="rank_c">
            <div class="rank_c-topThree">
                <div class="r2"> 
					<template v-if="!isUserPhoto(getTopThree[1].userPhoto)">
						<img src="@public/home/avatar.png" :data-img="defaultAvatar" />
					</template>
					<template v-else>
						<img v-lazy="getAvatarUrl(getTopThree[1].userPhoto)" :data-img="defaultAvatar" />
					</template>
                    <div class="name">{{ desensitizeString(getTopThree[1].nickName) }}</div>
                    <div class="money">{{ currency(getTopThree[1].price) }}</div>
                </div>
                <div class="r1">
					<template v-if="!isUserPhoto(getTopThree[0].userPhoto)">
						<img src="@public/home/avatar.png" :data-img="defaultAvatar" />
					</template>
					<template v-else>
						<img v-lazy="getAvatarUrl(getTopThree[0].userPhoto)" :data-img="defaultAvatar" />
					</template>
                    <div class="name">{{ desensitizeString(getTopThree[0].nickName) }}</div>
                    <div class="money">{{ currency(getTopThree[0].price) }}</div>
                </div>
                <div class="r3">
					<template v-if="!isUserPhoto(getTopThree[2].userPhoto)">
						<img src="@public/home/avatar.png" :data-img="defaultAvatar" />
					</template>
					<template v-else>
						<img v-lazy="getAvatarUrl(getTopThree[2].userPhoto)" :data-img="defaultAvatar" />
					</template>
                    <div class="name">{{ desensitizeString(getTopThree[2].nickName) }}</div>
                    <div class="money">{{ currency(getTopThree[2].price) }}</div>
                </div>
            </div>
            <div class="rank_c-list">
                <div class="rank_c-list__item" v-for="(item, index) in theRest" :key="index">
                    <span class="left-rank">{{ index + 4 }}</span>
					<template v-if="!isUserPhoto(item.userPhoto)">
						<img src="@public/home/avatar.png"  />
					</template>
                    <template v-else>
                        <img v-lazy="getAvatarUrl(item.userPhoto)"
                            :data-img="defaultAvatar" />
                    </template>
                    <span class="middle-name">{{ desensitizeString(item.nickName) }}</span>
                    <!-- <span class="middle-name">{{ formatString(item.nickName, 10) }}</span> -->
                    <span class="right-box">{{ currency(item.price) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useHome } from '@/hooks'
    import { useAssets } from '@/hooks/useAssets'
    import type { Home } from '@/types/api'
	import { currency, desensitizeString, isUserPhoto } from '@/utils'
    import { ref, watch } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { defaultAvatar, getAvatarUrl } = useAssets()
    const { t } = useI18n()

    const { homeState } = useHome()

    const EmptyData = {
        nickName: t('noData'),
        userPhoto: '',
        price: 0,
        time: '',
        typeName: ''
    } as const

    // 中奖信息处理
    watch(
        () => homeState.rankList,
        (newVal) => {
            getTopThree.value.splice(0, newVal.length, ...newVal.sort((a, b) => b.price - a.price).slice(0, 3))
            theRest.value.splice(0, newVal.length, ...newVal.sort((a, b) => b.price - a.price).slice(3, 10))
        }
    )

    const getTopThree = ref([EmptyData, EmptyData, EmptyData] as Home.DailyProfitRankProps[])

    const theRest = ref([] as Home.DailyProfitRankProps[])
</script>

<style lang="scss" scoped>
    .rank {

        .title {
            font-size: 28px;
            font-style: normal;
            font-weight: 900;
            color: #1E2637;
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 24px;
            font-family: "Alibaba PuHuiTi 3.0";

            svg {
                width: 40px;
                height: 40px;
            }
        }

        &_c {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #fff;
            padding: 32px 24px;
            border-radius: 24px;
            box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);

            &-topThree {
                width: 100%;
                height: fit-content;
                background-image: url('@/assets/icons/svg/91club/91-rank_bg.svg');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: bottom;
                display: flex;
                justify-content: center;

                &>div {
                    display: flex;
                    flex-direction: column;
                    justify-content: start;
                    align-items: center;

                    .name {
                        font-size: 24px;
                        font-weight: 900;
                        line-height: 32px;
                    }

                    .money {
                        font-size: 24px;
                        font-weight: 500;
                        line-height: 32px;
                        font-family: "Alibaba PuHuiTi 3.0";
                    }
                }

                .r1 {
                    position: relative;
                    height: 352px;
                    width: 246px;
                    &::after {
                        width: 48px;
                        height: 48px;
                        content: '';
                        display: block;
                        background-image: url('@/assets/icons/svg/91club/91-top1.svg');
                        background-size: 48px;
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translateX(10px)translateY(-16px);
                    }

                    img {
                        width: 110px;
                        height: 110px;
                        border-radius: 50%;
                        border: 4px solid #FB5755;
                        box-shadow: 0px 12px 16px 0px rgba(255, 102, 120, 0.32);
                    }

                    .name {
                        color: #FF2D5F;
                        margin-top: 124px;
                    }

                    .money {
                        color: #BC2958;
                    }
                }

                .r2 {
                    padding-top: 100px;
                    width: 197px;
                    img {
                        width: 84px;
                        height: 84px;
                        border-radius: 50%;
                        border: 4px solid #FF9051;
                        box-shadow: 0px 12px 14.8px 0px rgba(255, 156, 101, 0.30);
                    }

                    .name {
                        color: #FF772A;
                        margin-top: 74px;
                    }

                    .money {
                        font-size: 20px;
                        color: #B75C36;
                    }
                }

                .r3 {
                    padding-top: 100px;
                    width: 197px;
                    img {
                        width: 84px;
                        height: 84px;
                        border-radius: 50%;
                        border: 4px solid #FFB939;
                        box-shadow: 0px 12px 14.8px 0px rgba(255, 192, 71, 0.30);
                    }

                    .name {
                        color: #FFB628;
                        margin-top: 74px;
                    }

                    .money {
                        font-size: 20px;
                        color: #B58735;
                    }
                }
                img {
                    background: var(--bg_color_L1);
                }
            }

            &-list {
                position: relative;
                z-index: 2;
                width: 100%;

                &__item {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 112px;
                    &:not(:first-of-type) {
                        border-top: 2px solid #F1F2F4;
                    }
                    span {
                        &.left-rank {
                            font-size: 24px;
                            font-weight: 900;
                            color: #1E2637;
                            font-family: "Alfa Slab One";
                            margin-inline-end: 20px;
                        }

                        &.middle-name {
                            color: #1E2637;
                            font-size: 24px;
                            font-weight: 500;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            margin-inline-start: 12px;
                        }

                        &.right-box {
                            flex: 1;
                            line-height: 50px;
                            color: #FB5755;
                            text-align: end;
                        }
                    }

                    img {
                        width: 64px;
                        height: 64px;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
</style>
