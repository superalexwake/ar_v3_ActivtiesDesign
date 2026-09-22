<template>
	<div class="TimeLeft__C">
		<div class="TimeLeft__C-l1">
			<div class="TimeLeft__C-l1-l">
				<div class="TimeLeft__C-l1-no">{{ $t('winTrxNum') }}</div>
				<div class="TimeLeft__C-l1-tip" @click="showRule">
					<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
						<path
							d="M9.67074 29.1107L9.66322 29.1182L9.65598 29.126C9.02654 29.8017 8.45747 30.2157 7.98006 30.4218C7.50853 30.6254 7.16285 30.6135 6.91422 30.5064C6.6612 30.3975 6.39655 30.1416 6.18925 29.6333C5.98114 29.123 5.85 28.3992 5.85 27.45V10.56C5.85 7.52835 6.21824 5.86758 7.1019 4.92303C7.97224 3.99272 9.4962 3.6 12.33 3.6H23.67C26.5041 3.6 28.0275 3.99282 28.8959 4.92264C29.7774 5.86659 30.1425 7.52679 30.135 10.5585V10.56V27.435C30.135 28.3846 30.0047 29.1087 29.7975 29.6192C29.5911 30.1278 29.3276 30.383 29.076 30.4916C28.8287 30.5983 28.4837 30.6106 28.011 30.4067C27.5326 30.2004 26.9615 29.7861 26.3282 29.1102C25.6005 28.3296 24.6554 27.9468 23.7086 27.9984C22.7618 28.0499 21.8639 28.5332 21.225 29.385L21.2246 29.3856L19.7116 31.4079C19.7113 31.4083 19.711 31.4087 19.7107 31.4091C19.1996 32.0836 18.5725 32.3738 17.9925 32.3738C17.4125 32.3738 16.7854 32.0836 16.2743 31.4091C16.274 31.4087 16.2737 31.4083 16.2734 31.4079L14.7606 29.3858C14.7605 29.3857 14.7605 29.3856 14.7604 29.3856C13.4723 27.6623 11.1634 27.5349 9.67973 29.1017L9.67074 29.1107ZM9.57 16.5C9.57 17.6564 10.5136 18.6 11.67 18.6C12.8264 18.6 13.77 17.6564 13.77 16.5C13.77 15.3436 12.8264 14.4 11.67 14.4C10.5136 14.4 9.57 15.3436 9.57 16.5ZM9.57 10.5C9.57 11.6564 10.5136 12.6 11.67 12.6C12.8264 12.6 13.77 11.6564 13.77 10.5C13.77 9.34363 12.8264 8.4 11.67 8.4C10.5136 8.4 9.57 9.34363 9.57 10.5ZM16.095 18.225H24.345C25.2914 18.225 26.07 17.4464 26.07 16.5C26.07 15.5536 25.2914 14.775 24.345 14.775H16.095C15.1486 14.775 14.37 15.5536 14.37 16.5C14.37 17.4464 15.1486 18.225 16.095 18.225ZM16.095 12.225H24.345C25.2914 12.225 26.07 11.4464 26.07 10.5C26.07 9.55363 25.2914 8.775 24.345 8.775H16.095C15.1486 8.775 14.37 9.55363 14.37 10.5C14.37 11.4464 15.1486 12.225 16.095 12.225Z"
							stroke="currentColor"
							stroke-width="1.2"
						/></svg
					>{{ $t('winTrxIndicate') }}
				</div>
			</div>
			<div class="TimeLeft__C-l1-r" @click="goTrx">
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
					<path
						d="M22.3206 29.4914C20.713 30.1573 18.99 30.5 17.25 30.5C13.7359 30.5 10.3657 29.104 7.88084 26.6192C5.39598 24.1343 4 20.7641 4 17.25C4 13.7359 5.39598 10.3657 7.88083 7.88083C10.3657 5.39598 13.7359 4 17.25 4C18.99 4 20.713 4.34272 22.3206 5.0086C23.9281 5.67447 25.3888 6.65046 26.6192 7.88083C27.8495 9.11121 28.8255 10.5719 29.4914 12.1794C30.1573 13.787 30.5 15.51 30.5 17.25C30.5 18.99 30.1573 20.713 29.4914 22.3206C28.8255 23.9281 27.8495 25.3888 26.6192 26.6192C25.3888 27.8495 23.9281 28.8255 22.3206 29.4914ZM31.95 31.9985C31.9436 31.9985 31.9355 31.9971 31.9282 31.9941C31.9242 31.9925 31.922 31.9911 31.9214 31.9906L29.1369 29.2062C29.1268 29.1953 29.1211 29.1809 29.1211 29.166C29.1211 29.152 29.1261 29.1385 29.1351 29.1279C29.1381 29.1254 29.1407 29.124 29.1432 29.123C29.1472 29.1213 29.1535 29.1197 29.1619 29.1197C29.1774 29.1197 29.1952 29.1249 29.2127 29.1404L31.9929 31.9206C31.9948 31.9226 31.9963 31.9243 31.9975 31.926C31.9989 31.928 31.9998 31.9299 32.0005 31.9317C32.0022 31.9357 32.0037 31.942 32.0037 31.9504C32.0037 31.9608 32.0014 31.9723 31.9952 31.984C31.9756 31.9955 31.9587 31.9985 31.95 31.9985Z"
						stroke="currentColor"
						stroke-width="2"
					/></svg
				>{{ $t('winTrxPub') }}
			</div>
		</div>
		<div class="TimeLeft__C-l2">
			<div>{{ props.currentInfo.gameNo }}</div>
			<div class="TimeLeft__C-time">
				<span>{{ $t('winTrxTime') }}</span>
				<div>{{ currentInfo.time1 }}</div>
				<div>{{ currentInfo.time2 }}</div>
				<div notime>:</div>
				<div>{{ currentInfo.time3 }}</div>
				<div>{{ currentInfo.time4 }}</div>
			</div>
		</div>
		<div class="TimeLeft__C-l3">
			<template v-for="(item, index) in prizeNumList" :key="index">
				<p v-if="prizeNum == item" :class="['num' + item, prizeNum == item && 'prize' + item]"></p>
				<div v-else :class="['num' + item, prizeNum == item && 'prize' + item]"></div>
			</template>
		</div>
		<!-- 规则弹层 begin-->
		<rule :howPlayShow="howPlayShow" :gamePresentation="currentGame.gamePresentation" @close="howPlayShow = false" />
	</div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import rule from '@/components/Home/AllLotteryGames/WinGo/rule.vue'
