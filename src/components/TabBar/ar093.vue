<template>
	<div class="tabbar">
		<!-- Layer 1: 椭圆底座 -->
		<div class="tabbar__pedestal"></div>
		<!-- Layer 2: 主背景条 -->
		<div class="tabbar__bar"></div>
		<!-- Layer 3: 中间项内容（转盘/promotion） -->
		<div class="tabbar__center" @click="handleClick(centerTab.name)">
			<!-- 转盘 -->
			<template v-if="centerTab.name === 'turntable'">
				<div class="tabbar__center-icon" :style="{ backgroundImage: getInvitedWheelImgUrl }"></div>
				<div class="tabbar__center-fg"></div>
				<span class="tabbar__center-text">
					{{ $t('getMoney', [currency(getInvitedWheelTotalPrizeAmount, '', 0)]) }}
				</span>
			</template>
			<!-- Promotion -->
			<template v-else>
				<img src="@icon/tabBarIcons/promotion.png" class="tabbar__center-icon--img" />
				<div class="tabbar__center-fg"></div>
				<span class="tabbar__center-text">{{ $t('promotion') }}</span>
			</template>
		</div>
		<!-- Layer 4: 所有 tab 按钮 -->
		<div class="tabbar__items">
			<div
				class="tabbar__items-tab"
				v-for="(item, index) in currentTabBars"
				:class="{ active: item.name === route.name, placeholder: item.isCenter }"
				:key="item.name + index"
				@click="!item.isCenter && handleClick(item.name)"
			>
				<template v-if="!item.isCenter">
					<img
						:src="getTabIcon(item)"
						class="tabbar__items-tab__icon"
					/>
					<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
					<span>{{ $t(item.name) }}</span>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { currency } from '@/utils'
import { useRoute } from 'vue-router'
import { useTabBar } from './constTabbars'
import { useActive } from '@/components/common/use'
import homeNorIcon from '@icon/tabBarIcons/home_nor.png'
import homeSelIcon from '@icon/tabBarIcons/home_sel.png'
import activityNorIcon from '@icon/tabBarIcons/activity_nor.png'
import activitySelIcon from '@icon/tabBarIcons/activity_sel.png'
import walletNorIcon from '@icon/tabBarIcons/wallet_nor.png'
import walletSelIcon from '@icon/tabBarIcons/wallet_sel.png'
import mineNorIcon from '@icon/tabBarIcons/mine_nor.png'
import mineSelIcon from '@icon/tabBarIcons/mine_sel.png'

const { isTurntable, getInvitedWheelImgUrl, getInvitedWheelTotalPrizeAmount, handleClick } = useTabBar()
const { ActiveSotre } = useActive()
const redDot = computed(() => ActiveSotre.value.activityRedDot)
const route = useRoute()

// 中间项
const centerTab = computed(() =>
	isTurntable.value
		? { name: 'turntable', icon: '' }
		: { name: 'promotion', icon: 'promotion' }
)

// tab 列表（中间用占位）
const currentTabBars = computed(() => [
	{ name: 'home', icon: 'home', isCenter: false },
	{ name: 'activity', icon: 'activity', isCenter: false },
	{ name: centerTab.value.name, icon: '', isCenter: true },
	{ name: 'wallet', icon: 'wallet', isCenter: false },
	{ name: 'main', icon: 'mine', isCenter: false },
])

const tabIconMap: Record<string, string> = {
	home_nor: homeNorIcon,
	home_sel: homeSelIcon,
	activity_nor: activityNorIcon,
	activity_sel: activitySelIcon,
	wallet_nor: walletNorIcon,
	wallet_sel: walletSelIcon,
	mine_nor: mineNorIcon,
	mine_sel: mineSelIcon
}

const getTabIcon = (item: { name: string; icon: string }) => {
	return tabIconMap[`${item.icon}_${item.name === route.name ? 'sel' : 'nor'}`] || ''
}
</script>

<style scoped lang="scss">
.tabbar {
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 750px;
	height: 150px;
	z-index: 100;
	pointer-events: none;

	@media (max-width: 500px) {
		width: 100%;
		left: 0;
		transform: none;
		html:lang(ar) & {
			left: unset;
			right: 0;
		}
	}

	// Layer 1: 椭圆底座
	&__pedestal {
		position: absolute;
		left: 50%;
		bottom: 30px;
		transform: translateX(-50%);
		width: 300px;
		height: 110px;
		background: url('@icon/tabBarIcons/centerPedestal.png') no-repeat center / contain;
		z-index: 1;
		pointer-events: none;
		
	}

	// Layer 2: 中间项内容（在背景条之下）
	&__center {
		position: absolute;
		left: 50%;
		bottom: 10px;
		transform: translateX(-50%);
		width: 220px;
		height: 200px;
		z-index: 2;
		pointer-events: auto;
		cursor: pointer;

		&-icon {
			position: absolute;
			left: 50%;
			bottom: 38px;
			transform: translateX(-50%);
			width: 160px;
			height: 150px;
			background-repeat: no-repeat;
			background-size: cover;
		}

		&-icon--img {
			position: absolute;
			left: 50%;
			bottom: 10px;
			transform: translateX(-50%);
			width: 200px;
			height: 200px;
			object-fit: contain;
		}

		&-fg {
			position: absolute;
			left: 50%;
			bottom: 0;
			transform: translateX(-50%);
			width: 220px;
			height: 120px;
			background: url('@icon/tabBarIcons/turntableFg.png') no-repeat center bottom / contain;
			pointer-events: none;
		}

		&-text {
			position: absolute;
			left: 50%;
			bottom: 25px;
			transform: translateX(-50%);
			min-width: 220px;
			text-align: center;
			white-space: nowrap;
			color: #FFF;
			text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.25);
			font-size: 26px;
			font-weight: 600;
			line-height: normal;
		}
	}

	// Layer 3: 主背景条（盖住中间项下半部分）
	&__bar {
		position: absolute;
		bottom: 0;
		left: -4px;
		right: -4px;
		height: 150px;
		background: url('@icon/tabBarIcons/tabBarBg.png') no-repeat center bottom / 100% 100%;
		z-index: 3;
		pointer-events: none;
	}

	// Layer 4: tab 按钮
	&__items {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: flex-end;
		padding: 0 26px 20px;
		z-index: 4;

		&-tab {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			gap: 6px;
			color: rgba(255, 255, 255, 0.5);
			padding-bottom: 6px;
			pointer-events: auto;
			cursor: pointer;

			// 活动中心聚合红点(纯点),叠在图标右上角;需覆盖下方 span 的 width:100%
			.reddot {
				position: absolute;
				bottom: 72px;
				left: calc(50% + 12px);
				width: 14px;
				height: 14px;
				border-radius: 50%;
				background: #FA5B5B;
				z-index: 5;
			}

			// 活动向左靠，钱包向右靠
			&:nth-child(2) {
				transform: translateX(-24px);
			}
			&:nth-child(4) {
				transform: translateX(24px);
			}

			&__icon {
				width: 56px;
				height: 56px;
				object-fit: contain;
			}

			span {
				line-height: 1;
				font-size: 22px;
				width: 100%;
				text-align: center;
				white-space: nowrap;
			}

			&.active {
				color: #fff;
			}

			// 中间占位（不渲染内容，只占空间）
			&.placeholder {
				pointer-events: none;
			}
		}
	}
}
</style>
