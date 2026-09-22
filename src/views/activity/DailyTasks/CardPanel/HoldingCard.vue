<template>
	<div class="holding-card">
		<div class="hc-head">
			<span class="hc-progress">{{ t('progress') }} {{ progressPercent }}%</span>
			<span class="hc-taken" v-html="claimedDaysHtml"></span>
		</div>

		<div class="hc-bar" v-if="progressPercent > 0">
			<i :style="{ width: `${progressPercent}%` }"></i>
		</div>

		<div class="hc-days" :class="{ scrollable: isLongCard }" ref="daysRef">
			<div
				class="hc-day"
				v-for="day in holding.days"
				:key="day.dayIndex"
				:class="dayClass(day)"
				:ref="(el) => setDayRef(el, day)"
			>
				<span class="d-label">
					<img v-if="day.status === DAY_TAKEN" src="@public/activity/DailyTask/period_card_taken.png" />
					<!-- 月卡天数格按设计稿写「DAY 3」这种固定英文样式,周卡沿用原「第N天」 -->
					<template v-else>{{ t(cardType === 2 ? 'periodCardDayLabelMonth' : 'periodCardDayLabel', { n: day.dayIndex }) }}</template>
				</span>
				<span class="d-amount">{{ money(day.amount) }}</span>
			</div>
		</div>

		<div class="hc-swipe" v-if="isLongCard">{{ t('periodCardSwipeHint', { n: cardDays }) }}</div>

		<div class="hc-stats">
			<div class="hc-stat">
				<div class="v">{{ takeDayCount }}/{{ cardDays }}</div>
				<div class="l">{{ t('periodCardStatDays') }}</div>
			</div>
			<div class="hc-stat">
				<div class="v">{{ money(holding.totalRewardAmount) }}</div>
				<div class="l">{{ t('periodCardStatTaken') }}</div>
			</div>
			<div class="hc-stat">
				<div class="v">{{ money(remainAmount) }}</div>
				<div class="l">{{ t('periodCardStatRemain') }}</div>
			</div>
		</div>

		<div class="hc-btn" :class="[btnState, { locked: submitting }]" @click="onClaim">{{ btnText }}</div>
	</div>
</template>

<script setup lang="ts">
import { currencyTrim as money } from '@/utils'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// days[].status 契约:1 已领 / 2 已过作废 / 3 今日可领 / 4 未到
const DAY_TAKEN = 1
const DAY_MISSED = 2
const DAY_TODAY = 3
const DAY_LOCKED = 4
// cardState 契约:1 持卡中 / 2 已完成 / 3 已过期
const CARD_HOLDING = 1
const CARD_FINISHED = 2
const LONG_CARD_DAYS = 7

const props = defineProps({
	holding: { type: Object as () => any, required: true },
	totalDays: { type: Number, default: 7 },
	// 1 周卡 / 2 月卡;只用来决定天数格标签样式(DAY N vs 第N天),不参与其它业务逻辑
	cardType: { type: Number, default: 1 },
	// 公共响应体的 ServiceNowTime,站点时区墙钟串;倒计时以它为锚
	serverTime: { type: String, default: '' },
	submitting: { type: Boolean, default: false }
})
const emit = defineEmits<{ claim: [holding: any]; expire: [] }>()

const { t } = useI18n()

// 契约在持卡实例上带 totalDays,优先用它;活动级天数仅作兜底
const cardDays = computed(() => Number(props.holding.totalDays) || props.totalDays)
const takeDayCount = computed(() => Number(props.holding.takeDayCount) || 0)

// 契约不下发剩余应领,按「每日奖励 × 还能领的天数」派生;实时奖励改手动领后也算未落袋的一笔
// 不能用 cardDays - takeDayCount:已过作废(status 2)的格子既不计入已领,也永远领不到
// 卡不在持卡中(已完成/已过期)时剩余一律为 0,没领的那些已经作废
const remainAmount = computed(() => {
	if (props.holding.cardState !== CARD_HOLDING) return 0
	const claimable = props.holding.days?.filter(
		(day: any) => day.status === DAY_TODAY || day.status === DAY_LOCKED
	).length ?? 0
	const daily = Number(props.holding.dailyRewardAmount) * claimable
	return props.holding.realtimeTaken ? daily : daily + Number(props.holding.realtimeRewardAmount)
})

// 超过 7 天改横滑,否则一屏铺满
const isLongCard = computed(() => cardDays.value > LONG_CARD_DAYS)

const progressPercent = computed(() => {
	if (!cardDays.value) return 0
	return Math.floor((takeDayCount.value / cardDays.value) * 100)
})

