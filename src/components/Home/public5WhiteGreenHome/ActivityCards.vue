<template>
	<div class="activity-cards">
		<div
			class="activity-cards__item activity-cards__item--wheel"
			:style="{ backgroundImage: `url(${activityWheelImg})` }"
			@click="goActivity('wheel')"
		>
			<span class="activity-cards__item-title">Wheel of fortune</span>
			<span class="activity-cards__item-tag activity-cards__item-tag--wheel">View</span>
		</div>
		<div
			class="activity-cards__item activity-cards__item--bonus"
			:style="{ backgroundImage: `url(${activityBonusImg})` }"
			@click="goActivity('bonus')"
		>
			<span class="activity-cards__item-title">Welcome Bonus</span>
			<span class="activity-cards__item-tag activity-cards__item-tag--bonus">View</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import activityWheelImg from '@icon/home/activityWheel.png'
import activityBonusImg from '@icon/home/activityBonus.png'
import { requireLoginAction } from '@/hooks/useLoginIntercept'

const router = useRouter()

const goActivity = async (type: string) => {
	if (type === 'wheel') {
		if (!(await requireLoginAction())) return
		router.push({ name: 'Turntable' })
	} else {
		router.push({ name: 'promotion' })
	}
}
</script>

<style lang="scss" scoped>
.activity-cards {
	display: flex;
	gap: 16px;

	&__item {
		flex: 1;
		position: relative;
		height: 180px;
		border-radius: 20px;
		overflow: hidden;
		cursor: pointer;
		/* padding: 0px; */
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;

		&-title {
			position: absolute;
			top: 40px;
			left: 20px;
			font-size: 32px;
			font-weight: 600;
			color: var(--text_color_L1);
			line-height: 1.2;
			width: 200px;
		}

		&-tag {
			position: absolute;
			font-size: 22px;
			font-weight: 500;
			color: var(--text_color_L4);
			line-height: 1;
		}

		&-tag--wheel {
			left: 42px;
			bottom: 24px;
		}

		&-tag--bonus {
			left: 42px;
			bottom: 26px;
		}
		}
	}
</style>
