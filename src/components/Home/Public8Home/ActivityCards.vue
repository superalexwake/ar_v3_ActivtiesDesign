<template>
	<div class="activity-cards">
		<div
			class="activity-cards__item activity-cards__item--wheel"
			:style="{ backgroundImage: `url(${iconHomeActivityWheel})` }"
			@click="goActivity('wheel')"
		>
			<span class="activity-cards__item-title">Wheel of fortune</span>
			<span class="activity-cards__item-tag">View</span>
		</div>
		<div
			class="activity-cards__item activity-cards__item--bonus"
			:style="{ backgroundImage: `url(${iconHomeActivityBonus})` }"
			@click="goActivity('bonus')"
		>
			<span class="activity-cards__item-title">Welcome Bonus</span>
			<span class="activity-cards__item-tag">View</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import iconHomeActivityWheel from '@icon/home/activityWheel.png'
import iconHomeActivityBonus from '@icon/home/activityBonus.png'
import { useRouter } from 'vue-router'
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
		height: 200px;
		border-radius: 20px;
		overflow: hidden;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;

		&-title {
			font-size: 32px;
			font-weight: 600;
			color: var(--text_color_L1);
			line-height: 1.2;
			width: 200px;
			margin-top: 20px;
		}

		&-tag {
			font-size: 22px;
			font-weight: 500;
			color: var(--text_color_L4);
			padding-bottom: 6px;
		}
	}
}
</style>
