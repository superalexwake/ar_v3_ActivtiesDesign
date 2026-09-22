<template>
	<div class="redeem-container">
		<div class="redeem-container-header">
			<NavBar left-arrow classN="main" @click-left="router.go(-1)"/>
			<div class="redeem-container-header-greet">
				<h3>{{ $t('tipHelloVIP') }}</h3>
				<p>{{ $t('tipWepreparedGift4u') }}</p>
			</div>
			<img class="redeem-container-header-crown" src="@public/main/redeemCrown.png" alt=""/>
		</div>

		<div class="redeem-container-content">
			<div class="redeem-container-receive">
				<h4>{{ $t('tipPlsEnterRedeemCode') }}</h4>
				<input
					type="text"
					auto-complete="new-password"
					autocomplete="off"
					:placeholder="$t('tipPlsEnterCode')"
					v-model="giftCode"
				/>
				<h5 v-if="isHaveBank">{{ $t('tipPlsBindBankcard') }}</h5>
				<button @click="exchangeGif()">
					{{ $t('receive') }}
				</button>
			</div>
			<div class="redeem-container-record">
				<div class="redeem-container-record-title">
					<svg-icon name="giftHistory"/>
					<span>{{ $t('record') }}</span>
				</div>
				<List
					ref="listRef"
					v-model:list="RedpagePageData.list"
					v-model:page-query="qeuryParms"
					:api="getRedpagePageList"
					:distance="20"
					:isAutoLoad="isAutoLoad"
				>
					<template #content>
						<div class="redeem-container-record-items ar-1px-b" v-for="item in RedpagePageData.list"
							 :key="`${item.rewardType}-${item.redId}`">
							<div class="redeem-container-record-item">
								<div class="redeem-container-record-item-left">
									<h5>{{ $t('receiveSuccess') }}</h5>
									<span>{{ item.receiveTime }}</span>
								</div>
								<span class="redeem-container-record-item-value">
									{{ item.rewardType === REWARD_TYPE.COUPON ? $t('couponRechargeName') : currency(item.amount) }}
								</span>
							</div>
							<div
								v-if="item.coupon"
								class="coupon-ticket"
								:class="{ 'coupon-ticket--done': isCouponDone(item.coupon) }"
							>
								<div class="coupon-ticket__amount">
									<strong>{{ toPercent(item.coupon.rechargeGiftRate) }}%</strong>
									<span v-if="item.coupon.rechargeGiftLimit > 0">{{
										$t('couponUpperLimit', [
											currency(item.coupon.rechargeGiftLimit, '', Number.isInteger(item.coupon.rechargeGiftLimit) ? 0 : 2)
										])
									}}</span>
								</div>
								<div class="coupon-ticket__info">
									<h4>{{ $t('couponRechargeName') }}</h4>
									<p v-if="item.coupon.couponNumber">{{ $t('couponCodeLabel') }} {{ item.coupon.couponNumber }}</p>
									<p v-if="condText(item.coupon)">{{ condText(item.coupon) }}</p>
									<!-- expireTime=null 双义：state 非 null 为永久有效，整行不显示 -->
									<p v-if="item.coupon.expireTime">{{ $t('couponValidUntil', [formatDate(item.coupon.expireTime)]) }}</p>
									<!-- state=null 券实例配对不到：只展示券种静态信息，动作区不渲染 -->
									<button
										v-if="item.coupon.state !== null"
										class="coupon-ticket__use"
										:disabled="item.coupon.state !== USER_COUPON_STATE.UNUSED"
										@click="onUseCoupon"
									>
										{{ useTextOf(item.coupon.state) }}
									</button>
								</div>
								<em v-if="item.coupon.state !== null" class="coupon-ticket__tag">
									{{ stateTextOf(item.coupon.state) }}
								</em>
							</div>
						</div>
					</template>
				</List>
			</div>

			<div class="redeem-container-note">
				<div class="redeem-container-note-title">
					<svg-icon name="shuoming"/>
					<span>{{ $t('redeemNoteTitle') }}</span>
				</div>
				<ul>
					<li>{{ $t('redeemNote1') }}</li>
					<li>{{ $t('redeemNote2') }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ConversionRedpage, getRedpagePageList} from '@/api'
