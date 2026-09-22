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
				<img :src="item.bannerUrl" @error="$emit('image-error', item)" />
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
import type { ActivityList } from '@/types/api'

const props = defineProps<{
	list: ActivityList[]
	loading: boolean
	finished: boolean
	isShowEmpty: boolean
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
</script>

<style lang="scss" scoped>
.activitySection__container {
	display: flex;
	flex-direction: column;
	gap: 26px;
	width: 100%;
	padding-left: 24px;
	padding-right: 24px;

	& > .box {
		width: 100%;
		border-radius: 20px;
		background: var(--darkBg,var(--bg_color_L2));
		overflow: hidden;
		color: var(--darkTextW,var(--text_color_L1));

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
			width: 100%;
			height: 260px;
		}
	}
}
</style>
