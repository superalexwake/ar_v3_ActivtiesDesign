<template>
	<van-action-sheet v-model:show="betSheetVisible" :closeable="false">
		<div class="bet_content">
			<div class="bet_tit">{{ $t('betting') }}</div>
			<div class="bet_cnt">
				<span v-for="item in store.bet_number.split(',')" :class="`${filterNumberSize}`">{{ item }}</span>
			</div>

			<div class="bet_item">
				<div class="bet_item_tit">{{ $t('amount') }}</div>
				<div class="bet_money_list">
					<div
						class="money_item"
						v-for="(item, index) in store.money_list"
						:class="{ monyActive: store.currentMoneyIndex === index }"
						@click="store.currentMoneyIndex = index"
					>
						{{ item }}
					</div>
				</div>
			</div>

			<div class="bet_item">
				<div class="bet_item_tit">
					<span>{{ $t('multiple') }}</span>
					<div class="bet_step">
						<span @click="handleStep('sub')">-</span>
						<van-field
							v-model="store.beishu"
							input-align="center"
							@input="(value: any) => {
							if (9999 < Number(value.target.value)) {
								store.beishu = 9999;
								return 
							}
							if (Number(value.target.value) < 1) {
								store.beishu = 0;
								return 
							}
							store.beishu = Number(value.target.value);
						} "
							type="digit"
							class="bet_beishu_input"
						/>
						<span @click="handleStep('add')">+</span>
					</div>
				</div>

				<div class="bet_money_list bet_beishu">
					<div
						class="money_item"
						v-for="(item, index) in store.beishuList"
						:class="{ monyActive: store.currentBeishuIndex === index }"
						@click="store.currentBeishuIndex = index"
					>
						X{{ item }}
					</div>
				</div>
			</div>

			<div class="bet_info">
				<div class="tit">{{ $t('odds') }}</div>
				<div class="pl" style="color: #fff">{{ store.currentOdds }}</div>
			</div>
			<div class="bet_info">
				<div class="tit">{{ $t('walletBalance') }}</div>
				<div class="pl" style="color: #cee98c">{{ userInfo.amount }}</div>
			</div>
			<div class="bet_info">
				<div class="tit">{{ $t('betAmounts') }}</div>
				<div class="pl" style="color: #f9bc36">{{ store.bet_money * store.beishu }}</div>
			</div>

			<div class="recharge_tip" v-if="userInfo.amount < store.bet_money * store.beishu">
				<div>
					<van-icon name="warning-o" size="18" />
					{{ $t('walletTip') }}
				</div>
				<span @click="goRecharge">{{ $t('goRecharge') }} >></span>
			</div>

			<van-checkbox v-model="checkRule" checked-color="#CEE98C" label-disabled icon-size="24px">
				<span class="apply">{{ $t('agree') }}</span>
				<span class="rule" @click="() => {
					betSheetVisible = false
					betPopTXT = true
				}">{{ $t('presaleRules') }}</span>
			</van-checkbox>

			<div class="bet_btn_group">
				<div class="cancel_btn" @click="handleCancel">{{ $t('cancel') }}</div>
				<div
					class="bet_btn"
					@click="handleBetSubmit"
					:class="{
						inconformity:
							userInfo.amount < store.bet_money * store.beishu || !checkRule || store.bet_money * store.beishu === 0
					}"
				>
					{{ $t('betting') }}
				</div>
			</div>
		</div>
	</van-action-sheet>
</template>
<script setup lang="ts">
import { useBinguo } from '@/hooks/useBinguo.hook'
import { GlobalStore } from '@/stores'
import { useRouter } from 'vue-router'

const { betSheetVisible, store, betPopTXT, filterNumberSize, handleStep, checkRule, handleCancel, handleBetSubmit } = useBinguo()

const userInfoStore = GlobalStore()
const userInfo = userInfoStore.getUserInfo
const router = useRouter()

