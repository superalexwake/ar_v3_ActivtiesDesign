<template>
	<div class="game-tabs" ref="navRef">
		<div class="game-tabs__scroll" :class="{ 'game-tabs__scroll--sticky': isSticky }" ref="scrollRef">
			<div class="game-tabs__scroll-indicator" :style="indicatorStyle"></div>
			<div
				class="game-tabs__scroll-item"
				:class="{ active: activeIndex === index }"
				v-for="(item, index) in categories"
				:key="item.categoryCode"
				@click="handleClick(index, item)"
			>
				<img
					v-if="item.categoryImg"
					:src="item.categoryImg"
					class="game-tabs__scroll-item__icon"
				/>
				<span>{{ getTitle(item) }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted, CSSProperties } from 'vue'
import { useHome } from '@/hooks'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['change'])
const { homeState } = useHome()
const { t, locale } = useI18n()

// 分类名称映射（对应多语言 code93XX）
const textMap = computed<Record<string, string>>(() => ({
	popular: t('code9302'),
	fish: t('code9303'),
	slot: t('code9304'),
	sport: t('code9305'),
	casino: t('code9306'),
	pvc: t('code9307'),
	flash: t('code9308'),
	lottery: t('code9301'),
	chess: t('code9307'),
	video: t('code9306')
}))

// 从 API 数据获取分类列表，过滤掉 BigAward
const categories = computed(() =>
	(homeState.gameTypeList || []).filter(
		(item: any) => (item.categoryCode || '').toLowerCase() !== 'bigaward'
	)
)

const getTitle = (item: any) => {
	const code = (item.categoryCode || '').toLowerCase()
	return textMap.value[code] || item.categoryCode || ''
}

const activeIndex = ref(0)
const scrollRef = ref<HTMLElement>()
const navRef = ref<HTMLElement>()
const indicatorStyle = ref<CSSProperties>({})
const isSticky = ref(false)

// 计算指示器位置和宽度
const updateIndicator = (animate = true) => {
	const container = scrollRef.value
	if (!container) return
	const items = container.querySelectorAll('.game-tabs__scroll-item')
	const el = items[activeIndex.value] as HTMLElement
	if (!el) return

	indicatorStyle.value = {
		width: `${el.offsetWidth}px`,
		transform: `translate3d(${el.offsetLeft}px, 0, 0)`,
		transition: animate ? 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
	}
}

// 吸顶检测：tabs 到达 nav 底部时就吸顶
const STICKY_THRESHOLD = 50 // tabs 距顶部这个距离时就吸顶
const handleScroll = () => {
	if (navRef.value) {
		const navTop = navRef.value.getBoundingClientRect().top
		isSticky.value = navTop <= STICKY_THRESHOLD
	}
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll)
})

// 数据加载后自动 emit 第一个分类，并初始化指示器
watch(categories, (list) => {
	if (list.length && activeIndex.value === 0) {
		emit('change', (list[0].categoryCode || '').toLowerCase())
		nextTick(() => updateIndicator(false))
	}
}, { immediate: true })

// 语言切换后重新计算指示器位置
watch(locale, () => {
	nextTick(() => updateIndicator(false))
})

const handleClick = (index: number, item: any) => {
	const wasSticky = isSticky.value
	activeIndex.value = index
	emit('change', (item.categoryCode || '').toLowerCase())
	nextTick(() => {
		updateIndicator(true)

		const container = scrollRef.value
		if (!container) return
		const items = container.querySelectorAll('.game-tabs__scroll-item')
		const el = items[index] as HTMLElement

		if (wasSticky) {
			// 吸顶时：手动横向滚动 tab 居中（避免 scrollIntoView 干扰垂直滚动）
			if (el) {
				const targetLeft = el.offsetLeft - (container.offsetWidth - el.offsetWidth) / 2
				container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
			}
			// 等内容渲染完成后，滚动页面让 title 可见且 tabs 保持吸顶
			nextTick(() => {
				const gameSection = navRef.value?.nextElementSibling as HTMLElement
				if (!gameSection) return
				const stickyH = scrollRef.value?.offsetHeight || 90
				const gameSectionTop = gameSection.getBoundingClientRect().top + window.scrollY
				window.scrollTo({
					top: gameSectionTop - stickyH - 5,
					behavior: 'smooth'
				})
			})
		} else {
			// 非吸顶：正常 scrollIntoView
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.game-tabs {
	overflow: visible;

	&__scroll {
		position: relative;
		display: flex;
		gap: 20px;
		overflow-x: auto;
		padding: 10px 0;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		&--sticky {
			position: fixed;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 690px;
			z-index: 102;
			padding: 10px 0;
			background: #0c0a1a;
			box-shadow: -30px 0 0 #0c0a1a, 30px 0 0 #0c0a1a;

			@media (max-width: 500px) {
				width: calc(100% - 60px);
			}
		}

		// 滑动指示器（活跃背景）
		&-indicator {
			position: absolute;
			top: 10px;
			left: 0;
			height: 70px;
			border-radius: 50px;
			background:
				linear-gradient(95deg, #fb8466 3%, #bd5bd4 30%, #7473fa 65%, #53b2fa 103%) padding-box,
				linear-gradient(95deg, #a1edff, #3131b9, #fcf5ff, #363bb5, #3d49be, #4a64b4, #efe0ff, #6363da, #ffb184) border-box;
			border: 2px solid transparent;
			pointer-events: none;
			z-index: 0;
		}

		&-item {
			position: relative;
			z-index: 1;
			display: flex;
			align-items: center;
			gap: 8px;
			height: 70px;
			padding: 0 24px 0 16px;
			border-radius: 50px;
			border: 2px solid transparent;
			background:
				linear-gradient(268deg, #221d2d 0.62%, #373143 98.29%) padding-box,
				linear-gradient(95deg, #a1edff, #3131b9, #fcf5ff, #363bb5, #3d49be, #4a64b4, #efe0ff, #6363da, #ffb184) border-box;
			box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 2px 0 0 #2e384a inset;
			white-space: nowrap;
			flex-shrink: 0;
			cursor: pointer;

			&__icon {
				width: 50px;
				height: 50px;
				object-fit: contain;
				filter: drop-shadow(0 2px 4px rgba(42, 10, 56, 0.65));
			}

			span {
				font-size: 28px;
				font-weight: 500;
				color: #fff;
			}

			// 选中时隐藏自身背景，露出底下的指示器
			&.active {
				background: transparent;
				border-color: transparent;
				box-shadow: none;
			}
		}
	}
}
</style>
