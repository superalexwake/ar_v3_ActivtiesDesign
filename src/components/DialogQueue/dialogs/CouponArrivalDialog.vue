<template>
	<div class="coupon-arrival-dialog" :class="{ 'coupon-arrival-dialog--single': coupons.length === 1 }">
		<div class="coupon-arrival-dialog__card">
			<i class="coupon-arrival-dialog__toplight" aria-hidden="true" />

			<div class="coupon-arrival-dialog__title">{{ $t('couponArrivalTitle') }}</div>

			<p class="coupon-arrival-dialog__subtitle">
				{{ subtitleParts.before }}<b class="coupon-arrival-dialog__count">{{ subtitleParts.num }}</b
				>{{ subtitleParts.after }}
			</p>

			<ul class="coupon-arrival-dialog__list">
				<li v-for="c in coupons" :key="c.userRechargeCouponId ?? c.couponId" class="coupon-arrival-dialog__item">
					<div class="coupon-arrival-dialog__ratio">
						<strong>{{ toPercent(c.rechargeGiftRate) }}%</strong>
						<span v-if="c.rechargeGiftLimit > 0">{{
							$t('couponUpperLimit', [formatNumberToK(c.rechargeGiftLimit, 'k')])
						}}</span>
					</div>
					<div class="coupon-arrival-dialog__info">
						<div class="coupon-arrival-dialog__name">{{ $t('couponRechargeName') }}</div>
						<div class="coupon-arrival-dialog__meta">
							<div>
								{{
									c.minRechargeAmount > 0
										? $t('couponThreshold', [
												currency(c.minRechargeAmount, '', Number.isInteger(c.minRechargeAmount) ? 0 : 2)
										  ])
										: $t('couponNoThreshold')
								}}
							</div>
							<div v-if="c.couponValidDays > 0">{{ $t('couponValidDays', [c.couponValidDays]) }}</div>
						</div>
					</div>
				</li>
			</ul>

			<i class="coupon-arrival-dialog__gift" aria-hidden="true" />
		</div>

		<button type="button" class="coupon-arrival-dialog__button" :disabled="loading" @click="confirm">
			{{ $t('couponClaimNow', [coupons.length]) }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useCoupon } from '@/hooks/useCoupon.hook'
import type { RechargeCouponItem, UserRechargeCouponItem } from '@/types/api'
import { currency, formatNumberToK } from '@/utils'

export interface CouponArrivalDialogProps {
	// 两种券源：注册直发是券种级，查询未领是用户券级；交叉类型让用户维度字段可选可读
	coupons: (RechargeCouponItem & Partial<UserRechargeCouponItem>)[]
}

const props = defineProps<CouponArrivalDialogProps>()
const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'close'): void
}>()

const { t } = useI18n()
const { claim } = useCoupon()
const loading = ref(false)

// 比率为小数原值（0.05=5%），展示 ×100；toFixed(2) 去浮点尾巴
const toPercent = (rate: number) => +(rate * 100).toFixed(2)

// <i18n-t> 数字插槽在本项目渲染为空，故切三段仅数字包 <b>；放 computed 依赖 t()，切语言自动重算
const subtitleParts = computed(() => {
	const text = t('couponArrivalSubtitle', [props.coupons.length])
	const num = String(props.coupons.length)
	const at = text.indexOf(num)
	if (at === -1) return { before: text, num: '', after: '' }
	return { before: text.slice(0, at), num, after: text.slice(at + num.length) }
})

// 弹窗 force 且无关闭按钮，任何失败路径必须 emit close 放行，否则用户卡死首页；未领的券下次 openAll 会再弹
async function confirm() {
	if (loading.value) return
	loading.value = true
	try {
		const count = await claim()
		if (count <= 0) {
			emit('close')
			return
		}
		showSuccessToast(t('receiveSuccess'))
		emit('confirm')
	} catch {
		emit('close')
	} finally {
		loading.value = false
	}
}
</script>

<style scoped lang="scss">
// 四层层叠：z1 橙拱背景 → z2 白卡（flow 撑高）→ z3 礼物堆（锚白卡底沿）→ z4 按钮；底部座区固定高
.coupon-arrival-dialog {
	position: relative;
	width: min(622px, calc(100vw - 48px));
	padding-bottom: 168px; // 底部座区：礼物堆下半 + 按钮
	background: url('@/assets/icons/svg/pop_coupon_do.svg') center bottom / 100% 100% no-repeat;
	text-align: center;

	// 单张券：白卡矮，橙拱背景上移 25px 对齐（2/3 张仍是 center bottom）
	&--single {
		background-position: center -32px;
	}

	&__card {
		position: relative;
		z-index: 2;
		margin: 26px 28px 0;
		padding: 44px 28px 120px; // 底部 120 留给礼物堆压入
		border-radius: 44px;
		background: #fff;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
		overflow: visible; // 礼物堆需溢出底沿
	}

	&__toplight {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 44px;
		background: url('@/assets/icons/svg/pop_coupon1_top.svg') center top / contain no-repeat;
		pointer-events: none;
	}

	&__title {
		font-size: 40px;
		font-weight: 800;
		line-height: 1.25;
		color: #1f1f1f;
		word-break: break-word;
	}

	&__subtitle {
		margin: 14px 0 0;
		font-size: 24px;
		line-height: 1.45;
		color: #6b6b6b;
		word-break: break-word;
	}

	&__count {
		color: var(--norm_red-color, #fb5b5b);
		font-weight: 700;
		font-style: normal;
	}

	&__list {
		margin: 28px 0 0;
		padding: 0;
		max-height: 60vh; // 超 3 张滚动兜底，防顶出屏幕
		overflow-y: auto;
		list-style: none;
	}

	&__item {
		display: flex;
		align-items: stretch;
		padding: 20px;
		border: 1px solid rgba(251, 91, 91, 0.28);
		border-radius: 20px;
		background: #fff;
		text-align: start;
	}

	&__item + &__item {
		margin-top: 22px;
	}

	&__ratio {
		flex: 0 0 187.5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 18px 8px;
		border-radius: 14px;
		background: rgba(251, 91, 91, 0.08);
		color: var(--norm_red-color, #fb5b5b);

		strong {
			font-size: 44px;
			font-weight: 800;
			line-height: 1;
		}

		span {
			margin-top: 8px;
			font-size: 20px;
			line-height: 1.1;
		}
	}

	&__info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 20px;
		overflow: hidden;
	}

	&__name {
		font-size: 28px;
		font-weight: 700;
		color: #1f1f1f;
		word-break: break-word;
	}

	&__meta {
		margin-top: 8px;
		font-size: 21px;
		line-height: 1.4;
		color: #9a9a9a;
		word-break: break-word;
	}

	&__gift {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		bottom: -128px;
		aspect-ratio: 672 / 288; // 切图原始比例
		background: url('@/assets/icons/svg/pop_coupon_up.svg') center bottom / contain no-repeat;
		pointer-events: none;
	}

	&__button {
		position: absolute;
		z-index: 4;
		left: 40px;
		right: 40px;
		bottom: 68px;
		height: 92px;
		border: 0;
		background: none;
		color: #fff;
		font-size: 32px;
		font-weight: 800;
	}

	&__button:disabled {
		opacity: 0.7;
	}
}
</style>
