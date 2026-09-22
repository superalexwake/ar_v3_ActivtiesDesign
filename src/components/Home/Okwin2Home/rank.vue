<template>
    <div class="dailyProfitRank">
        <div class="title">{{ $t('earningsRankingToday') }}</div>
        <div class="dailyProfitRank__content">
            <div class="dailyProfitRank__content-topThree">
                <div
                    :class="['dailyProfitRank__content-topThree__item', `rank-${index + 1}`]"
                    v-for="(item, index) in getTopThree"
                    :key="index"
                    :style="{
                        order: index === 0 ? 2 : index === 2 ? 3 : 1,
                        top: index === 0 ? '-25px' : '0px'
                    }"
                >
                    <div class="rank-border">
						<template v-if="!isUserPhoto(item.userPhoto)">
							<img src="@public/home/avatar.png"  />
						</template>
                        <template v-else>
                            <img
                                v-lazy="getAvatarUrl(item.userPhoto)"
                                :data-img="defaultAvatar"
                            />
                        </template>
                    </div>
                    <div>
                        <i class="rank-crown" />
                    </div>
                    <span>
                        {{ desensitizeString(item.nickName) }}
                    </span>
                    <span>
                        {{ currency(item.price) }}
                    </span>
                </div>
            </div>
            <div class="dailyProfitRank__content-list">
                <div class="dailyProfitRank__content-list__item" v-for="(item, index) in theRest" :key="index">
                    <span class="left-rank">{{ index + 4 }}</span>
					<template v-if="!isUserPhoto(item.userPhoto)">
						<img src="@public/home/avatar.png"  />
					</template>
                    <template v-else>
                        <img
                            v-lazy="getAvatarUrl(item.userPhoto)"
                            :data-img="defaultAvatar"
                        />
                    </template>
                    <span class="middle-name">{{ desensitizeString(item.nickName) }}</span>
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
.dailyProfitRank {
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
        background-image: url('./assets/icon_rank.svg');
        background-repeat: no-repeat;
        background-size: 40px;
    }

    &__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid var(--bg_HomeModule_Stroke, #224ba2);
        background: var(--bg_HomeModule_Padding, linear-gradient(180deg, #001c54 0%, #000c33 100%));
		padding: 120px 24px 10px 24px;
		border-radius: 24px;

        &-topThree {
            position: relative;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            justify-items: center;
            width: 100%;
            height: 258px;
            z-index: 1;
            background: url('./assets/bg.png') no-repeat center center / 100% 100%;

            &__item {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 225px;
                height: fit-content;
				right: 10px;

                &:nth-child(2) {
                    right: 10px;

                    & > div {
                        &:first-of-type {
                            border: 4px solid #a0b5d2;
                        }
                    }

                    & > span {
						color: #C2D3ED;
                        &:first-of-type {
                            margin-top: 65px;
                        }

                        &:last-of-type {
							color: #8095B6;
                        }
                    }
                }

                &:nth-child(3) {
                    left: -8px;

                    & > div {
                        &:first-of-type {
                            border: 4px solid #ff9051;
                        }
                    }

                    & > span {
                        &:first-of-type {
                            margin-top: 65px;
							color: #FF772A;
                        }

                        &:last-of-type {
							color: #B75C36;
                        }
                    }
                }

                & > div {
                    &:first-of-type {
                        position: relative;
                        display: grid;
                        place-items: center;
                        width: 120px;
                        min-width: 120px;
                        height: 120px;
                        min-height: 120px;
                        border-radius: 50%;
                        overflow: hidden;
                        border: 4px solid #fff6de;

                        & > img {
                            width: calc(100% - 5px);
                            height: calc(100% - 5px);
                        }
                    }

                    &:last-of-type {
                        position: absolute;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: 134px;
                        height: 137px;

                        .rank-crown {
                            position: relative;
                            top: -40px;
                            left: -19px;
                            width: 86px;
                            height: 83px;
                            display: block;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: contain;
                        }
                    }
                }

                & > span {
                    padding: 0 10px;
                    text-align: center;

                    &:first-of-type {
                        margin-top: 90px;
                        font-size: 24px;
                        width: 200px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
						color: #FFDE78;
                    }

                    &:last-of-type {
                        width: 200px;
                        height: 50px;
                        padding: 13px 14px;
                        font-size: 24px;
                        line-height: 24px;
                        text-align: center;
                        border-radius: 9rem;
                        color: #D6AC2A;
                    }
                }

                @for $i from 1 through 3 {
                    &.rank-#{$i} {
                        .rank-border {
                            background: url('@public/images/DailyProfitRank/border#{$i}.png') no-repeat center center / 100% 100%;
                        }
                        .rank-crown {
                            background-image: url('@public/images/DailyProfitRank/crown#{$i}.png');
                        }
                    }
                }
            }
        }

        &-list {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            width: 100%;
            margin-top: 30px;

            &__item {
                display: flex;
                align-items: center;
                width: 100%;
                height: 102px;
                padding: 11px 19px 11px 33px;
                border-radius: 10px;
				gap: 12px;
				&+div {
					border-top: 1px solid var(--Dividing-line_color);
				}
                span {
                    &.left-rank {
                        margin-right: 31px;
                        color: var(--text_color_L2);
                        font-size: 32px;
                    }

                    &.middle-name {
                        color: var(--text_color_L1);
                        font-size: 24px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 200px;
                    }

                    &.right-box {
                        line-height: 36px;
                        width: fit-content;
                        height: 36px;
                        margin-left: auto;
                        color: var(--main-color);
                        font-size: 24x;
                        text-align: right;
                        border-radius: 9rem;
                    }
                }

                img {
                    width: 80px;
                    height: 80px;
                    margin-right: 13px;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>