import type {getRedpagePageParams, RedpagePageList, RedpageCouponInfo} from '@/types/api'
import {reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {showDialog, showSuccessToast} from 'vant'
import {useI18n} from 'vue-i18n'
import dayjs from 'dayjs'
import List from '@/components/common/List.vue'
import {USER_COUPON_STATE} from '@/hooks/useCoupon.hook'
import {currency} from '@/utils'

const {t} = useI18n()

const isHaveBank = ref(false) // 是否有银行卡
const router = useRouter()
const route = useRoute()
const giftCode = ref(route.query.hbcode || '')
const isAutoLoad = ref(true)
const listRef = ref<InstanceType<typeof List> | null>(null)

// 领取记录奖励类型（对接文档 §2.3）：1 现金 / 2 充值券
const REWARD_TYPE = {CASH: 1, COUPON: 2} as const

const qeuryParms = reactive<getRedpagePageParams>({
	pageSize: 10,
	pageNo: 1,
	startDate: null,
	endDate: null
})

const RedpagePageData = ref<RedpagePageList>({
	list: [],
	pageNo: 0,
	totalPage: 0,
	totalCount: 0
})

/**
 * @description: 兑换奖励
 * @return {*}
 */
const exchangeGif = async (): Promise<void> => {
	if (giftCode.value.trim() === '') {
		await showDialog({
			message: t('tipPlsEnterCode')
		})
		return
	}
	const res = await ConversionRedpage({giftCode: giftCode.value})
	if (res.code === 0) {
		showSuccessToast(t('redeemDialogDesc1'))
		giftCode.value = ''
		listRef.value?.resetRefresh()
		return
	}else {
		await showDialog({ message: t(`code${res.msgCode}`), allowHtml: res.msgCode === 1006});
	}
}

// 券卡展示口径与「我的充值优惠券」页一致
const toPercent = (rate: number) => +(rate * 100).toFixed(2)
// 本页产品要求完整年月日(语言中立)，不随 couponDateFormat 的本地化短格式
const formatDate = (time: string) => dayjs(time).format('YYYY-MM-DD')
const isCouponDone = (c: RedpageCouponInfo) => c.state !== null && c.state !== USER_COUPON_STATE.UNUSED
// 锁定(2)按已使用展示，停用(5)按已过期展示——与券包页 Tab 归类同口径，不为低频态增设文案
const isUsedLike = (state: number) => state === USER_COUPON_STATE.LOCKED || state === USER_COUPON_STATE.USED
const useTextOf = (state: number) =>
	state === USER_COUPON_STATE.UNUSED ? t('couponGoUse') : isUsedLike(state) ? t('couponUsed') : t('couponExpired')
// 角标报状态、按钮报动作：未使用时两者文案不同（未使用 / 去使用），不可合并
const stateTextOf = (state: number) =>
	state === USER_COUPON_STATE.UNUSED ? t('couponUnused') : isUsedLike(state) ? t('couponUsed') : t('couponExpired')
// 条件行：仅首充 + 充值门槛（本接口无适用大类字段，无大类专享行）
const condText = (c: RedpageCouponInfo) =>
	[
		c.isFirstRechargeAvailable ? t('couponFirstRechargeOnly') : '',
		c.minRechargeAmount > 0 ? t('couponThreshold', [currency(c.minRechargeAmount)]) : ''
	].filter(Boolean).join(' · ')
// 本接口不下发券实例 Id，「去使用」只能跳充值页由用户重新选券（对接文档 §6-7）
const onUseCoupon = () => router.push('/wallet/Recharge')
</script>

<style lang="scss" scoped>
.redeem-container {
	min-height: 100vh;
	background: var(--bg_color_L1);

	// 顶栏与头图共用同一条渐变，否则两段渐变在 92px 处会露出色阶断层
	:deep(.navbar-fixed) {
		background: var(--main_gradient-color);
	}

	&-header {
		position: relative;
		height: 352px;
		background: var(--main_gradient-color);

		$crown-size: 295px;
		$crown-inset: 44px;

		&-greet {
			position: relative;
			padding: 55px 32px 0;
			// 阿语标题实测 382px，不让出皇冠占位会被压穿，宁可换行
			padding-inline-end: $crown-size + $crown-inset;

			h3 {
				font-size: 42px;
				line-height: 50px;
				font-weight: 700;
				color: var(--text_color_L4);
			}

			p {
				margin-top: 14px;
				font-size: 30px;
				line-height: 42px;
				color: var(--text_color_L4);
				opacity: 0.9;
			}
		}

		&-crown {
			position: absolute;
			top: 62px;
			// RTL 下须与 greet 的让位同侧，故用逻辑属性而非 right
			inset-inline-end: $crown-inset;
			width: $crown-size;
			height: $crown-size;
		}
	}

	&-content {
		padding-bottom: 40px;
	}

	&-receive {
		position: relative;
		margin: -40px 24px 0;
		padding: 30px 20px 40px;
		background: var(--bg_color_L2);
		border-radius: 24px;

		h4 {
			font-size: 32px;
			line-height: 44px;
			font-weight: 700;
			color: var(--text_color_L1);
		}

		input {
			width: 100%;
			height: 68px;
			margin-top: 28px;
			padding: 0 28px;
			background: var(--bg_color_L1);
			border: none;
			border-radius: 16px;
			font-size: 28px;
			color: var(--text_color_L1);
		}

		input::placeholder {
			font-size: 28px;
			color: var(--text_color_L3);
		}

		h5 {
			margin-top: 12px;
			padding-left: 28px;
			font-size: 24px;
			color: var(--main-color);
		}

		button {
			width: 100%;
			height: 64px;
			margin-top: 36px;
			background: var(--main_gradient-color);
			border: none;
			border-radius: 32px;
			font-size: 30px;
			color: var(--text_color_L4);
		}
	}

	&-record {
		margin: 20px 24px 0;
		padding: 20px;
		background: var(--darkBg, var(--bg_color_L2));
		border-radius: 24px;

		&-title {
			display: flex;
			align-items: center;

			svg {
				width: 48px;
				height: 48px;
				margin-right: 12px;
			}

			span {
				font-size: 32px;
				font-weight: 700;
				color: var(--darkTextW, var(--text_color_L1));
			}
		}

		&-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 28px 0 20px;

			&-left {
				h5 {
					font-size: 32px;
					font-weight: 700;
					color: var(--norm_green-color);
				}

				span {
					display: block;
					padding-top: 14px;
					font-size: 28px;
					color: var(--text_color_L3);
				}
			}

			&-value {
				flex-shrink: 0;
				padding-left: 20px;
				font-size: 32px;
				font-weight: 700;
				color: var(--norm_secondary-color);
			}
		}
	}

	&-note {
		margin: 20px 24px 0;
		padding: 20px;
		background: var(--darkBg, var(--bg_color_L2));
		border-radius: 24px;

		&-title {
			display: flex;
			align-items: center;

			svg {
				width: 48px;
				height: 48px;
				margin-right: 12px;
			}

			span {
				font-size: 32px;
				font-weight: 700;
				color: var(--darkTextW, var(--text_color_L1));
			}
		}

		ul {
			margin-top: 20px;
			padding: 24px;
			border: 1px solid var(--Dividing-line_color);
			border-radius: 24px;
		}

		li {
			position: relative;
			padding-left: 34px;
			font-size: 28px;
			line-height: 46px;
			color: var(--text_color_L2);

			& + li {
				margin-top: 20px;
			}

			&::before {
				content: '';
				position: absolute;
				top: 16px;
				left: 2px;
				width: 14px;
				height: 14px;
				background: var(--main-color);
				transform: rotate(45deg);
			}
		}
	}
}