const goRecharge = () => {
	router.push('/wallet/recharge')
}
</script>
<style lang="scss" scoped>
.bet_content {
	width: 100%;
	background-color: #0e6946;
	padding: 0 24px;
	.bet_tit {
		padding-top: 40px;
		text-align: center;
		color: #fff;
		margin-bottom: 30px;
		font-size: 36px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
	}
	.bet_cnt {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 46px;
		span {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100px;
			height: 100px;
			border-radius: 50%;
			line-height: 100px;
			text-align: center;
			font-size: 48px;
			font-weight: 700;
			margin: 0 6px;
		}
	}

	.bet_item {
		.bet_item_tit {
			color: #acf8da;
			font-size: 30px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			margin-bottom: 20px;
			display: flex;
			justify-content: space-between;
			.bet_step {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				width: 300px;
				span {
					display: block;
					width: 50px;
					height: 50px;
					border-radius: 50%;
					background-color: #cee98c;
					color: #0f6946;
					font-size: 54px;
					line-height: 44px;
					text-align: center;
				}
				.bet_beishu_input {
					height: 50px;
					background-color: #038d5a;
					width: 180px;
					font-size: 28px;
					font-style: normal;
					font-weight: 700;
					border-radius: 30px;
					border: none;
					padding: 0;
					line-height: 50px;
				}
				:deep(.van-cell:after) {
					border: none;
				}
				:deep(.van-field__control) {
					color: #fff;
				}
			}
		}

		.bet_money_list {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 36px;
			div {
				width: 130px;
				height: 70px;
				flex-shrink: 0;
				background-color: #038d5a;
				border-radius: 6px;
				text-align: center;
				color: #cfe988;
				line-height: 70px;
				font-size: 28px;
				font-style: normal;
				font-weight: 500;
			}
			.monyActive {
				background-color: #cee98c;
				color: #0f6946;
			}
		}
		.bet_beishu {
			margin-bottom: 50px;
			div {
				width: 110px;
				border: 0.5px solid #cee98c;
				background-color: #0e6946;
			}
		}
	}
	.bet_info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		height: 60px;
		background: #0f5534;
		margin-bottom: 16px;
		div {
			width: 50%;
		}
		.tit {
			color: #acf8da;
			text-align: left;
			font-size: 28px;
			font-style: normal;
			line-height: 40px; /* 142.857% */
			text-indent: 24px;
			position: relative;
		}
		.tit::after {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			width: 1px;
			height: 40px;
			background: #0f6946;
		}
		div:nth-child(2) {
			text-align: center;
			font-size: 30px;
			font-style: normal;
			font-weight: 700;
			line-height: 40px;
		}
	}

	.recharge_tip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 28px;
		span {
			color: #f9bc36;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 36px; /* 150% */
		}
		div {
			display: flex;
			align-items: center;
			color: #cee98c;
			font-size: 22px;
			font-style: normal;
			font-weight: 400;
			line-height: 36px; /* 163.636% */
			i {
				margin-right: 10px;
			}
		}
	}
	.apply {
		color: #fff;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		padding-right: 14px;
	}
	:deep(.van-checkbox__icon--checked .van-icon) {
		color: #0e6946;
	}
	.rule {
		color: #cee98c;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	.bet_btn_group {
		margin-top: 26px;
		width: calc(100% + 48px);
		display: flex;
		align-items: center;
		height: 120px;
		margin-left: -24px;
		div {
			font-size: 30px;
			font-style: normal;
			font-weight: 400;
			line-height: 120px;
			text-align: center;
			cursor: pointer;
		}
		.cancel_btn {
			width: 290px;
			color: #fff;
			background-color: #038d5a;
		}
		.bet_btn {
			width: calc(100% - 290px);
			background-color: #cee98c;
			color: #0f6946;
		}
		.inconformity {
			background-color: #cbcbcb;
			color: #6b6b6b;
		}
	}
}
.small {
	color: #0b462a;
	background-color: #fff;
}
.big {
	color: #fff;
	background-color: #0b462a;
}
.and {
	color: #0b462a;
	background-color: #f9bc36;
}
</style>
