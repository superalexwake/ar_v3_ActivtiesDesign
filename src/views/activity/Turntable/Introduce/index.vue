<script setup lang="ts">
import { useTurntable } from '@/hooks'
import { onMounted } from 'vue'

const { getTurntablInfo, store, onClick } = useTurntable()
onMounted(() => {
	getTurntablInfo()
})
</script>

<template>
	<div class="turntable-pointRule">
		<NavBar :title="$t('activityIntroduce')" :placeholder="false" left-arrow @click-left="onClick" />
		<div class="turntable-pointRule-wrap">
			<div class="turntable-pointRule__body">
				<div class="turntable-pointRule__title">
					<span>
						<svg-icon name="eventDescriptionArrow" />
						
					</span>
					<span>{{ $t('turntableActivityTime') }}</span>
				</div>
				<p class="note">{{ $t('turntableStart') }}</p>
			</div>
			<div class="turntable-pointRule__body">
				<div class="turntable-pointRule__title">
					<span>
						<svg-icon name="eventDescriptionArrow" />
					</span>
					<span>{{ $t('validityPeriod') }}</span>
				</div>
				<p class="note">{{ $t('officialNotice') }}</p>
			</div>
			<div class="turntable-tips">{{ $t('turntableRule') }}。</div>
			<div class="turntable-pointRule__body">
				<div class="turntable-pointRule__title">
					<span>
						<svg-icon name="eventDescriptionArrow" />
					</span>
					<span>{{ $t('turntableJoinRule') }}</span>
				</div>
				<p class="satisfy-text" v-html="$t('turntableSatisfy', [store.vipRating.join(', ')])">
				</p>
				<!-- <p v-if="![0, -1].includes(store.bindingType)">
					{{ $t('turntableBind') }} <span>{{ bindingTypes[store.bindingType] || '' }}</span>
				</p> -->
				<!-- <p>{{ $t('turntablePrize') }}</p> -->
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.turntable {
	&-pointRule {
		&-wrap {
			padding: 30px 20px;
		}

		&__title {
			height: 70px;
			padding: 16px 20px;
			color: var(--text_white, var(--text_color_L1));
			font-size: 32px;
			line-height: 70px-16px * 2;
			display: flex;
			align-items: center;
			background: var(--pop_bg-color,var(--bg_color_L3));
			clip-path: polygon(0 0, 100% 0%, 96% 100%, 0% 100%);
			
			svg {
				width: 34px;
				height: 34px;
				margin-right: 20px;
			}
		}

		&__body {
			display: flex;
			flex-direction: column;
			gap: 10px;
			border-radius: 10px;
			background: var(--darkBg,var(--bg_color_L2));
			margin-bottom: 15px;
			.note
			{
				color: var(--text_color_L1);
			}
			p {
				padding: 20px;
				color: var(--text_color_L2);
				:deep(span) {
					color: var(--norm_red-color);
				}
			}
		}
	}

	&-tips {
		margin: 40px 0;
		color: var(--norm_red-color);
		font-family: Inter;
		font-size: 26px;
		font-style: normal;
		font-weight: 400;
		line-height: 40px;
		border-radius: 16px;
		padding: 28px;
		background: var(--bg_color_L2);
	}
}
.satisfy-text{
	line-height: 36px;
}
</style>
