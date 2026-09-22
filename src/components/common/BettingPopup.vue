<template>
	<!-- 投注内容 begin -->
	<van-popup v-model:show="showPopup" position="bottom" :round="true" :close-on-click-overlay="false">
		<div :class="[`Betting__Popup-${selectInfo.selecttype}`]">
			<div class="Betting__Popup-head">
				<div class="Betting__Popup-head-title">{{ gameName.replace('<br />', ' ') }}</div>
				<div class="Betting__Popup-head-selectName">
					<span>{{ t('choose') }}</span
					><span>{{ selectName }}</span>
				</div>
			</div>
			<div class="Betting__Popup-body">
				<div class="Betting__Popup-body-line">
					{{ t('amount') }}
					<div class="Betting__Popup-body-line-list">
						<div
							v-for="(item, index) in betTypeList"
							:key="index"
							class="Betting__Popup-body-line-item"
							:class="{ bgcolor: selectInfo.coin == item }"
							@click="changeCoin(item)"
						>
							{{ item }}
						</div>
					</div>
				</div>
				<div class="Betting__Popup-body-line">
					{{ t('numbers') }}
					<div class="Betting__Popup-body-line-btnL">
						<div class="Betting__Popup-btn" :class="{ bgcolor: selectInfo.count > 0 }" @click="Stepper(1)">-</div>
						<van-field
							class="Betting__Popup-input"
							v-model.number="selectInfo.count"
							type="digit"
							:maxlength="4"
							@input="changeStep"
						/>
						<div class="Betting__Popup-btn bgcolor" @click="Stepper(2)">+</div>
					</div>
				</div>
				<div class="Betting__Popup-body-line">
					<div></div>
					<div class="Betting__Popup-body-line-list">
						<div
							v-for="(item, index) in multipleList"
							:key="index"
							class="Betting__Popup-body-line-item"
							@click="TaskCount(item)"
							:class="{ bgcolor: selectInfo.count == item }"
						>
							X{{ item }}
						</div>
					</div>
				</div>
				<div class="Betting__Popup-body-line">
					<span
						class="Betting__Popup-agree"
						:class="{ active: isCheckPreSale }"
						@click="isCheckPreSale = !isCheckPreSale"
						>{{ t('agree') }}</span
					><span @click="isShowPreSale = true" class="Betting__Popup-preSaleShow">{{ t('presaleRules') }}</span>
				</div>
			</div>
			<div class="Betting__Popup-foot">
				<div class="Betting__Popup-foot-c" @click="emits('clearBetting')">{{ t('cancel') }}</div>
				<div
					class="Betting__Popup-foot-s bgcolor"
					:class="{ disabled: !canSubmit }"
					v-throttle-click="{ handler: submitBetting, wait: 2000 }"
				>
					{{ t('totalAmount') }} {{ currency(selectInfo.count * selectInfo.coin || 0) }}
				</div>
			</div>
		</div>
	</van-popup>

	<!-- 规则弹层 begin-->
	<van-popup v-model:show="isShowPreSale" :close-on-click-overlay="false" round>
		<div class="Betting__Popup-PreSale">
			<div class="Betting__Popup-PreSale-head">{{ t('presaleRules') }}</div>
			<div class="Betting__Popup-PreSale-body">
				{{ $t('betPopTXT') }}
			</div>
			<div class="Betting__Popup-PreSale-foot">
				<div class="Betting__Popup-PreSale-foot-btn" @click="knowPreSale">{{ t('iKonw') }}</div>
			</div>
		</div>
	</van-popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showFailToast, showToast } from 'vant'
import { currency } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emits = defineEmits<{
	(e: 'update:bettingPopupShow', val: boolean): void
	(e: 'update:selectInfo', val: any): void
	(e: 'clearBetting'): void
	(e: 'submitBetting'): void
}>()
// 是否展示预售规则
const isShowPreSale = ref(false)
// 是否同意预售规则
const isCheckPreSale = ref(true)

