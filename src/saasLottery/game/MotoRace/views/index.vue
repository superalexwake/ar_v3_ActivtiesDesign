<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCar } from '../hooks/useCar'
import ResultItem from '../components/ResultItem.vue'
import Betting from '../components/Betting.vue'
import { useMotorcycle } from '../hooks/useMotorcycle'
import { provide } from 'vue'
import { useGlobalContext } from '@/saasLottery/hooks'
import { Winning3 } from '@/saasLottery/components'
import { useSound } from '../hooks/useSound'
import router from "@/router";
import LoadingMoto from '../components/Loading.vue'
import Header_Svg from '../assets/images/header_bg.svg'
import { useI18n } from 'vue-i18n'

const {t,locale} = useI18n()
const num_tabs = ref([1, 2, 3])
const progress= ref(0)
// const totalPage = ref(0)
const showMore = ref(false)
const loading = ref(false)
const { getWebData, getGameInfo,currentGame } = useGlobalContext()
const MotorcycleHook = useMotorcycle()
provide('MotorcycleHook', MotorcycleHook)
const {
	getIssue,
	currentTab,
	numbers,
	onBet,
	useProvide,
	bigSmallData,
	oddEvenData,
	handleBet,
	countdown,
	getHistoryIssues,
	winner,
	prevHistory,
	nextHistory,
	hisPageInfo,
	hisRecord,
	getRecord,
	pageInfo,
	nextPage,
	prevPage,
	myRecord,
} = MotorcycleHook
useProvide()
const { containerInit, gameContainer, loadAssets } = useCar(MotorcycleHook)
const {handleMute, isMuted} = useSound()
onMounted(async () => {
	loading.value = true
	await Promise.all([getIssue(true), getWebData(), getGameInfo()])
	getRecord()
	await getHistoryIssues(true)
	await loadAssets((prs) => {
			progress.value = prs
		}
	).then(async () => {
		await containerInit()
		setTimeout(() => {
			loading.value = false
		}, 300)
	})
	
	// init()
})

const time40 = computed(() => {
	let aa = countdown.value.seconds - 23
	if (aa< 10) {
		if (aa > 0 ){
			return '0' + aa
		} else {
			return '37'
		}
	} else {
		return aa + ''
	}
})


const backGo = () => {
	router.go(-1)
	sessionStorage.setItem('clickedGameType', 'lottery')
	// router.push({path:'/'})
}

watch(
	() => countdown.value.seconds,
	(val) => {
		if (val === 5) {
			getRecord()
		}
	}
)
// Add this watch to toggle body scroll lock
watch(
	() => showMore.value,
	(isShown) => {
		if (isShown) {
			document.body.classList.add('scroll-lock')
		} else {
			document.body.classList.remove('scroll-lock')
		}
	}
)

watch(
  () => currentTab.value,
  () => {
    const balls = document.querySelector('.number-balls') as HTMLElement
    if (balls) {
      balls.classList.remove('balls1', 'balls2', 'balls3')
      void balls.offsetWidth // 触发重绘以重新应用动画
      balls.classList.add(`balls${currentTab.value}`)
    }
  }
)

const getMoto2Text = (locale: string, currentTab: number, translate: Function) => {
	const suffix = currentTab === 1 ? '1st' : currentTab === 2 ? '2nd' : '3rd';
	return locale === 'en' ? translate('moto2', [suffix]) : translate('moto2', [`${currentTab}`]);
};

</script>

