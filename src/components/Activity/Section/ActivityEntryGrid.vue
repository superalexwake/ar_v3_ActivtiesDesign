<template>
	<div class="activity-panel">
		<slot name="before-header"></slot>
		<div class="activity-panel-header" :class="[`lg${showLength}`]">
			<template v-for="item in navList" :key="item.goPath">
				<div v-if="item.show" class="header-item" @click="$emit('navigate', item.goPath)">
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
export type ActivityEntryItem = {
	name: string
	icon: string
	goPath: string
	noread: number
	show: boolean
}

defineProps<{
	navList: ActivityEntryItem[]
	showLength: number
}>()

defineEmits<{
	(e: 'navigate', path: string): void
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
			}
		}
	}
}
</style>
