<template>
	<Teleport to="body">
		<div class="coin-shower" v-if="coins.length">
			<div class="coin" v-for="coin in coins" :key="coin.id" :style="coin.fall">
				<i :style="coin.spin"></i>
			</div>
			<span>+{{ money(flashAmount) }}</span>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { currencyTrim as money } from '@/utils'
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
	// 父级成功后递增;不由点击触发,否则失败也会飘币
	seq: { type: Number, default: 0 },
	amount: { type: [Number, String], default: 0 }
})

// 枚数、尺寸、时长与 spawn 内的随机区间均照原型 coinShower 口径;基准尺寸按 22px@360 换算到 750 稿
const COIN_COUNT = 20
const BASE_SIZE = 46
// 须 >= duration 上限 2000 + delay 上限 400,否则最慢那几枚未落地就被清空
const LIFETIME = 2500

const coins = ref<any[]>([])
// 父级成功后会重拉数据,金额随之翻动;起飞时快照,否则动画中途改数
const flashAmount = ref<number | string>(0)
let timer: any = null

const rand = (min: number, max: number) => min + Math.random() * (max - min)

// 随机值要在起飞时抽定:留在渲染期算会让每次重渲染都换一批落点
const spawn = () => {
	coins.value = Array.from({ length: COIN_COUNT }, (_, i) => {
		const rotate = rand(-40, 40)
		const spinDuration = rand(0.45, 0.9)
		return {
			id: `${props.seq}-${i}`,
			fall: {
				left: `${rand(2, 94)}%`,
				width: `${BASE_SIZE * rand(0.7, 1.4)}px`,
				animationDuration: `${rand(1.1, 2)}s`,
				animationDelay: `${rand(0, 0.4)}s`,
				'--dx': `${rand(-60, 60)}px`,
				'--r0': `${rotate}deg`,
				'--r1': `${rotate + rand(-180, 180)}deg`
			},
			spin: {
				animationDuration: `${spinDuration}s`,
				// 负延迟让每枚从不同帧起转,否则整屏金币同步翻面
				animationDelay: `${-rand(0, spinDuration)}s`,
				animationDirection: Math.random() < 0.5 ? 'normal' : 'reverse'
			}
		}
	})
}

watch(
	() => props.seq,
	(value, old) => {
		if (!value || value === old) return
		clearTimeout(timer)
		flashAmount.value = props.amount
		spawn()
		timer = setTimeout(() => (coins.value = []), LIFETIME)
	}
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style lang="scss" scoped>
.coin-shower {
	position: fixed;
	top: 0;
	bottom: 0;
	// body 是 flex 居中容器,fixed 铺满会把币撒到 #app 两侧的灰边上;750px 经 pxtorem 转出的 10rem 与 #app 同值
	left: 50%;
	transform: translateX(-50%);
	width: 750px;
	max-width: 100%;
	// vant 弹层 z-index 自 2000 起每开一次自增且不重置,固定 2100 会被追上;取本仓全屏浮层惯例值
	z-index: 9999;
	pointer-events: none;
	overflow: hidden;

	.coin {
		position: absolute;
		top: -80px;
		animation: coin-fall linear forwards;

		// 精灵图 10 帧横排:背景宽 1000%,百分比定位下第 k 帧落在 k/9,steps(10) 走到 10/9 恰好每帧停一次
		i {
			display: block;
			padding-top: 100%;
			background: url('@/assets/icons/activity/DailyTask/period_card_coin_spin.png') no-repeat 0 0 / 1000% 100%;
			filter: drop-shadow(0 0 6px rgba(255, 196, 40, 0.75));
			animation: coin-spin steps(10) infinite;
		}
	}

	span {
		position: absolute;
		left: 0;
		right: 0;
		top: 38%;
		text-align: center;
		// 阿语站继承 rtl 会把加号甩到金额尾部,纯符号数字块须自行收口
		direction: ltr;
		font-size: 62px;
		font-weight: 600;
		// 金额固定金色,与金币同色系,不跟主题色
		color: #ffd23f;
		text-shadow: 0 0 12px rgba(255, 196, 40, 0.6), 0 3px 12px rgba(0, 0, 0, 0.5);
		animation: coin-pop 1.1s ease forwards;
	}
}

@keyframes coin-fall {
	0% {
		transform: translate(0, 0) rotate(var(--r0));
		opacity: 0;
	}
	// 全程保持不透明,只在出屏前才淡出,金币看得清
	6%,
	90% {
		opacity: 1;
	}
	100% {
		// 用视口高而非固定像素:落点要跟着机型走,否则高屏上金币半空消失
		transform: translate(var(--dx), 110vh) rotate(var(--r1));
		opacity: 0.6;
	}
}

@keyframes coin-spin {
	to {
		background-position: 111.111% 0;
	}
}

@keyframes coin-pop {
	0% {
		opacity: 0;
		transform: translateY(0) scale(0.5);
	}
	25% {
		opacity: 1;
		transform: translateY(-22px) scale(1.15);
	}
	70% {
		opacity: 1;
		transform: translateY(-38px) scale(1);
	}
	100% {
		opacity: 0;
		transform: translateY(-100px) scale(1);
	}
}
</style>
