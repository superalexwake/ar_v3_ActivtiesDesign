<template>
	<div class="tabbar__container tabbar__container--default" v-if="!isTurntable">
		<div
			class="tabbar__container-item"
			v-for="(item, index) in tabBars"
			:class="{
				active: item.name === route.name
			}"
			:key="item + '' + index"
			@click="handleClick(item.name)"
		>
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
			<img
				v-if="item.name === 'promotion'"
				class="promotion-special-icon"
				:src="promotionCenterImg"
			/>
			<img v-else class="tab-icon" :src="getIconSrc(item.name, item.name === route.name)" />
			<span :class="{ 'promotion-label': item.name === 'promotion' }">
				{{ $t(item.name) }}
			</span>
		</div>
	</div>
	<div class="tabbar__container tabbar__container--turntable" v-else>
		<div
			class="tabbar__container-item"
			v-for="(item, index) in newTabBars"
			:class="{
				active: item.name === route.name
			}"
			:key="item + '' + index"
			@click="handleClick(item.name)"
		>
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
			<!-- 仅中间项 (turntable) 保留原 svg-icon -->
			<svg-icon v-if="item.name === 'turntable'" :name="item.name" />
			<img v-else class="tab-icon" :src="getIconSrc(item.name, item.name === route.name)" />
			<div class="turntableBg" v-if="item.name === 'turntable'"></div>
			<span v-if="item.name === 'turntable'" class="turntable-text">
				<!-- {{ $t('invitedWheel') }} -->
				{{ $t('getMoney', [currency(getInvitedWheelTotalPrizeAmount, '', 0)]) }}
			</span>
			<span v-else>
				{{ $t(item.name) }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { currency } from '@/utils'
import { useRoute } from 'vue-router'
import { useTabBar, newTabBars } from './constTabbars'
import { useActive } from '@/components/common/use'
import homeNor from '@icon/tabBarIcons/home_nor.png'
import homeSel from '@icon/tabBarIcons/home_sel.png'
import activityNor from '@icon/tabBarIcons/activity_nor.png'
import activitySel from '@icon/tabBarIcons/activity_sel.png'
import walletNor from '@icon/tabBarIcons/wallet_nor.png'
import walletSel from '@icon/tabBarIcons/wallet_sel.png'
import promotionNor from '@icon/tabBarIcons/promotion_nor.png'
import promotionSel from '@icon/tabBarIcons/promotion_sel.png'
import mineNor from '@icon/tabBarIcons/mine_nor.png'
import mineSel from '@icon/tabBarIcons/mine_sel.png'
import promotionCenterImg from '@/assets/public5WhiteGreen/icons/tabBarIcons/promotion.png'

const tabBars = [
	{
		name: 'home'
	},
	{
		name: 'activity'
	},
	{
		name: 'promotion'
	},
	{
		name: 'wallet'
	},
	{
		name: 'main'
	}
]

// 路由名 → 图标资源映射（main → mine 图标）
const iconMap: Record<string, { nor: string; sel: string }> = {
	home: { nor: homeNor, sel: homeSel },
	activity: { nor: activityNor, sel: activitySel },
	wallet: { nor: walletNor, sel: walletSel },
	promotion: { nor: promotionNor, sel: promotionSel },
	main: { nor: mineNor, sel: mineSel }
}

const getIconSrc = (name: string, isActive: boolean) => {
	const icons = iconMap[name]
	if (!icons) return ''
	return isActive ? icons.sel : icons.nor
}

const { isTurntable, getInvitedWheelImgUrl, getInvitedWheelTotalPrizeAmount, handleClick } = useTabBar()
const { ActiveSotre } = useActive()
const redDot = computed(() => ActiveSotre.value.activityRedDot)

const route = useRoute()
</script>

<style scoped lang="scss">
.tabbar__container {
	position: fixed;
	bottom: 0;
	left: 50%;
	display: flex;
	align-items: stretch;
	width: 750px;
	transform: translateX(-50%);
	height: 119px;
	padding: 0;
	font-size: 22px;
	background: #fff;
	box-shadow: 0 -2px 0 0 #dff3eb;
	z-index: 100;

	&-item {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 4px;
		height: 100%;
		padding-top: 19px;
		box-sizing: border-box;
		// 普通态字体颜色（与普通态图标同色系），active 时切换为主题主色
		color: #83DEB7 !important;

		span {
			color: #83DEB7 !important;
		}

		.reddot {
			position: absolute;
			bottom: 88px;
			left: calc(50% + 14px);
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: #FA5B5B;
			z-index: 5;
		}

		&:nth-of-type(3) {
			position: relative;
			.turntableBg {
				position: absolute;
				left: 50%;
				bottom: 12px;
				transform: translate(-50%, 0);
				background-image: v-bind(getInvitedWheelImgUrl);
				background-repeat: no-repeat;
				background-size: cover;
				width: 153px;
				height: 153px;
				// border-radius: 50%;
				z-index: 2;
			}
			.turntable-text {
				display: inline-block;
				position: absolute;
				left: 50%;
				transform: translate(-50%, 0);
				bottom: 18px;
				z-index: 3;
				width: 220px;
				height: auto;
				min-width: 0;
				overflow: visible;
				font-size: 30px;
				font-weight: 600;
				line-height: 1.1;
				text-align: center;
				white-space: nowrap;
				color: var(--main-color);
			}
		}

		svg {
			display: block;
			width: 43.32px;
			height: 44.54px;
		}
		.tab-icon {
			display: block;
			width: 43.32px;
			height: 44.54px;
			object-fit: contain;
		}
		span {
			display: block;
			line-height: 1.2;
			height: auto;
			max-width: 100%;
			text-align: center;
			overflow: hidden;
		}

		&.active {
			color: var(--main-color) !important;

			span {
				color: var(--main-color) !important;
			}
		}
	}

	&--default {
		.tabbar__container-item:nth-of-type(3) {
			padding-top: 0;
			gap: 0;
			overflow: visible;

			.promotion-special-icon {
				position: absolute;
				top: -46px;
				left: 50%;
				transform: translateX(-50%);
				width: 156px;
				height: 100px;
				z-index: 3;
			}

			.promotion-label {
				position: absolute;
				top: 67px;
				left: 50%;
				transform: translateX(-50%);
				width: auto;
				max-width: none;
				overflow: visible;
				white-space: nowrap;
				line-height: 1.2;
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
