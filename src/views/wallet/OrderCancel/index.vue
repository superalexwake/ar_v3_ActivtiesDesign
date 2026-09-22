<template>
	<div class="orderCancel__container">
		<NavBar :left-arrow="true" @click-left="router.back()">
			<template #center>{{ $t('concelOrder') }}</template>
		</NavBar>

		<div class="orderCancel__container-header">
			<div v-for="(item, index) in cancelOrderData" class="orderCancel__container-header__details">
				<span>{{ item.name }}</span>
				<span>{{ item.value }}</span>
			</div>

			<div class="divider"></div>

			<div class="orderCancel__container-header__footer">
				<span>MS2022102618415496</span>
				<span>2022-06-01 15:15:15</span>
			</div>
		</div>

		<div class="orderCancel__container-reason">
			<h1>{{ $t('cancelReason') }}</h1>

			<div
				class="orderCancel__container-reason__item"
				:class="{ selected: item.value === selectedReason }"
				@click="selectedReason = item.value"
				v-for="(item, index) in cancellationReasons"
				:key="index"
			>
				<span>{{ item.label }}</span>
			</div>
			<textarea
				v-model="otherReason"
				:class="{ active: selectedReason === 4 }"
				:placeholder="$t('enterOtherReason')"
			></textarea>
		</div>

		<div class="orderCancel__container-tip">{{ $t('orderDesc1') }}</div>
	</div>
	<div class="orderCancel__container-button" @click="dialogShow = true">{{ $t('confirmCancel') }}</div>

	<Dialog v-model:show="dialogShow" :title="$t('cancelDeal')" :cancel-text="$t('close')" :confirm-text="$t('confirmCancel')">
		<template #content>{{ $t('orderDesc2') }}</template>
	</Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/common/Dialog.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const { t } = useI18n()

const router = useRouter()

const selectedReason = ref(1)

const otherReason = ref('')

const dialogShow = ref(false)

const cancelOrderData = [
	{
		name: 'Account Name',
		value: 'SAWARN TELECOM'
	},
	{
		name: 'Bank Number',
		value: '00051231000000315'
	},
	{
		name: 'Order Number',
		value: '2022102518543345000113'
	},
	{
		name: 'Payment Amount',
		value: '฿8888.00'
	}
]

const cancellationReasons = [
	{
		value: 1,
		label: t('c2cTip17')
	},
	{
		value: 2,
		label: t('c2cTip17')
	},
	{
		value: 3,
		label: t('c2cTip17')
	},
	{
		value: 4,
		label: t('other')
	}
]
</script>

<style lang="scss" scoped>
.orderCancel__container {
	padding-inline: 24px;

	&-header {
		width: 100%;
		height: 410px;
		padding: 42px 20px;
		color: var(--norm_red-color);
		font-size: 26px;
		border-radius: 10px;
		background-color: var(--textW);

		&__details {
			display: flex;
			justify-content: space-between;
			margin-bottom: 30px;

			span {
				&:last-of-type {
					color: var(--text_color_L2);
				}
			}

			&:nth-of-type(4) {
				margin-bottom: 50px;

				span {
					&:last-of-type {
						color: var(--norm_secondary-color);
					}
				}
			}
		}

		.divider {
			border-top: 1px solid var(--gray-color-1);
			margin-block: 33px;
		}

		&__footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--gray-color-1);
			font-size: 24px;
		}
	}

	&-reason {
		height: max-content;
		margin-top: 40px;
		padding: 28px 20px;
		border-radius: 20px;
		background-color: var(--textW);
		transition: height 0.3s ease-in-out;

		h1 {
			display: flex;
			align-items: center;
			gap: 17px;
			margin-bottom: 30px;
			color: var(--text_color_L1);
			font-size: 30px;
			font-weight: 600;

			&::before {
				content: '';
				display: inline-block;
				width: 6px;
				height: 30px;
				background-color: var(--main-color);
			}
		}

		&__item {
			display: flex;
			align-items: center;
			gap: 21px;
			margin-bottom: 30px;
			color: var(--text_color_L2);
			font-size: 24px;

			&::before {
				content: '';
				display: inline-block;
				width: 24px;
				height: 24px;
				border: 1px solid var(--text_color_L2);
				box-sizing: border-box;
				border-radius: 50%;
				background-color: var(--textW);
				transition: background-color 0.1s ease-in-out, border 0.1s ease-in-out;
			}

			&.selected {
				&::before {
					border-width: 0px;
					background-color: var(--main-color);
				}
			}

			&:last-of-type {
				margin-bottom: 0;
			}
		}

		textarea {
			width: 590px;
			height: 0px;
			margin-top: 15px;
			margin-left: 65px-24px;
			padding: 27px 24px;
			font-size: 24px;
			opacity: 0;
			border-radius: 10px;
			border: 1px solid var(--Dividing-line_color);
			transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;

			&.active {
				height: 210px;
				opacity: 1;
			}
		}
	}

	&-tip {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 50px;
		color: var(--text_color_L2);
		font-size: 24px;

		&::before {
			content: '';
			position: absolute;
			left: 12px;
			display: inline-block;
			width: 10px;
			height: 10px;
			background: var(--colorText-26);
			transform: rotate(45deg);
		}
	}

	&-button {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 70px;
		color: var(--textW);
		font-size: 30px;
		text-align: center;
		line-height: 70px;
		background: var(--main-color);
	}
}
</style>
