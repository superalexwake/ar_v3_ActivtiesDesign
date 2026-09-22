<template>
	<div class="result-item" @click="toggleDetails" :class="{'result-item_detail': showDetails}">
		<div class="result-summary">
			<div class="position">{{playNumberText}}</div>
			<div :class="['badge', (!isNaN(playTypeText) ? getCircleClass(playTypeText) : badgeClass)]">
				<span :class="{ 'small-text': isTextBadge ,'num_text': !isNaN(playTypeText)}">{{ playTypeText }}</span>
			</div>
			<div class="info">
				<div class="id">{{ info?.issueNumber }}</div>
				<div class="timestamp">{{ fromTime(info?.betTime, 'YYYY-MM-DD HH:mm:ss') }}</div>
			</div>
			<div class="status-container">
				<div :class="['status', statusClass]">{{ statusText }}</div>
				<div :class="['amount', amountClass]">{{ info?.winLoseAmount > 0 ? ('+' + currency(info.state?(info.winLoseAmount+info.amount):info.winLoseAmount)):
					currency(info?.winLoseAmount) }}</div>
			</div>
		</div>
		<div v-if="showDetails" class="driver"></div>
		<div v-if="showDetails" class="details-section">
			<h2 class="details-title">{{$t('detail')}}</h2>

			<div class="details-container">
				<div class="detail-item">
					<div class="detail-label">{{$t('orderNo')}}</div>
					<div class="detail-value with-icon">
						<span>{{ info?.orderNo }}</span>
						<svg @click.stop="copy(info?.orderNo + '')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
							<path
								d="M8.6665 25.3337H27.3332V10.667H19.9998V2.66699H8.6665V25.3337Z"
								stroke="#3478FE"
								stroke-width="2.66667"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M20 2.66699L27.3333 10.667"
								stroke="#3478FE"
								stroke-width="2.66667"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M4.6665 13.333V29.333H18.6665"
								stroke="#3478FE"
								stroke-width="2.66667"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path d="M12.6665 13.333H15.3332" stroke="#3478FE" stroke-width="2.66667" stroke-linecap="round" />
							<path d="M12.6665 18.667H20.6665" stroke="#3478FE" stroke-width="2.66667" stroke-linecap="round" />
						</svg>
					</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{$t('betNumber')}}</div>
					<div class="detail-value">{{ info?.issueNumber || '--' }}</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{ $t('amountMay') }}</div>
					<div class="detail-value">{{ currency(info?.amount) }}</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{$t('numMay')}}</div>
					<div class="detail-value">{{ info?.betMultiple }}</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{$t('afterTaxAmount')}}</div>
					<div class="detail-value">{{ currency(info?.realAmount) }}</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{$t('tax')}}</div>
					<div class="detail-value">{{ currency(info?.fee) }}</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{$t('resultMay')}}</div>
					<div class="detail-value number-circles">
						<span class="position-text">1st</span>
						<div v-for="num in resultArr" :key="num" :class="['circle', getCircleClass(num)]">{{ num }}</div>
					</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{ $t('selectMay') }}</div>
					<div class="detail-value">
						<span class="position-text">{{ playNumberText }}</span>
						<div class="circle blue small-circle">{{ playTypeText[0] }}</div>
					</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{$t('statusMay')}}</div>
					<div :class="['detail-value','status-text', amountClass]">{{ statusText }}</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{ $t('winOrLose') }}</div>
					<div :class="['detail-value', amountClass]">{{ info?.winLoseAmount > 0 ? '+' + currency(info?.winLoseAmount):currency(info?.winLoseAmount) }}</div>
				</div>

				<div class="detail-item">
					<div class="detail-label">{{$t('createTime')}}</div>
					<div class="detail-value">{{ fromTime(info.betTime, 'YYYY-MM-DD HH:mm:ss') }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {currency, fromTime, copy} from '@/saasLottery/utils'
import {useI18n} from "vue-i18n";

const props = defineProps({
	info: {
		type: Object,
		required: true
	}
})
const { t } = useI18n()

const showDetails = ref(false)

const toggleDetails = () => {
	showDetails.value = !showDetails.value
}
const playNumberText = computed(() => {
	let playType = props.info?.betContent.split('_')[0]
	if (playType.includes('First')) {
		return '1st'
	} else if (playType.includes('Second')) {
		return '2nd'
	} else {
		return '3rd'
	}
})

const playTypeText = computed(() => {
	let playType = props.info?.betContent.split('_')[1]
	if (!isNaN(playType)) {
		return playType
	} else {
		return playType
	}
})

const badgeClass = computed(() => {
	// if (props.badge && ['6', '7', '8'].includes(props.badge)) {
	// 	return props.badge === '6' ? 'purple' : props.badge === '7' ? 'brown' : 'teal'
	// }
	return 'blue'
})

const isTextBadge = computed(() => {
	// return props.badge ? !['6', '7', '8'].includes(props.badge) : false
	return true
})

const statusText = computed(() => {
	if (props.info?.state> 1) return '--'
	return props.info?.state === 1 ? t('success') : t('fail')
})

const statusClass = computed(() => {
	if (props.info?.state> 1) return '--'
	return props.info?.state === 1 ? 'Succeed' : 'Failed'
})

const amountClass = computed(() => {
	return props.info?.winLoseAmount > 0 ? 'positive' : 'negative'
	// return props.info?.winLoseAmount && props.info.winLoseAmount.startsWith('-') ? 'negative' : 'positive'
})

const resultArr = computed(() => {
	return props.info?.premium?.split(',') || []
})

const getCircleClass = (num: number) => {
	const classes = [
		'red',
		'blue-purple',
		'orange',
		'green',
		'light-blue',
		'purple',
		'brown',
		'teal',
		'medium-blue',
		'orange-red'
	]
	return classes[num - 1]
}
</script>

<style lang="scss" scoped>
.result-item {
	width: 650px;
	margin: 0 auto;
	min-height: 132px;
	border-bottom: 1px solid var(--Dividing-line_color);
	cursor: pointer;
}
.result-item_detail {
	width: 100%;
	padding: 0 24px;
}

.result-summary {
	min-height: 132px;
	display: flex;
	align-items: center;
}

.position {
	width: 50px;
	margin-right: 20px;
	font-size: 28px;
	font-weight: 500;
	color: var(--text_color_L1);
}

.badge {
	height: 72px;
	width: 72px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--bg_color_L2, #fff);
	font-weight: 500;
	margin-right: 12px;
	font-size: 48px;
}

.small-text {
	font-size: 24px;
}

.num_text {
	font-size: 48px;
}

.purple {
	background-color: #c36fff;
}

.brown {
	background-color: #b7805f;
}

.teal {
	background-color: #2ad4c5;
}

.blue {
	background-color: var(--main-color);
}

.info {
	flex: 1;
	font-size: 32px;
	font-weight: 400;
	line-height: 34px; /* 106.25% */
}

.id {
	color: var(--text_color_L1, #04060a);
	font-weight: 500;
	font-size: 32px;
	margin-bottom: 12px;
}

.timestamp {
	color: var(--text_color_L2, #646c7b);
	font-size: 24px;
	font-weight: 400;
	line-height: 26px; /* 108.333% */
	margin-top: 2px;
}

.status-container {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.status {
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 28px;
	font-weight: 500;
	margin-bottom: 4px;
}

.Failed {
	background-color: var(--Secondary_Color1);
	color: var(--Secondary_red_color);
}

.Succeed {
	background-color: var(--Secondary_Color2);
	color: var(--Secondary_green_color);
}

.amount {
	font-size: 24px;
	font-weight: 700;
}

.negative {
	color: var(--Secondary_red_color);
}

.positive {
	color: var(--Secondary_green_color);
}
.driver {
	border-bottom: 1px solid var(--Dividing-line_color);
	width: calc(100% + 48px);
	margin-left: -24px;
	margin-bottom: 12px;
}
.details-section {
	.details-title {
		font-size: 32px;
		font-weight: 400;
		line-height: 48px;
		margin-bottom: 12px;
		color: var(--text_color_L1, #04060a);
	}

	.details-container {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 56px;
		padding: 0px 20px;
		border-radius: 8px;
		background: var(--bg_color_L1, #f6f6f6);
	}

	.detail-label {
		color: var(--text_color_L2, #646c7b);
		font-size: 24px;
	}

	.detail-value {
		color: var(--text_color_L1, #04060a);
		font-size: 24px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.with-icon {
		display: flex;
		justify-content: space-between;
		align-items: center;
		svg {
			width: 32px;
			height: 32px;
			margin-left: 12px;
		}
	}

	.number-circles {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.position-text {
		margin-right: 4px;
	}

	.circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--bg_color_L2, #fff);
		font-size: 24px;
	}

	.small-circle {
		width: 40px;
		height: 40px;
	}

	.negative {
		color: var(--Secondary_red_color);
	}

	.positive {
		color: var(--Secondary_green_color);
	}
}

.red {
	background-color: #fd5358;
}
.blue-purple {
	background-color: #7b8eff;
}
.orange {
	background-color: #fbb84d;
}
.green {
	background-color: #3ac967;
}
.light-blue {
	background-color: #54b0fd;
}
.medium-blue {
	background-color: #7fadd1;
}
.orange-red {
	background-color: #fd8654;
}

.status-text {
	color: var(--norm_red-color, #fb5b5b);
}
</style>