const props = defineProps({
	currentGame: {
		// 选中的游戏
		type: Object,
		default: () => ({})
	},
	selectInfo: {
		// 投注相关参数
		type: Object,
		default: () => ({})
	},
	bettingPopupShow: {
		// 是否展示弹窗
		type: Boolean,
		default: ref(false)
	},
	betTypeList: {
		// 金额列表
		type: Array,
		default: []
	},
	multipleList: {
		// 份数快捷选项按钮
		type: Array,
		default: () => [1, 5, 10, 20, 50, 100]
	}
})

const showPopup = computed({
	get(): boolean {
		return props.bettingPopupShow || false
	},
	set(val: boolean) {
		emits('update:bettingPopupShow', val)
	}
})
// 选中投注展示
const selectName = computed(() => {
	switch (props.selectInfo.selecttype) {
		case 13:
			return t('big')
		case 14:
			return t('small')
		case 10:
			return t('redColor')
		case 11:
			return t('greenColor')
		case 12:
			return t('purpleColor')
		default:
			return props.selectInfo.selecttype
	}
})
//游戏名称
const gameName = computed(() => {
	return props.currentGame.typeName
})
const canSubmit = computed(() => Number(props.selectInfo.count) >= 1)

// 份数加减
const Stepper = (e: number) => {
	switch (e) {
		case 1:
			if (props.selectInfo.count > 1) {
				props.selectInfo.count--
				setAllCoin()
			}
			break
		case 2:
			props.selectInfo.count++
			setAllCoin()
			break
		default:
	}
}
// 输入框设置数量
const changeStep = (e: any) => {
	if (e > 0) {
		props.selectInfo.count = parseInt(e)
		setAllCoin()
	}
}
// 购买份数切换
const TaskCount = (item: number | unknown) => {
	props.selectInfo.count = item
	setAllCoin()
}
// 购买金额切换
const changeCoin = (item: any) => {
	props.selectInfo.coin = item
	setAllCoin()
}
// 知道预售规则
const knowPreSale = () => {
	isShowPreSale.value = false
	isCheckPreSale.value = true
}
// 点击提交金额
const submitBetting = () => {
	if (props.selectInfo.count == 0) {
		return showFailToast(t('bteNoCount'))
	}
	if (!isCheckPreSale.value) {
		showToast(t('agreePresaleRules'))
	} else {
		emits('submitBetting')
	}
}
// 计算总金额
const setAllCoin = () => {
	props.selectInfo.allCoin = props.selectInfo.coin * props.selectInfo.count
}
</script>

