<!-- 注册页优惠券卡片：解析邀请链接券码 → 查券面展示；无券码/查不到则不渲染（访客未登录 401 静默） -->
<template>
	<div v-if="coupon" class="register__container-coupon">
		<div class="register__container-coupon__head">
			<svg-icon name="login_list_icon" />
			<span>{{ $t('exclusiveCouponsClaim', [1]) }}</span>
		</div>
		<!-- 票券形状与文案按充值页券卡复刻而不复用：充值页已上线，两处各自独立不联动 -->
		<div class="register__container-coupon__card">
			<!-- 底板 rect 打底 + 左票根 path，票根右缘上下各咬掉四分之一圆，露出底板色即「撕开」的半圆缺口 -->
			<svg
				class="register__container-coupon__card-shape"
				viewBox="0 0 122 62"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<defs>
					<linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
						<stop class="stop-hi" offset="0" />
						<stop class="stop-lo" offset="1" />
					</linearGradient>
				</defs>
				<rect class="base" width="122" height="62" rx="8" vector-effect="non-scaling-stroke" />
				<path
					class="stub"
					:fill="`url(#${gradId})`"
					d="M8 0H37.4A3.6 3.6 0 0 0 41 3.6V58.4A3.6 3.6 0 0 0 37.4 62H8A8 8 0 0 1 0 54V8A8 8 0 0 1 8 0Z"
				/>
			</svg>
			<div class="register__container-coupon__card-main">
				<p class="percent">{{ toPercent(coupon.rechargeGiftRate) }}%</p>
				<p class="off">CASHBACK</p>
			</div>
			<!-- 副文按产品要求定死英文不做多语言（同充值页票券），货币符号仍由 currency 跟随站点；
				 上限走 k 缩写：可配到 ₹9,99,99,999 级，原样展示会在票券内折行 -->
			<div class="register__container-coupon__card-meta">
				<p v-if="coupon.rechargeGiftLimit > 0" class="cap">Up to</p>
				<p class="limit" :class="limitScale">
					{{ coupon.rechargeGiftLimit > 0 ? limitText : 'No limit' }}
				</p>
				<p class="min">
					{{ coupon.minRechargeAmount > 0 ? `MIN ${currency(coupon.minRechargeAmount, '', 0)}` : 'No min deposit' }}
				</p>
				<!-- 券种未领取没有到期日，展示领取后有效天数 couponValidDays；0=不限期整行隐藏 -->
				<p v-if="coupon.couponValidDays > 0" class="exp">
					<svg class="clock" viewBox="0 0 12 12" aria-hidden="true">
						<circle cx="6" cy="6" r="5" />
						<path d="M6 3.1V6.3L8.2 7.6" />
					</svg>
					{{ `Valid ${coupon.couponValidDays} day${coupon.couponValidDays > 1 ? 's' : ''}` }}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
// 手机/邮箱注册各挂一张卡，渐变 id 逐实例唯一，否则 url(#id) 会指到另一张可能已隐藏的卡上
// 计数器放普通 <script>：<script setup> 顶层变量逐实例重建，计不到数
let gradSeq = 0
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCoupon } from '@/hooks/useCoupon.hook'
import { resolveCouponNum, currency, formatNumberToK } from '@/utils'
import type { RechargeCouponItem } from '@/types/api'

const { t: $t } = useI18n()
const { fetchCouponByNumber } = useCoupon()

const coupon = ref<RechargeCouponItem | null>(null)
const gradId = `regCouponStubGrad-${gradSeq++}`

// 比率小数原值 ×100，toFixed(2) 去浮点尾
const toPercent = (rate: number) => +(rate * 100).toFixed(2)

const limitText = computed(() =>
	coupon.value && coupon.value.rechargeGiftLimit > 0 ? formatNumberToK(coupon.value.rechargeGiftLimit, 'k') : ''
)

// 金额位数一多就被 break-all 折成两行，按位数降档而非统一缩小；阈值 10/11 位同充值页票券（卡宽相同）
// 必须量 limitText 本身：换成另一处等价计算，两边一漂移字号档就错
const limitScale = computed(() => {
	const len = limitText.value.length
	return len >= 11 ? 'is-xs' : len >= 10 ? 'is-sm' : ''
})

// 落地页按券码拉券面；无券码/查不到/访客未登录 → coupon 为 null → 卡片不渲染
onMounted(async () => {
	const couponNum = resolveCouponNum()
	if (couponNum) coupon.value = await fetchCouponByNumber(couponNum)
})
</script>

<style lang="scss" scoped>
.register__container-coupon {
	padding: 0 2px;
	margin-top: 40px;

	&__head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;

		svg {
			width: 48px;
			height: 48px;
			color: var(--main-color);
		}

		span {
			font-size: 30px;
			line-height: 36px;
			color: var(--text_color_L1);
			word-break: break-word;
		}
	}

	// 与 shape 的 viewBox 122×62 严格同比：preserveAspectRatio="none" 下比例一偏离，圆角与缺口即被拉成椭圆
	// 不设 overflow：文案超高时让卡随内容长高，而不是裁断
	&__card {
		position: relative;
		width: 272px;
		aspect-ratio: 122 / 62;
		display: flex;
		align-items: stretch;

		// 票根是固定坐标 SVG 不随 RTL 镜像，卡内又是定死的英文；整卡锁 LTR 才与票根咬合
		html:lang(ar) & {
			direction: ltr;
		}
	}

	&__card-shape {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;

		.stop-hi {
			stop-color: color-mix(in srgb, var(--main-color) 82%, #fff);
		}

		.stop-lo {
			stop-color: var(--main-color);
		}

		// 底板取低一层的 L1，恒比表单底(L2)深一档；浅色主题两者仅差 3%，边界靠发丝线兜住
		.base {
			fill: var(--bg_color_L1);
			stroke: color-mix(in srgb, var(--text_color_L2) 35%, transparent);
			stroke-width: 2;
		}
	}

	// 票根 41/122，右边界正落在缺口圆心
	&__card-main {
		position: relative;
		z-index: 1;
		flex: 0 0 33.607%;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		row-gap: 8px;
		text-align: center;
		color: #fff;

		// 三位数比率 "100%" 在更大字号下会撑破票根栏被裁掉半个 %，32px 才装得下
		.percent {
			font-size: 32px;
			font-weight: 700;
			line-height: 1;
		}

		.off {
			font-size: 12px;
			line-height: 1.4;
		}
	}

	// 左内边距让开缺口圆心，右内边距防长金额顶到票券圆角
	&__card-meta {
		position: relative;
		z-index: 1;
		flex: 1;
		min-width: 0;
		padding: 0 16px 0 5%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		row-gap: 8px;
		font-size: 16px;
		line-height: 1.1;
		color: var(--text_color_L2);

		.limit {
			font-size: 27px;
			font-weight: 700;
			color: var(--text_color_L1);
			// 降档后仍兜不住的极端值才折行，不留这行会横向撑破票券
			word-break: break-all;

			&.is-sm {
				font-size: 26.25px;
			}

			&.is-xs {
				font-size: 22.5px;
			}
		}

		.min {
			word-break: break-all;
		}

		// 到期跟主色但混入 L1 提对比度：主色直接落在底板上有多套主题不足 3:1
		.exp {
			display: flex;
			align-items: center;
			column-gap: 5px;
			white-space: nowrap;
			color: color-mix(in srgb, var(--main-color) 55%, var(--text_color_L1));
		}

		.clock {
			flex: none;
			width: 16px;
			height: 16px;
			fill: none;
			stroke: currentColor;
			stroke-width: 1.3;
			stroke-linecap: round;
		}
	}
}
</style>
