<template>
	<div v-for="(item, index) in list" :key="index" class="c2cRecord__C-item" @click="goDetail(item.orderNo, item.state)">
		<div class="c2cRecord__C-item-h">
			<div class="title">{{ $t('withdraw') }}</div>
			<div :class="['state' + item.state]">
				{{ stateMap[item.state] }}
				<span v-if="item.state === 1">{{ formatTime }}</span>
				<span v-if="[11, 12].includes(item.state)">: {{ formatTime_11 }}</span>
				<van-icon v-if="item.state != 2" name="arrow" size="14" />
			</div>
		</div>
		<div class="c2cRecord__C-item-a">
			<span class="title">{{ $t('amount') }}</span> {{ currency(item.orderAmount) }}
		</div>
		<div class="c2cRecord__C-item-u">
			<span class="title">UTR</span>
			<span>{{ item.transactionNo }}<svg-icon name="copy" @click.stop="copy(item.transactionNo)"  /></span>
		</div>
		<div class="c2cRecord__C-item-t">
			<span class="title">{{ $t('time') }}</span
			>{{ item.createTime }}
		</div>
		<div class="c2cRecord__C-item-id">
			<span class="title">{{ $t('orderNo') }}</span
			><span>{{ item.orderNo }}<svg-icon name="copy" @click.stop="copy(item.orderNo)" /></span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { currency, copy } from '@/utils'
import { ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

export type ListProps = {
	list: Array<any>
}

const router = useRouter()
const stateMap = [
	t('c2cState0'),
	t('c2cState1'),
	t('c2cState2'),
	t('c2cState3'),
	t('c2cState4'),
	t('c2cTip9'),
	t('c2cState6'),
	t('c2cState7'),
	t('c2cState8'),
	t('c2cState9'),
	t('c2cState10'),
	t('c2cState11'),
	t('c2cState11'),
	t('c2cState13'),
	t('c2cState14'),
]
const stateindex = ref<any>(null)
const countDownTime = ref(0)
const formatTime = ref('00:00')
const formatTime_11 = ref('00:00')
const timer = ref<NodeJS.Timeout | null>(null)
const timer11 = ref<NodeJS.Timeout | null>(null) //匹配中状态的计时器
const props = withDefaults(defineProps<ListProps>(), {})

const goDetail = (orderNo: string, state: any) => {
	// if (state == 2) return
	localStorage.setItem('c2cOrderNo', orderNo)
	router.push({ name: 'Withdraw-C2cDetail', query: { order: orderNo, state } })
}
watch(
	() => props.list,
	(newList) => {
		//确认中倒计时
		stateindex.value = newList.findIndex((item) => item.state === 1)
		if (stateindex.value != -1) {
			const startTime = newList[stateindex.value].serviceTime.replace(/-/g, '/')
			const endTime = newList[stateindex.value].confrimEndTime.replace(/-/g, '/')
			countDownTime.value = new Date(endTime).getTime() - new Date(startTime).getTime()
			if (countDownTime.value > 0) {
				clearInterval(timer.value as NodeJS.Timeout)
				startTimer()
			} else {
				formatTime.value = '00:00'
			}
		} else {
			formatTime.value = '00:00'
		}

		//匹配中、提现超时倒计时
		let item = newList.find((item) => item.state === 11 || item.state === 12)
		if (item) {
			const startTime11 = item.auditEndTime.replace(/-/g, '/')
			const endTime11 = item.serviceTime.replace(/-/g, '/')
			countDownTime.value = new Date(endTime11).getTime() - new Date(startTime11).getTime()
			clearInterval(timer11.value as NodeJS.Timeout)
			startTimer11()
		} else {
			formatTime_11.value = '00:00'
		}
	}
)
const formatDuration = (duration: number) => {
	const hours = Math.floor(duration / 3600000)
	const minutes = Math.floor((duration - hours * 3600000) / 60000)
	const seconds = Math.floor((duration - hours * 3600000 - minutes * 60000) / 1000)
	console.log('hours', hours)
	return `${hours ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
}
function startTimer() {
	timer.value = setInterval(() => {
		countDownTime.value -= 1000 // 每次减少1秒
		formatTime.value = formatDuration(countDownTime.value) // 格式化时间
		if (countDownTime.value <= 0) clearInterval(timer.value as NodeJS.Timeout) // 计时结束时清除计时器
	}, 1000)
}
function startTimer11() {
	timer11.value = setInterval(() => {
		countDownTime.value += 1000 // 每次+1秒
		formatTime_11.value = formatDuration(countDownTime.value) // 格式化时间
	}, 1000)
}
onBeforeUnmount(() => {
	clearInterval(timer.value as NodeJS.Timeout)
	clearInterval(timer11.value as NodeJS.Timeout)
})
</script>
<style lang="scss" scoped>
.c2cRecord__C-item {
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

	&-u,
	&-id {
		span {
			display: flex;
			align-items: center;

			img {
				width: 32px;
			}
		}
	}

	&-t,
	&-u {
		color: var(--text_color_L2);
	}

	&-a {
		color: var(--norm_secondary-color);
	}

	&-id {
		color: var(--text_color_L2);
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
</style>
