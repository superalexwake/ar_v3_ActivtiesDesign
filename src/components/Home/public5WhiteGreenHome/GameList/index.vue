<template>
	<div class="game">
		<!-- Sticky Tab -->
		<div ref="navWrapRef" class="game__nav-placeholder">
			<div :class="['game__nav', { 'is-sticky': isSticky }]" ref="navRef">
				<div
					v-for="item in gameMenuTab"
					:key="item.type"
					:class="['game__nav-item', { 'is-active': activeType === item.type }]"
					@click="handleClick(item.type, $event)"
				>
					<span class="game__nav-glow" />
					<span class="game__nav-label">{{ item.label }}</span>
				</div>
			</div>
		</div>

		<!-- Tab 内容 -->
		<div class="game__content">
			<lobby v-if="activeType === ''" :tab-list="gameMenuTab" @change-type="changeType" />
			<seachGame v-else-if="activeType === 'Slot'" />
			<gameList v-else :active-type="activeType" />
		</div>

		<!-- 公共底部 -->
		<div class="game__footer">
			<SuperJackpot />
			<LuckyWinners />
			<DailyProfitRank />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import { useHome } from '@/hooks'
import lobby from './lobby.vue'
import gameList from './gameList.vue'
import seachGame from './seachGame.vue'
import SuperJackpot from './SuperJackpot.vue'
import LuckyWinners from '../LuckyWinners.vue'
import DailyProfitRank from '../DailyProfitRank.vue'
import { buildGameMenuTab } from './gameMenu'

// 静态导航项（与后端 categoryCode 对齐，按 sort 排序）
const navItems = [
	{ type: 'Lottery', label: 'Lottery' },
	{ type: 'Popular', label: 'Popular' },
	{ type: 'Flash', label: 'Mini Game' },
	{ type: 'Video', label: 'Casino' },
	{ type: 'Slot', label: 'Slots' },
	{ type: 'Sport', label: 'Sports' },
	{ type: 'Chess', label: 'PVC' },
	{ type: 'Fish', label: 'Fishing' }
]

const useHomeHook = useHome()
provide('useHomeHook', useHomeHook)
const { homeState } = useHomeHook

const activeType = ref('')
const navRef = ref<HTMLDivElement | null>(null)
const navWrapRef = ref<HTMLDivElement | null>(null)
const isSticky = ref(false)

// 动态合并：Lobby 永远在第一位，其他按后端 sort 排序，过滤未启用的
const gameMenuTab = computed(() => {
	return buildGameMenuTab({
		navItems,
		categories: homeState.gameTypeList || [],
		cachedMenu: sessionStorage.getItem('gameMenu')
	})
})

// 让选中 tab 在水平方向居中
const centerActiveTab = (target: HTMLElement) => {
	const navContainer = navRef.value
	if (!navContainer) return
	const containerRect = navContainer.getBoundingClientRect()
	const targetRect = target.getBoundingClientRect()
	// target 相对 nav 内部的左偏移（含已滚动距离）
	const targetLeft = targetRect.left - containerRect.left + navContainer.scrollLeft
	const scrollTo = targetLeft - (navContainer.clientWidth - target.offsetWidth) / 2
	navContainer.scrollTo({
		left: Math.max(0, scrollTo),
		behavior: 'smooth'
	})
}

// 切换 tab 时把页面滚回 nav 顶部，避免内容停留在上一个 tab 的滚动位置
const scrollPageToNav = () => {
	const top = navWrapRef.value?.offsetTop ?? 0
	if (window.scrollY > top) {
		window.scrollTo({ top, behavior: 'smooth' })
	}
}

const handleClick = (type: string, event: MouseEvent) => {
	activeType.value = type
	centerActiveTab(event.currentTarget as HTMLElement)
	scrollPageToNav()
}

const changeType = (value: string) => {
	activeType.value = value
	scrollPageToNav()
	// 等 DOM 更新后让对应 tab 居中
	requestAnimationFrame(() => {
		const idx = gameMenuTab.value.findIndex((i: any) => i.type === value)
		const el = navRef.value?.children[idx] as HTMLElement | undefined
		if (el) centerActiveTab(el)
	})
}

const handleScroll = () => {
	if (!navWrapRef.value) return
	const top = navWrapRef.value.getBoundingClientRect().top
	isSticky.value = top <= 0
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.game {
	display: flex;
	flex-direction: column;
	gap: 48px;

	&__nav-placeholder {
		min-height: 110px;
	}

	&__nav {
		margin-top:24px;
		display: flex;
		width: 100%;
		height: 64px;
		overflow-x: auto;
		padding: 0;
		background: #fff;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch;

		&::-webkit-scrollbar {
			display: none;
		}

		&.is-sticky {
			position: fixed;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			max-width: 750px;
			width: 100%;
			height: 88px;
			margin-top: 0;
			z-index: 100;
			padding: 24px 30px 24px 24px;
			background: #fff;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
		}
	}

	&__nav-item {
		position: relative;
		flex: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 32px;
		cursor: pointer;
	}

	&__nav-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: block;
		width: calc(100% + 28px);
		min-width: 156px;
		height: 80px;
		box-sizing: border-box;
		border-style: solid;
		border-width: 0 52px;
		border-image-source: url('@icon/home/tabBgGlow.png');
		border-image-slice: 0 52 fill;
		border-image-repeat: stretch;
		transition: opacity 0.2s ease;
		pointer-events: none;
		opacity: 0;
		z-index: 0;
	}

	&__nav-label {
		position: relative;
		z-index: 1;
		font-size: 30px;
		font-weight: 400;
		line-height: 1;
		color: var(--text_color_L2);
		white-space: nowrap;
	}

	&__nav-item.is-active {
		.game__nav-glow {
			opacity: 1;
		}
		.game__nav-label {
			color: var(--text_color_L1);
			font-weight: 700;
		}
	}

	&__content {
		min-height: 200px;
	}

	&__footer {
		display: flex;
		flex-direction: column;
		gap: 48px;
	}
}
</style>
