<template>
	<div class="activity-wrapper">
		<ActivityRewardHeader
			:today-rewards="ActiveSotre.todayRewards"
			:total-rewards="ActiveSotre.totalRewards"
			:is-activity-bonus-hidden="isActivityBonusHidden"
			:is-login="hasLogin"
			:show-reward-center="setting.getIsShowRewardCenter"
			@bonus="goProtectedPath('Bonus')"
		/>

		<ActivitySwitchTabs :active="activeTopTab" @switch="onSwitchTopTab" />

		<div v-show="activeTopTab === 'activity'">
			<ActivityEntryGrid
				v-if="navList.length"
				:nav-list="navList"
				:show-length="navList.length"
				@navigate="onIconNavigate"
			>
				<template v-if="globalStore.token && ActiveSotre.isFinishUserGuidelines && ActiveSotre.isOpenActivityAward" #before-header>
					<van-popover v-model:show="ActiveSotre.isFinishUserGuidelines" :overlay="true" placement="top-start" :close-on-click-overlay="false" class="arPopover">
						<div class="msg-window">
							<div class="msg-header">{{$t('activityTip8')}}</div>
							<div class="msg-footer">
								<div @click="goDetail">
									<span>{{$t('dragonEntry')}}</span>
									<van-icon name="arrow-double-right" color="var(main-color)"/>
								</div>
							</div>
						</div>
  					<template #reference>
						<div class="nowidth"></div>
					</template>
					</van-popover>
				</template>
			</ActivityEntryGrid>

			<GiftExchangeCard @view-record="onViewRecord" />

			<ActivityFilterTabs v-model="activeCategory" />

			<ActivityBannerList
				v-model:loading="loading"
				:list="filteredActivityList"
				:finished="finished"
				:is-show-empty="isShowEmpty"
				:championship="championEntranceVO"
				@load="onLoad"
				@click-item="onClick"
				@image-error="fixIcons"
			/>
		</div>

		<DailyTasksPage v-if="hasOpenedTask" v-show="activeTopTab === 'task'" embedded />
	</div>
</template>

<script setup lang="ts">
import { AwaitApiResult } from '@/utils'
import defaultImgAvatar from '@public/images/avatar.png'
import { useRoute, useRouter } from 'vue-router'
import type { ActivityList, UserInfo } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue'
import { useActive } from '@/components/common/use'
import { GetActivityList } from '@/api'
import { useChampionship } from "@/hooks"
import { GlobalStore, SettingStore } from '@/stores'
import { useServer } from '@/hooks/useServe.hook'
import { requireLoginAction } from '@/hooks/useLoginIntercept'
import { ROUTER_WHITE_LIST } from '@/config/config'
import { createDialogQueueItem } from '@/components/DialogQueue/registry'
import { useDialogQueue } from '@/components/DialogQueue/useDialogQueue'
import type { DialogQueueCloseReason } from '@/components/DialogQueue/types'
import { ACTIVITY_UN_AWARD_REMINDER_DIALOG_KEY } from '@/hooks/dialogKeys'
import ActivityRewardHeader from './ActivityRewardHeader.vue'
import ActivityEntryGrid, { type ActivityEntryItem } from './ActivityEntryGrid.vue'
import ActivityBannerList from './ActivityBannerList.vue'
import ActivitySwitchTabs, { type ActivityTopTab } from './ActivitySwitchTabs.vue'
import ActivityFilterTabs, { type ActivityCategory } from './ActivityFilterTabs.vue'
import GiftExchangeCard from './GiftExchangeCard.vue'

// 任务页签内容较重(周卡/月卡/新手礼包等一整套逻辑),异步加载,首次切到「任务」才拉取该 chunk
const DailyTasksPage = defineAsyncComponent(() => import('@/views/activity/DailyTasks/index.vue'))

const { getSelfCustomerServiceLink } = useServer({ServerType: 2})
const { ActiveSotre, saveUserGuidelines, saveUserDayRequest,getDailyAwardCount,allUnAwardCount, getActive } = useActive()
const setting = SettingStore()
const globalStore = GlobalStore()
const {championEntranceV,championEntranceVO} = useChampionship()
const dialogQueue = useDialogQueue()
const userInfo = computed(() => globalStore.getUserInfo as UserInfo)
const activityBonusHiddenUsers = [
	{
		tenant: 'ar052',
		userIds: [789650],
	},
]
const isActivityBonusHidden = computed(() => {
	const tenant = window.CONFIG?.tenant
	const userId = Number(userInfo.value?.userId)
	return activityBonusHiddenUsers.some(item => item.tenant === tenant && item.userIds.includes(userId))
})
// 锦标赛报名/倒计时数据仍需拉取:活动列表里那张带 HOT 标签的锦标赛卡要用它渲染倒计时/奖池覆盖层(见 ActivityBannerList 的 championship prop)
watch(()=>ActiveSotre.value.isOpenChampion,
(newValue)=>{
	if(newValue==1){
		championEntranceV()
	}
})

