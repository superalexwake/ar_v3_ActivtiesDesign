<template>
	<div class="dailySignIn__container">
		<template v-if="!props.embedded">
		<NavBar title="" :placeholder="false" left-arrow @click-left="onClick" >
			<template #right>
				<div class="navi-record" @click="goRecord">
					<svg-icon name="watchCollection" />
					<span>{{$t('awardsRecord')}}</span>
				</div>
			</template>
		</NavBar>
		<div
			class="task-banner"
			:class="{ 'card-banner': cardBannerUrl }"
			:style="cardBannerUrl ? { backgroundImage: `url(${cardBannerUrl})` } : undefined"
		>
			<div>
				<p>
					<div class="banner-title">{{ activeCardBanner ? activeCardBanner.title : $t('actTip1') }}</div>
					<div class="banner-content">
						<div class="banner-rule" v-if="activeCardBanner" @click="ruleDialog = true">
							<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M23.67 3H12.33C6.66 3 5.25 4.515 5.25 10.56V27.45C5.25 31.44 7.44 32.385 10.095 29.535L10.11 29.52C11.34 28.215 13.215 28.32 14.28 29.745L15.795 31.77C17.01 33.375 18.975 33.375 20.19 31.77L21.705 29.745C22.785 28.305 24.66 28.2 25.89 29.52C28.56 32.37 30.735 31.425 30.735 27.435V10.56C30.75 4.515 29.34 3 23.67 3ZM11.67 18C10.845 18 10.17 17.325 10.17 16.5C10.17 15.675 10.845 15 11.67 15C12.495 15 13.17 15.675 13.17 16.5C13.17 17.325 12.495 18 11.67 18ZM11.67 12C10.845 12 10.17 11.325 10.17 10.5C10.17 9.675 10.845 9 11.67 9C12.495 9 13.17 9.675 13.17 10.5C13.17 11.325 12.495 12 11.67 12ZM24.345 17.625H16.095C15.48 17.625 14.97 17.115 14.97 16.5C14.97 15.885 15.48 15.375 16.095 15.375H24.345C24.96 15.375 25.47 15.885 25.47 16.5C25.47 17.115 24.96 17.625 24.345 17.625ZM24.345 11.625H16.095C15.48 11.625 14.97 11.115 14.97 10.5C14.97 9.885 15.48 9.375 16.095 9.375H24.345C24.96 9.375 25.47 9.885 25.47 10.5C25.47 11.115 24.96 11.625 24.345 11.625Z" fill="currentColor"/>
							</svg>{{ $t('ruleillustrate') }}
						</div>
						<template v-else>
							<div>{{$t('awardsTip1')}}</div>
							<div>{{$t('awardsTip3')}}</div>
						</template>
					</div>
				</p>
			</div>
		</div>
		</template>
		<div class="task-tabs" ref="tabsRef" @mousedown="tabsDrag.onDown">
			<button
				v-for="tab in visibleTabs"
				:key="tab.key"
				:class="{ active: activeTab === tab.key }"
				@click="onTabClick(tab.key)"
			>
				{{ tab.label }}
				<span class="tab-badge" v-if="tabBadgeCount(tab.key) > 0">{{ tabBadgeCount(tab.key) }}</span>
			</button>
		</div>
		<Transition :name="`tab-${slideDir}`">
		<div class="task-panel" :key="activeTab">
			<DailySignInPage v-if="activeTab === 'signin'" embedded />

			<template v-if="activeTab === 'day' || activeTab === 'week'">
				<div class="status-filter" ref="statusFilterRef" @mousedown="statusFilterDrag.onDown">
					<div
						v-for="f in TASK_FILTERS"
						:key="String(f.key)"
						class="status-filter__item"
						:class="{ 'is-active': taskFilter === f.key }"
						@click="onFilterClick(f.key)"
					>{{ t(f.labelKey) }}</div>
				</div>
				<div class="claim-all">
					<div class="claim-all__info">
						<span class="claim-all__label">{{ t('taskClaimableAmount') }}</span>
						<span class="claim-all__amount">{{ currency(claimableAmount) }}</span>
					</div>
					<div class="claim-all__btn" :class="{ locked: isBatchClaiming }" @click="onOneKeyClaim">{{ t('taskOneKeyClaim') }}</div>
				</div>
			</template>

			<div class="task-item" v-show="activeTab === 'newbie'" v-if="newbieGiftPackage.length>0">
				<div class="task-item-header">
					<div class="hearder-status new">
						{{ $t('actTip3') }}
					</div>
					<span class="headerR">{{newHeadStatus(newbieGiftPackage[0]?.status)  }}</span>
				</div>
				<div class="task-item-type">
					<div class="type-title new">
						<svg-icon name="actNewGift" />
						<div>{{ newbieGiftPackage[0].title }}</div>
					</div>
					<div class="type-tip">{{newbieGiftPackage[0].receivedNumber + '/' + newbieGiftPackage[0].totalNumber }}</div>
				</div>
				<div class="task-item-description">
					{{ newbieGiftPackage[0].description }}
				</div>
				<div class="task-item-bottom">
					<div>{{$t('awardsAmount')}}</div>
					<div class="bottom-title">
						<svg-icon name="activityWallet" />
						<span>{{ currency(newbieGiftPackage[0].amount) }}</span>
					</div>
				</div>
				<div class="btn btnNew" :class="`status${newbieGiftPackage[0].status}`" @click="clickBtnNew(newbieGiftPackage[0])">{{ newStatus(newbieGiftPackage[0].status) }}</div>
			</div>

			<div class="task-item task-item--card" :class="{ 'is-ended': item.status === 4 }" v-for="(item, index) in filteredCurrentTasks" :key="index">
				<template v-if="item.taskId=='D20'">
					<div class="task-item-subject">
						<div class="sub-title" >
							<svg-icon :name="ActiveTaskMap['A1'].icon" />
							<div>{{ item.taskTitle }}</div>
						</div>
						<div class="subject">
							<span>{{$t('recharge')}}</span>
							<span class="schedule">{{item.schedule + '/' + item.taskTarget }}</span>
						</div>
						<div class="subject">
							<span>{{$t('betting')}}</span>
							<span class="schedule">{{item.scheduleTwo + '/' + item.targetTwo }}</span>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="task-item-type" >
						<div class="type-title" :class="[ActiveTaskMap[item.taskId].icon]">
							<svg-icon :name="ActiveTaskMap[item.taskId].icon" />
							<div>{{ item.taskTitle }}</div>
						</div>
					</div>
					<div class="task-progress">
						<div class="tp-track">
							<div class="tp-fill" :style="{ width: taskProgressPercent(item) + '%' }"></div>
							<span class="tp-text tp-text--light" :style="{ clipPath: `inset(0 ${100 - taskProgressPercent(item)}% 0 0)` }">{{ item.schedule + '/' + item.taskTarget }}</span>
							<span class="tp-text tp-text--dark" :style="{ clipPath: `inset(0 0 0 ${taskProgressPercent(item)}%)` }">{{ item.schedule + '/' + item.taskTarget }}</span>
						</div>
					</div>
				</template>
				<div class="task-item-description">
					{{ item.taskDescribe }}
				</div>
				<div class="task-item-bottom">
					<div>{{$t('awardsAmount')}}</div>
					<div class="bottom-title" v-if="item.receiveType == 1">
						<svg-icon name="activityWallet" />
						<span>{{ currency(item.taskAwardAmount) }}</span>
					</div>
					<div class="bottom-title" v-else>
						<svg-icon name="activityWallet" />
						 <template v-if="!item.displayRewardMinAmount || !item.displayRewardMaxAmount">
							<span>{{ currency(item.taskAwardAmount) }}</span>
						</template>
						<template v-else>
							<span>{{ currency(item.displayRewardMinAmount) }}</span>
							<span>~</span>
							<span>{{ currency(item.displayRewardMaxAmount) }}</span>
						</template>
					</div>
				</div>
				<div v-if="!(item.status == 2 && item.isReceiveButtonHidden)" class="btn btnOther" :class="`status${item.status}`" @click="clickBtn(item)">{{ changeStatus(item.status) }}</div>
			</div>

			<CardPanel
				v-for="card in periodCards"
				:key="card.cardType"
				v-show="activeTab === CARD_TAB_KEY[card.cardType]"
				:tiers="card.tiers"
				:holding-orders="card.holdingOrders"
				:disabled-tier-ids="disabledTierIds(card)"
				:total-days="card.totalDays"
				:card-type="card.cardType"
				:server-time="cardServerTime"
				:submitting="isCardSubmitting"
				@buy="(tier: any) => onBuyCard(tier, card.totalDays)"
				@claim="onClaimCard"
				@expire="loadPeriodCards"
			/>
		</div>
		</Transition>

		<van-dialog v-model:show="showGateDialog" :show-confirm-button="false" className="noOverHidden">
			<div class="dialog-window">
				<div class="dialog-wrapper gate-wrapper" :class="{ 'is-warn': gateDialog?.warn }">
					<svg-icon v-if="gateDialog?.warn" name="periodCardWarn" class="gate-icon" />
					<img v-else class="gate-icon" src="@public/activity/DailyTask/period_card_gate.png" />
					<div class="dialog-title">{{ gateDialog ? $t(gateDialog.title) : '' }}</div>
					<div class="dialog-tips gate-desc" v-if="gateDesc">{{ gateDesc }}</div>
					<div class="gate-btns">
						<div class="gate-btn" :class="gateDialog?.recharge ? 'cancel' : 'ok'" @click="showGateDialog = false">
							{{ gateDialog?.recharge ? $t('cancel') : $t('confirm') }}
						</div>
						<div class="gate-btn ok" v-if="gateDialog?.recharge" @click="onGoRecharge">
							{{ $t('periodCardGoRecharge') }} →
						</div>
					</div>
					<div class="dialog-footer" @click="showGateDialog = false">
						<img src="@public/activity/DailyTask/close.png" />
					</div>
				</div>
			</div>
		</van-dialog>

		<van-dialog v-model:show="showDialog"  :show-confirm-button="false" className="noOverHidden">
			<div class="dialog-window">
				<div class="dialog-wrapper">
					<img src="@icon/public/succeed.png" />
					<div class="dialog-title">{{$t('awardsReceived')}}</div>
					<div class="dialog-tips">{{showTaskTitle}}</div>
					<div class="dialog-content">
                        <svg-icon name="receivedSuccessfuly" />
						<span>{{ currency(bonus) }}</span>
					</div>
					<div class="dialog-btn" @click="showDialog=false">{{$t('confirm')}}</div>
					<div class="dialog-footer" @click="showDialog=false">
						<img src="@public/activity/DailyTask/close.png" />
					</div>
				</div>
			</div>
		</van-dialog>
		<van-dialog v-model:show="showDoneDialog" :show-confirm-button="false" className="noOverHidden">
			<div class="dialog-window">
				<div class="dialog-wrapper done-wrapper">
					<div class="done-hero"></div>
					<div class="dialog-title">{{ $t('periodCardBuyDone') }}</div>
					<div class="done-amount">{{ doneAmountParts.before }}<b>{{ doneAmountParts.amount }}</b>{{ doneAmountParts.after }}</div>
					<div class="dialog-tips done-tips">{{ $t('periodCardDoneDaily', { n: doneDays }) }}</div>
					<div class="gate-btn ok" @click="showDoneDialog = false">{{ $t('periodCardKnow') }}</div>
					<div class="dialog-footer" @click="showDoneDialog = false">
						<img src="@public/activity/DailyTask/close.png" />
					</div>
				</div>
			</div>
		</van-dialog>
		<van-popup v-model:show="ruleDialog" :close-on-click-overlay="false" round>
			<BetRule :title="activeCardBanner?.title" @close="ruleDialog = false">
				<!-- ruleContent 契约允许含 HTML,渲染方式与本仓 BetRule 既有调用方一致 -->
				<div v-html="activeCardBanner?.ruleContent"></div>
			</BetRule>
		</van-popup>

		<CoinShower :seq="coinSeq" :amount="coinAmount" />
	</div>
