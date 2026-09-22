<template>
	<div class="Laundry-page">
		<NavBar :title="t('laundry')" left-arrow @click-left="router.go(-1)"> </NavBar>
		<van-sticky :offset-top="46" :container="containerRef" class="bet-container-sticky">
			<div>
				<NavTab :list="rootConfig.gameTabList" v-model:active="active" tabClassName="tabs" v-slot="{ item, index }"
					@onClickTab="onClickTab" activeClassName="tab_active" ref="tabRefs" tabItemClassName="funtab_item">
					<div class="tab_item" :class="{ tab_active: index === active }">
						<svg-icon :name="item.img" />
						<span>{{ item.name }}</span>
					</div>
				</NavTab>
			</div>
		</van-sticky>
		<!-- 可洗码量 -->
		<div class="laundry-page_container">
			<div class="laundry-page_box">
				<div class="title">
					{{ rootConfig.gameTabList[active].name }}-{{ t('washableSize') }}
				</div>
				<div class="lab"><svg-icon name= "rebateRealTime" /> 
					{{ t('laundryTxt') }}</div>
				<div class="number">
					<svg-icon name="rebate" />
					{{ laundryList.codeWashAmount.toFixed(2) || 0 }}
				</div>
				<div class="txt">{{ t('laundryTxt1') }}</div>
				<div class="c-row">
					<div class="item">
						<div v-show="active == 0">
							<p class="tit">{{ t('rebateToday') }}</p>
							<span class="num"> {{ laundryList.dayRebate || 0 }} </span>
						</div>
						<div v-show="active != 0">
							<p class="tit">{{ t('laundryRate') }}</p>
							<span class="num red"> {{ laundryList.washRate || 0 }}%</span>
						</div>
					</div>
					<div class="item">
						<p class="tit">{{ t('totalRebate') }}</p>
						<span class="num"> {{ laundryList.totalRebate || 0 }} </span>
					</div>
				</div>
				<div class="tip">{{t('laundryTxt2')}}</div>
				<button v-if="showdel" :class="laundryList.codeWashAmount >= 100 ? 'btn active' : 'btn'" v-throttle-click="{ handler: CheckLaundry, wait: 2000 }">
					{{ t('codeWashing') }}
				</button>
				<p class="rule" v-show="false" @click="onToRule">
					{{ t('understandRules') }}<img class="rule-img" src="@icon/main/ruleicon.png" alt="" />
				</p>
			</div>
			<!-- 洗码记录 -->
			<div class="laundry-page_list">
				<div class="title">{{ t('laundryRed') }}</div>
				<div class="list" v-if="laundryList.washList">
					<div class="item" v-for="(item, index) in laundryList.washList || []" :key="index">
						<div class="header">
							<div class="">
								<p class="name">{{ getType(item.codeType) }}</p>
								<span class="time"> {{ item.addTime }} </span>
							</div>
							<div class="state">{{ t('laundrySuccess') }}</div>
						</div>
						<div class="body">
							<div class="left">
								<div class="imgBox"><img class="img" src="@icon/main/gameStatsSteps.png" alt="" /></div>
								<div>
									<p>{{ t('laundryAmount') }}</p>
									<p>{{ t('laundryRate') }}</p>
									<p>{{ t('rebateAmount') }}</p>
								</div>
							</div>
							<div class="right">
								<p>{{ item.washVolume }}</p>
								<p class="red">{{ item.washRate }}%</p>
								<p class="orange">{{ item.rebateAmount }}</p>
							</div>
						</div>
					</div>
				</div>
				<van-button class="all-record"  plain block round type = "primary"
					v-throttle-click="{ handler: onToRecord, wait: 2000 }">{{ t('allRecords') }}</van-button>
			</div>
		</div>
		<Dialog v-model:show="LaundryDialogShow" @confirm="onLaundy" :show-cancel-btn="false" :confirmText="t('confirm')"
			:title="`${rootConfig.gameTabList[active].name}-${t('laundryAmount')}`">
			<template #header>
				<img src="@icon/public/succeed.png" alt="" />
			</template>
			<template #content>
				<div class="Laundry-Con">
					<div class="Laundry-Con_tip">{{ t('codeWashingSuccess') }}</div>
					<div class="Laundry-Con_txt">
						{{ t('rebateAmount') }}:<span class="number">{{ rebateAmount.toFixed(2) }}</span>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import { AwaitApiResult } from '@/utils'
import { GetCodeWashAmount, AddCodeWashRecord } from '@/api'
import type { CodeWashAmount, ResCodeWashAmount } from '@/types/api'

