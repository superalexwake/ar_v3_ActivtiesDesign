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
import {  useRoute } from 'vue-router'
import { currency } from '@/utils'
import {useTabBar, newTabBars} from './constTabbars'
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
	left: 50%;
	bottom: 15px;
	display: flex;
	align-items: flex-end;
	width: 750px;
	transform: translateX(-50%);
	height:136px;
	padding-block: 0 10px;
	font-size: 22px;
	background: url('@icon/public/tabBarBg.png') no-repeat center center / cover;
	z-index: 100;

	&-item {
		flex: 1;
		height: 100%;
		padding-top: 85px;
		color: var(--text_color_L3, #837064);
		text-align: center;
		background-repeat: no-repeat;
		background-size: 56px 56px;
		background-position: center 24px;

		&.promotion {
			background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_home.png');
		}
		&.activity {
			position: relative;
			background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_activity.png');

			.reddot {
				position: absolute;
				top: 16px;
				left: calc(50% + 18px);
				width: 14px;
				height: 14px;
				border-radius: 50%;
				background: #FA5B5B;
				z-index: 5;
			}
		}
		&.home {
			position: relative;
			top: -28px;
			background-position: center 14px;
			color: var(--text_color_L3, #837064);
			padding-top:130px;
			background-size:96px 96px;
			background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/home.png');
		}
		&.wallet {
			background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_wallet.png');
		}
		 &.turntableBg {
            background-image: v-bind(getInvitedWheelImgUrl);
            background-size: 100%;
			background-position: center;
       		border-radius: 0;
			width: 150px;
			height: 150px;
            position: relative;
			top: -8px;
			left: 3px;
            font-size: 26px;
            padding-top: 108px;
            font-weight: 600;
			z-index: 3;
			color: #FED358;
        }
		&.main {
			background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_main.png');
		}
		&.active:not(.home) {
			background-size:56px 56px;
			color: var(--main-color, #FED358);
			padding-top: 85px;
			&.promotion {
				background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_home_a.png');
			}
			&.activity {
				background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_activity_a.png');
			}
			&.wallet {
				background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_wallet_a.png');
			}
			&.main {
				background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_main_a.png');
			}
		}
		&.active.home{
			color: var(--main-color, #FED358);
		}
	}
}

.isTurntable {
	background: #382E35;
	border-radius: 80px;
    
    .home {
        top: 0;
        height: 100%;
        background-size: 56px;
        background-position: center 24px;
        padding-top: 80px;
        background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_index.png') !important;
    }
    .active {
        &.home {
            background-size: 56px 56px;
            background-image: url('@/assets/icons/tabBarIcons/p5bgTabBar/t7_index_a.png') !important;
        }
    }
    
}

@media screen and (max-width: 500px) {
	.tabbar__container {
		width: 96%;
		left: 2%;
		transform: translateX(0);
		html:lang(ar) &{
			left: unset;
			right: 0;
		}
	}
}
</style>

