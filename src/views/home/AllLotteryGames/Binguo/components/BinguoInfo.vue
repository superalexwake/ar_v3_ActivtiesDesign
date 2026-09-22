<template>
	<div class="binguo_info">
		<div class="binguo_award">
			<div v-if="isSell" class="main">
				<div class="current_award">
					<div class="tit">{{ $t('currentIssNumber') }}</div>
					<div class="current_number">{{ store.currentNumber }}</div>
				</div>

				<div class="award_time">{{ timeText }}</div>

				<div class="award_result">
					<div class="tit">{{ store.drawIssnum }}</div>
					<div class="award_type">
						<div :style="{ backgroundImage: `url(${resultImgList[0]}) ` }"></div>
						<van-icon :name="iconHomeAllLotteryGamesBinguoAdd" v-if="store.binguoType !== 2" />
						<div :style="{ backgroundImage: `url(${resultImgList[1]}) ` }"></div>
						<van-icon :name="iconHomeAllLotteryGamesBinguoAdd" v-if="store.binguoType !== 2" />
						<div :style="{ backgroundImage: `url(${resultImgList[2]})` }"></div>
					</div>
				</div>
			</div>
			<div class="over_tip" v-else>{{$t('playerEnd')}}</div>
		</div>

		<div class="trend">
			<div class="trend_result1" v-if="store.binguoType === 1">
				<div class="text">{{ $t('result') }}</div>

				<div class="result_list">
					<span class="tag" v-for="item in store.trend_result" :class="`${getDigitType(item)}_tag`">{{ item }}</span>
					<span class="tag animation_tag">-</span>
				</div>
			</div>

			<div v-else class="trend_result2">
				<div class="result_list2" v-for="item in store.trend_result2">
					<span :class="`${getDigitType(item)}_tag`" v-for="t in item">{{ t }}</span>
				</div>
				<div class="result_list2">
					<span class="animation_tag" v-for=" in 3"></span>
				</div>
			</div>
			<div class="trend_img" @click="goCount()"></div>
		</div>
	</div>
	<div id="time"></div>
</template>
<script lang="ts" setup>
import iconHomeAllLotteryGamesBinguoAdd from '@public/home/AllLotteryGames/binguo/add.png'
import { useBinguo } from '@/hooks/useBinguo.hook'

import { useRouter } from 'vue-router';

const { store, resultImgList, isSell, timeText, getGameBingo18Issue, getBingo18LastGameResult, getBingo18Last50Result } = useBinguo()

const router = useRouter()
// 实现一个方法 传入一个数字 判断小于10为小 等于10 11为和 大于11 为大
function getDigitType(digit: string | number): string {
	let num: number = 0
	if (store.value.binguoType === 1) {
		num = Number(digit)
	} else {
		num = 0
		;(digit as string).split('').forEach((a) => {
			num += Number(a)
		})
	}
	if (num < 10) {
		return 'small'
	} else if (num === 11 || num === 10) {
		return 'sum'
	} else {
		return 'big'
	}
}

const goCount = () => {
	console.log(1111)
	router.push({
		path: '/home/AllLotteryGames/BinguoCount'
	})
}


getGameBingo18Issue()
getBingo18LastGameResult()
getBingo18Last50Result()

// 启动倒计时
// startCountdown()
</script>
<style lang="scss" scoped>
.binguo_info {
	width: 100%;
	height: 200px;
	border-radius: 20px;
	background: #0d4e2f;
	margin-bottom: 20px;
	.binguo_award {
		padding-top: 20px;
		margin-bottom: 14px;

		.main {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.over_tip {
			padding-top: 20px;
			height: 94px;
			width: 100%;
			color: #f9bc36;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 24px; /* 100% */
			text-align: center;
		}
		.current_award,
		.award_result,
		.award_time {
			width: 33%;
			height: 94px;

			.tit {
				padding-top: 10px;
				color: #fff;
				font-size: 22px;
				font-style: normal;
				font-weight: 400;
				line-height: 22px; /* 100% */
				margin-bottom: 6px;
				text-align: center;
			}
			.current_number {
				color: #fff;
				font-size: 24px;
				font-style: normal;
				font-weight: 500;
				line-height: 50px; /* 100% */
				text-align: center;
			}
			.award_type {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 50px;

				div {
					width: 46px;
					height: 48px;
					background-size: cover;
					background-repeat: no-repeat;
					background-position: center;
					margin: 0 6px;
				}
			}
		}
		.award_time {
			width: 184px;
			height: 94px;
			background: url('@/assets/icons/home/AllLotteryGames/binguo/binguo_time.png') no-repeat;
			background-size: 100% 100%;
			font-family: 'digitalDreamFat', sans-serif;
			vertical-align: bottom;
			font-size: 40px;
			color: #fff;
			line-height: 112px;
			text-align: center;
			font-style: normal;
			font-weight: 400;
		}
	}
	.trend {
		height: 50px;
		padding: 0 10px;
		background-color: 0A603E;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.trend_result1 {
			width: 612px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 10px;
			background-color: #0a603e;
			height: 50px;
			.text {
				width: 88px;
				margin-left: 10px;
				color: #5dba47;
				font-size: 22px;
				font-style: normal;
				font-weight: 400;
			}
			.result_list {
				display: flex;
				align-items: center;
				width: 100%;
				height: 32px;
				.tag {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 32px;
					height: 32px;
					margin-left: 5px;
					text-align: center;
					border-radius: 10px;
					font-size: 22px;
					font-style: normal;
					font-weight: 400;
				}
			}
		}

		.trend_result2 {
			width: 612px;
			display: flex;
			align-items: center;
			height: 50px;
			.result_list2 {
				width: 120px;
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #0a603e;
				border-radius: 50px;
				span {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 32px;
					height: 32px;
					margin: 0 1px;
					text-align: center;
					border-radius: 50%;
					font-size: 22px;
					font-style: normal;
					font-weight: 400;
				}
			}
		}
		.trend_img {
			width: 48px;
			height: 48px;
			background: url('@/assets/icons/home/AllLotteryGames/binguo/count_icon.png') no-repeat center center;
			background-size: 100% 100%;
		}
	}
}
.small_tag {
	color: #0b462a;
	background: #fff;
}
.big_tag {
	color: #fff;
	background: #0b462a;
}
.sum_tag {
	color: #0b462a;
	background: #f9bc36;
}
.animation_tag {
	border: 1px solid #87c7af;
	color: #87c7af;
	animation: opacityEl 2s infinite;
}

@keyframes opacityEl {
	0% {
		opacity: 0.3;
	}
	50% {
		opacity: 1;
	}
	100% {
		opacity: 0.3;
	}
}
</style>