import NavTab from '@/components/FunTab/NavBar.vue'
import Dialog from '@/components/common/Dialog.vue'

import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'
import { useActive } from '@/components/common/use'

const { t } = useI18n()
const { refreshRedDot } = useActive()

const router = useRouter()
const settingS = SettingStore()
const showdel = computed(() => settingS.getIsShowAppHandCodeWashingSwitch)
const containerRef = ref<HTMLElement>(null as any)
const active = ref(0)

const onClickTab = (val: any) => {
	let type = rootConfig.gameTabList[active.value].codeType
	if (type === data.codeType) return false
	data.codeType = type
	getCodeWashAmount()
}
const LaundryDialogShow = ref(false)
const rebateAmount = ref(0)
const CheckLaundry = async (): Promise<void> => {
	if (laundryList.codeWashAmount < 100) return;
	const res = await AwaitApiResult(AddCodeWashRecord(data))
	if (res?.data?.rebateAmount > 0 ) {
		rebateAmount.value = res?.data?.rebateAmount
		getCodeWashAmount()
		LaundryDialogShow.value = true
		refreshRedDot()
	}

}

const onLaundy = () => {
	LaundryDialogShow.value = false
}

// 跳转到规则页面
const onToRule = () => {
	router.push({
		name: 'Laundry-LaundryRule'
	})
}

// 跳转到全部记录页面
const onToRecord = () => {
	router.push({
		name: 'Laundry-LaundryRecord'
	})
}

const laundryList = reactive<ResCodeWashAmount>({
	codeWashAmount: 0,
	dayRebate: 0,
	totalRebate: 0,
	washRate: '',
	washList: []
})

const data = reactive<CodeWashAmount>({
	codeType: -1
})
// 获取游戏分类显示
function getType(type: number) {
	let name = ''
	rootConfig.gameTabList.map((ele: { codeType: number; name: string }) => {
		if (ele.codeType == type) {
			name = ele.name
		}
	})
	return name
}


// 洗码率
async function getCodeWashAmount() {
	const res = await AwaitApiResult(GetCodeWashAmount(data))
	if (res) {
		laundryList.codeWashAmount = res.data.codeWashAmount
		laundryList.dayRebate = res.data.dayRebate
		laundryList.totalRebate = res.data.totalRebate
		laundryList.washRate = res.data.washRate
		laundryList.washList = res.data.washList
	}
}

onMounted(() => {
	rootConfig.gameTabList
	settingS.getHomeSetting()
	getCodeWashAmount()
})
</script>

<style scoped lang="scss">
:deep(.dialog__container) {
	.dialog__container-img {
		height: 180px;
		margin-top: -80px;

		img {
			width: 100%;
			height: 100%;
		}
	}
}

