<template>
	<div class="float" v-scrollhide>
		<!-- 会员回归奖励 -->
		<div class="reBenefit float-entry" @click="openReBenefit" v-if="showReBenefit">
			<div class="downText">
				<span class="time">{{ formattedTime }}</span>
			</div>
		</div>
		<!-- 奖金弹窗 -->
		<div class="rewardCenter float-entry" @click="openReward" v-if="setting.getIsShowRewardCenter"></div>
		<!-- 邀请转盘组件 -->
		<div v-if="setting.getIsOpenInvitedWheel" class="turntable-lottery float-entry" @click="openTurntable" />
		<!-- 大转盘组件 -->
		<div
			v-if="setting.getHomeBigTurntableSwitch"
			ref="turntableId"
			class="big-turntable float-entry"
			@click="bigTurntableJump"
		/>
		<!-- Telegram组件 -->
		<div
			v-if="setting.getTelegramExternalLink"
			class="turntable-telegram float-entry"
			@click="openLink(setting.getTelegramExternalLink)"
		/>
		<!-- 长龙组件 -->
		<div class="changlongEnter float-entry" v-if="showChanglong" @click="changlongEnter"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SettingStore } from '@/stores'
import { useHome, useGlobalDialog, useTrigger, useReBenefit } from '@/hooks'
import { pushReBenefitDialog, pushRewardCenterDialog } from '@/components/DialogQueue/producers'
import { requireLoginAction } from '@/hooks/useLoginIntercept'
const router = useRouter()
const turntableId = ref()
const setting = SettingStore()
const { store, onReturnReBenefit } = useGlobalDialog()
const { isAlowGame, goChangLong, showChanglong } = useHome()
const { onTriggerGoogle } = useTrigger()
const { formattedTime, activityStatus } = useReBenefit()

// 判断是否显示会员回归图标
const showReBenefit = computed(() => {
	// console.log('会员回归状态:', store.reBenefit, '活动状态:', activityStatus.value);
	return store.reBenefit && activityStatus.value === 'IN_PROGRESS'
})
const changlongEnter = async () => {
	if (!(await requireLoginAction())) return
	await isAlowGame('', goChangLong)
}

/*邀请转盘*/
const openTurntable = async () => {
	if (!(await requireLoginAction())) return
	router.push({ name: 'turntable' })
}

/*大转盘*/
const bigTurntableJump = async () => {
	if (!(await requireLoginAction())) return
	router.push({ name: 'Turntable' })
}

const openReward = async () => {
	if (!(await requireLoginAction())) return
	await pushRewardCenterDialog()
	onTriggerGoogle('reward_center_click')
}
const openReBenefit = async () => {
	if (!(await requireLoginAction())) return
	await onReturnReBenefit()
	if (!store.reBenefitObj) return
	await pushReBenefitDialog()
}
const openLink = (link: string) => {
	if (!link) return
	window.open(link)
}
//会员回归
import reBenefitLocalImgUrl from '@/assets/icons/home/reBenefits.png'
const reBenefitBgUrl = computed(() => {
	return `url('${reBenefitLocalImgUrl}')`
})

//彩金中心
import rewardCenterImgUrl from '@/assets/icons/home/rewardCenter.png'
const rewardCenterBgUrl = computed(() => {
	const img = setting.getBonusCenterImgUrl || rewardCenterImgUrl
	return `url('${img}')`
})

// telegram背景图计算
import telegramLocalImgUrl from '@/assets/icons/home/tg_bg.png'
const telegramBgUrl = computed(() => {
	const img = setting.getTelegramImgUrl || telegramLocalImgUrl
	return `url('${img}')`
})

//邀请转盘背景图
import bigTurntableLocalImgUrl from '@/assets/icons/home/turntable_icon.png'
const bigTurntableBgUrl = computed(() => {
	const img = setting.getBigTurntableImgUrl || bigTurntableLocalImgUrl
	return `url('${img}')`
})

//大转盘背景图
import homeBigTurntableImgUrl from '@/assets/icons/activity/Turntable/turntable.png'
const homeBigTurntableBgUrl = computed(() => {
	const img = setting.getHomeBigTurntableImgUrl || homeBigTurntableImgUrl
	return `url('${img}')`
})

//长龙图标配置
import longDragonIcon from '@icon/blueHome/changlong.svg?url'
const changlongIconUrl = computed(() => {
	const img = setting.getLotteryDragonIcon || longDragonIcon
	return `url('${img}')`
})
</script>
<style lang="scss">
.float {
	position: fixed;
	bottom: 300px;
	right: 30px;
	touch-action: none;
	z-index: 1000;
	&-entry {
		width: 112px;
		height: 112px;
		border-radius: 50%;
		margin-bottom: 6px;
	}
}
.reBenefit {
	background: v-bind(reBenefitBgUrl) no-repeat center/cover;
	position: relative;
	.downText {
		position: absolute;
		text-align: center;
		z-index: 1;
		left: 0;
		bottom: 0;
		display: inline-flex;
		width: 110px;
		height: 27px;
		padding: 2px 5px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		border-radius: 70px;
		border: 1px solid #ffecca;
		background: #5a0b5d;
		box-shadow: 1px 2px 1px 0 rgba(255, 251, 255, 0.3) inset;
		.time {
			background: linear-gradient(180deg, #fff 0%, #ffda2f 100%);
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			text-align: center;
			text-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
			font-family: Poppins;
			font-size: 22px;
			font-style: normal;
			font-weight: 600;
			line-height: 23px;
			letter-spacing: -0.5px;
		}
	}
}
.rewardCenter {
	background: v-bind(rewardCenterBgUrl) no-repeat center/cover;
}
.turntable-lottery {
	background: url('@/assets/icons/home/turntable_icon.png') no-repeat center/cover;
}
.turntable {
	background: v-bind(bigTurntableBgUrl) no-repeat center/cover;
}
.big-turntable {
	background: v-bind(homeBigTurntableBgUrl) no-repeat center/cover;
}

.turntable-telegram {
	background: v-bind(telegramBgUrl) no-repeat center/cover;
}
.changlongEnter {
	background: v-bind(changlongIconUrl) no-repeat center/cover;
}
</style>
