<!-- 充值优惠券选择：按当前充值大类拉可用券展示；本期仅展示不带券下单，无券/失败整块不渲染 -->
<template>
	<div v-if="coupons.length" class="rechargeCoupon" :style="{ '--coupon-ink': stubInk }">
		<!-- 票根渐变的共享定义：v-for 内各卡引用同一 id，逐卡内联会产出重复 id -->
		<svg class="rechargeCoupon__defs" aria-hidden="true">
			<defs>
				<linearGradient id="couponStubGrad" x1="0" y1="0" x2="0" y2="1">
					<stop class="stop-hi" offset="0" />
					<stop class="stop-lo" offset="1" />
				</linearGradient>
			</defs>
		</svg>

		<div class="rechargeCoupon__header">
			<svg-icon name="login_list_icon" class="rechargeCoupon__header-icon" />
			<span class="rechargeCoupon__header-title">{{ $t('couponRechargeName') }} ({{ coupons.length }})</span>
		</div>

		<div ref="cardsRef" class="rechargeCoupon__cards" @wheel="onWheel">
			<div
				v-for="item in coupons"
				:key="item.userRechargeCouponId"
				class="rechargeCoupon__cards-item"
				:class="{ active: item.userRechargeCouponId === selectedId, disabled: !isUsable(item) }"
				@click="selectCoupon(item)"
			>
				<!-- 票券形状：底板 rect 打底 + 左票根 path，票根右缘上下端各咬掉四分之一圆，
					 合出的半圆缺口露出底板色，即设计稿「沿红白交界撕开」的完形；fill 由 CSS 控三态 -->
				<svg class="rechargeCoupon__cards-shape" viewBox="0 0 122 62" preserveAspectRatio="none" aria-hidden="true">
					<rect class="base" width="122" height="62" rx="8" vector-effect="non-scaling-stroke" />
					<path
						class="stub"
						d="M8 0H37.4A3.6 3.6 0 0 0 41 3.6V58.4A3.6 3.6 0 0 0 37.4 62H8A8 8 0 0 1 0 54V8A8 8 0 0 1 8 0Z"
					/>
				</svg>

				<!-- 选中角标：整卡已变绿框，再补角标是因三态在小卡上仅靠边框色区分度不足 -->
				<span v-if="item.userRechargeCouponId === selectedId" class="rechargeCoupon__cards-tick" aria-hidden="true">
					<svg viewBox="0 0 16 12"><path d="M1.6 6.4 5.9 10.4 14.4 1.6" /></svg>
				</span>

				<div class="rechargeCoupon__cards-main">
					<p class="percent">{{ toPercent(item.rechargeGiftRate) }}%</p>
					<p class="off">CASHBACK</p>
				</div>

				<!-- 副文按产品要求定死英文不做多语言，货币符号仍由 currency 跟随站点；
					 i18n 版 couponUpperLimit/couponThreshold 仍服务券包与领取弹窗，勿据此改语言包。
					 金额去小数：上限可配到 ₹9,99,99,999 级，带 .00 会在票券内折行 -->
				<div class="rechargeCoupon__cards-meta">
					<p v-if="item.rechargeGiftLimit > 0" class="cap">Up to</p>
					<p class="limit" :class="limitScale(item)">
						{{ item.rechargeGiftLimit > 0 ? currency(item.rechargeGiftLimit, '', 0) : 'No limit' }}
					</p>
					<!-- 有门槛=可用性约束，加重强调；无门槛是好消息，弱化处理（设计稿两态字重不同） -->
					<p class="min" :class="{ 'is-strong': item.minRechargeAmount > 0 }">
						{{ item.minRechargeAmount > 0 ? `MIN ${currency(item.minRechargeAmount, '', 0)}` : 'No min deposit' }}
					</p>
					<!-- expireTime=null 即永久有效，整行隐藏而非占位 -->
					<p v-if="item.expireTime" class="exp">
						<svg class="clock" viewBox="0 0 12 12" aria-hidden="true">
							<circle cx="6" cy="6" r="5" />
							<path d="M6 3.1V6.3L8.2 7.6" />
						</svg>
						{{ `Exp. ${formatExpire(item.expireTime)}` }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { currency } from '@/utils'
import { useCoupon, estimateCouponBonus } from '@/hooks/useCoupon.hook'
import { useRecharge } from '@/hooks/useRecharge'
import type { UserRechargeCouponItem } from '@/types/api'

const { t: $t } = useI18n()
const { currentPayId, store, rechargeDetailAmount } = useRecharge()
const { fetchCategoryUsable } = useCoupon()

const rawCoupons = ref<UserRechargeCouponItem[]>([])
// 选中态按券 id 存而非下标：排序随金额实时变化，下标会指到另一张券上（资金链路静默换券）
const selectedId = ref<number | null>(null)
// 仅下单后对账重拉时上锁：券可能已被后端锁走，此刻不得改选其它券（无感知换券比不带券更糟）
const isReconcileLocked = ref(false)
const cardsRef = ref<HTMLElement>()

// 票根文字色由主色亮度定：40 套主题主色跨度极大（#FED358 到 #02457C），写死白或深都会有一半
// 主题不可读。放组件内算而不是给每套主题加变量——后者要动 40 个 root.scss，收益不抵风险
const stubInk = ref('#fff')

// 借一次 getComputedStyle 让浏览器把主色归一成 rgb()：主题里 hex/rgb/rgba 三种写法都有，自己解析易漏
const readMainColor = () => {
	const probe = document.createElement('span')
	probe.style.cssText = 'position:absolute;visibility:hidden;color:var(--main-color)'
	document.body.appendChild(probe)
	const rgb = getComputedStyle(probe).color
	probe.remove()
	return rgb
}

// WCAG 相对亮度；白字对比度达 3:1 即用白（票根文字均为大号粗体，适用大文本阈值）
const pickInk = (rgb: string) => {
	const ch = rgb.match(/[\d.]+/g)?.slice(0, 3).map(Number)
	if (!ch || ch.length < 3) return '#fff'
	const lin = (c: number) => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
	const luminance = 0.2126 * lin(ch[0]) + 0.7152 * lin(ch[1]) + 0.0722 * lin(ch[2])
	return 1.05 / (luminance + 0.05) >= 3 ? '#fff' : '#1f1f1f'
}

onMounted(() => {
	stubInk.value = pickInk(readMainColor())
})

// 比率小数原值 ×100，toFixed(2) 去浮点尾
const toPercent = (rate: number) => +(rate * 100).toFixed(2)

// 金额位数一多就被 break-all 折成两行（₹10,000,000 实测已折）。按位数降档而非统一缩小，
// 让常见小额保持醒目字号；阈值取 10/11 位——真机可用宽约 75px，10 位处只剩 0.8px 余量
const limitScale = (c: UserRechargeCouponItem) => {
	if (c.rechargeGiftLimit <= 0) return ''
	const len = currency(c.rechargeGiftLimit, '', 0).length
	return len >= 11 ? 'is-xs' : len >= 10 ? 'is-sm' : ''
}

// expireTime 定长 'YYYY-MM-DD HH:mm:ss'，切串重排即得设计稿的 DD-MM-YYYY
// 禁止改用 new Date()——该格式带空格，iOS Safari 解析得 Invalid Date（同 expiresEarlier）
const formatExpire = (time: string) => {
	const [y, m, d] = time.slice(0, 10).split('-')
	return `${d}-${m}-${y}`
}

// 券本单是否达门槛：金额 >= minRechargeAmount 即可用(等于即达标, §6.3)。大类/首充/状态后端5.4已过滤
const isUsable = (c?: UserRechargeCouponItem) =>
	!!c && !(c.minRechargeAmount > 0 && rechargeDetailAmount.value < c.minRechargeAmount)

// 本单预估彩金，仅用于排序；展示值由 RechargeDetail 就同一函数算，两处口径不会分叉
const bonusOf = (c: UserRechargeCouponItem) => estimateCouponBonus(c, rechargeDetailAmount.value)

// 彩金按「分」取整再比：浮点尾差(1e-13 级)会让两张展示金额相同的券错过到期时间这一档
const bonusRank = (c: UserRechargeCouponItem) => Math.round(bonusOf(c) * 100)

// 到期先后：expireTime 是定长 'YYYY-MM-DD HH:mm:ss'，字典序即时间序
// 禁止改用 new Date()——该格式带空格，iOS Safari 解析得到 Invalid Date
// null = 已领取且不限期(永久有效)，同分时让给有限期券先被消耗
// 别改用 remainingMinutes：精度只到分钟，实测同分钟到期的券会并列，分不出先后
const expiresEarlier = (a: UserRechargeCouponItem, b: UserRechargeCouponItem) => {
	if (a.expireTime === b.expireTime) return 0
	if (!a.expireTime) return 1
	if (!b.expireTime) return -1
	return a.expireTime < b.expireTime ? -1 : 1
}

// 展示序：可用券优先 → 本单预估彩金降序 → 到期时间升序；榜首恒为「达门槛且本单彩金最高」的券
// 按实得彩金而非比率：₹501 下「20% 不限」(100.2) 须排在「100% 封顶 100」(100) 之前
// 契约 GetRechargeCategoryUsableCoupon 返回裸数组、无 recommendedId 也不承诺顺序，排序只能前端补位
const coupons = computed(() =>
	[...rawCoupons.value].sort(
		(a, b) => Number(isUsable(b)) - Number(isUsable(a)) || bonusRank(b) - bonusRank(a) || expiresEarlier(a, b)
	)
)

// 榜首可用券 = 本单可获彩金最高者（排序已保证可用券在前、彩金降序、同分早到期在前）
const bestUsableId = () => coupons.value.find(isUsable)?.userRechargeCouponId ?? null

// 选中态唯一写入点：不可用券一律落空，selectedId 与 store.selectedCoupon 不会分叉
const applySelection = (id: number | null) => {
	const picked = coupons.value.find((c) => c.userRechargeCouponId === id && isUsable(c)) ?? null
	selectedId.value = picked?.userRechargeCouponId ?? null
	store.selectedCoupon = picked
}

// 大类切换即重拉该大类可用券；失败/无券 → 空 → 整块不渲染（充值是资金主链路，券仅增强，必须可降级）
// keepId：下单后对账重拉只认原券，查不到即已被后端锁走 → 静默取消选中；此时不改选其它券，
// 否则用户在无感知下带着另一张券下单，比不带券更糟
const loadCoupons = async (payId: number, keepId?: number) => {
	if (!payId || payId < 0) {
		rawCoupons.value = []
		isReconcileLocked.value = false
		applySelection(null)
		return
	}
	rawCoupons.value = await fetchCategoryUsable(payId)
	isReconcileLocked.value = !!keepId
	applySelection(keepId ?? bestUsableId())
}

// 点当前选中项 → 取消(不用券)；否则选中。选中券同步 store 供 RechargeDetail 试算 / 带券下单
// 手动选择只在当前金额下成立：金额一变即按新金额重新推荐最优券（产品规则「榜首恒为选中项」）
const selectCoupon = (c: UserRechargeCouponItem) => {
	if (!isUsable(c)) return // 未达门槛不可选
	applySelection(selectedId.value === c.userRechargeCouponId ? null : c.userRechargeCouponId)
}

// PC 无横滑手势：滚动条已隐藏(不能拖)、鼠标滚轮只出 deltaY(不横滚)、无触屏(不能 swipe)，≥4 张时后面的券在桌面端够不到
// 触摸板横滑自带 deltaX，浏览器已原生横滚，不重复干预
// 到边界即放行，否则鼠标停在券区时整页纵向滚动被劫持
const onWheel = (e: WheelEvent) => {
	if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
	const el = e.currentTarget as HTMLElement
	const max = el.scrollWidth - el.clientWidth
	if (max <= 0) return
	// RTL 下 scrollLeft ∈ [-max, 0]，不按方向取符号则阿语站券滚不动、还吃掉页面纵滚
	const sign = getComputedStyle(el).direction === 'rtl' ? -1 : 1
	if (e.deltaY > 0 ? el.scrollLeft * sign >= max - 1 : el.scrollLeft * sign <= 0) return
	e.preventDefault()
	el.scrollLeft += e.deltaY * sign
}

// 必须包一层：watch 回调第二参是 oldValue，直接传 loadCoupons 会把它当成 keepId
watch(currentPayId, (payId) => loadCoupons(payId), { immediate: true })

// 带券下单后与后端对账：券被锁走(State 1→2)即从可用券接口消失，选中态随之静默清空
watch(
	() => store.couponSyncKey,
	() => loadCoupons(currentPayId.value, store.selectedCoupon?.userRechargeCouponId)
)

// 金额变化 → 重排 → 选中态跟随榜首（可用且彩金最高）；仅对账锁定期保原券，掉出门槛即取消
// 必须同时监听 rechargeDetailAmount：券不足 2 张时排序比较器不执行，computed 不会把金额记成依赖
watch([coupons, rechargeDetailAmount], () =>
	applySelection(isReconcileLocked.value ? selectedId.value : bestUsableId())
)

// 一屏只放 2 张，重排后中选券可能停在横滑区外，用户看不到高亮 → 滚回可视范围
// flush post 才拿得到重排后的 DOM；用 rect 增量滚动，不碰 offsetParent，也不用 scrollIntoView
// （scrollIntoView 会连带滚动整页——券面板嵌在纵向滚动的充值页里）
watch(
	[selectedId, coupons],
	() => {
		const box = cardsRef.value
		const card = box?.querySelector<HTMLElement>('.rechargeCoupon__cards-item.active')
		if (!box || !card) return
		const b = box.getBoundingClientRect()
		const c = card.getBoundingClientRect()
		if (c.left < b.left) box.scrollBy({ left: c.left - b.left, behavior: 'smooth' })
		else if (c.right > b.right) box.scrollBy({ left: c.right - b.right, behavior: 'smooth' })
	},
	{ flush: 'post' }
)
</script>

<style lang="scss" scoped>
.rechargeCoupon {
	margin: 24px 0;

	// 只承载 <defs>，用零尺寸而非 display:none —— 后者会让部分浏览器跳过渐变解析
	&__defs {
		position: absolute;
		width: 0;
		height: 0;

		// 票根跟站点主色；票根文字由 stubInk 按主色亮度算，见 script
		.stop-hi {
			stop-color: color-mix(in srgb, var(--main-color, #ee4537) 82%, #fff);
		}

		.stop-lo {
			stop-color: var(--main-color, #ee4537);
		}
	}

	&__header {
		display: flex;
		align-items: center;
		column-gap: 12px;

		// 子级标题：比"充值金额"(36px/600/L1)弱一级——小 icon、小字号、常规字重、次要色
		&-icon {
			width: 32px;
			height: 32px;
		}

		&-title {
			font-size: 28px;
			font-weight: 400;
			color: var(--text_color_L2, #999);
		}
	}

	&__cards {
		display: flex;
		column-gap: 18px;
		margin-top: 24px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none; // Firefox 隐藏滚动条
		-webkit-overflow-scrolling: touch;

		&::-webkit-scrollbar {
			display: none; // Chrome/Safari 隐藏滚动条
		}

		// 鼠标设备(触屏不命中)：留一条细滚动条，既补回被隐藏的拖拽入口，也兼作"后面还有券"的可见暗示
		@media (hover: hover) and (pointer: fine) {
			scrollbar-width: thin;
			scrollbar-color: color-mix(in srgb, var(--text_color_L3, #989898) 40%, transparent) transparent;

			&::-webkit-scrollbar {
				display: block;
				height: 8px;
			}

			&::-webkit-scrollbar-thumb {
				border-radius: 4px;
				background: color-mix(in srgb, var(--text_color_L3, #989898) 40%, transparent);
			}
		}

		&-item {
			position: relative;
			// 一屏 2.3 张：第 3 张露出 81/271，用半张卡告诉用户还能滑（8 张券只铺 2 张时没有任何可滑暗示）
			flex: 0 0 calc((100% - 2 * 18px) / 2.3);
			min-width: 0;
			scroll-snap-align: start;
			// 与 shape 的 viewBox 122×62 严格同比：preserveAspectRatio="none" 下比例一偏离，圆角与缺口即被拉成椭圆
			aspect-ratio: 122 / 62;
			display: flex;
			align-items: stretch;
			overflow: hidden;
			// 与 rect 的 rx 8/122 同比，选中描边与折角才贴合票券轮廓
			border-radius: 19px;

			// 票根是固定坐标 SVG 不随 RTL 镜像，卡内又是产品定死的英文；整卡锁 LTR 才与票根咬合
			html:lang(ar) & {
				direction: ltr;
			}

			// 底板取页面底色而非设计稿的纯白：稿中券卡落在浅灰底上，而本页 panel 恰是 --bg_color_L2
			// （浅色主题 #FFF / 深色主题 #333332）。用低一层的 L1 恒比 panel 深一档，深浅主题同向成立；
			// 纯白硬编码在 blackGoldStyle 这类深色站会变成刺眼白斑
			.base {
				fill: var(--bg_color_L1, #f7f8ff);
				// 浅色主题下 L1 与 panel 仅差 3%，边界主要靠这道发丝线兜住
				// （stroke-width 2 有一半落在 viewBox 外被裁，视觉即 1px）
				stroke: color-mix(in srgb, var(--text_color_L2, #768096) 35%, transparent);
				stroke-width: 2;
			}

			.stub {
				fill: url(#couponStubGrad);
			}

			.percent,
			.off {
				color: var(--coupon-ink, #fff);
			}

			// 金额不跟主色：实测 11/40 主题的主色落在底板上 <3:1（yellow1Style 仅 1.38:1），
			// 而 text_color_L1 是主题体系保证与底色成对比的那一档
			.limit {
				color: var(--text_color_L1, #1e2637);
			}

			.cap,
			.min {
				color: var(--text_color_L2, #768096);
			}

			// 到期跟主色，但不能直接用：主色落在底板上有 11/40 主题 <3:1（yellow1Style 仅 1.38:1）。
			// 混入 text_color_L1——它恒与底板成对比，混多少就往可读方向拉多少；实测 45% 这一档
			// 40 套全部 ≥3.55:1（yellow1Style 回到 3.86），再高比例会有 4 套跌回 3:1 以下
			.exp {
				color: color-mix(in srgb, var(--main-color, #ff7f22) 55%, var(--text_color_L1, #1e2637));
			}

			// 选中：主色描边 + 右上折角
			// 描边走伪元素而非 outline/border：outline 绘制序在子元素之前，会被 inset:0 的 shape 整块盖掉；
			// border 则改盒宽、把票券挤窄
			&.active::after {
				content: '';
				position: absolute;
				inset: 0;
				z-index: 3;
				border: 4px solid var(--main-color, #18b660);
				border-radius: inherit;
				pointer-events: none;
			}

			// 未达门槛不可选：整卡淡化。色值已全部跟主题后，逐色写死禁用态会在深浅主题各错一半
			// （灰底配白字在浅色主题上不可读），唯有透明度深浅同向成立
			&.disabled {
				opacity: 0.5;
			}
		}

		&-shape {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
		}

		// 右上折角：右上圆角跟随票券、左下大圆角，咬出设计稿的翻页观感
		&-tick {
			position: absolute;
			top: 0;
			right: 0;
			z-index: 2;
			width: 15%;
			height: 27.6%;
			border-radius: 0 19px 0 17px;
			background: var(--main-color, #18b660);
			display: flex;
			align-items: center;
			justify-content: center;

			svg {
				width: 55%;
				height: auto;
				fill: none;
				stroke: var(--coupon-ink, #fff);
				stroke-width: 2.4;
				stroke-linecap: round;
				stroke-linejoin: round;
			}
		}

		// 票根 41/122，右边界正落在缺口圆心
		&-main {
			position: relative;
			z-index: 1;
			flex: 0 0 33.607%;
			min-width: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			row-gap: 8px;

			// 字号按卡宽等比取自设计稿（稿 120 宽 → 实渲 2.3 栏），换栅格须同步缩放
			// percent 例外，不取等比值 42×0.845=35：三位数比率"100%"在 35px 下宽 96.5，
			// 撑破 41/122 的票根栏(91.0)被 overflow 裁掉半个 %；32px 下 88.3 才装得下
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

		// 左内边距让开缺口圆心(41/122)，右内边距防长金额顶到票券圆角
		&-meta {
			position: relative;
			z-index: 1;
			flex: 1;
			min-width: 0;
			padding: 0 16px 0 5%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			row-gap: 8px;

			.cap {
				font-size: 16px;
				line-height: 1.1;
			}

			.limit {
				font-size: 27px;
				font-weight: 700;
				line-height: 1.1;
				// 降档后仍兜不住的极端值（超宽字形）才折行，不留这行会横向撑破票券
				word-break: break-all;

				&.is-sm {
					font-size: 26.25px;
				}

				&.is-xs {
					font-size: 22.5px;
				}
			}

			.min {
				font-size: 16px;
				line-height: 1.1;
				word-break: break-all;

				&.is-strong {

				}
			}

			.exp {
				display: flex;
				align-items: center;
				column-gap: 5px;
				font-size: 16px;
				line-height: 1.1;
				white-space: nowrap;
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
}
</style>
