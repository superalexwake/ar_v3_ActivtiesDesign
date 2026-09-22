<template>
	<div class="myReceive__container">
		<NavBar :title="$t('titlePickUpRecord')" left-arrow @click-left="onClick" />

		<div class="myReceive__container-searchbar">
			<div class="myReceive__container-searchbar__selector" :class="{ active: dropdownShow }">
				<div @click="dropdownShow = !dropdownShow">
					<span class="myReceive__container-searchbar__selector-default">
						{{ selectedLevelType }}
					</span>
					<van-icon name="arrow-down" />
				</div>
				<div class="myReceive__container-searchbar__selector-dropdown">
					<li
						v-for="(item, index) in levelTypes"
						:key="index"
						:class="{ selected: item.label === selectedLevelType }"
						@click="onItemClick(item.label)"
					>
						{{ item.label }}
					</li>
				</div>
			</div>
		</div>

		<div class="myReceive__container-content">
			<div class="myReceive__container-content__item" v-for="(item, index) in inviList" :key="index">
				<div class="myReceive__container-content__item-header">
					<span> <van-icon :name="commissionIcon" />{{ $t('commission') }}</span>
					<span
						>{{ $t('checkOver') }}
						<van-icon name="arrow" />
					</span>
				</div>
				<div>{{ item.moneySpent }}</div>
				<div class="myReceive__container-content__item-body">
					<div>
						<span>{{ $t('time') }}</span>
						<span>{{ item.time }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import commissionIcon from '@icon/promotion/commission.png'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()
const dropdownShow = ref(false)
const levelTypes = [
	{
		label: $t('selectTime'),
		value: 'all'
	},
	{
		label: '2022-09-23 13:13:13',
		value: 'level1'
	},
	{
		label: '2022-09-23 13:13:14',
		value: 'level2'
	},
	{
		label: '2022-09-23 13:13:15',
		value: 'level3'
	}
]

const inviList = [
	{
		level: '1',
		status: 0, // 0:启用 1:禁用
		time: '2022-09-23 13:13:13',
		UID: '90164',
		moneySpent: '50,000.00'
	},
	{
		level: '2',
		status: 0, // 0:启用 1:禁用
		time: '2022-09-23 13:13:13',
		UID: '90170',
		moneySpent: '75,000.00'
	},
	{
		level: '3',
		status: 0, // 0:启用 1:禁用
		time: '2022-09-23 13:13:13',
		UID: '90203',
		moneySpent: '100,000.00'
	},
	{
		level: '4',
		status: 0, // 0:启用 1:禁用
		time: '2022-09-23 13:13:13',
		UID: '90324',
		moneySpent: '125,000.00'
	}
]

const selectedLevelType = ref(levelTypes[0].label)

const router = useRouter()

function onItemClick(label: string) {
	selectedLevelType.value = label
	dropdownShow.value = false
}

function onClick() {
	router.back()
}
</script>

<style lang="scss" scoped>
.myReceive__container {
	padding-inline: 24px;
	padding-block: 0 112px;
	font-family: $font-family;

	&-searchbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 80px;

		&__selector {
			position: relative;
			display: flex;
			flex: 1;
			height: 100%;
			line-height: 80px;
			color: var(--text_color_L2);

			& > div {
				width: 100%;
				font-size: 28px;
				border-radius: 10px;
				background: var(--bg_color_L2);
				

				&:first-of-type {
					position: relative;
					padding: 0 20px;
					z-index: 2;

					i {
						position: absolute;
						top: 50%;
						right: 20px;
						transform: translateY(-50%);
						transition: all 0.2s ease-in-out;
					}
				}
			}

			&-dropdown {
				position: absolute;
				top: 100%;
				transform: translateY(-10%);
				opacity: 0;
				visibility: hidden;
				z-index: -1;
				border: 1px solid var(--text_color_L1);
				overflow: hidden;
				transition: all 0.2s ease-in-out;

				li {
					padding: 0 20px;
					list-style: none;

					&.selected {
						color: var(--textW);
						background-color: var(--norm_red-color);
					}
				}
			}

			&.active {
				& > div {
					&:first-of-type {
						i {
							transform: translateY(-50%) rotate(180deg);
							transform-origin: center;
						}
					}

					&:last-of-type {
						transform: translateY(0%);
						opacity: 1;
						visibility: visible;
						z-index: 1;
					}
				}
			}
		}
	}

	&-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 42px;

		&__item {
			display: flex;
			flex-direction: column;
			height: 232px;
			padding: 24px 10px;
			border-radius: 10px;
			background-color: var(--textW);
			

			&-header {
				display: flex;
				align-items: center;
				gap: 10px;

				span {
					font-size: 26px;
					text-align: center;

					&:first-of-type {
						display: flex;
						align-items: center;
						margin-left: 10px;
						color: var(--text_color_L1);

						i {
							margin-right: 6px;
							font-size: 40px;
						}
					}

					&:last-of-type {
						margin-left: auto;
						padding: 6px 27px;
						border: 1px solid var(--gray-color-1);
						border-radius: 10px;
					}
				}
			}

			& > div {
				&:nth-of-type(2) {
					margin-bottom: 27px;
					padding-left: 10px;
					color: var(--main-color);
					font-size: 48px;
					line-height: 48px;
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 0.375rem;
				font-size: 0.875rem;
				color: var(--text_color_L3);

				& > div {
					display: flex;
					align-items: center;
					justify-content: space-between;
					background-color: #F6F6F6;

					&:last-of-type {
						span {
							&:last-of-type {
								color: var(--text_color_L2);
							}
						}
					}

					span {
						height: 60px;
						padding: 0px 20px;
						line-height: 60px;

						&:first-of-type {
							flex: 0.45;
							background: var(--bgColor-6);
							clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
						}

						&:last-of-type {
							flex: 0.55;
							text-align: right;
						}
					}
				}
			}
		}
	}
}
</style>
