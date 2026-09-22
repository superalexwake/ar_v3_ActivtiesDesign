<template>
	<div
		class="customer"
		@click="onToCustomer"
		@mousedown="down"
		@touchstart="down"
		@mousemove="move"
		@touchmove="move"
		@mouseup="end"
		id="customerId"
		v-scrollhide
		v-if="isShowCustomer"
	>
		<img src="@icon/home/icon_sevice.png" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useServer } from '@/hooks/useServe.hook'
import { useRoute } from 'vue-router'
const VITE_HOME = import.meta.env.VITE_HOME
const route = useRoute()
const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
const flags = ref(false)
const position = ref({
	x: 0,
	y: 0
})
const dx = ref(0)
const dy = ref(0)

const nx = ref(0)
const ny = ref(0)

const xPum = ref(0)
const yPum = ref(0)
const customerId = ref()

let beforeX: number, beforeY: number, afterX: number, afterY: number
const isShowCustomer = computed(() => {
	const hidHome = ['electronic', 'blackGoldHome']
	if (hidHome.includes(VITE_HOME)) return false
	const list = [
		'/wallet/Withdraw/C2cDetail',
		'/wallet/RechargeHistory/RechargeUpiDetail',
		'/wallet/Withdraw/Upi',
		'/wallet/Withdraw/AddUpi',
		'/wallet/Withdraw/c2cCancelWithdrawal/index.vue',
		'/wallet/otherPay?type=C2C',
		'/home/game',
		'/installApp'
	]
	return !list.includes(route.path)
})
function onToCustomer() {
	if (!isdrag(beforeX, beforeY, afterX, afterY)) {
		getSelfCustomerServiceLink()
	}
}

onMounted(() => {
	customerId.value = document.getElementById('customerId') as HTMLElement
})
// 实现移动端拖拽
function down(event: any) {
	flags.value = true
	var touch
	if (event.touches) {
		touch = event.touches[0]
	} else {
		touch = event
	}
	position.value.x = touch.clientX
	position.value.y = touch.clientY

	dx.value = customerId.value.offsetLeft
	dy.value = customerId.value.offsetTop

	beforeX = event.clientX
	beforeY = event.clientY
}

function move(event: any) {
	if (flags.value) {
		var touch
		var div = document.getElementById('customerId') as HTMLElement
		var divwidth = div.clientWidth
		var divheight = div.clientHeight
		var winHeight = document.documentElement.clientHeight
		var winWidth = document.documentElement.clientWidth
		if (event.touches) {
			touch = event.touches[0]
		} else {
			touch = event
		}
		nx.value = touch.clientX - position.value.x
		ny.value = touch.clientY - position.value.y
		xPum.value = dx.value + nx.value
		yPum.value = dy.value + ny.value
		if (xPum.value <= 0) {
			xPum.value = 0
		}
		if (yPum.value <= 0) {
			yPum.value = 0
		}
		if (xPum.value >= winWidth - divwidth) {
			xPum.value = winWidth - divwidth
		}
		if (yPum.value >= winHeight - divheight) {
			yPum.value = winHeight - divheight
		}
		customerId.value.style.left = xPum.value + 'px'
		customerId.value.style.top = yPum.value + 'px'
		//阻止页面的滑动默认事件
		document.addEventListener(
			'touchmove',
			function () {
				event.preventDefault()
			},
			false
		)
	}
	// 阻止冒泡
	event.stopPropagation()
	// 阻止默认事件
	event.preventDefault()
}
//鼠标释放时候的函数
function end(event: any) {
	flags.value = false

	afterX = event.clientX
	afterY = event.clientY
}

function isdrag(x1: number, y1: number, x2: number, y2: number) {
	if (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) <= 1) {
		return false
	}
	return true
}

// 根据语言动态设置字体类型
const langFamilys = [
	{ title: 'vi', bgColor: 'bahnschrift' },
	{ title: 'else', bgColor: `'Roboto', 'Inter', sans-serif` }
]

const currentFontFamily = ref('bahnschrift')
// const onBtnClick = (bgColor: string) => {
// 	currentFontFamily.value = bgColor
// }
</script>
<style lang="scss">
// $font-family: 'bahnschrift';
// $font-family: 'Roboto', 'Inter', sans-serif;
$font-family: v-bind(currentFontFamily);

// .demo {
// 	font-family: $font-family;
// 	position: fixed;
// 	bottom: 500px;
// 	z-index: 999;
// }

.customer {
	position: fixed;
	bottom: 180px;
	right: 30px;
	width: 112px;
	height: 112px;
	border-radius: 50%;
	z-index: 108; //层级需要高于头部导航栏

	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
</style>