// 券票：左票根 + 右信息，撕口用伪元素挖圆；容器为 L2 底，票面用 L1 区分层次（同上方输入框口径）
.coupon-ticket {
	position: relative;
	display: flex;
	min-height: 162px;
	margin-bottom: 24px;
	background: var(--bg_color_L1);
	border-radius: 12px;
	overflow: hidden;

	// 整票置灰替代逐元素维护禁用色，与设计稿「已使用/已过期」整体灰化一致
	&--done {
		filter: grayscale(1);
		opacity: 0.85;
	}

	&__amount {
		position: relative;
		flex-shrink: 0;
		width: 221px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 12px;
		background: var(--main-color);
		color: var(--text_color_L4);

		strong {
			font-size: 52px;
			font-weight: 700;
			line-height: 1;
		}

		span {
			margin-top: 14px;
			font-size: 24px;
			line-height: 1.2;
			text-align: center;
		}

		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 50%;
			width: 20px;
			height: 20px;
			margin-top: -10px;
			border-radius: 50%;
			background: var(--darkBg, var(--bg_color_L2));
		}

		&::before {
			left: -10px;
		}

		&::after {
			right: -10px;
		}
	}

	&__info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 18px 24px;

		h4 {
			font-size: 32px;
			font-weight: 700;
			color: var(--text_color_L1);
		}

		p {
			margin-top: 6px;
			font-size: 26px;
			line-height: 32px;
			color: var(--text_color_L2);
		}
	}

	&__use {
		min-width: 151px;
		height: 48px;
		margin-top: 16px;
		padding: 0 24px;
		border: none;
		border-radius: 24px;
		background: var(--main-color);
		color: var(--text_color_L4);
		font-size: 26px;
		white-space: nowrap;
	}

	&__tag {
		position: absolute;
		top: 0;
		// 须锚在信息区外角：阿语下 right 不镜像会把角标压到红票根上，红底红标看不见
		inset-inline-end: 0;
		display: flex;
		align-items: center;
		height: 34px;
		padding: 0 4px;
		border-radius: 0 12px 0 12px;
		background: var(--main-color);
		color: var(--text_color_L4);
		font-size: 22px;
		font-style: normal;
	}
}
</style>