</template>

<script setup lang="ts">
import { AwaitApiResult, AwaitWrap, currency } from '@/utils'
import { showFailToast } from 'vant'
import { GetWeeklyAwardList, ReceiveWeeklyAward,getNewbieGiftPackage,receiveAward,GetDailyAwardList ,ReceiveDailyAward, GetPeriodCardInfo, BuyPeriodCard, TakeDailyReward, GetActivityCenterTabSort } from '@/api'
import { computed, defineAsyncComponent, nextTick, onMounted, ref,watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router';
import { useActive } from '@/components/common/use';
import { useGlobalDialog } from '@/hooks';
import CardPanel from './CardPanel/index.vue';
import CoinShower from './CoinShower.vue';
import { BetRule } from '@/saasLottery/components';
import { currencyTrim as money } from '@/utils';
import { useWalletStore } from '@/stores';
import { requireLoginAction } from '@/hooks/useLoginIntercept';

// 每日签到子页签内容较重(独立页面整体复用),异步加载,首次切到「每日签到」才拉取该 chunk
const DailySignInPage = defineAsyncComponent(() => import('../DailySignIn/index.vue'))
// embedded=true 时用于嵌进活动页「任务」页签:隐藏自身导航栏与顶部大图 banner,只保留子页签条+列表+弹窗
const props = withDefaults(defineProps<{ embedded?: boolean }>(), { embedded: false })
const { t } = useI18n()
const showDialog = ref(false)
const ruleDialog = ref(false)
const router = useRouter()
const route = useRoute()
const { ActiveTaskMap,ActiveSotre,getActive,refreshRedDot } = useActive()
getActive()
const { downAppTip } = useGlobalDialog()
const walletStore = useWalletStore()
const showTaskTitle = ref('')
const bonus = ref('0');
const newbieGiftPackage = ref<any[]>([])
const weekList= ref<any[]>([])
const dayList= ref<any[]>([])
// status → 展示优先级:待领取 > 未完成 > 已领取
const TASK_ORDER = ['', 2, 1, 3]
const sortTasks = (list: any[]) => [...list].sort((a, b) =>
	TASK_ORDER[a.status] - TASK_ORDER[b.status]
	// 仅未完成组按完成度倒序,其余组维持入参次序
	|| (a.status == 1 ? calculatePercentage(b.schedule, b.taskTarget) - calculatePercentage(a.schedule, a.taskTarget) : 0)
)
// tab key → 该 Tab 的任务源;新手礼包/每日签到不走列表渲染
const TASK_SOURCES: Record<string, any> = { day: dayList, week: weekList }
const activeTab = ref('')
let isTabPicked = false
// CardType 契约:1=周卡 2=月卡
const CARD_TAB_KEY: Record<number, string> = { 1: 'weekcard', 2: 'monthcard' }
const CARD_TAB_LABEL: Record<number, string> = { 1: 'periodCardWeekTab', 2: 'periodCardMonthTab' }

const TAB_KEY_BY_CONTRACT: Record<string, string> = {
	GiftPack: 'newbie',
	DailyTask: 'day',
	WeeklyTask: 'week',
	WeekCard: 'weekcard',
	MonthCard: 'monthcard'
}
// 子页签固定顺序(2026-09-22 拍板):每日任务、每周任务、每日签到、购买周卡、购买月卡、新手礼包
// 每日签到无对应契约键,排序值只在这里维护;后台未配置时的契约默认值与此对齐(见 periodCard.ts 的 DEFAULT_TAB_SORT)
const DEFAULT_TAB_SORT: Record<string, number> = {
	day: 100,
	week: 95,
	signin: 90,
	weekcard: 85,
	monthcard: 80,
	newbie: 75
}
const tabSort = ref<Record<string, number>>({ ...DEFAULT_TAB_SORT })

const loadTabSort = async () => {
	const res: any = await AwaitApiResult(GetActivityCenterTabSort())
	if (!res?.data) return
	// 漏发或发脏的 tabKey 要留在原位,不能因取不到值被甩到末尾
	tabSort.value = res.data.reduce((acc: Record<string, number>, tab: any) => {
		const key = TAB_KEY_BY_CONTRACT[tab.tabKey]
		const sort = Number(tab.tabSort)
		return key && Number.isFinite(sort) ? { ...acc, [key]: sort } : acc
	}, { ...DEFAULT_TAB_SORT })
}


const periodCards = ref<any[]>([])
const cardServerTime = ref('')

const loadPeriodCards = async () => {
	const res: any = await AwaitApiResult(GetPeriodCardInfo())
	if (!res) return
	cardServerTime.value = res.serviceNowTime ?? ''
	periodCards.value = res.data ?? []
}

// 持卡上限默认 1 且跨档位合计,故持卡期间该活动所有档位都不可再购
const disabledTierIds = (card: any) =>
	card.holdingOrders?.length ? card.tiers?.map((tier: any) => tier.tierId) ?? [] : []

// 锁要罩整段而非单个请求:成功后的重拉也是网络往返,只锁请求会被连点出后端 146
const isCardSubmitting = ref(false)

const runCardSubmit = async (task: () => Promise<any>) => {
	if (isCardSubmitting.value) return
	isCardSubmitting.value = true
	try {
		await task()
	} finally {
		isCardSubmitting.value = false
	}
}

// 必须拿原始响应:AwaitApiResult 遇失败码抢先弹通用 toast 并返回 null,msgCode 与 1031 差额全丢,而这是扣钱链路
// 拦截器放行 code 0/1、reject 其余码,故 resolve 取 res、reject 取 err
const submitCard = async (request: Promise<any>) => {
	const [err, res] = await AwaitWrap<any, any>(request)
	return res ?? err
}

// 成功后库存、持卡上限、档位可购状态都会变,须整体重拉
const afterCardSubmit = (res: any) => {
	if (!res) return
	if (res.code === 0) return loadPeriodCards()
	// 不走全局 fixMsg:它写死拼 `Error: {msgCode}` 前缀,技术码会露给玩家
	const text = t(`code${res.msgCode}`)
	// 后端新增码时语言包还没跟上,t 会原样吐回 key,此时退回后端 msg
	showFailToast({ message: text.startsWith('code') ? res.msg : text, className: 'fail_message_toast', iconSize: 28 })
}

// 需要玩家做决定的失败给弹窗:1031 缺累计充值资格、142 缺当次现金、1032 该档当日无货、15 条件不满足
const LOW_BALANCE_CODE = 142
const CARD_DIALOGS: Record<number, { title: string; desc: string; recharge: boolean; warn?: boolean }> = {
	1031: { title: 'periodCardGateTitle', desc: 'periodCardGateDesc', recharge: true },
	142: { title: 'code142', desc: 'periodCardBalanceDesc', recharge: true },
	1032: { title: 'periodCardSoldOutTitle', desc: 'code1032', recharge: false },
	// 设计稿只有感叹号 + 标题 + 确认,无描述
	15: { title: 'code15', desc: '', recharge: false, warn: true }
}
const gateCode = ref(0)
const gateAmount = ref(0)
const showGateDialog = ref(false)
const gateDialog = computed(() => CARD_DIALOGS[gateCode.value] ?? null)
// 三条描述的插值名不同(gap / need / 无),一次全传,用不到的那个 vue-i18n 会忽略
const gateDesc = computed(() =>
	gateDialog.value?.desc ? t(gateDialog.value.desc,{ gap: money(gateAmount.value), need: money(gateAmount.value) }) : ''
)

const openCardDialog = (code: number, amount: number) => {
	gateCode.value = code
	gateAmount.value = amount
	showGateDialog.value = true
}

const showDoneDialog = ref(false)
const doneAmount = ref(0)
const doneDays = ref(0)

// 金额要单独套主题色,而整句在 i18n 里是一条带插值的 key,只能按金额回切三段
const doneAmountParts = computed(() => {
	const amount = money(doneAmount.value)
	const text = t('periodCardDoneAmount', { amount })
	const at = text.indexOf(amount)
	return at < 0
		? { before: text, amount: '', after: '' }
		: { before: text.slice(0, at), amount, after: text.slice(at + amount.length) }
})

// 购卡是参与类操作,未登录先弹登录,不进 runCardSubmit(避免占用提交锁)
const onBuyCard = async (tier: any, totalDays: number) => {
	if (!(await requireLoginAction())) return
	return runCardSubmit(async () => {
		const res = await submitCard(BuyPeriodCard({ TierId: tier.tierId }))
		// 后端只在 1031 下发差额;142 没有缺口字段,拿本卡售价让玩家判断该充多少
		if (CARD_DIALOGS[res?.msgCode]) {
			const amount = res.msgCode === LOW_BALANCE_CODE ? tier.sellPrice : res.data?.rechargeGapAmount ?? 0
			openCardDialog(res.msgCode, amount)
			// 1032 尤其要重拉:本地 todaySoldOut 不刷新,该档会一直亮着让玩家反复点反复失败
			return loadPeriodCards()
		}
		// 购买成功弹窗与金币雨同时出,金币雨金额取立即返现
		if (res?.code === 0) {
			doneAmount.value = res.data?.realtimeRewardAmount ?? tier.realtimeRewardAmount
			doneDays.value = totalDays
			showDoneDialog.value = true
			showCoins(doneAmount.value)
		}
		await afterCardSubmit(res)
	})
}

const onGoRecharge = () => {
	showGateDialog.value = false
	downAppTip('Recharge')
}

// 购买与领取共用一层全屏金币雨;递增触发,只在成功后动
const coinSeq = ref(0)
const coinAmount = ref<number | string>(0)

const showCoins = (amount: number | string) => {
	coinAmount.value = amount
	coinSeq.value++
}

const onClaimCard = async (holding: any) => {
	if (!(await requireLoginAction())) return
	return runCardSubmit(async () => {
		const res = await submitCard(TakeDailyReward({ OrderNo: holding.orderNo }))
		if (res?.code === 0) {
			// 撒后端回的到账额而非前端推算:实时与每日两笔金额不同,推算会在切换那次飘错数
			showCoins(res.data?.rewardAmount ?? 0)
		}
		await afterCardSubmit(res)
	})
}
const visibleTabs = computed(() => [
	{ key: 'day', label: t('dailyMission'), show: dayList.value.length > 0 },
	{ key: 'week', label: t('actTip4'), show: weekList.value.length > 0 },
	// 每日签到常驻不做空态判断,签到本身没有"空列表"概念
	{ key: 'signin', label: t('code9007'), show: true },
	// 卡活动的显隐与顺序完全跟随接口:资格不符时后端不返回该活动,前端不做资格判断
	...periodCards.value.map((card: any) => ({
		key: CARD_TAB_KEY[card.cardType],
		label: t(CARD_TAB_LABEL[card.cardType]),
		show: !!CARD_TAB_KEY[card.cardType]
	})),
	{ key: 'newbie', label: t('actTip3'), show: newbieGiftPackage.value.length > 0 }
].filter((tab) => tab.show)
	// 排序值互不相等(见 DEFAULT_TAB_SORT),固定顺序:每日任务、每周任务、每日签到、购买周卡、购买月卡、新手礼包
	.sort((a, b) => tabSort.value[b.key] - tabSort.value[a.key]))
const currentTasks = computed<any[]>(() => sortTasks(TASK_SOURCES[activeTab.value]?.value ?? []))

// 状态筛选:全部/可领取(2)/可参与(1)/已领取(3)/已结束(4),仅每日任务、每周任务两个 Tab 用
const TASK_FILTERS: { key: 'all' | number; labelKey: string }[] = [
	{ key: 'all', labelKey: 'all' },
	{ key: 2, labelKey: 'taskFilterClaimable' },
	{ key: 1, labelKey: 'taskFilterOngoing' },
	{ key: 3, labelKey: 'claimed' },
	{ key: 4, labelKey: 'ended' }
]
const taskFilter = ref<'all' | number>('all')
const filteredCurrentTasks = computed(() =>
	taskFilter.value === 'all' ? currentTasks.value : currentTasks.value.filter((item: any) => item.status === taskFilter.value)
)
// 可领取金额与一键领取:按当前 Tab 未筛选的原始列表求和,不受筛选项影响
const claimableAmount = computed(() =>
	(TASK_SOURCES[activeTab.value]?.value ?? [])
		.filter((item: any) => item.status === 2)
		.reduce((sum: number, item: any) => sum + Number(item.taskAwardAmount || 0), 0)
)
const isBatchClaiming = ref(false)
const onOneKeyClaim = async () => {
	if (isBatchClaiming.value) return
	if (!(await requireLoginAction())) return
	const list = (TASK_SOURCES[activeTab.value]?.value ?? []).filter((item: any) => item.status === 2)
	if (!list.length) return
	isBatchClaiming.value = true
	try {
		let total = 0
		for (const item of list) {
			const res: any = activeTab.value === 'week'
				? await AwaitApiResult(ReceiveWeeklyAward({ weeklyAwardId: item.configId }))
				: await AwaitApiResult(ReceiveDailyAward({ dailyAwardId: item.configId }))
			if (res?.code === 0) total += Number(item.taskAwardAmount || 0)
		}
		if (total > 0) {
			showDialog.value = true
			bonus.value = String(total)
			showTaskTitle.value = t('taskOneKeyClaim')
		}
		onLoad()
		refreshRedDot()
	} finally {
		isBatchClaiming.value = false
	}
}

// 每个子页签右上角的可领数量角标,0 不显示
const tabBadgeCount = (key: string): number => {
	if (key === 'day') return dayList.value.filter((item: any) => item.status === 2).length
	if (key === 'week') return weekList.value.filter((item: any) => item.status === 2).length
	if (key === 'signin') return ActiveSotre.value.activityRedDot.attendanceBonusCount
	if (key === 'newbie') return newbieGiftPackage.value[0]?.status === 1 ? 1 : 0
	const card = periodCards.value.find((item: any) => CARD_TAB_KEY[item.cardType] === key)
	return card ? (card.holdingOrders?.filter((holding: any) => holding.canTakeToday).length ?? 0) : 0
}

// 卡 Tab 下 banner 换成该活动自己的图与文案;其余 Tab 为 null,维持页面原有静态 banner
const activeCardBanner = computed(
	() => periodCards.value.find((card: any) => CARD_TAB_KEY[card.cardType] === activeTab.value) ?? null
)
// 契约允许多图英文逗号分隔,而 banner 位只有一个,取首张
const cardBannerUrl = computed(() => (activeCardBanner.value?.bannerUrl ?? '').split(',')[0].trim())
const onSwitchTab = (key: string) => {
	isTabPicked = true
	activeTab.value = key
}
// 地址参数记住当前子页签,刷新后停在同一页:进页面时若命中则锁定为已选,不再跟随排序自动回落
const initialSub = typeof route.query.sub === 'string' ? route.query.sub : ''
// 礼包异步到达/领完消失都会改可见项:用户未手动切过时跟随首项,切过后只在当前项消失时回落
watch(visibleTabs, (tabs) => {
	if (!isTabPicked) {
		if (initialSub && tabs.some((tab) => tab.key === initialSub)) {
			activeTab.value = initialSub
			isTabPicked = true
			return
		}
		activeTab.value = tabs[0]?.key
		return
	}
	if (!tabs.some((tab) => tab.key === activeTab.value)) activeTab.value = tabs[0]?.key
}, { immediate: true })
// 无论自动落位还是手动切换,都把当前子页签同步进地址栏,刷新后能停在原地
watch(activeTab, (key) => {
	if (!key || route.query.sub === key) return
	router.replace({ query: { ...route.query, sub: key } })
})
// 反向联动:页面已打开时地址栏 sub 被外部改动(浏览器前进后退、手动改地址栏)也要驱动内容跟着切,不能只换高亮;
// 与上面那条互为反向,靠"值已相等则跳过"避免来回触发
watch(
	() => route.query.sub,
	(sub) => {
		const key = typeof sub === 'string' ? sub : ''
		if (!key || key === activeTab.value) return
		if (!visibleTabs.value.some((tab) => tab.key === key)) return
		isTabPicked = true
		activeTab.value = key
	}
)

// 桌面鼠标按住左右拖动滚动:手机端触屏本来就能滑动(overflow-x:auto 原生支持),这里只补桌面鼠标场景;
// 拖动距离超过阈值就标记为"拖过",配合下面 onTabClick/onFilterClick 抑制这次的点击,避免拖完松手误触发切换
const makeDragScroll = (elRef: Ref<HTMLElement | null>) => {
	let dragging = false
	let startX = 0
	let startScrollLeft = 0
	let dragged = false
	const onMove = (e: MouseEvent) => {
		if (!dragging || !elRef.value) return
		const delta = e.clientX - startX
		if (Math.abs(delta) > 5) dragged = true
		elRef.value.scrollLeft = startScrollLeft - delta
	}
	const stop = () => {
		dragging = false
		window.removeEventListener('mousemove', onMove)
		window.removeEventListener('mouseup', stop)
	}
	const onDown = (e: MouseEvent) => {
		if (!elRef.value) return
		dragging = true
		dragged = false
		startX = e.clientX
		startScrollLeft = elRef.value.scrollLeft
		window.addEventListener('mousemove', onMove)
		window.addEventListener('mouseup', stop)
	}
	return { onDown, wasDragged: () => dragged }
}

// Tab 满 5 个后一屏放不下,选中项可能落在屏幕外,切换后要把它带回视野
const tabsRef = ref<HTMLElement | null>(null)
const tabsDrag = makeDragScroll(tabsRef)
const onTabClick = (key: string) => {
	if (tabsDrag.wasDragged()) return
	onSwitchTab(key)
}
// 状态筛选行同样可能超宽,同一套拖动逻辑
const statusFilterRef = ref<HTMLElement | null>(null)
const statusFilterDrag = makeDragScroll(statusFilterRef)
const onFilterClick = (key: 'all' | number) => {
	if (statusFilterDrag.wasDragged()) return
	taskFilter.value = key
}
// 面板前后滑动的方向:切到靠后的 Tab 为 next。watch 默认 pre 冲刷,重渲染前方向已定好
const slideDir = ref<'next' | 'prev'>('next')
watch(activeTab, async (key, prevKey) => {
	// 状态筛选不跟随切到的新 Tab,回到"全部"
	taskFilter.value = 'all'
	const keys = visibleTabs.value.map((tab) => tab.key)
	slideDir.value = keys.indexOf(key) >= keys.indexOf(prevKey) ? 'next' : 'prev'
	await nextTick()
	tabsRef.value?.querySelector('.active')?.scrollIntoView({ inline: 'center', block: 'nearest' })
})
// 状态筛选行同样可能超宽,切换筛选项后把它带回视野
watch(taskFilter, async () => {
	await nextTick()
	statusFilterRef.value?.querySelector('.is-active')?.scrollIntoView({ inline: 'center', block: 'nearest' })
})

const taskProgressPercent = (item: any) => {
	const target = Number(item.taskTarget) || 0
	if (!target) return 0
	return Math.min(100, Math.max(0, (Number(item.schedule) || 0) / target * 100))
}

const getWeekList = async() =>{
	const res: any = await AwaitApiResult(GetWeeklyAwardList())
	if(res) {
		weekList.value = res.data.map((item:any)=>{
			return {...item,type:'week'}
		}) || []
	}
}
const getDayList = async()=>{
	const res: any = await AwaitApiResult(GetDailyAwardList())
	if(res) {
		dayList.value = res.data.map((item:any)=>{
			return {...item,type:'day'}
		}) || []
	}
}
const onLoad = async() => {
	getWeekList()
	getDayList()
}
const onClick = ()=> {
	router.push({name: 'activity'})
}
function calculatePercentage(part:number, whole:number) {
	if (whole==0) return 0
	return (part / whole) * 100;
}
const getNewbieGiftPackageV = async()=>{
	newbieGiftPackage.value.length = 0
	const res: any = await AwaitApiResult(getNewbieGiftPackage())
	if(res?.data) {
		newbieGiftPackage.value.push(res?.data)
	}
}
//1 未完成 2 未领取 3已领取 4已结束
const changeStatus = (val: any)=> {
	const map = { 1: t('goComplete'), 2: t('receive'), 3: t('claimed'), 4: t('claimed')}
	return map[val] || ''
}
//领取状态 0 未完成 1 待领取 2已领取 3 领取完成
const newStatus = (val: any)=> {
	const map = { 0: t('goComplete'), 1: t('receive'), 2: t('claimed'), 3: t('claimed')}
	return map[val] || ''
}
const newHeadStatus = (val: any)=> {
	const map = { 0: t('undone'), 1: t('actTip2'), 2: t('claimed'), 3: t('complete')}
	return map[val] || ''
}
const timerC = ref(null)
// 领取/去完成属参与类操作,未登录先弹登录拦截;任务列表本身未登录也能看,不受影响
const clickBtn = async (item: any)=> {
	if (!(await requireLoginAction())) return
	if (timerC.value) {
		clearTimeout(timerC.value)
	}
	timerC.value = setTimeout(async () => {
		if(item.status == 1) return goAnotherPage(item)
		if(item.status == 3 || item.status == 4) return;
		let res;
		if(item.type=='week'){
			res = await AwaitApiResult(ReceiveWeeklyAward({weeklyAwardId: item.configId}))
		}else if(item.type=='day'){
			res = await AwaitApiResult(ReceiveDailyAward({dailyAwardId: item.configId}))
		}
		if(res.code === 0) {
			showDialog.value = true;
			bonus.value = item.taskAwardAmount
			showTaskTitle.value = item.taskTitle
			onLoad()
			refreshRedDot()
		}
	}, 100) as any
}
const timer = ref(null)
// 新手礼包领取同属参与类操作,同样先过登录拦截
const clickBtnNew = async (item:any)=>{
	if (!(await requireLoginAction())) return
	if (timer.value) {
		clearTimeout(timer.value)
	}
	timer.value = setTimeout(async () => {
		if([2,3].includes(item.status)) return
		if(item.status == 0) return await downAppTip('Recharge');
		const res = await AwaitApiResult(receiveAward({id:item.id}))
		if(res){
			showDialog.value = true;
			bonus.value =item.totalNumber == 0? '0' : (Math.floor((item.amount/item.totalNumber) * 100) / 100).toString()
			showTaskTitle.value = item.title
			getNewbieGiftPackageV()
			refreshRedDot()
		}
	}, 100) as any
}
const goAnotherPage = async (item: any)=> {
	if(item.taskId=='D20'){
		if(item.schedule<item.taskTarget){
			return await downAppTip('Recharge');
		}else {
			return router.push({name: 'home'})
		}
	}else {
		if(!ActiveTaskMap[item.taskId].goPath) return
		if(ActiveTaskMap[item.taskId].homeType) sessionStorage.setItem('clickedGameType', ActiveTaskMap[item.taskId].homeType)
		if(ActiveTaskMap[item.taskId].goPath == 'Recharge' || ActiveTaskMap[item.taskId].goPath == 'Withdraw') return downAppTip(ActiveTaskMap[item.taskId].goPath)
		router.push({name: ActiveTaskMap[item.taskId].goPath})
	}
}
const goRecord = () => {
	router.push({name: 'DailyTasks-Record'})
}
watch(()=>ActiveSotre.value.isOpenActivityAward,
(newValue)=>{
	if(newValue){
		onLoad()
	}
},{immediate:true})
onMounted(()=>{
	getNewbieGiftPackageV()
	// 买卡扣的是现金余额,进页面先把三方游戏里的钱收回来,否则有钱也会被判 142
	walletStore.resetData(true, true)
	loadPeriodCards()
	loadTabSort()
})
</script>

<style lang="scss" scoped>
// 主色打底才能跟换肤;红站还原原稿 #ff867a→#f95959
$buy-tint: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%);

