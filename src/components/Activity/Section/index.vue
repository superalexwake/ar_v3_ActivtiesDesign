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

		<ActivityEntryGrid
			:nav-list="navList"
			:show-length="showLength"
			:attendance-count="dotCount(redDot.attendanceBonusCount)"
			@navigate="goProtectedPath"
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
		<div class="cardBox" v-if="ActiveSotre.isOpenChampion == 1">
			<Card :itemD="championEntranceVO" :state="championEntranceVO.state" v-model:isRefresh="isRefresh" bgImgWidth="100%" bgImgHeight="150px"
			@click="goProtectedPath('Championship')">
			</Card>
		</div>

		<ActivityBannerList
			v-model:loading="loading"
			:list="activityList"
			:finished="finished"
			:is-show-empty="isShowEmpty"
			@load="onLoad"
			@click-item="onClick"
			@image-error="fixIcons"
		/>
	</div>
</template>

<script setup lang="ts">
import { AwaitApiResult } from '@/utils'
import defaultImgAvatar from '@public/images/avatar.png'
import { useRouter } from 'vue-router'
import type { ActivityList, UserInfo } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { ref,computed,watch,onMounted } from 'vue'
import { useActive } from '@/components/common/use'
import { GetActivityList } from '@/api'
import Card from '@/components/Activity/Championship/card.vue'
import { useChampionship, useHome } from "@/hooks"
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

const { getSelfCustomerServiceLink } = useServer({ServerType: 2})
const { ActiveSotre, saveUserGuidelines, saveUserDayRequest,getDailyAwardCount,allUnAwardCount, getActive } = useActive()
const setting = SettingStore()
const globalStore = GlobalStore()
const {championEntranceV,championEntranceVO} = useChampionship()
const {isOpenInvitedWheel} = useHome()
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
watch(()=>ActiveSotre.value.isOpenChampion,
(newValue)=>{
	if(newValue==1){
		championEntranceV()
	}
})
const isRefresh = ref(false)
watch(isRefresh,
(val)=>{
	if(val){
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
const hasLogin = computed(() => Boolean(globalStore.token))
// 红点计数:未登录一律 0(后端未登录也返全 0,前端再兜底一层)
const redDot = computed(() => ActiveSotre.value.activityRedDot)
const dotCount = (n: number) => (hasLogin.value ? n : 0)
const navList = computed<ActivityEntryItem[]>(()=>([
	{ name: t('actTip1'), icon: 'a1', goPath: 'DailyTasks', noread: dotCount(redDot.value.activityAwardCount), show: ActiveSotre.value.isOpenActivityAward },
	{ name: t('invitationBonus'), icon: 'a2', goPath: 'InvitationBonus', noread: dotCount(redDot.value.invitationBonusCount), show: ActiveSotre.value.isTaskState},
	{ name: t('laundryAmount'), icon: 'a3', goPath: 'Laundry', noread: dotCount(redDot.value.bettingRebateCount), show: ActiveSotre.value.isOpenWashCode},
	{ name: t('superjackpot'), icon: 'a4', goPath: 'SuperJackpot', noread: dotCount(redDot.value.superJackpotCount), show: ActiveSotre.value.isOpenJackpotReward},
	{ name: t('newMenberPackage'), icon: 'a5', goPath: "MemberPackage", noread: dotCount(redDot.value.firstGiftCount), show: ActiveSotre.value.newMemberGiftPackageSwitch},
	{ name: t('inviteWheel'), icon: 'a6', goPath: "turntable", noread: dotCount(redDot.value.invitedWheelCount), show: isOpenInvitedWheel.value},
]))
const showLength = computed(()=>{
	return navList.value.filter(item=>item.show).length
})

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

	.cardBox{
		padding: 0 20px;
	}
}
:deep() .van-dialog.MsgRadius {
	border-radius: 10px;
}
.nowidth {
	width: 0;
	flex: none;
}
</style>
