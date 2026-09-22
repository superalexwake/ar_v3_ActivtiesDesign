<template>
	<div class="c2cRecord__C">
		<div class="c2cRecord__C-head">{{ $t('c2CWithdrawalRecord') }}</div>
		<div class="c2cRecord__C-body">
			<List
				v-model:list="recordList"
				v-model:page-query="pageQuery"
				:api="GetC2CWithdrawRecord"
				:distance="100"
				ref="listRef"
				:is-auto-load="true"
				:showNoM="false"
			>
				<template #content>
					<c2cList :list="recordList" />
				</template>
			</List>
		</div>
		<div class="c2cRecord__C-allrecord" @click="goAllRecord">{{ $t('allRecords') }}</div>
	</div>
</template>
<script setup lang="ts">
import List from '@/components/common/List.vue'
import c2cList from './c2cRecordList.vue'
import { GetC2CWithdrawRecord } from '@/api'
import { ref, defineExpose } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listRef = ref()
const pageQuery = ref({
	startDate: '',
	endDate: '',
	type: -1,
	state: -1,
	category: -1
})
const recordList = ref<any>([])
const goAllRecord = () => {
	router.push({
		name: 'WithdrawHistory'
	})
}
const resetRefresh = () => {
	listRef.value.resetRefresh()
}
defineExpose({
	resetRefresh
})
</script>
<style lang="scss" scoped>
.c2cRecord__C {
	margin-top: 60px;

	&-head {
		height: 48px;
		line-height: 48px;
		background-size: 48px;
		background-repeat: no-repeat;
		background-position: 12px center;
		font-weight: 600;
		font-size: 32px;
		color: var(--text_color_L1);
		padding-left: 66px;
		text-align: left;
		margin-bottom: 42px;
	}

	&-item {
		background: var(--bg_color_L2);
		box-shadow:var(--BoxShadowColor-9);
		border-radius: 10px;
		padding: 24px 20px;

		&-a,
		&-u,
		&-t,
		&-id,
		&-h {
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 26px;

			.title {
				color: var(--text_color_L2);
			}

			& + div {
				margin-top: 20px;
			}
		}

		&-a {
			color: var(--norm_secondary-color);
		}

		&-h {
			height: 74px;
			padding-bottom: 24px;
			border-bottom: 1px solid var(--gray-color-1);

			& > div.title {
				height: 50px;
				background-color: var(--norm_red-color);
				border-radius: 10px;
				color: #fff;
				font-size: 28px;
				padding: 0 50px;
			}

			$colors: var(--norm_bule-color), var(--norm_red-color), var(--norm_secondary-color), #f95959, var(--norm_red-color), #f95959, var(--text_color_L2), #f95959, #ff8616, var(--norm_secondary-color);

			@for $i from 0 through 9 {
				.state#{$i} {
					color: nth($colors, $i + 1);
				}
			}

			:deep(i) {
				color: var(--text_color_L2);
			}
		}

		& + div {
			margin-top: 20px;
		}
	}

	&-allrecord {
		height: 70px;
		line-height: 70px;
		border: 1px solid var(--main-color);
		border-radius: 80px;
		color: var(--main-color);
		font-size: 30px;
	}
}
</style>