const activityList = ref<ActivityList[]>([])
const { t } = useI18n()
const loading = ref(false);
const finished = ref(false);
const pageNo = ref(1);
const isShowEmpty = ref(false);

const router = useRouter()
const route = useRoute()
const hasLogin = computed(() => Boolean(globalStore.token))
// 红点计数:未登录一律 0(后端未登录也返全 0,前端再兜底一层)
const redDot = computed(() => ActiveSotre.value.activityRedDot)
const dotCount = (n: number) => (hasLogin.value ? n : 0)

// 活动/任务顶部切换:任务并入本页做 Tab,不再跳独立任务页(2026-09-22 拍板)。用地址参数 tab 记住,刷新后停在同一页签
const activeTopTab = ref<ActivityTopTab>(route.query.tab === 'task' ? 'task' : 'activity')
// 任务 Tab 首次打开才挂载组件,之后一直用 v-show 保留状态(滚动位置/已加载数据),不随每次切换反复重建
const hasOpenedTask = ref(activeTopTab.value === 'task')
watch(activeTopTab, (val) => {
	if (val === 'task') hasOpenedTask.value = true
})
watch(() => route.query.tab, (val) => {
	activeTopTab.value = val === 'task' ? 'task' : 'activity'
})
const switchTopTab = (tab: ActivityTopTab) => {
	if (activeTopTab.value === tab) return
	activeTopTab.value = tab
	router.replace({ query: { ...route.query, tab } })
}
// 顶部切换条切「任务」不需要登录:未登录也能看任务列表,登录门槛下沉到列表里具体的「领取/去完成」按钮上
const onSwitchTopTab = (tab: ActivityTopTab) => {
	switchTopTab(tab)
}

// 活动列表筛选(全部/充值/游戏/新人),category 由 mock 假数据的 category 字段提供
const activeCategory = ref<ActivityCategory>('all')
const filteredActivityList = computed(() =>
	activeCategory.value === 'all'
		? activityList.value
		: activityList.value.filter((item: any) => item.category === activeCategory.value)
)

// 顶部图标行=「推荐位」,由下方活动列表里 recommend=true 的条目筛选+排序驱动(2026-09-22 拍板),不再写死 6 个固定入口。
// 这里只给"曾经是固定图标"的活动保留现成的 80×80 图标 + 复用原有红点参数口径;没在这张表里的活动
// (锦标赛/首充奖励/邀请奖励/积分商城/国庆充值活动等)如果也被选进推荐位,用 ActivityEntryGrid 的通用图标兜底。
// enabled() 对应的是原来"这个入口该不该显示"的后台功能开关,与 recommend(是否被选进推荐位)是两个独立维度:
// 开关关闭的活动即使被选进推荐位也不出现在图标行,保持与老版本一致的功能可用性判断。
const RECOMMEND_ICON_META: Partial<Record<string, { icon: string; enabled: () => boolean; badge: () => number }>> = {
	invitationBonus: { icon: 'a2', enabled: () => ActiveSotre.value.isTaskState, badge: () => dotCount(redDot.value.invitationBonusCount) },
	laundry: { icon: 'a3', enabled: () => ActiveSotre.value.isOpenWashCode, badge: () => dotCount(redDot.value.bettingRebateCount) },
	superJackpot: { icon: 'a4', enabled: () => ActiveSotre.value.isOpenJackpotReward, badge: () => dotCount(redDot.value.superJackpotCount) },
	newMemberPackage: { icon: 'a5', enabled: () => ActiveSotre.value.newMemberGiftPackageSwitch, badge: () => dotCount(redDot.value.firstGiftCount) },
	// 第 6 个图标是普通幸运大转盘(v1 后台叫「大转盘配置」),不是邀请转盘,没有开关也没有红点
	bigWheel: { icon: 'a6', enabled: () => true, badge: () => 0 },
}

// 活动奖励不是下方活动列表里的一张卡(2026-09-23 打回:每日签到/活动奖励都属于任务页签,设计稿的活动
// 列表里不出现它们),是前端固定排在图标行第一位的快捷入口,用不在真实 bannerID 段位里的哨兵值标记,
// 点击时不查活动列表、直接切到「任务」页签
const TASK_SWITCH_BANNER_ID = -1
const navList = computed<ActivityEntryItem[]>(() => {
	const fromList = activityList.value
		.filter((item: any) => {
			if (!item.recommend) return false
			const meta = RECOMMEND_ICON_META[item.activityCode as string]
			return meta ? meta.enabled() : true
		})
		.map((item: any) => {
			const meta = RECOMMEND_ICON_META[item.activityCode as string]
			return {
				bannerID: item.bannerID,
				name: item.bannerTitle,
				icon: meta?.icon ?? 'ageneric',
				noread: meta?.badge() ?? 0,
			}
		})
	if (!ActiveSotre.value.isOpenActivityAward) return fromList
	const taskEntry: ActivityEntryItem = {
		bannerID: TASK_SWITCH_BANNER_ID,
		name: t('actTip1'),
		icon: 'a1',
		noread: dotCount(redDot.value.activityAwardCount),
	}
	return [taskEntry, ...fromList]
})

