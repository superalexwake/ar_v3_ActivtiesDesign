<script setup lang="ts">
import { useTurntable } from '@/hooks'
import { currency } from '@/utils'
import ruleContainer from '@/components/common/Rule.vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { getTurntablInfo, store, onClick } = useTurntable()
const rules = ref([t('turntableRule2'), t('turntableRule3'), t('turntableRule4'), t('turntableRule5')])
const taskType = {
	1: t('singleDeposit'),
	2: t('cumulativeDeposits')
}
const item = computed(() => {
	if (!store.taskList.length) return null;
	const task = store.taskList.sort((item, item2) => item.targetAmount - item2.targetAmount)[store.taskList.length - 1]
	return task
})
onMounted(() => {
	getTurntablInfo()
})
</script>

<template>
	<div class="turntable-detail">
		<NavBar :title="$t('activityDestitle')" :placeholder="false" left-arrow @click-left="onClick" />
		<div class="turntable-detail-wrap">
			<div class="turntable-detail-hero">
				<div class="turntable-detail-hero__wrapper">
					<div class="turntable-detail-hero__wrapper-titlebox">
						<div class="turntable-detail-hero__wrapper-title">{{ $t('turntableTask') }}</div>
						<div class="turntable-detail-hero__wrapper-title">{{ $t('turntableCount') }}</div>
						<div class="turntable-detail-hero__wrapper-title">{{ $t('turntableTime') }}</div>
					</div>
					<ul>
						<li v-for="(item, index) in store.taskList" :key="index">
							<div>
								<p class="targetAmount">{{ currency(item.targetAmount) }}</p>
								<p>{{ taskType[item.taskType] }}</p>
							</div>
							<div class="rotateNum">+{{ item.rotateNum }}</div>
							<div>00:00-23:59</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<ruleContainer :name="$t('rule')" render="html" :tiplist="rules">
			<div class="turntable-detail-tips">
				<p>{{ $t('example') }}：</p>
				<p v-if="item" v-html="$t('turntableExample', [currency(item.targetAmount), item.rotateNum])"></p>
			</div>
		</ruleContainer>
	</div>
</template>

<style scoped lang="scss">
.turntable-detail {
	&-wrap {
		padding: 30px 20px;
	}
	&-hero {
		display: flex;
		margin: 0 auto 40px;
		color: var(--text_color_L2);
		border-radius: 10px;
		overflow: hidden;
		background-color: var(--bg_color_L2);

		&__wrapper {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;

			&-titlebox {
				display: flex;
				justify-content: center;
				align-items: center;
				flex: 1;
				width: 100%;
				color: var(--text_color_L1);
				background: var(--sheet_nva_color);
			}
			ul {
				width: 100%;

				li {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					padding: 10px 10px;
					&:nth-child(even) {
						background: var(--sheet_detail_bg_color);
					}
					div {
						height: 100%;
						flex: 1;
						font-size: 28px;
						padding: 26px 0;
						text-align: center;
					}
				}
				.targetAmount {
					color: var(--textBlueLight, var(--norm_red-color));
					font-family: Inter;
					font-size: 26px;
					font-style: normal;
					font-weight: 500;
					line-height: 26px;
					margin-bottom: 6px;
				}
				p {
					color: var(--text_color_L2);
					font-size: 22px;
					font-style: normal;
					font-weight: 400;
					line-height: 22px;
				}
				.rotateNum {
					color: var(--darkTextW, var(--text_color_L1));
					font-size: 26px;
					font-style: normal;
					font-weight: 500;
					line-height: 26px;
				}
			}
			&-title {
				width: 100%;
				height: 80px;
				padding-block: 26px;
				font-size: 32px;
				line-height: 24px;
				text-align: center;
				color: var(--text_white, var(--text_color_L1));
				background: var(--sheet_nva_color);
			}

			&-content {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 100%;
				height: 100%;

				& > div {
					width: 100%;
					padding: 26px 0;
					font-size: 28px;
					line-height: 28px;
					text-align: center;
					border-bottom: 1px solid var(--norm_red-color);

					&:last-of-type {
						border-bottom: none;
					}
				}
			}
		}
	}
	&-tips {
		border-radius: 16px;
		background: var(--bg_color_L1);
		min-height: 220px;
		padding: 20px;
		color: var(--text_color_L2);
		font-size: 26px;
	}
	:deep(.rule) {
		span {
			color: var(--norm_red-color);
		}
	}
}
</style>