// 「已领取 2 / 7 天」的数字要高亮,整句又必须整体翻译,故插值后再包 <b>
const claimedDaysHtml = computed(() =>
	t('periodCardClaimedDays', {
		taken: `<b>${takeDayCount.value}</b>`,
		total: cardDays.value
	})
)

// 格子按购买日为第 1 天顺排(周卡 7 格、月卡 30 格),直接用契约 days,不按星期几/几号对齐
// 契约的 status 没有「下一个待领日」态,按首个未到格派生——已过作废会跳过,不能拿 takeDayCount 当下标
const nextDayIndex = computed(() => {
	if (props.holding.cardState !== CARD_HOLDING || props.holding.canTakeToday) return -1
	return props.holding.days?.find((day: any) => day.status === DAY_LOCKED)?.dayIndex ?? -1
})

// 购买当天即第 1 天,须高亮不能置灰;契约若未给「今日可领」态,按钮可领时退回首个「未到」格补亮
const todayDayIndex = computed(() => {
	if (!canClaim.value) return -1
	const days = props.holding.days ?? []
	const day = days.find((d: any) => d.status === DAY_TODAY) ?? days.find((d: any) => d.status === DAY_LOCKED)
	return day?.dayIndex ?? -1
})

const dayClass = (day: any) => ({
	taken: day.status === DAY_TAKEN,
	missed: day.status === DAY_MISSED,
	today: day.dayIndex === todayDayIndex.value,
	next: day.dayIndex === nextDayIndex.value
})

// 不能用 new Date():玩家改系统时间即可骗过前端;两端同为站点时区墙钟,取时分秒算到次日 00:00
const SECONDS_PER_DAY = 86400
const secondsToNextMidnight = (serverTime: string) => {
	const hms = /(\d{1,2}):(\d{2}):(\d{2})\s*$/.exec(serverTime || '')
	if (!hms) return 0
	return SECONDS_PER_DAY - (Number(hms[1]) * 3600 + Number(hms[2]) * 60 + Number(hms[3]))
}

// 后端下发 nextTakeSeconds 时以它为准——它掌握站点时区配置,比墙钟串反推更权威
const initialRemain = computed(() => {
	const fromApi = Number(props.holding.nextTakeSeconds)
	return Number.isFinite(fromApi) && fromApi > 0 ? fromApi : secondsToNextMidnight(props.serverTime)
})

const remainSeconds = ref(0)
let timer: any = null

const stopTick = () => {
	if (timer) {
		clearInterval(timer)
		timer = null
	}
}

watch(
	initialRemain,
	(value) => {
		stopTick()
		remainSeconds.value = value
		if (remainSeconds.value <= 0) return
		timer = setInterval(() => {
			if (remainSeconds.value > 0) return remainSeconds.value--
			stopTick()
			// 归零只是前端墙钟到点,canTakeToday 还是上次拉取的值;不让父级重拉,按钮会永远停在 00:00:00
			emit('expire')
		}, 1000)
	},
	{ immediate: true }
)

onBeforeUnmount(stopTick)

const countdownText = computed(() => {
	const total = remainSeconds.value
	const pad = (n: number) => String(n).padStart(2, '0')
	return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
})

const canClaim = computed(() => props.holding.cardState === CARD_HOLDING && props.holding.canTakeToday)

const btnState = computed(() => {
	if (canClaim.value) return 'can'
	if (props.holding.cardState === CARD_HOLDING) return 'wait'
	return 'done'
})

// 领取接口实时未领时优先发实时,故按钮与动画的金额都要跟着 realtimeTaken 切
const claimAmount = computed(() =>
	props.holding.realtimeTaken ? props.holding.dailyRewardAmount : props.holding.realtimeRewardAmount
)

const btnText = computed(() => {
	if (canClaim.value) return `${t('periodCardClaimNow')} +${money(claimAmount.value)}`
	if (props.holding.cardState === CARD_HOLDING) return `${t('periodCardNextIn')} ${countdownText.value}`
	return props.holding.cardState === CARD_FINISHED ? t('completed') : t('periodCardExpired')
})

const onClaim = () => {
	if (!canClaim.value || props.submitting) return
	emit('claim', props.holding)
}

// 月卡 30 格进场时把「今日可领」滚进视野,否则玩家看到的永远是第 1 天
const daysRef = ref<HTMLElement | null>(null)
const todayEl = ref<HTMLElement | null>(null)
// 今天已领完时 todayDayIndex 为 -1,改定位到下一个待领格
const setDayRef = (el: any, day: any) => {
	const target = todayDayIndex.value > 0 ? todayDayIndex.value : nextDayIndex.value
	if (el && day.dayIndex === target) todayEl.value = el
}