<style lang="scss" scoped>
.Betting__Popup {
	&-head {
		height: 190px;
		position: relative;
		padding-top: 30px;

		&::after {
			content: '';
			position: absolute;
			width: 50%;
			left: 0;
			bottom: 0;
			height: 59px;
			background-image: linear-gradient(9deg, var(--bg_color_L2) 50%, transparent 50%);
		}

		&::before {
			content: '';
			position: absolute;
			right: 0;
			bottom: 0;
			width: 50%;
			height: 59px;
			background-image: linear-gradient(-9deg, var(--bg_color_L2) 50%, transparent 50%);
		}

		&-title {
			height: 44px;
			font-weight: 700;
			font-size: 36px;
			text-align: center;
			color: #fff;
		}

		&-selectName {
			width: 560px;
			height: 50px;
			margin: 16px auto 0;
			background: #fff;
			border-radius: 10px;
			text-align: center;
			font-weight: 500;
			font-size: 26px;
			color: #000000;

			& > span {
				line-height: 50px;

				& + span {
					margin-left: 28px;
				}
			}
		}
	}

	&-body {
		height: 390px;
		padding: 57px 26px 40px 26px;

		&-line {
			font-size: 32px;
			color: var(--text_color_L1);
			height: 56px;
			line-height: 56px;
			display: flex;
			justify-content: space-between;

			&-list {
				display: flex;
				justify-content: space-between;
			}

			&-item {
				padding: 0 16px;
				background: var(--bg_color_L3);
        border-radius: 10px;

				& + div {
					margin-left: 12px;
				}
			}

			& + div {
				margin-top: 30px;
			}

			&-btnL {
				justify-content: center;
				display: flex;
			}

			&:last-child {
				justify-content: flex-start;
			}
		}
	}

	&-foot {
		height: 72px;
		display: flex;
		text-align: center;
		line-height: 72px;
		font-size: 28px;
		color: var(--text_color_L1);

		&-c {
			flex: 1;
			background: var(--bg_color_L3);
			color: var(--text_color_L2);
		}

		&-s {
			flex: 2;

			&.disabled {
				opacity: 0.6;
				pointer-events: none;
			}
		}
	}

	&-11,
	&-1,
	&-3,
	&-7,
	&-9 {
		.bgcolor {
			background-color: var(--norm_green-color);
		}

		.Betting__Popup-head {
			background: var(--norm_green-color);
		}
	}

	&-10,
	&-2,
	&-4,
	&-6,
	&-8 {
		.bgcolor {
			background-color: var(--norm_red-color);
		}

		.Betting__Popup-head {
			background: var(--norm_red-color);
		}
	}

	&-0 {
		.bgcolor {
			background-color: var(--norm_red-color);
		}

		.Betting__Popup-head {
      background: linear-gradient(to bottom right,var(--norm_red-color) 50%,var(--norm_Purple-color) 0);
		}
	}

	&-5 {
		.bgcolor {
			background-color: var(--norm_green-color);
		}

		.Betting__Popup-head {
			background: linear-gradient(to bottom right,var(--norm_green-color) 50%,var(--norm_Purple-color) 0);
		}
	}

	&-12 {
		.bgcolor {
			background-color: var(--norm_Purple-color);
		}

		.Betting__Popup-head {
			background: var(--norm_Purple-color);
		}
	}

	&-13 {
		.bgcolor {
			background-color: var(--norm_secondary-color);
		}

		.Betting__Popup-head {
			background: var(--norm_secondary-color);
		}
	}

	&-14 {
		.bgcolor {
			background-color: var(--norm_bule-color);
		}

		.Betting__Popup-head {
			background: var(--norm_bule-color);
		}
	}

	&-btn {
		width: 56px;
		height: 56px;
		pointer-events: none;
		text-align: center;
		font-size: 50px;
		padding: 0;
		background: var(--bg_color_L3);
		color: var(--button_dis_color);
    border-radius: 10px;
		flex: none;
	}

	&-input {
		border: 1px solid var(--bg_color_L3);
    background-color: var(--bg_color_L1);
		padding: 2px 20px;
		width: 158px;
		margin: 0 12px;

		:deep(.van-field__control) {
			text-align: center;
			font-size: 28px;
			line-height: 54px;
		}
	}

	&-agree {
		padding-left: 60px;
		background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/agree-b.png');
		background-repeat: no-repeat;
		background-position: left center;
		background-size: 48px;
		font-size: 24px;
		color: var(--colorText-3);
		html:lang(ar) &{
			background-position: right center;
		}
		&.active {
			background-image: url('@icon/common/agree-a.png');
		}
	}

	&-preSaleShow {
		margin-left: 26px;
		font-size: 24px;
		color: var(--norm_red-color);
	}

	&-PreSale {
		width: 528px;

		&-head {
			height: 90px;
			line-height: 90px;
			color: var(--text_color_L1);
			font-size: 30px;
			text-align: center;
			background: var(--main_gradient-color);
		}

		&-body {
			max-height: 600px;
			overflow-y: auto;
            color: var(--text_color_L1);
			padding: 30px;
			font-size: 24px;
			line-height: 60px;

			:deep(p) {
				margin-bottom: 15px;
				line-height: 40px;
			}
		}

		&-foot {
			height: 140px;
			display: flex;
			justify-content: center;
			align-items: center;

			&-btn {
				width: 60%;
				background: var(--main_gradient-color);
				border-radius: 40px;
				height: 70px;
				line-height: 70px;
				text-align: center;
				font-size: 28px;
				color: var(--text_color_L1);
			}
		}
	}
}

.bgcolor {
	pointer-events: all;
	color: #fff;
}
</style>
