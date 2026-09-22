<template>
	<div class="activity-panel">
		<slot name="before-header"></slot>
		<div class="activity-panel-header" :class="[`lg${showLength}`]">
			<template v-for="item in navList" :key="item.bannerID">
				<div class="header-item" @click="$emit('navigate', item.bannerID)">
					<van-badge
						:dot="isDot(item.noread)"
						:content="badgeNum(item.noread)"
						max="99"
						color="#FA5B5B"
					>
						<div :class="[item.icon, 'bgcontainer']"></div>
					</van-badge>
					<span>{{ item.name }}</span>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
// 「推荐位」图标行的一项:内容取自下方活动列表里 recommend=true 的活动本身(活动名+图标),
// 调用方已经按 recommend 过滤好并排好序,本组件不再做显隐判断
export type ActivityEntryItem = {
	/** 对应活动的 bannerID,点击时回传给调用方用来定位原始活动、复用同一套跳转逻辑 */
	bannerID: number
	name: string
	icon: string
	noread: number
}

defineProps<{
	navList: ActivityEntryItem[]
	showLength: number
}>()

defineEmits<{
	(e: 'navigate', bannerID: number): void
}>()

const isDot = (count?: number) => (count ?? 0) === 1
const badgeNum = (count?: number) => ((count ?? 0) > 1 ? count : undefined)
</script>

<style lang="scss" scoped>
.activity-panel{
	padding: 24px;
	&-header{
		&.lg3 {
			padding: 0 44px;
		}
		&.lg2 {
			padding: 0 127px;
		}
		&.lg1 {
			justify-content: center;
		}
		&.lg5{
			.header-item{
				width: 150px;
				margin-bottom: 20px;
			}
		}
		&.lg1,&.lg2,&.lg3,&.lg4{
			display: flex;
			justify-content: space-between;
		}
		&.lg5,&.lg6,&.lg7,&.lg8,&.lg9,&.lg10,&.lg11,&.lg12,&.lg13,&.lg14,&.lg15,&.lg16{
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-gap: 30px;
			flex-wrap: wrap;
		}
		.header-item{
			display: flex;
			flex-direction: column;
			color: var(--text_color_L2);
			width: 100px;
			margin: 0 auto;
			align-items: center;
			text-align: center;
			.bgcontainer {
				width: 80px;
				height: 80px;
				border-radius: 20px;
				padding: 10px;
				margin-bottom: 22px;
				&::after {
					content: '';
					display: block;
					width: 60px;
					height: 60px;
					background-repeat: no-repeat;
					background-position: center;
					background-size: 60px;
				}
				&.a1 {
					background: url("@/assets/icons/activity/Home/activityReward.png") no-repeat;
					background-position: center;
					background-size: 80px, 80px;
				}
				&.a2 {
					background: url("@/assets/icons/activity/Home/invitationBonus.png") no-repeat;
					background-position: center;
					background-size: 80px, 80px;
				}
				&.a3 {
					background: url("@/assets/icons/activity/Home/BettingRebate.png") no-repeat;
					background-position: center;
					background-size: 80px, 80px;
				}
				&.a4 {
					background: url("@/assets/icons/activity/Home/superJackpot.png") no-repeat;
					background-position: center;
					background-size: 80px, 80px;
				}
				&.a5 {
					background: url("@/assets/icons/activity/Home/memberGift.png") no-repeat;
					background-position: center;
					background-size: 80px, 80px;
				}
				&.a6 {
					background: url("@/assets/icons/activity/invite_wheel.png") no-repeat;
					background-position: center;
					background-size: 80px, 80px;
				}
				// 没有专属图标映射的活动(每日签到/首充奖励/锦标赛/国庆充值活动等)被选进推荐位时的兜底通用图标
				&.ageneric {
					background: url("@/assets/icons/svg/activity.svg") no-repeat;
					background-position: center;
					background-size: 48px, 48px;
					opacity: .7;
				}
			}
		}
	}
}
</style>
