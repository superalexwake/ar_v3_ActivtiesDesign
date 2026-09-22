<template>
	<div class="game-tabs">
		<van-tabs
			v-model:active="activeName"
			class="game-tabs__tabs"
			:sticky="true"
			:offset-top="0"
			:ellipsis="false"
			:line-width="0"
			:line-height="0"
			:swipeable="false"
			:scrollspy="false"
			shrink
			@change="handleChange"
		>
			<van-tab
				v-for="item in categories"
				:key="item.categoryCode"
				:name="(item.categoryCode || '').toLowerCase()"
			>
				<template #title>
					<div class="game-tabs__item">
						<div class="game-tabs__item-icon-wrap">
							<img
								v-if="item.categoryImg"
								:src="item.categoryImg"
								class="game-tabs__item-icon"
							/>
						</div>
						<span class="game-tabs__item-label">{{ getTitle(item) }}</span>
					</div>
				</template>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHome } from '@/hooks'
import { useI18n } from 'vue-i18n'
import tabBgImg from '@icon/home/tabBg.png'
import tabBgActiveImg from '@icon/home/tabBgActive.png'

const emit = defineEmits(['change'])
const { homeState } = useHome()
const { t } = useI18n()

// 背景图（用 v-bind 传到 CSS）
const tabBg = `url(${tabBgImg})`
const tabBgActive = `url(${tabBgActiveImg})`

// 分类标题国际化映射
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

// 过滤掉 bigaward 分类
const categories = computed(() =>
	(homeState.gameTypeList || []).filter(
		(item: any) => (item.categoryCode || '').toLowerCase() !== 'bigaward'
	)
)

const getTitle = (item: any) => {
	const code = (item.categoryCode || '').toLowerCase()
	return textMap.value[code] || item.categoryCode || ''
}

// van-tabs 使用 name 绑定当前激活项
const activeName = ref<string>('')

const handleChange = (name: string) => {
	emit('change', name)
}

// 初始化默认选中第一个分类
watch(
	categories,
	(list) => {
		if (list.length && !activeName.value) {
			const first = (list[0].categoryCode || '').toLowerCase()
			activeName.value = first
			emit('change', first)
		}
	},
	{ immediate: true }
)
</script>

<style lang="scss" scoped>
.game-tabs {
	// 覆盖 vant 默认样式，保留横向滚动与吸顶能力
	:deep(.van-tabs__wrap) {
		height: auto;
		overflow: visible;
	}

	:deep(.van-tabs__nav) {
		background: transparent;
		padding: 10px 0;
		gap: 20px;
	}

	:deep(.van-tabs__line) {
		display: none;
	}

	:deep(.van-tab) {
		flex: none;
		padding: 0;
		color: inherit;
		font-size: inherit;
		line-height: normal;

		&.van-tab--active {
			color: inherit;
		}
	}

	// 吸顶时撑满屏幕宽度 + 背景与阴影
	// vant 默认把 fixed 元素宽度设为原元素宽度，这里覆盖为全屏
	:deep(.van-sticky--fixed) {
		left: 0 !important;
		right: 0 !important;
		width: 100vw !important;
		max-width: 100vw;
		transform: none !important;
		background: var(--bg_color_L2);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		z-index: 102;

		.van-tabs__wrap,
		.van-tabs__nav {
			padding-left: 30px;
			padding-right: 30px;
		}
	}

	&__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 112px;
		cursor: pointer;
	}

	&__item-icon-wrap {
		width: 112px;
		height: 112px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: v-bind(tabBg);
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100% 100%;
		border-radius: 10px;
		border: 2px solid #fff;
		box-shadow: 0 8.4px 18.76px 0 rgba(27, 90, 198, 0.25);
		backdrop-filter: blur(35px);
	}

	&__item-icon {
		margin-top: 24px;
		width: 60px;
		height: 60px;
		object-fit: contain;
	}

	&__item-label {
		margin-top: 24px;
		font-size: 24px;
		font-weight: 500;
		color: var(--text_color_L2);
		white-space: nowrap;
	}

	// 激活态：替换背景图、加高、加粗文字
	:deep(.van-tab--active) {
		.game-tabs__item-icon-wrap {
			width: 112px;
			height: 136px;
			background-image: v-bind(tabBgActive);
			background-repeat: no-repeat;
			background-position: center;
			background-size: 100% 100%;
			box-shadow: none;
			border: none;
		}

		.game-tabs__item-icon {
			margin-top: 0;
		}

		.game-tabs__item-label {
			margin-top: 0;
			color: var(--text_color_L1);
			font-weight: 600;
		}
	}
}
</style>