.Laundry-page {
	overflow: hidden;
	padding: 0 24px;

	.tabs {
		background: var(--bg_color_L1);
		height: 140px;
	}

	.tab_item {
		width: 190px;
		height: 100px;
		margin-inline: 5px;
		padding: 0;
		color: var(--text_color_L2) !important;
		border-radius: 10px;
		background: var(--bg_color_L2);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		

		svg {
			height: 50px;
			width: 50px;
		}

		span {
			font-size: 24px;
		}
	}

	.tab_active {
		color: var(--text_color_L4) !important;
		background: var(--main_gradient-color);
		
	}

	:v-deep(.fun-tabs .fun-tab-item) {
		padding: 14px 0;
	}

	&-tabBar {
		padding-inline: 24px;

		:deep(.van-tabs__nav--card) {
			height: 140px;
			margin: 0;

			.van-tab--card {
				width: 190px;
				height: 100px;
				margin-inline: 5px;
				padding: 0;
				color: var(--text_color_L2) !important;
				border-radius: 10px;
				background: var(--darkBg,var(--bg_color_L2));
				

				&>span {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;

					img {
						width: 50px;
						height: auto;
					}

					span {
						font-size: 24px;
					}
				}

				&.van-tab--active {
					color: var(--textW) !important;
					background: var(--main_gradient-color);
				
				}
			}
		}
	}

	//可洗码量
	.laundry-page_container {
		.laundry-page_box {
			background: var(--bg_color_L2);
			border-radius: 10px;
			padding: 15px;

			.title {
				height: 50px;
				line-height: 50px;
				font-size: 28px;
				color: var(--text_color_L1);
			}
			.lab {
				display: flex;
				min-width: 250px;
				max-width: 100%;
				width: fit-content;
				align-items: center;
				min-height: 42px;
				height: 50px;
				line-height: 50px;
				border: 1px solid var(--main-color);
				border-radius: 10px;
				padding: 0 12px;
				font-size: 22px;
				gap:9px;
				color: var(--main-color);
                svg{
					width: 36px;
					height: 36px;
				}	
			}

			.number {
				color: var(--darkTextW,var(--text_color_L1));
				font-weight: 700;
				font-size: 36px;
				display: flex;
				align-content: center;
				margin: 20px 0;

				.wallet {
					width: 40px;
					margin-right: 15px;
				}

				svg
				{
					color: var(--main-color);
					height: 48px;
					width: 48px;
					margin-inline-end: 13px;
				}
			}

			.txt {
				background: var(--bg_color_L3);
				margin-bottom: 15px;
				width: 85%;
				line-height: 30px;
				padding: 15px;
				font-size: 22px;
				border-radius: 10px;
				color: var(--text_color_L2);
			}

			.tip {
				padding: 15px;
				color: var(--text_color_L2);
			}
			.c-row {
				display: flex;
				justify-content: space-between;

				.item {
					width: calc(50% - 7px);
					background: var(--bg_color_L3);
					padding: 15px;
					border-radius:10px;

					.tit {
						color: var(--text_color_L2);
						font-size: 22px;
						margin-bottom: 10px;
					}

					.num {
						color: var(--norm_secondary-color);
						font-size: 32px;
						font-weight: bold;

						&.red {
							color: var(--norm_red-color);
						}
					}
				}
			}

			.btn {
				width: 660px;
				height: 70px;
				line-height: 70px;
				text-align: center;
				background: var(--button_dis_color, var(--bg_color_L3));
				border-radius: 80px;
				font-size: 30px;
				color: var(--text_color_L1);
				border: none;
				margin-top: 6px;

				&.active {
					background: var(--main_gradient-color);
					color: var(--text_color_L4);
				}
			}

			.rule {
				height: 60px;
				line-height: 60px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24px;
				color: var(--text_color_L2);
				margin-top: 10px;

				&-img {
					height: 40px;
					width: 40px;
				}
			}
		}

		.laundry-page_list {
			margin-top: 20px;
			padding-bottom: 30px;

			.title {
				height: 50px;
				line-height: 50px;
				padding-left: 20px;
				font-weight: bold;
				font-size: 36px;
				position: relative;
				margin-bottom: 20px;
				color: var(--text_color_L1);

				&::before {
					display: block;
					content: '';
					height: 30px;
					width: 6px;
					background: var(--main-color);
					position: absolute;
					left: 0;
					top: 50%;
					transform: translate(0, -50%);
				}
			}

			.list {
				margin-top: 20px;

				.item {
					margin-bottom: 20px;
					background: var(--bg_color_L2);
					border-radius: 10px;
					padding: 15px;

					.header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 10px;
						margin-bottom: 15px;
						border-bottom: 1px solid var(--Dividing-line_color);

						.name {
							font-size: 30px;
							font-weight: bold;
							color: var(--text_color_L1,);
							margin-bottom: 15px;
						}

						.time {
							font-size: 22px;
							color: var(--text_color_L3);
						}

						.state {
							font-size: 28px;
							color: #40c592;
						}
					}

					.body {
						display: flex;
						justify-content: space-between;

						.left {
							display: flex;
							justify-content: space-between;
							color: var(--text_color_L3);
							font-size: 24px;
							height: 180px;

							.imgBox {
								padding: 15px 0;
								margin-right: 15px;

								.img {
									height: 100%;
								}
							}

							div {
								&>p {
									
									line-height: 60px;
									font-size: 24px;
									color: var(--text_color_L2);
								}
							}
						}

						.right {
							text-align: right;
							color: var(--text_color_L1);
						
							&>p {
								line-height: 60px;
								font-size: 24px;
								color: var(--text_color_L1);

								&.red {
									color: var(--norm_red-color);
								}

								&.orange {
									color: var(--norm_secondary-color);
								}
							}
						}
					}
				}
			}
			
			.all-record {
				height: 75px;
				border-color: var(--main-color) !important;
				color: var(--main-color) !important;
				background: var(--bg_color_L2);
		
			}
		}
		
		
	}
	:deep(.dialog__container-img) {
			width: 281px;
			height: 185px;
		}
	:deep(.dialog__container-content) {
		text-align: center;

		.Laundry-Con_tip {
			font-size: 24px;
			color: var(--text_color_L2);
			margin: 0 0 40px;
		}
		
		.Laundry-Con_txt {
			font-size: 24px;
			color: var(--text_color_L1);

			.number {
				color: var(--norm_secondary-color);
				font-size: 30px;
			}
		}
	}
}
</style>
