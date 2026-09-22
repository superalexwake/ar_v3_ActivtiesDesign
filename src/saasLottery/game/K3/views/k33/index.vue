<template>
	<section class="k3_main">
		<LotteryInfo @change-select-game="changeSelectGame" @setVoice="setVoice" :VoiceType="VoiceType" />
		<div class="k3_container">
			<section class="cont betting">
				<time-left :issue="issue" :countdownTime="countdownTime" :premium="premium"
					@showRule="onSwitchIntroduce"></time-left>
				<div class="zhongjiang K3B__C">
					<!-- <canvas class="c" v-show="animationLock" ref="lottieEl"></canvas> -->
					<div v-show="isShowMark && markLock" class="K3B__C-mark" ref="lottieEl">
						<div>{{ countdownTime[3] || '0' }}</div>
						<div>{{ countdownTime[4] || '0' }}</div>
					</div>
					<div class="K3B__C-nav">
						<div v-for="(item, index) in navList" :key="index" :class="{ active: actNav == index }"
							@click="changeType(index)">
							<span>{{ item.name }}</span>
						</div>
					</div>
					<Betting1 @question="onQuestion" @choose="onBet" :bets="bets" :numbers="numbers"
						v-show="actNav === 0" />
					<Betting2 @question="onQuestion" @choose="onBet" :bets="bets" :same2Mult="same2Mult"
						:same2Rate="same2Rate" v-show="actNav === 1" />
					<Betting3 @question="onQuestion" @choose="onBet" :bets="bets" :numSame3="numSame3"
						:same3All="same3All" v-show="actNav === 2" />
					<Betting4 @question="onQuestion" @choose="onBet" :bets="bets" :numNear3All="numNear3All"
						:numDiff3="numDiff3" :numDiff2="numDiff2" v-show="actNav === 3" />
				</div>
			</section>
			<div class="RecordNav__C">
				<div v-for="(item, index) in recordNav" :key="index" :class="{ active: item.comp == gameComponent }"
					@click="gameComponent = item.comp">
					<span>{{ item.name }}</span>
				</div>
			</div>
			<div class="">

				<KeepAlive>
					<Suspense>
						<template #default>
							<component :is="currentComponent" />
						</template>
						<template #fallback>
							<p style="height: 200px"> </p>
						</template>
					</Suspense>
				</KeepAlive>
			</div>
		</div>

		<BettingPopup :actNav="actNav" />
		<!--声音-->
		<van-popup v-model:show="sound" :close-on-click-overlay="false" round>
			<BetSound @close="sound = false" />
		</van-popup>
		<!-- 玩法提示 -->
		<van-popup class="qpopup" v-model:show="showQuestion" round>
			<div class="qpopup-box">
				<div class="qpopup-box-list">
					<div :class="'num number' + item" v-for="(item, index) in questionList" :key="index"></div>
				</div>
				<div class="qpopup-box-txt">
					{{ questionText }}
				</div>
			</div>
			<i class="close_pop" @click="showQuestion = false"><van-icon name="close" /></i>

		</van-popup>
		<van-popup @open="getIntroduce" v-model:show="introduceDialog" :close-on-click-overlay="false" round>

			<BetRule :title="introduceHtml?.title" @close="onSwitchIntroduce">
				<div class="flex-center" style="height: 100%" v-if="introduceLoading">
					<van-loading type="spinner" color="#FD565C" />
				</div>
				<div v-else v-html="introduceHtml?.content">
				</div>
			</BetRule>
		</van-popup>
		<WinningTips ref="winner">
			<template v-slot="{ data }">
				<div class="line1">
					<div v-for="(n, i) in data.premium" :class="['number' + n]"></div>
				</div>
				<div class="line2">
					<div>{{ data.sum > 10 ? t('big') : t('small') }}</div>
					<div class="yuan">{{ data.sum }}</div>
					<div>{{ data.sum % 2 ? t('k3Odd') : t('k3Even') }}</div>
				</div>
			</template>
		</WinningTips>
		<audioVue />
	</section>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { LotteryInfo } from "@/saasLottery/components";
import { BetRule, BetSound, WinningTips } from "@/saasLottery/components";
import TimeLeft from "../../components/k33/TimeLeft.vue"
import Betting1 from "../../components/k33/Betting1.vue";
import Betting2 from "../../components/k33/Betting2.vue";
import Betting3 from "../../components/k33/Betting3.vue";
import Betting4 from "../../components/k33/Betting4.vue";
import BettingPopup from "../../components/k33/BettingPopup.vue";
import audioVue from '@/saasLottery/components/Audio/audio.vue'
import { useK3 } from "../../hooks"
 import { useGlobalContext } from '@/saasLottery/hooks';
