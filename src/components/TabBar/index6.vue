<template>
    <div class="tabbar__container">
        <div
            class="tabbar__container-item"
            v-for="(item, index) in tabBars"
            :class="[item.name === route.name && 'active', item.name]"
            :key="item + '' + index"
            @click="handleClick(item.name)"
        >
            <span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
            {{ $t(item.name) }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { handleTabBarClick } from './constTabbars'
import { useActive } from '@/components/common/use'

const router = useRouter()
const route = useRoute()
async function handleClick(name: string) {
    await handleTabBarClick(name, router)
}

const { ActiveSotre } = useActive()
const redDot = computed(() => ActiveSotre.value.activityRedDot)

const tabBars = [
    {
        name: 'promotion'
    },
    {
        name: 'activity'
    },
    {
        name: 'home'
    },
    {
        name: 'wallet'
    },
    {
        name: 'main'
    }
]
</script>

<style scoped lang="scss">
.tabbar__container {
    position: fixed;
    bottom: 0;
    left: 50%;
    display: flex;
    align-items: flex-end;
    width: 750px;
    transform: translateX(-50%);
    height: 165px;
    font-size: 22px;
    background: #05012b;
    box-shadow: 0px -2px 0px 0px #16236c;
    z-index: 100;

    &-item {
        flex: 1;
        height: 100%;
        padding-top: 80px;
        color: #6F80A4;
        text-align: center;
        background-repeat: no-repeat;
        background-size: 40px;
        background-position: center 24px;
        &.promotion {
            background-image: url('@/assets/icons/common/tabbar/t6_promotion.png');
        }
        &.activity {
            position: relative;
            background-image: url('@/assets/icons/common/tabbar/t6_activity.png');

            .reddot {
                position: absolute;
                top: 18px;
                left: calc(50% + 12px);
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #FA5B5B;
                z-index: 5;
            }
        }
        &.home {
			position: relative;
			top: -30px;
			background-position: center 14px;
			color: #00ECBE;
			padding-top: 116px;
            background-size: 132px 146px;
            background-image: url('@/assets/icons/common/tabbar/t6_home.png');
        }
        &.wallet {
            background-image: url('@/assets/icons/common/tabbar/t6_wallet.png');
        }
        &.main {
            background-image: url('@/assets/icons/common/tabbar/t6_main.png');
        }
        &.active:not(.home) {
			background-size: 80px 90px;
			color: #00ECBE;
			padding-top: 74px;
            &.promotion {
				background-image: url('@/assets/icons/common/tabbar/t6_promotion_a.png');
            }
            &.activity {
				background-image: url('@/assets/icons/common/tabbar/t6_activity_a.png');
            }
            &.wallet {
				background-image: url('@/assets/icons/common/tabbar/t6_wallet_a.png');
            }
            &.main {
				background-image: url('@/assets/icons/common/tabbar/t6_main_a.png');
            }
        }
    }
}

@media screen and (max-width: 500px) {
    .tabbar__container {
        width: 100%;
        left: 0;
        transform: translateX(0);
        html:lang(ar) & {
            left: unset;
            right: 0;
        }
    }
}
</style>