<template>
	<div class="motuo">
		<NavBar left-arrow @click-left="backGo" :title="currentGame?.gameName || 'MotoRace'" class="main" >

		</NavBar>
		<div class="game_canvas">
			<div class="loading_bg" v-if="loading"></div>
			<div id="game-container" ref="gameContainer"></div>
			<div class="sound_icon" :class="{mute_icon: isMuted}" @click="handleMute" />
			<div class="game_header" v-if="countdown.seconds > 23 || countdown.seconds === 0">
				<!-- <div class="issue">{{ issue }}</div> -->
				<div class="countDown">
					<div class="txt">{{$t('timeLeftToBuy')}}</div>
					<div class="time_num">
						<div :class="'t_' + 0"></div>
						<div :class="'t_' + 0"></div>
						<span>:</span>
						<div :class="'t_' + time40[0]"></div>
						<div :class="'t_' + time40[1]"></div>
					</div>
				</div>
			</div>
			<div @click="showMore = !showMore" class="more_box">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="more_btn"
					:class="{ rote_more: showMore }"
					viewBox="0 0 17 12"
					fill="none"
				>
					<path d="M8.5 12L0.272759 0.749998L16.7272 0.75L8.5 12Z" fill="#DBEAFF" />
				</svg>
			</div>

		</div>

		<div class="historyIssues" v-if="showMore">
			<div class="mask" @click.stop="showMore = !showMore"></div>
			<div class="historyIssues_wrap">
				<div class="title">{{$t('bet')}}</div>
				<div v-if="hisRecord.length" class="his_list">
					<div class="his_tit">
						<div>{{$t('issueMay')}}</div>
						<div>
							<span>1st</span>
							<span>2nd</span>
							<span>3rd</span>
						</div>
						<div>{{$t('resultMay')}}</div>
					</div>
					<div class="his_item" v-for="item in hisRecord">
						<div class="item_issue">**{{ (item.issueNumber + '').slice(-6) }}</div>
						<div class="item_123">
							<span v-for="n in item.premium.split(',').slice(0, 3)" :class="['result_n', 'n_' + n]"></span>
						</div>
						<div class="item_result">
							<span v-for="n in item.premium.split(',').slice(3, 10)" :class="['result_n', 'n_' + n]"></span>
						</div>
					</div>
				</div>
				<div class="his_foot">
					<div class="my_r-foot">
						<div class="my_r-foot-previous" :class="{ disabled: hisPageInfo.pageNo <= 1 }" @click="prevHistory">
							<van-icon name="arrow-left" class="my_r-icon" size="20" />
						</div>
						<div class="my_r-foot-page">{{ hisPageInfo.pageNo }}/{{ hisPageInfo.totalPage }}</div>
						<div class="my_r-foot-next" :class="{ disabled: hisPageInfo.pageNo >= hisPageInfo.totalPage }" @click="nextHistory">
							<van-icon name="arrow" class="my_r-icon" size="20" />
						</div>
					</div>
				</div>
			</div>
		</div>

		
		<!-- // 下注区域 -->
		<div class="betting-area">
			<div class="betting-container">
				<!-- Header -->
				<div class="header">
					<Header_Svg class="head_bg" />
					<div class="moto_bg"></div>
					<div class="header-content">
						<h1>{{$t('moto1')}}</h1>
						<!--						<img src="/placeholder.svg?height=80&width=120" alt="Motorcycle" class="motorcycle-image" />-->
					</div>
				</div>

				<!-- Main Content -->
				<div class="main-content">
					<!-- Number Selection Tabs -->
					<div class="number-tabs">
						<div
							class="tab_item"
							v-for="num in num_tabs"
							:key="num"
							@click="currentTab = num"
							:class="{ active: currentTab === num, bottom_bg: currentTab === num }"
						>
							{{ num }}{{num == 1? 'st' : (num == 2 ? 'nd' : 'rd')}} Number
						</div>
					</div>
					<p class="selection-instruction">
						{{getMoto2Text(locale, currentTab, $t)}}
						<span class="number_b">({{$t('odds')}} {{ numbers[0]?.playRate || '--' }}X)</span>
					</p>

					<!-- Number Balls -->
					<div class="number-balls" :class="`balls${currentTab}`">
						<div
							class="number"
							v-for="(n, index) in numbers"
							:key="index"
							@click="onBet(n)"
							:class="'ball_' + (index + 1)"
						></div>
					</div>

					<!-- Odd or Even Section -->
					<div class="betting-section">
						<div class="title_1 bottom_bg">{{ $t('moto3') }}</div>
						<p class="selection-instruction">{{ $t('moto4') }}</p>
						<div class="betting-grid">
							<div v-for="(position, index) in oddEvenData" :key="position.label" class="betting-row">
								<span class="position-label">{{ index + 1 }}{{index == 0? 'st' : (index == 1 ? 'nd' : 'rd')}}</span>
								<div class="odd" @click="handleBet('Odd', index)">
									<span>{{ $t('betOdd') }}</span>
									<span>{{ position?.playRate1 }}X</span>
								</div>
								<div class="even" @click="handleBet('Even', index)">
									<span>{{$t('betEven')}}</span>
									<span>{{ position?.playRate2 }}X</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Big or Small Section -->
					<div class="betting-section">
						<div class="title_1 bottom_bg">{{$t('moto5')}}</div>
						<p class="selection-instruction">{{$t('moto6')}}</p>
						<div class="betting-grid">
							<div v-for="(position, index) in bigSmallData" :key="position.label" class="betting-row">
								<span class="position-label">{{ index + 1 }}{{index == 0? 'st' : (index == 1 ? 'nd' : 'rd')}}</span>
								<div class="odd" @click="handleBet('Big', index)">
									<span>{{$t('big')}}</span>
									<span>{{ position?.playRate1 }}X</span>
								</div>
								<div class="even" @click="handleBet('Small', index)">
									<span>{{$t('small')}}</span>
									<span>{{ position?.playRate2 }}X</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- // 历史记录 -->
		<div class="record_container">
			<div class="header">
				<Header_Svg class="head_bg" />
				<div class="moto_bg"></div>
				<div class="header-content">
					<h1>{{$t('myRecord')}}</h1>
				</div>
			</div>

			<div class="results-list">
				<div v-if="!myRecord.length && !loading" class="no_data">
					<img src="../assets/images/no_data.png" alt="no_data" />
					<div>{{$t('noData')}}</div>
				</div>
				<ResultItem v-else v-for="item in myRecord" :key="item?.orderNo" :info="item" />
			</div>

			<div v-if="myRecord.length" class="my_r-foot">
				<div class="my_r-foot-previous" :class="{ disabled: pageInfo.pageNo <= 1 }" @click="prevPage">
					<van-icon name="arrow-left" class="my_r-icon" size="20" />
				</div>
				<div class="my_r-foot-page">{{ pageInfo.pageNo }}/{{ pageInfo.totalPage }}</div>
				<div class="my_r-foot-next" :class="{ disabled: pageInfo.pageNo >= pageInfo.totalPage }" @click="nextPage">
					<van-icon name="arrow" class="my_r-icon" size="20" />
				</div>
			</div>
		</div>
		<Betting />
		<Winning3 ref="winner">
			<template #result="{ data }">
				<div class="win_item" :class="{'noWin': !data.isWin}" v-for="(item, index) in data.result.premium.split(',').slice(0, 3)">
					<div class="rk">{{ index + 1 }}{{index == 0? 'st' : (index == 1 ? 'nd' : 'rd')}}</div>
					<div class="win_ball" :class="'ball_' + item"></div>
					<div class="bs_oe">{{ Number(item) > 5 ? t('betBig') : t('betSmall') }}</div>
					<div class="bs_oe oe">{{ Number(item) % 2 == 0 ? t('betEven') : t('betOdd') }}</div>
				</div>
			</template>
		</Winning3>

	</div>
	<LoadingMoto v-if="loading" :progress="progress" />
