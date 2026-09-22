<template>
	<van-list
		v-model:loading="innerLoading"
		:finished="finished"
		:finished-text="$t('noMoreThere')"
		@load="$emit('load')"
	>
		<div class="activitySection__container">
			<div
				v-for="item in list"
				:key="`${item.bannerID}-${item.bannerUrl}`"
				class="box"
				@click="$emit('click-item', item)"
			>
				<div class="box-media">
					<img :src="item.bannerUrl" @error="$emit('image-error', item)" />
					<span v-if="tagMeta(item)" class="box-tag" :class="tagMeta(item)!.className">{{ $t(tagMeta(item)!.labelKey) }}</span>
					<div v-if="isChampionshipItem(item) && championshipOverlay" class="box-champion">
						<div class="box-champion__box">
							<div class="box-champion__title">{{ $t('cpsTip3') }}</div>
							<div class="box-champion__value">
								<span v-html="$t('fifteenDays', [championshipOverlay.days])"></span>
								<span>{{ championshipOverlay.time }}</span>
							</div>
						</div>
						<div class="box-champion__box">
							<div class="box-champion__title">{{ $t('cpsTip4') }}</div>
							<div class="box-champion__value">{{ currency(championship?.sumBonus || 0) }}</div>
						</div>
					</div>
				</div>
				<div class="box-content">
					<div class="box-title">
						{{ item.bannerTitle }}
					</div>
				</div>
			</div>
		</div>
	</van-list>
	<Empty v-if="isShowEmpty"/>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Empty from '@/components/Empty/index.vue'
import { currency } from '@/utils'
import type { ActivityList } from '@/types/api'

const props = defineProps<{
	list: ActivityList[]
	loading: boolean
	finished: boolean
	isShowEmpty: boolean
	/** 锦标赛倒计时/最高奖金叠加框用的数据,与活动页顶部锦标赛入口共用同一份(useChampionship 的 championEntranceVO) */
	championship?: { state?: number; startTime?: string; endTime?: string; sumBonus?: number } | null
}>()

const emit = defineEmits<{
	(e: 'update:loading', value: boolean): void
	(e: 'load'): void
	(e: 'click-item', item: ActivityList): void
	(e: 'image-error', item: ActivityList): void
}>()

const innerLoading = computed({
	get: () => props.loading,
	set: value => emit('update:loading', value),
})

// 活动标签(HOT/推荐/NEW):固定三种,文案走组件级 i18n 而不是假数据里的本地化文案,与筛选 Tab 同口径
const TAG_META: Record<string, { labelKey: string; className: string }> = {
	hot: { labelKey: 'activityTagHot', className: 'box-tag--hot' },
	recommend: { labelKey: 'activityTagRecommend', className: 'box-tag--recommend' },
	new: { labelKey: 'activityTagNew', className: 'box-tag--new' },
}
const tagMeta = (item: ActivityList) => TAG_META[(item as any).tag] ?? null

// 锦标赛那张 banner 才叠加倒计时/最高奖金框,按跳转地址识别(与 GetActivityList 假数据里锦标赛条目的 contents 一致)
const isChampionshipItem = (item: ActivityList) => (item as any).contents === '/activity/Championship'

// 倒计时按当前时刻与假数据 endTime 的差值一次性算,不额外起定时器(与入口卡片 card.vue 各自独立展示)
const championshipOverlay = computed(() => {
	const info = props.championship
	if (!info || info.state !== 1 || !info.endTime) return null
	const diff = Math.max(0, new Date(info.endTime.replace(/-/g, '/')).getTime() - Date.now())
	const days = Math.floor(diff / 86400000)
	const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0')
	const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
	const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
	return { days, time: `${hours}:${minutes}:${seconds}` }
})
</script>

<style lang="scss" scoped>
.activitySection__container {
	display: flex;
	flex-direction: column;
	gap: 20px;
	width: 100%;
	margin-top: 32px;
	padding-left: 24px;
	padding-right: 24px;

	& > .box {
		width: 100%;
		border-radius: 16px;
		background: var(--darkBg,var(--bg_color_L2));
		overflow: hidden;
		color: var(--darkTextW,var(--text_color_L1));

		.box-media {
			position: relative;
		}

		& > .box-content {
			padding: 18px 24px;
			line-height: 24px;

			.box-title {
				font-size: 30px;
				font-weight: 600;
				margin-bottom: 10px;
			}

			p {
				font-size: 24px;
				color: var(--text_color_L2);
			}
		}

		img {
			display: block;
			width: 100%;
			height: 260px;
		}
	}
}

// 活动标签:左上角随卡片圆角,右下角小圆角,形成旗标形状
.box-tag {
	position: absolute;
	top: 0;
	left: 0;
	min-width: 88px;
	height: 40px;
	padding: 0 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 24px;
	border-radius: 16px 0 12px 0;

	&--hot {
		background: #F95959;
	}

	&--recommend {
		background: #FEAA57;
	}

	&--new {
		background: #18B660;
	}
}

// 锦标赛倒计时 / 最高奖金叠加框
.box-champion {
	position: absolute;
	top: 24px;
	right: 24px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 220px;

	&__box {
		border-radius: 12px;
		overflow: hidden;
	}

	&__title {
		padding: 6px 0;
		background: #F95959;
		color: #fff;
		font-size: 22px;
		text-align: center;
	}

	&__value {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 10px 0;
		background: #fff;
		color: #1E2637;
		font-size: 26px;
		font-weight: 700;

		:deep(span) {
			white-space: nowrap;
		}
	}
}
</style>
