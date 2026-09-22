<!-- 我的充值优惠券：三 Tab(未使用/已使用/已过期) + 券卡片列表；数据统一经 useCoupon 拉取 -->
<template>
	<div class="coupon-container">
		<NavBar :title="$t('myRechargeCoupon')" left-arrow @click-left="router.go(-1)" />

		<div class="coupon-container-tabs">
			<div
				v-for="tab in tabs"
				:key="tab.state"
				class="coupon-container-tabs__item"
				:class="{ active: activeTab === tab.state }"
				@click="selectTab(tab.state)"
			>
				{{ tab.label }}
			</div>
		</div>

		<div class="coupon-container-list">
			<!-- v-for 外提到 template：Vue 3 同元素上 v-if 优先级高于 v-for，写一起取不到 state -->
			<template v-for="state in TAB_STATES" :key="state">
				<List
					v-if="mountedTabs.includes(state)"
					v-show="activeTab === state"
					:api="fetchCouponPage"
					:page-query="{ couponStates: TAB_QUERY_STATES[state] }"
					v-model:list="buckets[state]"
				>
					<template #content>
						<div
							class="coupon-card"
							:class="{ 'coupon-card--done': state !== USER_COUPON_STATE.UNUSED }"
							v-for="item in buckets[state]"
							:key="item.userRechargeCouponId"
						>
							<div class="coupon-card__amount">
								<strong>{{ toPercent(item.rechargeGiftRate) }}%</strong>
								<span v-if="item.rechargeGiftLimit > 0">{{
									$t('couponUpperLimit', [
										currency(item.rechargeGiftLimit, '', Number.isInteger(item.rechargeGiftLimit) ? 0 : 2)
									])
								}}</span>
							</div>
							<div class="coupon-card__info">
								<h4>{{ $t('couponRechargeName') }}</h4>
								<p>{{ $t('couponCodeLabel') }} {{ item.couponNum }}</p>
								<p v-if="condText(item)">{{ condText(item) }}</p>
								<!-- expireTime=null 即永久有效，无到期日则整行不显示 -->
								<p v-if="item.expireTime">{{ $t('couponValidUntil', [formatDate(item.expireTime)]) }}</p>
								<button
									class="coupon-card__use"
									:disabled="state !== USER_COUPON_STATE.UNUSED"
									@click="onUse(item)"
								>
									{{ useTextOf(state) }}
								</button>
							</div>
						</div>
					</template>
				</List>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useCoupon, USER_COUPON_STATE, isUsdtOnly, isUpiOnly, categoryIdsOf } from '@/hooks/useCoupon.hook'
import List from '@/components/common/List.vue'
import type { UserCouponState, UserRechargeCouponItem } from '@/types/api'
import { currency } from '@/utils'

const { t: $t } = useI18n()
const router = useRouter()
const { fetchCouponPage } = useCoupon()

// 三 Tab 对应 couponState：未使用 1 / 已使用 3 / 已过期 4
const TAB_STATES = [USER_COUPON_STATE.UNUSED, USER_COUPON_STATE.USED, USER_COUPON_STATE.EXPIRED] as const
const TAB_LABEL_KEYS: Record<number, string> = {
	[USER_COUPON_STATE.UNUSED]: 'couponUnused',
	[USER_COUPON_STATE.USED]: 'couponUsed',
	[USER_COUPON_STATE.EXPIRED]: 'couponExpired'
}
// 已使用需连查 LOCKED(2)：券绑定到充值单后先转锁定态，漏掉这档用户会看不到刚用掉的券
const TAB_QUERY_STATES: Record<number, UserCouponState[]> = {
	[USER_COUPON_STATE.UNUSED]: [USER_COUPON_STATE.UNUSED],
	[USER_COUPON_STATE.USED]: [USER_COUPON_STATE.LOCKED, USER_COUPON_STATE.USED],
	[USER_COUPON_STATE.EXPIRED]: [USER_COUPON_STATE.EXPIRED]
}
const activeTab = ref<UserCouponState>(USER_COUPON_STATE.UNUSED)

// 懒挂载：Tab 首次点开才挂 List(挂载即发一次请求)，之后常驻不卸载，切回不重复拉且保住分页游标
const mountedTabs = ref<UserCouponState[]>([USER_COUPON_STATE.UNUSED])
const selectTab = (state: UserCouponState) => {
	activeTab.value = state
	if (!mountedTabs.value.includes(state)) mountedTabs.value.push(state)
}

const buckets = ref<Record<number, UserRechargeCouponItem[]>>({
	[USER_COUPON_STATE.UNUSED]: [],
	[USER_COUPON_STATE.USED]: [],
	[USER_COUPON_STATE.EXPIRED]: []
})
const tabs = computed(() => TAB_STATES.map((state) => ({ state, label: $t(TAB_LABEL_KEYS[state]) })))

// 比率小数原值 ×100，toFixed(2) 去浮点尾
const toPercent = (rate: number) => +(rate * 100).toFixed(2)

const useTextOf = (state: UserCouponState) =>
	state === USER_COUPON_STATE.USED
		? $t('couponUsed')
		: state === USER_COUPON_STATE.EXPIRED
		? $t('couponExpired')
		: $t('couponGoUse')

// 产品规则：至多 2 类点名，再多只报数量——名字堆叠挤行且信息量低
const MAX_NAMED_CATEGORIES = 2

