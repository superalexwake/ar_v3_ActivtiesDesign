<template>
	<div class="K3__C">
		<NavBar
			left-arrow
			@click-left="backGo"
			class="main"
			:headLogo="true"
		>
			<template #right>
				<div class="K3__C-head-more">
					<div @click="goPath('CustomerService')"></div>
					<div :class="{ disableVoice: VoiceType == '2' }" @click="setVoice"></div>
				</div>
			</template>
		</NavBar>
		<!-- 钱包余额 -->
		<Wallte ref="WallteRef" />
		<noTiceBar :siteMsg="sitemsg" key="k3" />
		<!-- 游戏类型 -->
		<GameList :gameList="gameList" :currentGameIndex="currentGameIndex" @changeGame="changeGame" />
		<!-- 游戏开始时间倒计时 -->
		<TimeLeft :currentInfo="currentInfo" :premium="premium" :currentGame="currentGame" />
		<!-- 投注表 -->
		<Betting
			:currentInfo="currentInfo"
			:currentGame="currentGame"
			:VoiceType="VoiceType"
			:typeid="typeid"
			@betting="addBetting"
			@changeBettingP="changeBettingP"
		/>
		<!-- 记录导航 -->
		<RecordNav :record="gameComponent" @changeC="(component) => (gameComponent = component)" />
		<!-- 动态展示对应的组件 -->
		<KeepAlive>
			<component
				ref="RecordComponent"
				:is="GameRecordList[gameComponent]"
				:typeid="typeid"
				:ApiFun="winTxrGetMyEmerdList"
				:listApi="getK3NoaverageEmerdList"
				:EmerdApi="winTxrGetEmerdList"
				goPathName="AllLotteryGames-BettingRecordK3"
			/>
		</KeepAlive>
		<!-- 弹窗组件 -->
		<Dialog :show="showDialog" @confirm="goPath('/login')">
			<template #content>
				<div>{{ dialogText }}</div>
			</template>
		</Dialog>
		<!-- 中奖提示组件 -->
		<WinningTips ref="WinningTipsRef" />
		<ChangLong v-if="showChanglong" />
		<audioVue />
	</div>
</template>

<script setup lang="ts">
import Wallte from '@/components/Home/AllLotteryGames/WinGo/Wallet.vue'
import GameList from '@/components/Home/AllLotteryGames/WinGo/GameList.vue'
import TimeLeft from '@/components/Home/AllLotteryGames/K3/TimeLeft.vue'
import Betting from '@/components/Home/AllLotteryGames/K3/Betting.vue'
import RecordNav from '@/components/Home/AllLotteryGames/WinGo/RecordNav.vue'
import GameRecord from '@/components/Home/AllLotteryGames/K3/GameRecord.vue'
import Trend from '@/components/Home/AllLotteryGames/K3/Trend.vue'
import noTiceBar from '@/components/Home/NoticeBar/index.vue'
import MyGameRecord from '@/components/Home/AllLotteryGames/K3/MyGameRecord.vue'
import WinningTips from '@/components/Home/AllLotteryGames/K3/WinningTips.vue'
import ChangLong from '@/components/common/ChangLong.vue'
import Dialog from '@/components/common/Dialog.vue'
import audioVue from '@/components/Home/AllLotteryGames/WinGo/audio.vue'
import {ref, onMounted, computed, nextTick, onBeforeUnmount, watch, reactive} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
	winTxrGetMyEmerdList,
	getK3NoaverageEmerdList,
	winTxrGetEmerdList,
	getGameK3Issue,
	getK3OneEmerd,
	getK3TheLotteryResult
} from '@/api'
import { AwaitApiResult, AwaitWrap } from '@/utils'
import type { K3, MessageDataList } from '@/types/api'
import { GlobalStore, LorreryStore, SettingStore } from '@/stores'

