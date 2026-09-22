<template>
    <div class="tabbar__container" v-if="!isTurntable">
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
    <div class="tabbar__container isTurntable" v-else>
		<div
			class="tabbar__container-item"
			v-for="(item, index) in newTabBars"
			:class="[item.name === route.name && 'active', item.name,
                item.name === 'turntable' && 'turntableBg'
            ]"
			:key="item + '' + index"
			@click="handleClick(item.name)"
		>
			
        <span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
        <span v-if="item.name === 'turntable'"> {{ $t('getMoney', [currency(getInvitedWheelTotalPrizeAmount, '', 0)]) }}</span>
        <span v-else>{{ $t(item.name) }}</span>
        
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {useTabBar, newTabBars} from './constTabbars'
import { currency } from '@/utils'
import { useActive } from '@/components/common/use'

const {isTurntable,getInvitedWheelImgUrl,getInvitedWheelTotalPrizeAmount,handleClick} = useTabBar()
const { ActiveSotre } = useActive()
const redDot = computed(() => ActiveSotre.value.activityRedDot)

const route = useRoute()
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
    background: #19150B;
    box-shadow: 0 -2px 0 0 #4B3C0B;
    z-index: 100;

    &-item {
        flex: 1;
        height: 100%;
        padding-top: 80px;
        color: var(--norm_secondary-color);
        text-align: center;
        background-repeat: no-repeat;
        background-size: 40px;
        background-position: center 24px;
        &.promotion {
            background-image: url('@/assets/icons/common/tabbar/yellow_promotion.png');
        }
        &.activity {
            position: relative;
            background-image: url('@/assets/icons/common/tabbar/yellow_activity.png');

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
			color: var(--main-color);
			padding-top: 116px;
            background-size: 132px 146px;
            background-image: url('@/assets/icons/common/tabbar/yellow_home.png');
        }
        &.wallet {
            background-image: url('@/assets/icons/common/tabbar/yellow_wallet.png');
        }
        &.turntableBg {
            background-image: v-bind(getInvitedWheelImgUrl);
            background-size: cover;
            width: 153px;
            height: 153px;
            position: relative;
			top: -60px;
            font-size: 26px;
            padding-top: 126px;
            font-weight: 600;
        }
        &.main {
            background-image: url('@/assets/icons/common/tabbar/yellow_main.png');
        }
        &.active:not(.home) {
			background-size: 80px 90px;
			color: var(--main-color);
			padding-top: 74px;
            &.promotion {
				background-image: url('@/assets/icons/common/tabbar/yellow_promotion_a.png');
            }
            &.activity {
				background-image: url('@/assets/icons/common/tabbar/yellow_activity_a.png');
            }
            &.wallet {
				background-image: url('@/assets/icons/common/tabbar/yellow_wallet_a.png');
            }
            &.main {
				background-image: url('@/assets/icons/common/tabbar/yellow_main_a.png');
            }
        }
    }
}

.isTurntable {
    
    .home {
        top: 0;
        height: 100%;
        background-size: 80px 90px;
        background-size: 80px;
        background-position: center 24px;
        padding-top: 80px;
        background-image: url('@/assets/icons/common/tabbar/ar064_home.png') !important;
    }
    .active {
        &.home {
            background-size: 80px 90px;
            background-image: url('@/assets/icons/common/tabbar/ar064_home_a.png') !important;
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