.dailySignIn__container {
	font-family: 'Inter', sans-serif;
	padding-bottom: 96px;
	// 切 Tab 时两屏并存,离场的一屏脱离文档流叠回原位;只裁横向,卡片阴影不受影响
	position: relative;
	// clip 不切纵向,老 WebView 认不得时退回 hidden
	overflow-x: hidden;
	overflow-x: clip;
	// 阿语整站 dir=rtl,滑动方向要跟着翻
	--slide-sign: 1;
	[dir='rtl'] &{
		--slide-sign: -1;
	}

	:deep(.navbar) {
		.navi-record{
			color: var(--text_color_L1);
		}
	}

	.task-banner{
		width: 100%;
		height: 260px;
		padding: 10px 20px;
		margin-bottom: 12px;
		background:  url("@/assets/icons/activity/DailyTask/award_bg.png") no-repeat;
		background-size: 100% 260px;
		display: flex;
		align-items: flex-start;
		position: relative;

		// 后端配的活动图尺寸不定,按宽铺满居中裁切
		&.card-banner{
			background-size: cover;
			background-position: center;
		}
		.banner-rule{
			align-self: flex-start;
			display: flex;
			// 覆盖 .task-banner div 的 space-between,否则图标与文案被推到胶囊两端
			justify-content: center;
			align-items: center;
			gap: 6px;
			height: 46px;
			padding: 0 20px;
			border: 1px solid rgba(255, 255, 255, .6);
			border-radius: 60px;
			font-size: 22px;
			svg{
				width: 32px;
				height: 32px;
			}
		}

		div{
			display: flex;
			justify-content: space-between;
		}
		.banner-title{
			margin-top: 30px;
			margin-bottom: 10px;
			font-size: 36px;
			color: #FFF;
			font-weight: 600;
		}
		.banner-content{
			display: flex;
			color: #FFF;
			word-break: break-word;
			flex-direction: column;
		    width: 420px;
			line-height: 24px

		}
	}

	.task-tabs{
		display: flex;
		gap: 20px;
		// overflow-x 形成裁切上下文,padding 不留够会切掉按钮阴影
		padding: 10px 20px 20px;
		overflow-x: auto;
		scrollbar-width: none;
		// 手机触屏原生就能滑动;桌面用鼠标按住拖动(见 script 里 tabsDrag),这里只负责手型光标和禁止拖动时选中文字
		cursor: grab;
		user-select: none;
		&::-webkit-scrollbar{
			display: none;
		}
		button{
			position: relative;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			// 取 min-width 是因 16 语言中长词会撑破定宽,中文下二者等价
			min-width: 190px;
			height: 76px;
			padding: 0 20px;
			border: none;
			border-radius: 38px;
			font-size: 26px;
			white-space: nowrap;
			background: var(--bg_color_L2);
			color: var(--text_color_L2);
			box-shadow: 0 6px 12px 4px rgba(208, 208, 237, 0.36);
			&.active{
				background: var(--main_gradient-color2);
				color: var(--text_color_L4);
				font-weight: 700;
				box-shadow: 0 6px 12px rgba(208, 208, 237, 0.6), inset 0 -4px 10px #FFF6F4;
			}
			// 可领数量角标,0 不渲染(模板层已判断)
			.tab-badge{
				position: absolute;
				top: -10px;
				inset-inline-end: -6px;
				min-width: 32px;
				height: 32px;
				padding: 0 6px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 16px;
				background: var(--norm_red-color, #F95959);
				color: #fff;
				font-size: 20px;
				font-weight: 700;
				line-height: 1;
			}
		}
	}

	// 状态筛选行:样式对齐活动页 ActivityFilterTabs 的选中态,单独维护避免耦合该组件的固定筛选项
	.status-filter{
		display: flex;
		align-items: center;
		gap: 16px;
		margin: 24px 0 0;
		overflow-x: auto;
		scrollbar-width: none;
		cursor: grab;
		user-select: none;
		&::-webkit-scrollbar{
			display: none;
		}
		&__item{
			flex-shrink: 0;
			min-width: 116px;
			height: 60px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 12px;
			background: #FFFFFF;
			color: #768096;
			font-size: 28px;
			white-space: nowrap;
			&.is-active{
				background: #F95959;
				color: #fff;
			}
		}
	}

	// 一键领取横条
	.claim-all{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 702px;
		height: 80px;
		margin: 32px auto 32px;
		padding: 0 12px 0 24px;
		background: #FFFFFF;
		border-radius: 12px;
		box-shadow: 0 6px 12px 4px rgba(208, 208, 237, 0.2);

		&__info{
			display: flex;
			align-items: baseline;
			gap: 12px;
			overflow: hidden;
		}
		&__label{
			flex-shrink: 0;
			font-size: 26px;
			color: #768096;
		}
		&__amount{
			font-size: 28px;
			font-weight: 700;
			color: #FEAA57;
			white-space: nowrap;
		}
		&__btn{
			flex-shrink: 0;
			width: 200px;
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 30px;
			background: linear-gradient(90deg, #FE6868 0%, #FF8A87 100%);
			color: #fff;
			font-size: 26px;
			font-weight: 600;
			&.locked{
				opacity: .6;
				pointer-events: none;
			}
		}
	}

	.task-panel{
		padding: 0 20px;

		&.tab-next-enter-active,
		&.tab-next-leave-active,
		&.tab-prev-enter-active,
		&.tab-prev-leave-active{
			transition: transform .26s ease, opacity .26s ease;
		}
		// 离场的一屏脱离文档流,容器高度直接跟随进场那屏,不会先塌再撑
		&.tab-next-leave-active,
		&.tab-prev-leave-active{
			position: absolute;
			inset-inline: 0;
		}
		&.tab-next-enter-from,
		&.tab-prev-leave-to{
			transform: translateX(calc(100% * var(--slide-sign)));
			opacity: 0;
		}
		&.tab-next-leave-to,
		&.tab-prev-enter-from{
			transform: translateX(calc(-100% * var(--slide-sign)));
			opacity: 0;
		}

		.task-item{
			position: relative;
			width: 100%;
			background:var(--bg_color_L2);
			border-radius: 20px;
			overflow: hidden;
			padding: 0 0 10px;
			margin-bottom: 16px;

			// 每日/每周任务卡去掉了顶部状态横条(设计稿没有),改用顶部内边距顶开图标+标题行;
			// 按设计稿实测(卡顶到图标顶)为 24px,新手礼包卡仍保留横条、不叠加这层内边距;
			// 图标行自身原有 margin-top:20px(见 .task-item-type/.task-item-subject),
			// 与这层 padding-top 会叠加(padding 会阻断 margin 塌陷),故下面把它清零,让 24px 内边距单独成立
			&--card{
				padding-top: 24px;
				> .task-item-type,
				> .task-item-subject{
					margin-top: 0;
				}
			}

			// 已结束(status 4):整卡叠一层灰,不必逐个子元素改色;按钮的置灰另见 .btnOther.status4
			&.is-ended::after{
				content: '';
				position: absolute;
				inset: 0;
				background: rgba(176, 179, 185, 0.75);
				pointer-events: none;
			}

			img{
				width: 40px;
				height: 40px;
			}
			&-header{
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: -5px;
				padding-right: 20px;
				&::after{
					content: '';
                    position: absolute;
                    bottom: 0;
                    inset-inline-end: 0;
                    width: 60%;
                    height: 1px;
                    border-radius: 20px 0 0 20px;
                    background: var(--Dividing-line_color);
				}
				img{
					width: 40px;
					height: 40px;
				}
				.hearder-status{
					display: flex;
					align-items: center;
					justify-content: center;
					min-width: 260px;
					padding: 15px 0;
					color: var(--text_white, var(--text_color_L1));
					border-bottom-right-radius: 25px;
					font-size: 28px;
					font-weight: 700;
					&.new{
						background: var(--norm_secondary-color);
					}
					&.week{
						background: var(--norm_red-color);
					}
					&.day{
						background: var(--norm_green-color);
					}
				}
				.headerR{
					color: var(--norm_red-color);
					font-size: 28px;
				}
				.headerGray {
					color: var(--text_color_L2);
					font-size: 28px;
				}
				.hearder-type{
					min-width: 240px;
					height: 50px;
					line-height: 50px;
					border-radius: 50px;
					text-align: center;
					padding: 0 10px;
					color: var(--text_color_L4);
					&.n1 {
						border: 1px solid var(--main-color);
						color: var(--main-color);
					}
					&.n2 {
						background: var(--linearGradien-19);
					}
					&.n3 {
						background: var(--linearGradien-17);
					}
				}
				.uncomplete{
					background: var(--linearGradien-17) !important;
				}
				.completed{
					background: var(--linearGradien-17);
				}
				.gocomplete{
					color: var(--main-color);
					border: 1px solid var(--main-color);
					background: var(--bg_color_L2);
				}
			}
			&-type{
				display: flex;
				align-items: center;
				margin: 20px 20px 0;
				img{
					width: 40px;
					height: 40px;
				}
				.type{
					border:1px solid red;
				}
				.type-title{
					display: flex;
					align-items: center;
					justify-content: center;
					column-gap: 14px;
					height: 40px;
					color: var(--text_color_L2);
					svg{
						width:40px;
						height: 40px;
					}

					html:lang(ar) &{
						background-position: right;
					}
				}
				.type-tip{
					color: var(--norm_red-color);
					font-size: 28px;
					font-weight: 400;
					margin-left: 20px;
				}
			}
			// 每日/每周任务的进度条:已完成部分渐变、未完成部分浅灰,文字按填充分界互补深浅色叠在条上
			// 注意:类名是 .task-progress(非 &-progress 的 .task-item-progress),与模板里的独立 div 对应
			.task-progress{
				margin: 20px 20px 0;

				.tp-track{
					position: relative;
					height: 32px;
					border-radius: 16px;
					background: #E5E5E5;
					overflow: hidden;
				}
				.tp-fill{
					height: 100%;
					border-radius: 16px;
					background: linear-gradient(90deg, #FF8E89 0%, #FFC3A2 100%);
					transition: width .3s;
				}
				.tp-text{
					position: absolute;
					inset: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24px;
					line-height: 32px;
					white-space: nowrap;
					&--light{
						color: #fff;
					}
					&--dark{
						color: #1E2637;
					}
				}
			}
			&-subject{
				margin:20px 20px 0;
				display: flex;
				flex-direction: column;
				gap: 12px;
				.sub-title{
					display: flex;
					align-items: center;
					column-gap: 14px;
					height: 48px;
					color: var(--text_color_L2);
					svg{
						width:48px;
						height: 48px;
					}
				}
				.subject{
					color: var(--text_color_L2);
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24px;
					.schedule{
						color: var(--norm_red-color);
					}
				}
			}
			&-description{
				color: var(--text_color_L2);
				padding: 20px;
				background: var(--bg_color_L3);
				border-radius: 10px;
				margin: 20px;
				font-size: 22px;
			}
			&-bottom{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 20px;
				margin: 0 20px;
				color: var(--text_color_L2);
				border-bottom: 1px solid var(--Dividing-line_color);
				.bottom-title{
					display: flex;
					color: var(--DailyTaskTextColor-3);
					align-items: center;
				}
				svg{
					margin-right: 10px;
					width: 30px;
					height: 30px;
				}
				span {
					color: var(--norm_secondary-color);
					font-weight: 400;
					font-size: 28px;
				}
			}
			.btn{
				color: var(--darkTextW,var(--bg_color_L2));
				font-size: 30px;
				font-weight: 700;
				height: 70px;
				line-height: 70px;
				border-radius: 35px;
				text-align: center;
				margin: 20px 15px 10px;
			}
			.btnOther{
				&.status1{
					color: var(--main-color);
					border:1px solid var(--main-color);
					line-height: 68px; // 减去 1px 边框,与其余三态视觉齐高
				}
				&.status2{
					background: var(--main_gradient-color);
					color: var(--text_color_L4);

				}
				&.status3{
					background: var(--button_dis_color, var(--bg_color_L3));
					color: var(--text_white, var(--text_color_L1));
				}
				// 已结束:按钮同样置灰,不可点(clickBtn 已按 status 4 短路)
				&.status4{
					background: #AAADB3;
					color: #fff;
				}
			}
			.btnNew{
				&.status0{
					color: var(--main-color);
					border:1px solid var(--main-color);
				}
				&.status1{
					background:  var(--main-color);
					
				}
				&.status2,
				&.status3{
					background: var(--button_dis_color);
				}
			}
		}
	}

	.navi-record{
		display: flex;
		align-items: center;
		color: var(--text_color_L4);
		svg{
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}
	}
	.dialog-wrapper{
		padding: 20px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		img{
			width: 280px;
			height: 162px;
			position: relative;
			margin-top: -56px;
		}
		.dialog-title{
			color: var(--text_color_L1);
			margin: 30px 0 20px;
			font-size: 36px;
			font-weight: bold;
			padding: 0 10px;
			
		}
		.dialog-tips{
			width: 380px;
			color: var(--text_color_L2);
			font-size: 24px;
			margin: 0 0 24px 0;
		}
		.dialog-para{
			color: var(--text_color_L2);
			font-size: 24px;
			padding: 0 20px;
		}

		.dialog-btn{
			width: 420px;
			height: 80px;
			text-align: center;
			line-height: 80px;
			background: var(--GradiantBlue,var(--main_gradient-color));
			border-radius: 80px;
			font-weight: bold;
			color: var(--text_color_L4);
			font-size: 32px;
			margin-top: 40px;
		}
		.dialog-content{
			display: flex;
			align-items: center;
			color: var(--textBlueLight,var(--DailyTaskTextColor-3));
			svg {
				width: 40px;
				height: 40px;
				margin: 0 10px 0 0;
			}
			span{
				color: var(--norm_secondary-color);
			}
		}

		.dialog-footer{
			position: relative;
			bottom: -110px;
			img{
				width: 60px;
				height: 60px;
			}
		}

		// 门槛弹窗与购买成功弹窗共用同一套主题色按钮
		.gate-btns{
			display: flex;
			gap: 24px;
			width: 100%;
		}
		.gate-btn{
			flex: 1;
			// 长语种文案必折行,line-height 撑高只容得下一行
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 88px;
			line-height: 1.25;
			text-align: center;
			border-radius: 88px;
			font-size: 32px;
			font-weight: 700;

			&.cancel{
				background: var(--button_dis_color);
				color: var(--text_color_L1);
			}
			&.ok{
				background-color: var(--main-color);
				background-image: $buy-tint;
				color: #fff;
				text-shadow: 0 4px 2px rgba(0, 0, 0, 0.25);
			}
		}

		// 充值门槛弹窗:锁图标在框内,不像领取弹窗那样溢出顶沿
		&.gate-wrapper{
			padding: 60px 40px 48px;

			.gate-icon{
				width: 160px;
				height: 160px;
				margin-top: 0;
			}
			.gate-desc{
				margin-bottom: 48px;
				padding: 0 10px;
				text-align: center;
				line-height: 40px;
			}
			.dialog-footer{
				bottom: -140px;
			}

			// 条件不满足:间距按设计稿 622×500 实测(图标距顶 18、图标到标题 55、标题到按钮 111、按钮距底 40)
			&.is-warn{
				padding: 18px 40px 40px;

				.dialog-title{
					margin: 55px 0 111px;
					line-height: 36px;
					color: var(--text_color_L1);
				}
				.gate-btns{
					justify-content: center;
				}
				.gate-btn{
					flex: 0 0 326px;
					min-height: 80px;
				}
			}
		}

		&.done-wrapper{
			position: relative;
			padding: 20px 40px 32px;
			// 折行后盒子撑满,align-items 就管不到盒内文字
			text-align: center;

			.done-hero{
				width: 280px;
				height: 185px;
				margin-top: -56px;
				background: url('@/assets/icons/activity/DailyTask/period_card_done.svg') no-repeat;
				background-size: 100% 100%;
			}
			.dialog-title{
				margin: 0 0 16px;
				line-height: 46px;
			}
			.done-amount{
				margin-bottom: 16px;
				font-size: 24px;
				font-weight: 400;
				line-height: 36px;
				color: var(--text_color_L1);

				b{
					color: var(--main-color);
				}
			}
			.done-tips{
				margin-bottom: 40px;
				line-height: 40px;
			}
			.gate-btn{
				width: 100%;
			}
			// relative 偏移只挪视觉、原位仍占高,弹窗底部会多出一截空白;脱流悬在弹窗外沿下方
			.dialog-footer{
				position: absolute;
				left: 50%;
				bottom: -82px;
				transform: translateX(-50%);

				img{
					margin-top: 0; // 抵掉 .dialog-wrapper img 给领取弹窗大图的 -56px
				}
			}
		}

	}
}
:deep() .van-dialog.noOverHidden {
	overflow: inherit;
}
</style>
