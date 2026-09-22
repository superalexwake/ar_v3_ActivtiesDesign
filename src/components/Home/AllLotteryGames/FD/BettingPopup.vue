<template>
	<!-- 投注内容 begin -->
	<van-popup
		v-model:show="showPopup"
		position="bottom"
		style="box-shadow: 0px -18px 40px rgba(37, 37, 60, 0.26)"
		:round="true"
		:close-on-click-overlay="false"
	>
		<div class="Betting__Popup-body">
			<slot></slot>
			<div class="Betting__Popup-body-line">
				{{ t('amount') }}
				<div class="Betting__Popup-body-line-list">
					<div
						v-for="(item, index) in betTypeList"
						:key="index"
						class="Betting__Popup-body-line-item"
						:class="{ bgcolor: props.selectInfo.coin == item }"
						@click="changeCoin(item)"
					>
						{{ item }}
					</div>
				</div>
			</div>
			<div class="Betting__Popup-body-line">
				{{ t('numbers') }}
				<div class="Betting__Popup-body-line-btnL">
					<div class="Betting__Popup-btn" :class="{ bgcolor: props.selectInfo.count > 0 }" @click="Stepper(1)">-</div>
					<van-field
						class="Betting__Popup-input"
						v-model.number="props.selectInfo.count"
						type="digit"
						:maxlength="4"
						@input="changeStep"
					/>
					<div class="Betting__Popup-btn bgcolor" @click="Stepper(2)">+</div>
				</div>
			</div>
			<div class="Betting__Popup-body-line">
				<div></div>
				<div class="Betting__Popup-body-line-list ">
					<div
						v-for="(item, index) in multipleList"
						:key="index"
						class="Betting__Popup-body-line-item setBorder"
						@click="TaskCount(item)"
						:class="{ bgcolor: props.selectInfo.count == item }"
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
				{{ t('totalAmount') }}{{ currency(props.selectInfo.allCoin || 0) }}
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
import { ref, computed, watch } from 'vue'
import { showToast } from 'vant'
import { currency } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emits = defineEmits<{
	(e: 'update:bettingPopupShow', val: boolean): void
	(e: 'update:selectInfo', val: any): void
	(e: 'clearBetting'): void
	(e: 'computedCoin'): void
	(e: 'submitBetting'): void
}>()
// 是否展示预售规则
const isShowPreSale = ref(false)
// 是否同意预售规则
const isCheckPreSale = ref(true)
// 份数快捷选项按钮
const multipleList = computed(() => {
	return props.currentGame.betMultiple.split('|')
})

const props = withDefaults(
	defineProps<{
		currentInfo: any
		currentGame: any
		bettingPopupShow: any
		betTypeList: any
		selectInfo: any
	}>(),
	{}
)
watch(
	() => multipleList,
	() => {
		props.selectInfo.count = multipleList.value[0]
	},
	{ deep: true, immediate: true }
)
/**
 * 是否展示弹窗
 */
let showPopup = computed({
	get(): boolean {
		return props.bettingPopupShow || false
	},
	set(val: boolean) {
		emits('update:bettingPopupShow', val)
	}
})
const canSubmit = computed(() => Number(props.selectInfo.count) >= 1)

// 份数加减
const Stepper = (e: number) => {
	switch (e) {
		case 1:
			if (props.selectInfo.count > 1) {
				props.selectInfo.count--
			}
			break
		case 2:
			props.selectInfo.count++
			break
		default:
	}
	emits('computedCoin')
}
// 输入框设置数量
const changeStep = (e: any) => {
	if (e > 0) {
		props.selectInfo.count = Math.floor(e)
	}
	emits('computedCoin')
}
// 购买份数切换
const TaskCount = (item: number) => {
	props.selectInfo.count = item
	emits('computedCoin')
}
// 购买金额切换
const changeCoin = (item: any) => {
	props.selectInfo.coin = item
	emits('computedCoin')
}
// 知道预售规则
const knowPreSale = () => {
	isShowPreSale.value = false
	isCheckPreSale.value = true
}
// 点击提交金额
const submitBetting = async () => {
	if (!canSubmit.value) return
	if (!isCheckPreSale.value) {
		showToast(t('agreePresaleRules'))
		return
	}
	emits('submitBetting')
}
</script>

<style lang="scss" scoped>
.Betting__Popup {
	&-body {
		padding: 38px 26px 40px 26px;
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
				color: var(--text_color_L2);
				border-radius: 6px;

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

		&-c {
			flex: 1;
			background: var(--bg_color_L3);
			color: var(--text_color_L2);
		}

		&-s {
			flex: 2;
			background: var(--main-color);
			color: var(--text_color_L4);

			&.disabled {
				opacity: 0.6;
				pointer-events: none;
			}
		}
	}

	&-btn {
		width: 56px;
		height: 56px;
		pointer-events: none;
		text-align: center;
		font-size: 50px;
		padding: 0;
		background: var(--button_dis_color);
		color: var(--button_dis_color);
		flex: none;
		border-radius: 6px;
	}

	&-input {
		padding: 2px 20px;
		width: 158px;
		margin: 0 12px;
		background-color: var(--bg_color_L1);
		color: var(--text_color_L4);
		&::after {
			content: none;
		}

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
			color: var(--text_color_L4);
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
				color: var(--text_color_L4);
			}
		}
	}
}

.bgcolor {
	pointer-events: all;
	color: var(--text_color_L4);
	background: var(--main-color);
}
</style>