</template>

<style scoped lang="scss">
:global(.scroll-lock) {
	overflow: hidden;
	height: 100%;
	width: 100%;
	position: fixed;
}
#game-container {
	position: relative;
	width: 100%;
	height: 484px;
	z-index: 1;
	overflow: hidden;
}
canvas {
	image-rendering: pixelated; /* 像素渲染，适合像素风格游戏 */
	image-rendering: crisp-edges; /* 保持边缘清晰 */
}
.motuo {
	background: var(--bg_color_L1, #f6f6f6);
	position: relative;
	overflow: hidden;
	::v-deep(.navbar.main .navbar-fixed) {
		background: var(--bg_color_L2);
		.navbar__content-left .van-icon {
			color: var(--text_color_L1);
		}
		.navbar__content-center {
			color: var(--text_color_L1);
		}
	}
	.game_canvas {
		width: 100%;
		position: relative;
		z-index: 1;
		.loading_bg {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 6;
			width: 100%;
			height: 484px;
			background: url('../assets/images/game_bg.png') no-repeat center center;
			background-size: cover;
		}
		.game_header {
			width: 100%;
			position: absolute;
			display: flex;
			align-items: center;
			top: 0;
			left: 0;
			z-index: 3;
			.issue {
				margin-top: 28px;
				margin-left: 26px;
				font-size: 24px;
				font-weight: 500;
				line-height: 24px; /* 100% */
				background: linear-gradient(180deg, #fff 29.71%, #aac9ff 100%);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}
			.countDown {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				z-index: 4;
				width: 210px;
				height: 78px;
				background: url('../assets/images/time_bg.png') no-repeat left center;
				background-size: 100% 100%;
				text-align: center;
				font-size: 28px;
				font-weight: 400;
				line-height: 36px; /* 128.571% */
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.txt {
					color: #f5faff;
					font-size: 24px;
					font-weight: 400;
					line-height: 24px; /* 100% */
				}
				.time_num {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 2px;
					div {
						width: 23px;
						height: 36px;
						background-size: 20px 32px;
						background-repeat: no-repeat;
						background-position: center;
					}
					$times: 9;
					@for $i from 0 through $times {
						.t_#{$i} {
							background-image: url('../assets/images/t_#{$i}.png');
						}
					}
					span {
						color: #ff4a4a;
						font-size: 28px;
						font-weight: 400;
						line-height: 36px; /* 128.571% */
					}
				}
			}
		}
		.more_box {
			width: 100%;
			height: 80px;
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 5;
			.more_btn {
				position: absolute;
				right: 26px;
				bottom: 30px;
				width: 20px;
				height: 15px;
				z-index: 6;

			}
		}

		.rote_more {
			transform: rotate(180deg);
		}
		.sound_icon {
			width: 32px;
			height: 32px;
			background: url('../assets/images/sound.png') no-repeat center;
			background-size: 100% 100%;
			position: absolute;
			top: 26px;
			right: 26px;
			z-index: 5;
		}
		.mute_icon {
			background: url('../assets/images/mute.png') no-repeat center;
			background-size: 100% 100%;
		}
	}
}
.historyIssues {
	position: fixed;
	top: 575px;
	left: 50%;
	width: 750px;
	height: calc(100vh - 484px);
	z-index: 3;
	transform: translateX(-50%);

	.mask {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
	.historyIssues_wrap {
		position: relative;
		z-index: 3;
		width: 698px;
		height:  600px;
		overflow-y: scroll;
		border-radius: 0px 0px 16px 16px;
		margin: auto;

		.title {
			background: var(--Secondary_moto_Color8);
			height: 88px;
			color: var(--text_color_L2);
			font-size: 28px;
			font-weight: 500;
			line-height: 88px; /* 114.286% */
			text-align: center;
		}

		.his_list {
			background:var(--bg_color_L3);
			padding: 0 20px;

			.his_item {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 66px;

				div {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
				}

				div:nth-child(1) {
					color: var(--text_color_L1, #04060a);
					font-size: 28px;
					font-weight: 400;
					line-height: 40px; /* 142.857% */
					width: 205px;
					margin-right: 37px;
					text-align: center;
					justify-content: center;
				}

				.result_n {
					width: 32px;
					height: 32px;
					background-size: 100%;
					background-position: left;
					background-repeat: no-repeat;
				}

				div:nth-child(2) {
					width: 136px;
					margin-right: 17px;
				}

				div:nth-child(3) {
					width: 260px;
				}

				$balls: 10;
				@for $i from 1 through $balls {
					.n_#{$i} {
						background-image: url('../assets/images/n_#{$i}.png');
					}
				}
			}

			.his_item:nth-child(even) {
				background: var(--bg_color_L3);
			}

			.his_tit {
				width: 100%;
				height: 66px;
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #646c7b;
				font-size: 24px;
				font-weight: 500;
				line-height: 66px;

				div:nth-child(1) {
					width: 205px;
					margin-right: 37px;
					text-align: center;
				}

				div:nth-child(2) {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					width: 136px;
					margin-right: 17px;

					span {
						width: 34px;
					}
				}

				div:nth-child(3) {
					width: 260px;
					text-align: center;
				}
			}
		}

		.his_foot {
			border-top: 1px solid var(--Dividing-line_color);
			border-radius: 0px 0px 16px 16px;
			background: var(--bg_color_L2, #fff);
			.my_r-foot {
				&-previous,
				&-next {
					&.disabled {
						background: var(--Secondary_moto_Color8);
						pointer-events: none;
						.my_r-icon {
							color: #646C7B;
						}
					}
				}
			}
		}
	}
}
.betting-area {
	width: 698px;
	margin: 0 auto;
	padding-top: 44px;
}

.betting-container {
	border-radius: 24px;
	background: var(--bg_color_L2);
	// overflow: hidden;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	position: relative;
}

.header {
	background-color: var(--Secondary_moto_Color9);
	
	height: 128px;
	position: relative;
	border-radius: 32px 32px 0 0;
	z-index: 1;
	// background-image: url('../assets/images/header_bg.png');
	// background-repeat: no-repeat;
	// background-position: left center;
	// background-size: 100% 100%;
	.moto_bg {
		position: absolute;
		right: -8px;
		top: -35px;
		width: 177px;
		height: 107px;
		background: url('../assets/images/moto_bg.png') no-repeat center;
		background-size: 100% 100%;
	}
	.head_bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 128px;
		z-index: 2;
	}
}

.header-content {
	position: relative;
	padding: 32px 24px 48px;
	z-index: 3;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: var(--text_color_L4);
}

.header h1 {
	font-size: 36px;
	font-weight: bold;
	margin: 0;
}

.motorcycle-image {
	width: 120px;
	height: 80px;
	object-fit: contain;
}

.main-content {
	background: var(--bg_color_L2, #fff);
	border-radius: 24px;
	margin-top: -24px;
	padding: 24px;
	position: relative;
	z-index: 2;
}

.number-tabs {
	display: flex;
	gap: 36px;
	margin-bottom: 8px;
	.tab_item {
		font-size: 32px;
		font-weight: bold;
		color: var(--text_color_L2);
		line-height: 32px;
	}
	.active {
		color: var(--text_color_L1);
		position: relative;
	}
}

.selection-instruction {
	color: var(--text_color_L2);
	margin-bottom: 24px;
	font-size: 24px;
	span {
		color: var(--norm_red-color);
		font-size: 24px;
		font-weight: 600;
	}
}

.number-balls {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 16px;
	margin-bottom: 32px;
	.number {
		width: 110px;
		height: 110px;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}
	$balls: 10;
	@for $i from 1 through $balls {
		.ball_#{$i} {
			background-image: url('../assets/images/ball_#{$i}.png');
		}
	}
	&.balls1, &.balls2, &.balls3 {
		animation: alternate 0.5s 1 ballsScale;
	}
}


@keyframes ballsScale {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(0.9);
	}
	100% {
		transform: scale(1);
	}
}

.betting-section {
	margin-bottom: 40px;
	.title_1 {
		color: var(--text_color_L1);
		font-size: 32px;
		font-weight: bold;
		line-height: 32px; /* 100% */
		display: inline-block;
		position: relative;
		margin-bottom: 8px;
	}
}

.betting-grid {
	display: grid;
	gap: 24px;
}

.betting-row {
	display: grid;
	grid-template-columns: 50px 1fr 1fr;
	gap: 26px;
	align-items: center;
	span {
		color: var(--text_color_L1);
		font-size: 28px;
		font-weight: bold;
	}
	div {
		height: 80px;
		border-radius: 16px;
		background: var(--Secondary_moto_Color8);
		box-shadow: 0px 4px 0px 0px var(--Secondary_moto_Color8);
		text-align: center;
		color: var(--text_color_L3);
		font-size: 32px;
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		span {
			color: var(--text_color_L2);
			font-weight: bold;
		}
		span:nth-child(2) {
			font-size: 24px;
			font-weight: 400;
			opacity: 0.7;
		}
	}
	div::after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		width: 145px;
		height: 80px;
		background: url('../assets/images/btn_bg.png') no-repeat center;
		background-size: 100% 100%;
		z-index: 2;
	}
}

.betting-section:last-child {
	margin-bottom: 16px;
}

.position-label {
	font-weight: bold;
	font-size: 20px;
}

.bottom_bg::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4px;
	opacity: 0.5;
	background: var(--Secondary_red_color);
}