/*****************变量 *****************/
// 动态组件
const GameRecordList = {
	GameRecord,
	Trend,
	MyGameRecord
}
// 动态组件ref
const RecordComponent = ref()
// 中奖组件
const WinningTipsRef = ref()
// 錢包組件
const WallteRef = ref()
// 投注组件是否展示投注界面
const BettingPS = ref(false)
// 动态组件展示
const gameComponent = ref('GameRecord')
// 路由
const router = useRouter()
// 彩票状态
const lottery = LorreryStore()
// 游戏列表 -后端返回
let gameList = reactive<any[]>([]);
// 当前选中游戏的index
const currentGameIndex = ref(0)
// 开关音频变量
const VoiceType = ref(localStorage.getItem('volumeShow') || '1')
// 是否展示弹窗
const showDialog = ref(false)
// 公告消息
const sitemsg = ref<MessageDataList[]>([])
// 倒数定时器
const timeHandle = ref<NodeJS.Timeout | null>(null)
// 选中游戏详情
const currentInfo = ref<{
	gameNo: string
	currentTime: string
	beginTime: string
	passTime: number
	time1: number
	time2: number
	time3: number
	time4: number
}>({
	gameNo: 'loading',
	currentTime: '',
	beginTime: '',
	passTime: 180,
	time1: 0,
	time2: 0,
	time3: 0,
	time4: 0
})
// 中將號碼
const premium = ref('666')
// 倒计时，多少秒
const ProhibitBuyTime = ref(5)
// 弹窗文案
const dialogText = ref('')
// 投注弹窗
const bettingDialog = ref(false)
// 游戏类型
const typeid = ref<any>(null)
const currentGame = computed(() => lottery.k3[currentGameIndex.value] || {})

// 是否展示长龙
const settingS = SettingStore()
const showChanglong = computed(() => settingS.getIsShowLotteryDragon)
const route=useRoute()
const type_Id=route.query.typeId;
/*****************生命周期 *****************/

onMounted(() => {
	getGameList()
})

onBeforeUnmount(() => {
	clearInterval(timeHandle.value as NodeJS.Timeout)
	clearInterval(intv.value as NodeJS.Timeout)
	tiemOutList.value.forEach((item: NodeJS.Timeout) => {
		clearInterval(item as NodeJS.Timeout)
	})
	setTime.value && clearTimeout(setTime.value)
})

watch(
	() => GlobalStore().visibility,
	(newVal) => {
		if (newVal === 0) {
			clearInterval(timeHandle.value as NodeJS.Timeout)
		} else {
			getGameList(currentGameIndex.value)
		}
	}
)
/*****************方法 *****************/


const backGo=()=>{
	router.go(-1);
	sessionStorage.setItem('clickedGameType','lottery');
	// router.push({path:'/'})
}

// 开启、关闭音频
const setVoice = () => {
	VoiceType.value == '1' ? (VoiceType.value = '2') : (VoiceType.value = '1')
	localStorage.setItem('volumeShow', VoiceType.value)
}

// 跳转路由
const goPath = (name: string) => {
	router.push({ name })
}

// 获取游戏列表
const getGameList = async (currentGameIndex:any = null) => {
	await lottery.getK3Data()
	gameList = lottery.getK3
	const index=gameList.findIndex((item:any)=>item.typeID==type_Id);
	if (typeid.value == null&&!type_Id) {
		changeGame(0)
	}else {
		changeGame(currentGameIndex != null ? currentGameIndex : index)
	}
}
// 獲取上一期開獎結果
const getlastOneEmerd = async (typeId: number, animation: boolean = false) => {
	const res = await AwaitApiResult<ObjResNull<K3.resGetK3OneEmerd>>(getK3OneEmerd({ typeId }))
	if (res) {
		premium.value = res.data.premium
		if (animation) animationShow(premium.value)
	}
}
// 切换游戏
const changeGame = (index: number) => {
	lottery.getK3Data()
	currentGameIndex.value = index
	typeid.value = gameList[index].typeID
	getGameIssue(typeid.value)
	nextTick(() => {
		RecordComponent.value.getData(typeid.value)
	})
}

// 获取当前游戏期号
const getGameIssue = async (typeId: any, animation: boolean = false) => {
	getlastOneEmerd(typeId, animation)
	const [err, res] = await AwaitWrap<any>(getGameK3Issue({ typeId }))
	currentInfo.value.gameNo = res.issueNumber
	currentInfo.value.currentTime = res.serviceTime.replace(/-/g, '/')
	currentInfo.value.beginTime = res.startTime.replace(/-/g, '/')
	passTime()
}

