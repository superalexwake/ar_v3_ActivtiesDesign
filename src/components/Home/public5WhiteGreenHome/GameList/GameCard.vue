<template>
	<div class="game-card" @click="$emit('click', item)">
		<div class="game-card__img" :style="{ aspectRatio: ratio }">
			<img v-lazy="imgSrc" alt="" />
			<Maintain :item="item" />
		</div>
		<div class="game-card__info">
			<div v-if="tagText" class="game-card__tag">
				<svg-icon v-if="tagIcon" :name="tagIcon" class="game-card__tag-icon" />
				<span class="game-card__tag-text">{{ getSlotTitle(tagText) }}</span>
			</div>
			<div v-if="showName" class="game-card__name">{{ name }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getSlotTitle } from '@/utils'
const props = withDefaults(
	defineProps<{
		item: any
		// 第 1 行：厂商 svg-icon 名称（vendorCode）
		tagIcon?: string
		// 第 1 行：厂商/分类 名称
		tagText?: string
		// 第 2 行：游戏名（仅子游戏时传）
		name?: string
		// 图片宽高比（CSS aspect-ratio 值），默认 11/15 对齐 ar088 通用竖图卡
		ratio?: string
	}>(),
	{
		ratio: '11 / 15'
	}
)

defineEmits<{
	(e: 'click', item: any): void
}>()

// 第 2 行只在 name 非空且不同于 tag 时显示
const showName = computed(() => !!props.name && props.name !== props.tagText)

// 优先级：item.img > vendorImg > imgUrl > categoryImg
const imgSrc = computed(() => props.item?.img || props.item?.vendorImg || props.item?.imgUrl || props.item?.categoryImg)
</script>

<style scoped lang="scss">
.game-card {
	display: flex;
	flex-direction: column;
	gap: 12px;
	cursor: pointer;

	&__img {
		position: relative;
		width: 100%;
		border-radius: 16px;
		overflow: hidden;

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&__info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 0 4px;
	}

	&__tag {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 22px;
		color: #6b8f7f;
		line-height: 1.2;
		min-width: 0;
	}

	&__tag-icon {
		width: 48px;
		height: 32px;
		flex-shrink: 0;
	}

	&__tag-text {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__name {
		font-size: 26px;
		font-weight: 600;
		color: var(--text_color_L1);
		line-height: 1.2;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