.record_container {
	width: 698px;
	margin: 48px auto;
	background: var(--bg_color_L2);
	border-radius: 24px 24px 12px 12px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
}

.results-list {
	border-radius: 36px 36px 12px 12px;
	margin-top: -24px;
	position: relative;
	min-height: 456px;
	z-index: 3;
	background-color: var(--bg_color_L2);
	.no_data {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 456px;
		img {
			width: 385px;
			height: 296px;
			margin-bottom: 20px;
		}
		div {
			color: var(--text_color_L2);
			font-size: 28px;
			font-weight: 400;
			line-height: 36px;
			text-align: center;
		}
	}
}

.my_r-foot {
	width: 342px;
	height: 92px;
	padding: 16px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;

	&-page {
		font-size: 24px;
		color: var(--text_color_L2);
	}

	&-previous,
	&-next {
		width: 70px;
		height: 70px;
		border-radius: 10px;
		background: var(--main-color);
		display: flex;
		align-items: center;
		justify-content: center;

		&.disabled {
			background: var(--Secondary_moto_Color8);
			pointer-events: none;

			.my_r-icon {
				color: #646C7B;
			}
		}
		.my_r-icon {
			color: #fff;
		}
	}
}

.win_item {
	margin-bottom: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	.rk {
		color: #f9561b;
		line-height: normal;
		font-size: 24px;
		font-weight: 500;
	}
	.win_ball {
		width: 64px;
		height: 64px;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}
	$balls: 10;
	@for $i from 1 through $balls {
		.ball_#{$i} {
			background-image: url('../assets/images/ball_#{$i}.png');
		}
	}

	.bs_oe {
		width: 140px;
		height: 60px;
		text-align: center;
		color: #fff;
		font-size: 32px;
		line-height: 60px;
		font-weight: 500;
		border-radius: 8px;
		background: linear-gradient(180deg, #ff9350 0%, #f9561b 100%);
		box-shadow: 0px 2px 0px 0px #ca4b1c;
	}
	.oe {
		border-radius: 8px;
		background: linear-gradient(180deg, #59c896 0%, #13ac66 100%);
		box-shadow: 0px 2px 0px 0px #0d804c;
	}
}

.noWin {
	.rk {
		color: #768CA6;
	}
	.bs_oe, .oe {
		border-radius: 8px;
		background: linear-gradient(180deg, #A5C2E4 0%, #7194C7 100%);
		box-shadow: 0px 2px 0px 0px #5275A0;
	}
}

.win_item:first-child {
	margin-top: 0;
}
</style>