import { LorreryStore } from '@/stores'
const howPlayShow = ref(false)
const router = useRouter()
// 中奖号码数组
const prizeNumList = computed(() => {
	const { blockID } = props.settled
	if (!blockID) return [0, 0, 0, 0, 0]
	let str = blockID.substring(blockID.length - 5).toUpperCase() //获取后5位
	if (/\d/.test(str)) {
		return [...str]
	} else {
		return [...blockID.substring(blockID.length - 5, blockID.length - 10).toUpperCase()]
	}
})
// 中奖号码
const prizeNum = computed(() => {
	return props.settled?.number
})
const props = defineProps({
	currentInfo: {
		type: Object,
		default: () => ({
			gameNo: 'loading',
			currentTime: '',
			beginTime: '',
			passTime: 180,
			time1: 0,
			time2: 0,
			time3: 0,
			time4: 0
		})
	},
	settled: {
		type: Object,
		default: () => ({})
	},
	gameName: {
		type: String,
		default: ''
	},
	currentGame: {
		// 当前选中游戏
		type: Object,
		default: () => ({})
	}
})
// 跳转ifrmae 页面展示交易所
const goTrx = () => {
	let url = 'https://tronscan.org'
	window.location.href = url
}
const lottery = LorreryStore()
const showRule = () => {
	howPlayShow.value = true
	lottery.getTrxRule(props.currentGame.typeID)
}
</script>
<style lang="scss" scoped>
.TimeLeft__C {
	width: calc(100% - 52px);
	height: 375px;
	margin: 36px auto 0;
	background-image: url('@icon/home/trxbg.png');
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 1px center;
	color: var(--text_color_L4);
	padding: 32px 22px;

	&-l1 {
		display: flex;
		justify-content: space-between;
		height: 50px;
		line-height: 50px;

		&-l {
			display: flex;
		}

		&-no {
			height: 50px;
			border: 1px solid var(--text_color_L4);
			border-radius: 10px;
			padding: 0 22px;
			margin-right: 10px;
			font-size: 22px;
		}

		&-tip,
		&-r {
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;
			background: var(--darkLight, var(--bg_color_L2));
			border-radius: 60px;
			font-size: 22px;
			gap: 5px;
			color: var(--darkTextW, var(--main-color));
			padding: 0 18px;
			svg {
				display: flex;

				color: var(--darkTextW, var(--main-color));
				height: 36px;
				width: 36px;
			}
		}
	}

	&-l2 {
		height: 50px;
		line-height: 50px;
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
		font-size: 28px;
	}

	&-l3 {
		height: 110px;
		margin-top: 78px;
		display: flex;
		justify-content: space-between;
		$list: 0 1 2 3 4 5 6 7 8 9 A B C D E F;

		@each $i in $list {
			.num#{$i} {
				background-image: url('@/assets/icons/home/AllLotteryGames/WinTrx/num#{$i}.png');
			}

			.num#{$i}.prize#{$i}:last-of-type {
				background-image: url('@/assets/icons/home/AllLotteryGames/WinTrx/prize#{$i}.png');
			}
		}

		& > div,
		& > p {
			width: 110px;
			height: 110px;
			line-height: 110px;
			text-align: center;
			font-weight: 700;
			font-size: 48px;
			background-position: center;
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
	}

	&-time {
		height: 50px;
		line-height: 50px;
		bottom: 22px;
		right: 24px;
		display: flex;
		align-items: center;

		& > span {
			display: block;
			margin-right: 9px;
			font-weight: 700;
			font-size: 22px;
			line-height: 25px;
		}

		& > div {
			background: var(--darkLight2, var(--winTips));
			color: var(--text_color_L4);
			font-weight: 700;
			font-size: 36px;
			text-align: center;
			padding: 0 10px;
			border: 1px solid var(--text_color_L4);
			border-radius: 5px;
			background-position: center;
			background-size: 100% 100%;
			background-repeat: no-repeat;

			& + div {
				margin-left: 9px;
			}

			&:nth-child(2) {
				//background-image: url('@/assets/icons/home/AllLotteryGames/WinTrx/timeb.png');
				//border: transparent;
				//background-color: transparent;
			}

			&:last-child {
				//background-image: url('@/assets/icons/home/AllLotteryGames/WinTrx/timea.png');
				//border: transparent;
				//background-color: transparent;
			}
		}
	}
}
</style>