// offsetLeft 相对 .holding-card(relative)算,须减去格子容器自身偏移,否则会多滚一个卡片内边距
const scrollToToday = () => {
	const box = daysRef.value
	const el = todayEl.value
	if (!box || !el || !isLongCard.value) return
	box.scrollLeft = el.offsetLeft - box.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2
}

watch([todayEl, isLongCard], scrollToToday)

// 月卡面板在 v-show 隐藏的 Tab 里挂载,那时容器宽为 0、设 scrollLeft 无效;切到该 Tab 进入视野时再滚一次
let observer: IntersectionObserver | null = null
onMounted(() => {
	if (!daysRef.value) return
	observer = new IntersectionObserver(([entry]) => entry.isIntersecting && scrollToToday())
	observer.observe(daysRef.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
.holding-card {
	position: relative;
	padding: 20px 24px;
	margin-bottom: 24px;
	border: 4px solid var(--main-color);
	border-radius: 20px;
	background: var(--bg_color_L2);

	.hc-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 14px;
		font-size: 28px;
		font-weight: 600;
		color: var(--text_color_L1);

		.hc-taken :deep(b) {
			color: var(--main-color);
		}
	}

	.hc-bar {
		height: 20px;
		margin-bottom: 16px;
		padding: 4px 4px;
		border-radius: 20px;
		background: #545252;
		overflow: hidden;

		i {
			display: block;
			height: 100%;
			border-radius: 10px;
			background: var(--main_gradient-color);
			transition: width 0.3s;
		}
	}

	.hc-days {
		display: flex;
		gap: 6px;
		&.scrollable {
			overflow-x: auto;
			padding-bottom: 4px;
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
			.hc-day {
				flex: 0 0 90px;
			}
		}
	}

	.hc-day {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// 内容区高 52:文字格 12 行高标签 + 16 间距 + 24 行高金额;已领格 28 图标 + 0 间距 + 24
		gap: 16px;
		height: 100px;
		padding: 12px 4px;
		border: 2px solid transparent;
		border-radius: 30px;
		background: #7b7a7a;
		color: #fff;
		font-size: 20px;

		.d-label {
			line-height: 12px;
			white-space: nowrap;
		}
		.d-amount {
			font-size: 18px;
			line-height: 24px;
			font-weight: 600;
			white-space: nowrap;
		}
		img {
			display: block;
			width: 28px;
			height: 28px;
		}

		&.taken {
			gap: 0;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%), var(--main-color);
			box-shadow: 0 4px 0 var(--main-color);
			color: #fff;
		}
		&.next,
		&.today {
			border-color: var(--main-color);
			background: var(--bg_color_L2);
			box-shadow: 0 8px 16px rgba(208, 208, 237, 0.36);
			color: var(--main-color);

			.d-label {
				color: var(--norm_red-color);
			}
		}
		&.missed {
			opacity: 0.5;

			.d-amount {
				text-decoration: line-through;
			}
		}
	}

	.hc-swipe {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-top: 10px;
		font-size: 24px;
		line-height: 28px;
		font-weight: 500;
		color: var(--text_color_L3);

		// 走背景图而非 <img>:本仓 svg 经模板 src 引入会被当组件解析
		&::before,
		&::after {
			content: '';
			flex: 0 0 20px;
			height: 20px;
			background: url('@/assets/icons/activity/DailyTask/period_card_arrow_l.svg') no-repeat center / 100% 100%;
		}
		&::after {
			background-image: url('@/assets/icons/activity/DailyTask/period_card_arrow_r.svg');
		}
	}

	.hc-stats {
		display: flex;
		margin: 16px 0;

		.hc-stat {
			flex: 1;
			text-align: center;

			& + .hc-stat {
				border-left: 1px solid var(--Dividing-line_color);
			}
			.v {
				font-size: 32px;
				font-weight: 600;
				color: var(--text_color_L1);
			}
			.l {
				margin-top: 2px;
				font-size: 22px;
				color: var(--text_color_L3);
			}
		}
	}

	.hc-btn {
		height: 76px;
		line-height: 76px;
		text-align: center;
		border-radius: 76px;
		font-size: 28px;
		font-weight: 700;

		&.can {
			background: var(--main_gradient-color);
			color: var(--text_color_L4);
		}
		// 禁用态照设计稿是主色按钮压 60% 黑;用叠加而非硬编码深红,金色站压出来就是暗金
		&.wait,
		&.done {
			background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), var(--main_gradient-color);
			box-shadow: 0 4px 0 var(--main-color);
			color: var(--text_color_L2);
		}

		&.locked {
			opacity: 0.6;
			pointer-events: none;
		}
	}
}
</style>