// 大类标签：USDT/UPI 语义组优先(多 id 同语义)；其余用随券下发的大类名（GetCurrentCoupon rechargeCategorys[].name），超量退化为计数
const channelTag = (c: UserRechargeCouponItem) => {
	if (isUpiOnly(c)) return $t('couponChannelOnly', ['UPI'])
	if (isUsdtOnly(c)) return $t('couponChannelOnly', ['USDT'])
	const cats = c.rechargeCategorys
	if (!Array.isArray(cats) || cats.length === 0) return ''
	// 计数用原始长度而非可取名数：畸形元素同样是一档限制，少报会让用户以为适用面更窄
	if (cats.length > MAX_NAMED_CATEGORIES) return $t('couponChannelCount', [cats.length])
	// 旧形态裸 payId 元素无名可用，滤空后兜底通用受限文案不误导
	const names = cats.map((cat) => (typeof cat === 'number' ? '' : cat?.name)).filter(Boolean)
	return names.length ? $t('couponChannelOnly', [names.join('/')]) : $t('couponChannelLimited')
}

// 产品四行之条件行：首充限制 + 大类专享，「 · 」拼接；两者皆无(如全大类券)则整行隐藏
const condText = (c: UserRechargeCouponItem) =>
	[c.isFirstRechargeAvailable ? $t('couponFirstRechargeOnly') : '', channelTag(c)].filter(Boolean).join(' · ')

// 产品要求完整年月日(语言中立)，不随 couponDateFormat 的本地化短格式；null(永久有效)由模板 v-if 隐藏整行
const formatDate = (time: string) => dayjs(time).format('YYYY-MM-DD')

// 「去使用」带适用大类 id 供充值页默认高亮命中 Tab；不带券 id——选券交给充值页现有默认逻辑
const onUse = (c: UserRechargeCouponItem) => {
	const ids = categoryIdsOf(c)
	router.push(ids.length ? { path: '/wallet/Recharge', query: { couponPayIds: ids.join(',') } } : '/wallet/Recharge')
}
</script>

<style lang="scss" scoped>
.coupon-container {
	min-height: 100vh;
	background: var(--bg_color_L1);

	// 通栏主色条：设计稿 #f95959 即 redStyle 皮肤的 --main-color，走 token 让 37 套皮肤各自成色
	&-tabs {
		display: flex;
		height: 88px;
		background: var(--main-color);

		&__item {
			position: relative;
			flex: 1;
			// 泰米尔语 284px / 俄语 268px 标签超 tab 宽 250px 且无空格可断，不强制断词会顶破通栏
			min-width: 0;
			overflow-wrap: anywhere;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30px;
			line-height: 36px;
			text-align: center;
			color: var(--text_color_L4);

			// 三档同底同字，仅靠底边缺口标记选中；填 bg_color_L1 与页面底色一致才咬出缺口
			&.active::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				border-left: 10px solid transparent;
				border-right: 10px solid transparent;
				border-bottom: 17px solid var(--bg_color_L1);
			}
		}
	}

	&-list {
		padding: 30px 24px 0;
	}
}

.coupon-card {
	display: flex;
	// min-height 而非定高：条件行/有效期行可缺省，长语种也会撑高，定高会切字
	min-height: 231px;
	border-radius: 10px;
	box-shadow: 0 8px 16px rgba(208, 208, 237, 0.36);
	// 左沿咬口靠此裁成半圆，去掉会露出整圆
	overflow: hidden;

	// 下间距而非 & + & 上间距：末张卡须与「没有更多了」拉开，否则贴死
	margin-bottom: 24px;

	&__amount {
		// 定位上下文兼绘制层级：info 保持静态流，咬口圆才能盖在其底色之上
		position: relative;
		flex-shrink: 0;
		width: 221px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 21px;
		padding: 28px 24px;
		color: var(--text_color_L4);
		background: var(--main-color);

		// 票券咬口：左沿半圆 + 骑缝整圆，填页面底色才咬得穿
		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 50%;
			width: 18px;
			height: 18px;
			border-radius: 50%;
			background: var(--bg_color_L1);
			transform: translateY(-50%);
		}

		&::before {
			left: -9px;
		}

		&::after {
			right: -9px;
		}

		strong {
			font-size: 60px;
			font-weight: 600;
			line-height: 36px;
		}

		span {
			font-size: 24px;
			font-weight: 500;
			line-height: 36px;
			text-align: center;
		}
	}

	&__info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
		// 设计稿右留白 125px 是按样例短文案排的，实数据券码/大类更长，收至 30px 换取不折行
		padding: 16px 30px 14px;
		overflow: hidden;
		background: var(--bg_color_L3);

		h4 {
			font-size: 30px;
			font-weight: 600;
			line-height: 30px;
			color: var(--text_color_L1);
		}

		p {
			font-size: 24px;
			line-height: 40px;
			letter-spacing: 0.04em;
			color: var(--text_color_L2);
		}
	}

	&__use {
		align-self: flex-start;
		min-width: 150px; // 设计定宽，长语种由 padding 撑开
		height: 50px;
		flex-shrink: 0; // 列容器下按钮会被压扁，须锁高
		padding: 0 42px;
		border: none;
		border-radius: 10px;
		background: var(--main-color);
		color: var(--text_color_L4);
		font-size: 22px;
		line-height: 24px;
		white-space: nowrap; // 文案随 Tab 切为「已使用/已过期」，长语种不可断行
	}

	// 已使用/已过期整卡转灰：不用 opacity，降透明会让文字发糊且咬口圆透出底色
	&--done {
		.coupon-card__amount,
		.coupon-card__use {
			background: var(--text_color_L3);
		}

		.coupon-card__info p {
			color: var(--text_color_L3);
		}
	}
}
</style>