// 图标点击统一入口:活动奖励走切 Tab,其余按 bannerID 找回原始活动,复用与下方卡片一样的 onClick 跳转/登录逻辑
const onIconNavigate = (bannerID: number) => {
	if (bannerID === TASK_SWITCH_BANNER_ID) {
		switchTopTab('task')
		return
	}
	const item = activityList.value.find((entry: any) => entry.bannerID === bannerID)
	if (item) onClick(item)
}

const onViewRecord = () => goProtectedPath('RedeemGift')

const ACTIVITY_PROTECTED_ROUTE_NAMES = new Set(['DailyTasks', 'PointMall', 'InvitationBonus'])

const getActivityFlag = (value: unknown) => {
	const flag = Number(value)
	return Number.isFinite(flag) ? flag : undefined
}

const getActivityRouteName = (id: number) => {
	switch (id) {
		case 1:
			return 'DailyTasks'
		case 2:
			return 'PointMall'
		case 3:
			return 'InvitationBonus'
		default:
			return 'ActivityDetail'
	}
}

const isPublicActivityPath = (path: string) => {
	const resolved = router.resolve({ path }).path
	return ROUTER_WHITE_LIST.includes(resolved)
}

const isActivityItemLoginRequired = (item: ActivityList, targetName?: string, targetPath?: string) => {
	if (getActivityFlag(item.jumpLinkType) === 1) return true
	if (targetName && ACTIVITY_PROTECTED_ROUTE_NAMES.has(targetName)) return true
	if (targetPath && !isPublicActivityPath(targetPath)) return true
	if (getActivityFlag(item.visibility) === 1) return true
	return false
}

const checkActivityItemAccess = async (item: ActivityList, targetName?: string, targetPath?: string) => {
	if (!isActivityItemLoginRequired(item, targetName, targetPath)) return true
	return requireLoginAction()
}

async function onClick(item: ActivityList) {
	const {bannerID: id,jumpType, contents} = item;
	if(jumpType == 2) {
		if(contents?.startsWith('/')) {
			if (!(await checkActivityItemAccess(item, undefined, contents))) return
			router.push({
				path: contents
			})
			return
		}
		if (!(await checkActivityItemAccess(item))) return
		if (contents) window.location.assign(contents)
		return
	} else if (jumpType == 5) {
		if (!(await checkActivityItemAccess(item))) return
		return getSelfCustomerServiceLink()
	}
	const url = getActivityRouteName(id)
	if (!(await checkActivityItemAccess(item, url))) return
	if (url == 'ActivityDetail') {
		router.push({
			name: url,
			query: { id }
		})
	} else {
		url &&
			router.push({
				name: url
			})
	}
}

const fixIcons = (item: ActivityList) => {
	item.bannerUrl = defaultImgAvatar
}

const goPath = (path: string) => {
	router.push({name: path})
}
const goProtectedPath = async (path: string) => {
	if (!(await requireLoginAction())) return
	goPath(path)
}
const goDetail = async()=>{
	if (!(await requireLoginAction())) return
	await saveUserGuidelines()
	goPath('DailyTasks')
}
const handleUnAwardReminderClose = (reason: DialogQueueCloseReason) => {
	if (reason !== 'confirm' && reason !== 'close') return
	void saveUserDayRequest()
	if (reason === 'confirm') goPath('DailyTasks')
}
const pushUnAwardReminderDialog = async () => {
	if (!hasLogin.value) return
	if (!ActiveSotre.value.isOpenActivityAward) return
	if (!ActiveSotre.value.isFirstUserDayRequest) return
	if (allUnAwardCount.value <= 0) return
	const item = createDialogQueueItem<{ count: number }>(ACTIVITY_UN_AWARD_REMINDER_DIALOG_KEY, {
		props: { count: allUnAwardCount.value },
		onClose: handleUnAwardReminderClose,
	})
	if (!item) return
	await dialogQueue.push(item)
}
const onLoad = async() => {
	const res: any = await AwaitApiResult(GetActivityList({pageNo: pageNo.value, pageSize: 20,}))
	if(res) {
		if(res.data.totalCount == 0) isShowEmpty.value = true
		if(res.data.totalPage <= pageNo.value) finished.value = true
		if(res.data.list) activityList.value.push(...res.data.list);
		pageNo.value++
	} else {
		finished.value = true;
	}
	loading.value = false
}

onMounted(async()=>{
	await getActive();
	if(hasLogin.value && ActiveSotre.value.isOpenActivityAward) await getDailyAwardCount()
	await pushUnAwardReminderDialog()
	if(ActiveSotre.value.isOpenChampion == 1){
		championEntranceV()
	}
})

</script>

<style lang="scss" scoped>
.activity-wrapper{
	padding-bottom: 225px;
}
:deep() .van-dialog.MsgRadius {
	border-radius: 10px;
}
.nowidth {
	width: 0;
	flex: none;
}
</style>