// 过期时间处理
const passTime = () => {
	if (!gameList.length) {
		return
	}
	var currentTime = new Date(currentInfo.value.currentTime).getTime()
	var beginTime = new Date(currentInfo.value.beginTime).getTime()
	let gameTime = (currentTime - beginTime) / 1000 //游戏时间 = 服务器时间-游戏开始时间 如果大于
	let currentGame = gameList[currentGameIndex.value]
	if (gameTime > currentGame.intervalM * 60) {
		gameTime = currentGame.intervalM * 60
	}
	currentInfo.value.passTime = currentGame.intervalM * 60 - gameTime //游戏剩余的时间，秒
	if (currentInfo.value.passTime < 0) {
		dialogText.value =
			'An error occurred, please contact customer service。' +
			'The game time is ' +
			currentGame.intervalM +
			' minutes,' +
			'start time is ' +
			currentInfo.value.beginTime +
			',current time is' +
			currentInfo.value.currentTime +
			'!'
		showDialog.value = true
		return
	}
	timeOutSubTime()
}
// 倒计时定时器
const timeOutSubTime = () => {
	clearInterval(timeHandle.value as NodeJS.Timeout)
	subTime(false)
	timeHandle.value = setInterval(function () {
		subTime()
	}, 1000)
}
// 每秒钟处理倒计时
const subTime = (reload = true) => {
	if (currentInfo.value.passTime <= ProhibitBuyTime.value) {
		bettingDialog.value = false
	}
	if (VoiceType.value == '1') {
		if (currentInfo.value.passTime <= ProhibitBuyTime.value && currentInfo.value.passTime > 1) {
			voicePlay(1)
		} else if (currentInfo.value.passTime == 1) {
			voicePlay(2)
		}
	}
	if (currentInfo.value.passTime > 0) {
		let subTime = currentInfo.value.passTime
		currentInfo.value.time2 = Math.floor(subTime / 60)
		currentInfo.value.time3 = Math.floor((subTime % 60) / 10)
		currentInfo.value.time4 = Math.floor(subTime % 10)
		currentInfo.value.passTime--
	} else {
		clearInterval(timeHandle.value as NodeJS.Timeout)
		if (reload) {
			reLoadAmonut()
		}
	}
}
// 播放音频
const voicePlay = (action = 1) => {
	const ttsAudio: any = document.getElementById(`voice${action}`)
	if (ttsAudio) {
		ttsAudio.play()
	}
}
// 重新加载钱包
const reLoadAmonut = () => {
	getGameIssue(typeid.value, true) //期号
	WallteRef.value.getWinsUserAmount(false)
	RecordComponent.value.getData(true)
}

const intv = ref<NodeJS.Timeout | null>(null)
// 随机数字
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
// 投注監視定時器Obj
const checkObj = ref<Object>({})
const tiemOutList = ref<any>([])
// 缓存投注记录
const addBetting = (issuenumber: string) => {
	WallteRef.value.getWinsUserAmount(false)
	RecordComponent.value.getData()
	if (checkObj.value[issuenumber]) return
	checkObj.value[issuenumber] = true
	const { time1, time2, time3, time4 } = currentInfo.value
	const outTime = (time1 * 10 * 60 + time2 * 60 + time3 * 10 + time4) * 1000
	tiemOutList.value[currentGame.value.intervalM] = setTimeout(() => {
		checkWinTheLottery(issuenumber)
	}, outTime)
}

// 设置
const changeBettingP = (value: boolean) => {
	BettingPS.value = value
}

const setTime = ref<any>(null)
// 查询 中奖记录
const checkWinTheLottery = async (issueNumber: string) => {
	const res = await AwaitApiResult<ObjResNull<K3.resGetK3TheLotteryResult>>(getK3TheLotteryResult({ issueNumber }))
	if (res) {
		const isLottery = res.data.state != 2
		if (!isLottery) {
			setTime.value = setTimeout(() => {
				checkWinTheLottery(issueNumber)
			}, 2000)
			return
		}
		WinningTipsRef.value.showMark(res.data)
		delete checkObj.value[issueNumber]
	}
}
</script>

<style lang="scss" scoped>
.K3__C {
	padding-bottom: 26px;

	&-head {
		height: 94px;
		background: linear-gradient(90deg, #de2325 0%, #ff504a 100%);
		padding: 0 26px;
		position: relative;

		div {
			background-repeat: no-repeat;
			background-position: center;
		}

		&-bcak {
			position: absolute;
			width: 48px;
			height: 48px;
			background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/bcakIcon.png');
			background-size: 48px;
			left: 26px;
			top: 50%;
			transform: translateY(-50%);
		}

		&-logo {
			background: url('@/assets/icons/home/AllLotteryGames/WinGo/headlogo.png');
			background-size: 224px 84px;
			height: 84px;
			width: 224px;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%) translateY(-50%);
		}

		&-more {
			position: absolute;
			width: 116px;
			height: 48px;
			right: 26px;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			justify-content: space-between;

			& > div {
				width: 48px;
				height: 48px;
				background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/kefu.png');
				background-size: 48px;

				&:last-child {
					background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/voice.png');

					&.disableVoice {
						background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/voice-off.png');
					}
				}
			}
		}
	}

	:deep(.noticeBar__container) {
		width: calc(100% - 52px)!important;
		margin: 34px auto;
		position: relative;
		z-index: 1;
		top: 0;
	}
}
</style>