const Record = defineAsyncComponent(() => import('../../components/k33/Record.vue'));
const Trend = defineAsyncComponent(() => import('../../components/k33/Trend.vue'));
const MyRecord = defineAsyncComponent(() => import('../../components/k33/MyRecord.vue'));
const { t } = useI18n()
const gameComponent = ref('Record');
 const { onLotteryJump } = useGlobalContext()
const currentComponent = computed(() => {
	switch (gameComponent.value) {
		case 'Record':
			return Record;
		case 'Trend':
			return Trend;
		case 'MyRecord':
			return MyRecord;
		default:
			return null;
	}
});
const {
	issue,
	onBet,
	getIssue,
	getHistoryIssues,
	changeType,
	useProvide,
	lotteryList,
	countdown,
	countdownTime,
	canBet,
	animationLock,
	lottieEl,
	numbers,
	actNav,
	same2Mult,
	same2Rate,
	numSame3,
	same3All,
	numDiff3,
	numNear3All,
	numDiff2,
	introduceLoading,
	introduceDialog,
	introduceHtml,
	bets,
	sound,
	winner,
	getIntroduce,
	onSwitchIntroduce,
	getlotteryissue,
	VoiceType,
	setVoice,
	onClearBet,
	visibilityStatus
} = useK3()
useProvide();
onMounted(async () => {
	await getlotteryissue()
	markLock.value = true
})

const navList = ref<{ name: string; comp: string }[]>([
	{ name: t('totalBet'), comp: 'Betting1' },
	{ name: t('sameNum'), comp: 'Betting2' },
	{ name: t('numbersMatch'), comp: 'Betting3' },
	{ name: t('numbersUnmatch'), comp: 'Betting4' }
])
const recordNav = ref<{ name: string; comp: string }[]>([
	{ name: t('gameRecords'), comp: 'Record' },
	{ name: t('chartTrends'), comp: 'Trend' },
	{ name: t('myGameRecords'), comp: 'MyRecord' },
])

// 玩法提示框
const showQuestion = ref(false)
const isChangeGame = ref(false)
const questionList = ref<Array<number>>([])
const questionText = ref('')
const markLock = ref(false)
const look=ref(false)
const onQuestion = ({ text, numbers }: { text: string, numbers: number[] }) => {
	showQuestion.value = true;
	questionList.value = numbers;
	questionText.value = text;
}
const isShowMark = computed(() => {
	// console.log('isShowMark========isShowMark', markLock.value)
	return countdown.value.minutes === 0 && countdown.value.seconds < 6
})
// 中將號碼
// console.log('---', lotteryList.value)
const premium = ref('')
const intv = ref<NodeJS.Timeout | null>(null)
const random = (min: number, max: number) => {
	if (min >= 0 && max > 0 && max >= min) {
		let gab = max - min + 1
		return Math.floor(Math.random() * gab + min)
	} else {
		return 0
	}
}
//开奖动画
const animationShow = (num: string) => {
	// debugger
	if (!intv.value) {
		intv.value = setInterval(function () {
			var arr = []
			for (var i = 0; 3 > i; i++) {
				arr.push(random(1, 6))
			}
			premium.value = arr.join('')
		}, 50)
	}
	setTimeout(function () {
		clearInterval(intv.value as NodeJS.Timeout)
		premium.value = num
		intv.value = null
	}, 2000)
}
watch(lotteryList, (count, prevCount) => {
	// console.log('---', count)
	premium.value = count.join('')
	if (count.length > 0 && prevCount.length > 0 && !isChangeGame.value) {
		animationShow(count.join(''))
	}
})

watch(() => visibilityStatus.value, (val) => {
	if (val) {
		getHistoryIssues()
	}
})
 // 播放音频
 const voicePlay = (action = 1) => {
        const ttsAudio: any = document.getElementById(`voice${action}`)
        if (ttsAudio) {
            ttsAudio?.play()
        }
    }
	 /*
     * 倒计时定时器
     */
	 watch(() => countdown.value.seconds, async () => {
		// console.log('countdown.value.seconds', countdown.value, countdown.value.seconds, VoiceType.value)
        if (VoiceType.value == '1' && countdown.value.minutes === 0) {
            if (countdown.value.seconds <= 5 && countdown.value.seconds > 0) {
                voicePlay(1)
            } else if (countdown.value.seconds == 0) {
                voicePlay(2)
            }
        }
    }, {
        immediate: false
    });
const changeSelectGame = async (item:any) => {
	if (look.value)return;
	try {
		look.value=true
		isChangeGame.value = true
		markLock.value = false
		clearInterval(intv.value as NodeJS.Timeout)
		intv.value = null
		onClearBet(true);
		onLotteryJump(item)
		await getlotteryissue()
		isChangeGame.value = false
		markLock.value = true
	}catch (e) {

	}finally {
		look.value=false
	}

}
</script>
<style lang="scss">
.k3_main {
	.Big {
		background: #F8B460 !important;
		// color: rgba(255, 255, 255, 0.70) !important;
		font-size: 32px !important;
		// box-shadow: 0px -4px 0px 0px #F8B460 inset;
	}

	.Odd {
		background: #F04848 !important;
		// color: rgba(255, 255, 255, 0.70) !important;

		font-size: 32px !important;
		// box-shadow: 0px -4px 0px 0px #F04848 inset;
	}

	.Small {
		background: #609DEC !important;
		// color: rgba(255, 255, 255, 0.70) !important;

		font-size: 32px !important;
		// box-shadow: 0px -4px 0px 0px #609DEC inset;
	}

	.Even {
		background: #13C164 !important;
		// color: rgba(255, 255, 255, 0.70) !important;

		font-size: 32px !important;
		// box-shadow: 0px -4px 0px 0px #08AA61 inset;
	}

	.number1 {
		background: url('@game/K3/assets/k33/AllGames/n1.png');
		background-size: cover;
	}

	.number2 {
		background: url('@game/K3/assets/k33/AllGames/n2.png');
		background-size: cover;
	}

	.number3 {
		background: url('@game/K3/assets/k33/AllGames/n3.png');
		background-size: cover;
	}

	.number4 {
		background: url('@game/K3/assets/k33/AllGames/n4.png');
		background-size: cover;
	}

	.number5 {
		background: url('@game/K3/assets/k33/AllGames/n5.png');
		background-size: cover;
	}

	.number6 {
		background: url('@game/K3/assets/k33/AllGames/n6.png');
		background-size: cover;
	}

	.number7 {
		background: url('@game/K3/assets/k31/image/numBig7.png');
		background-size: cover;
	}

	.line {
		height: 2px;
		width: 100%;
		background: #E1E3F2;
		margin: 40px 0;
	}
	.bet-rule-head{
		background: var(--main_gradient-color);
	}
}
</style>
<style lang="scss" scoped>
.k3_main {
	background: var(--bg_color_L1);
	min-height: 100vh;

	.k3_container {
		padding: 0 30px 26px 30px;
	}

	.betting {
		background-color: var(--bg_color_L2);
		padding: 32px 22px 10px;
		border-radius: 20px 20px 20px 20px;

		p {
			padding: 0 24px;
			color: #323536;
			font-size: 28px;

			span {
				color: #929292;
			}
		}

		.betTime {
			border-radius: 8px;
			border: 2px solid #CBEBD6;
			background: #E6F2EA;
			color: #07962F;
			font-size: 28px;
			text-align: center;
			padding: 10px 0;
			line-height: 1;
			margin: 28px 24px 0 24px;

			span {
				margin-left: 10px
			}
		}

	}

	.RecordNav__C {
		height: 72px;
		line-height: 72px;
		display: flex;
		justify-content: space-between;
		margin: 24px auto;

		&>div {
			width: calc((100% - 38px) / 3);
			height: 100%;
			background: var(--bg_color_L2);
			border-radius: 16px;
			font-size: 28px;
			color: var(--text_color_L2);
			text-align: center;
			overflow: hidden;

			&.active {
				background: var(--main_gradient-color,var(--main_gradient-color));
				font-weight: 600;
				color: var(--text_color_L4);
			}
		}
	}

	.betting-play {
		width: fit-content;
		/* Adjust the width as needed */
		height: 66px;
		background: #ffd5d2;
		border-radius: 0 32px 0 32px;
		color: #ef3124;
		font-size: 24px;
		padding: 0 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-size: cover;
		position: absolute;
		right: 0;
		top: 0;

		svg {
			width: 40px;
			height: 40px;
		}

		&::after {
			content: '';
			width: 28px;
			height: 28px;
			position: absolute;
			left: -28px;
			top: 0;
			background: radial-gradient(circle at 0 100%, #fff 28px, #ffd5d2 28px);
			z-index: 10;
		}

		&::before {
			content: '';
			width: 28px;
			height: 28px;
			position: absolute;
			bottom: -28px;
			right: 0;
			background: radial-gradient(circle at 0 100%, #fff 28px, #ffd5d2 28px);
			z-index: 10;
		}
	}

	.cont {
		// border-radius: 32px;
		background: var(--bg_color_L2);
		box-shadow: 0px 16px 40px 0px rgba(27, 37, 49, 0.03);
		margin-bottom: 24px;
		position: relative;
	}

	.K3B__C {
		margin: auto;
		background: var(--bg_color_L2);
		position: relative;
		margin-top: 34px;

		&-mark {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.60);
			position: absolute;
			z-index: 99;
			top: 0;
			left: 0;
			color: var(--main-color);
			border-radius: 20px;
			display: flex;
			justify-content: center;
			align-items: center;

			html:lang(ar) & {
				right: o;
				left: unset;
				direction: ltr;
			}

			&>div {
				display: inline-block;
				border-radius: 30px;
				background-color: var(--bg_color_L3);
				font-weight: 700;
				font-size: 280px;
				text-align: center;
				line-height: 360px;
				height: 360px;
				width: 230px;

				&+div {
					margin-left: 80px;
				}
			}
		}

		&-nav {
			height: 80px;
			display: flex;
			font-size: 22px;
			color: var(--text_color_L2);
			overflow: hidden;
			justify-content: space-between;

			&>div {
				line-height: 80px;
				text-align: center;
				width: calc(25% - 3px);
				background: var(--bg_color_L3);
				border-radius: 10px 10px 0 0;

				&.active {
					background: var(--main-color);
					color: var(--text_color_L4);
				}
			}
		}
	}

	&-winner {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;

		li {
			width: 32px;
			height: 32px;
		}
	}
}



.qpopup {
	overflow-y: visible;

	&-box {
		max-width: 8rem;
		padding: 60px 58px 78px;

		&-list {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20px;

			.num {
				height: 90px;
				width: 90px;
				background-color: var(--colorText-2);
				margin: 0 20px;
			}
		}

		&-txt {
			text-align: center;
			font-size: 24px;
			color: var(--text_color_L2);
		}
	}

	.close_pop {
		position: absolute;
		font-size: 60px;
		bottom: -75px;
		left: 50%;
		transform: translate(-50%, 0);
		color: #c8c9cc;
	}
}


.zhongjiang {
	position: relative;
	.winN {
		position: absolute;
		top: 8px;
		left: 20px;
		width: 50px;
		height: 50px;
		background-repeat: no-repeat;
		background-size: 50px;
		$list: 0 1 2 3 4 5 6 7 8 9;
		z-index: 100;
		opacity: 1;

		@each $i in $list {
			&.n#{$i} {
				// background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/n#{$i}.png');
				animation: moveAndResize#{$i} 2s infinite;
			}
		}
	}

	.showResult {
		display: flex;
		justify-content: center;
		align-items: center;
		animation: slide-in-bottom .6s cubic-bezier(.25, .46, .45, .94) both;

		.resultNum {
			width: 86px;
			height: 86px;
			margin: 0 16px
		}

		p {
			color: #FD565C;
			font-size: 12px;
			font-style: normal;
			font-weight: 700;
			line-height: 14px;
			margin: 0 8px
		}
	}
}

.line1 {
	height: 40px;
	width: 188px;
	margin: auto;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&>div {
		width: 40px;
		height: 40px;
		background-repeat: no-repeat;
		background-size: 40px;
		background-position: center;
	}

	$list: 1 2 3 4 5 6;

	@each $i in $list {
		.n#{$i} {
			background-image: url('@game/K3/assets/k33/AllGames/n#{$i}.png');
		}
	}
}

.line2 {
	height: 44px;
	width: 268px;
	margin: 12px auto 0;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&>div {
		height: 44px;
		line-height: 44px;
		background: #6889B1;
		border-radius: 10px;
		width: 100px;
		text-align: center;
		color: #fff;

		&.yuan {
			width: 40px;
			height: 40px;
			line-height: 40px;
			margin: 0 14px;
			border-radius: 50%;
		}
	}
}

@keyframes slide-in-bottom {
	0% {
		transform: translateY(300px);
		opacity: 0
	}

	50% {
		transform: translateY(0);
		opacity: 1
	}

	90% {
		transform: translateY(-288px);
		opacity: 1
	}

	100% {
		transform: translateY(-288px);
		opacity: 0
	}
}
</style>