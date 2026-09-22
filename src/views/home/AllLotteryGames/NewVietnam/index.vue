<template>
	<div class="NewVietnam__C">
		<NavBar left-arrow @click-left="backGo" class="main">
			<template #center>
				<div class="centercity" @click="showPicker = true">
					{{ DefaultcityName }}
					<div class="bottombg"></div>
				</div>
			</template>
		</NavBar>
		<!--彩种及玩法-->
		<ColorsAndPlay
			:gameCategoryList="gamCategoryList"
			:colortab="colortab"
			:playtab="playtab"
			@colorupdate="colorupdate"
			@update="update"
		></ColorsAndPlay>
		<!--玩法说明-->
		<TimeLeft
			v-if="gVSs == '1'"
			:defaultcityname="DefaultcityName"
			:defaultplayname="Defaultplayname"
			:defaultexpiredate="expiredate"
			:colorId="colorId"
			:issue="currentInfo?.issueNo"
			:time="time"
			:odds="odds"
			:areId="areId"
		/>
		<TimeLeftF
			v-else-if="gVSs == '2'"
			:defaultcityname="DefaultcityName"
			:defaultplayname="Defaultplayname"
			:colorId="colorId"
			:issue="currentInfo?.issueNo"
			:time="timeF"
			:odds="odds"
			:areId="areId"
			:resultList="resultList"
			:isShowPreparing="isShowPreparing"
		/>
		<!--趣味玩法-->
		<TasteSelect :funplaylist="funplaylist" :numbercon="numbercon" @selectvalue="selectvalue" v-if="colorId === 8">
		</TasteSelect>
		<!--选择号码，输入号码，快捷选号-->
		<NumberSelect
			v-else
			ref="numberselectRef"
			:methodList="methodList"
			:activeTab="activeTab"
			:randomList="randomList"
			:randomtype="randomtype"
			:specialtype="specialtype"
			:isthreenumber="isthreenumber"
			:speciaSelectNo="speciaSelectNo"
			:isShowMark="isShowMark"
			:betconfig="selectmethod"
			:hundred="hundred"
			:groupTab="groupTab"
			:thousandnumList="thousandnumList"
			:hundrednumList="hundrednumList"
			:tennumList="tennumList"
			:indicualnumList="indicualnumList"
			:quicknumList="quicknumList"
			:intervalnumber="intervalnumber"
			:intervalTab="intervalTab"
			@tabupdate="tabupdate"
			@selectgroup="selectgroup"
			@selectinterval="selectinterval"
			@betNum="betNum"
			@betQuickNum="betQuickNum"
			@getselect="getselect"
			@getquick="getquick"
			@inputblur="inputblur"
		></NumberSelect>

		<!--投注记录和比赛结果-->
		<RecordNav :record="gameComponent" @changeC="changeC"></RecordNav>	
		<!-- 动态展示对应的组件 -->
		<KeepAlive>
			<component
				ref="RecordComponent"
				:is="GameRecordList[gameComponent]"
				:ApiFun="apiFun"
				:areId="areId"
				:cityCode="DefaultcityCode"
				:parmas="pageQuery"
				:gVSs="gVSs"
			/>
		</KeepAlive>
		<!--foot-->
		<Footer :betNumber="betNumber" :betSum="betAmount" @playBet="playBet"></Footer>

		<!-- 中奖提示组件 -->
		<WinningTips ref="WinningTipsRef" />
	</div>
	<!--下注弹窗-->
	<van-popup v-model:show="betShow" :close-on-click-overlay="false" class="popup" position="bottom">
		<div class="box p-l-10 p-r-10 p-t-10 p-b-10">
			<div class="close" @click="colseBet">
				<img class="img" src="@public/main/close.png" />
			</div>
			<div class="title c-tc">{{ $t('bettingnumber') }}</div>
			<div
				v-if="
					colorId === 6 ||
					(areId === 2 && colorId === 1 && playId === 4) ||
					(areId === 3 && colorId === 1 && playId === 4) ||
					(areId === 1 && colorId === 1 && playId === 5)
				"
				class="titlebets c-tc border60"
			>
				{{ $t('xosoTxt93') }}
			</div>
			<div :class="'c-row c-flex-warp compound' + activeTab" v-if="activeTab == 2 || activeTab == 3">
				<div :class="'c-row item item' + gameTabType + '-' + gamelength">
					<div class="box">
						<div class="c-row">
							<div class="num c-row c-row-middle-center" v-for="(citem, cindex) in quicknumList" :key="cindex">
								{{ citem }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div :class="'c-row c-flex-warp compound'" v-if="activeTab == 1">
				<div class="item" v-if="thousandnumList.length > 0">
					<div class="title">{{ $t('xosoTxt87') }}</div>
					<div class="numcontainer">
						<div class="num" v-for="(numitem, index) in thousandnumList" :key="index">
							{{ numitem }}
						</div>
					</div>
				</div>
				<div class="item" v-if="hundrednumList.length > 0">
					<div class="title">{{ $t('xosoTxt88') }}</div>
					<div class="numcontainer">
						<div class="num" v-for="(numitem, index) in hundrednumList" :key="index">
							{{ numitem }}
						</div>
					</div>
				</div>
				<div class="item" v-if="tennumList.length > 0">
					<div class="title">{{ $t('xosoTxt89') }}</div>
					<div class="numcontainer">
						<div class="num" v-for="(numitem, index) in tennumList" :key="index">
							{{ numitem }}
						</div>
					</div>
				</div>
				<div class="item" v-if="indicualnumList.length > 0">
					<div class="title">{{ $t('xosoTxt90') }}</div>
					<div class="numcontainer">
						<div class="num" v-for="(numitem, index) in indicualnumList" :key="index">
							{{ numitem }}
						</div>
					</div>
				</div>
				<div class="item" v-if="quicknumList.length > 0">
					<div class="numcontainer">
						<div class="num" v-for="(numitem, index) in quicknumList" :key="index">
							{{ numitem }}
						</div>
					</div>
				</div>
			</div>
			<div class="popup-info">
				<div class="popup-info-item c-row c-row-between">
					<div class="tit">{{ $t('multiple') }}</div>
					<div class="c-row c-row-between stepper-box">
						<div class="li minus" @click="Stepper(1)">-</div>
						<van-field class="digit-box" v-model="count" type="digit" :maxlength="5" @input="changeStep(count)" />
						<div class="li plus c-row c-row-middle-center" @click="Stepper(2)">+</div>
					</div>
				</div>
				<div class="popup-info-item c-row c-flew-end">
					<div class="c-row multiple-box">
						<div
							v-for="(item, index) in bettingMultiple"
							:class="count == item ? 'action li' : 'li'"
							@click="TaskCount(item, index)"
						>
							X{{ item }}
						</div>
					</div>
				</div>

				<div class="c-row c-row-between c-row-middle quantity">
					<div class="c-row c-row-middle-center">
						{{ $t('quantity') }} <span class="line">|</span>
						<span class="num">{{ betNumber || 0 }}{{ $t('note') }}</span>
					</div>
					<div class="c-row c-row-middle-center">
						{{ $t('odds') }}<span class="line">|</span> <span class="num">{{ calcodds }}</span>
					</div>
				</div>
				<div class="wallet c-row c-row-between c-row-middle">
					<div class="txt c-row">
						{{ $t('walletBalance') }}
						<span class="num c-row c-row-middle">{{ currency(Amount) }}</span>
					</div>
				</div>
				<div class="balance c-row c-row-middle">
					<div class="txt">
						{{ $t('betAmounts') }}<span class="num yellow">{{ currency(betAmount) }}</span>
					</div>
				</div>
				<div class="wallet c-row c-row-between c-row-middle" v-if="betAmount > Amount">
					<div class="txt c-row bg7172">
						<img src="@public/home/AllLotteryGames/NewVietnam/tip.png" />{{ $t('insufficientWallet') }}
					</div>
					<div class="txt bg333" @click="goPath('Recharge')">{{ $t('torecharge') }} >></div>
				</div>
				<div class="popup-info-item c-row c-row-middle">
					<van-checkbox v-model="checked" shape="square" checked-color="#F4453E" @change="checkboxChange">
						<div class="agree p-r-15">{{ $t('agree') }}</div>
					</van-checkbox>
					<span class="txt" @click="isShowPreSale = true">{{ $t('presaleRules') }}</span>
				</div>
			</div>
		</div>
		<div class="popup-btn c-row c-row-between">
			<div class="left">
				<van-button class="btn" block @click="closeBet">
					<span> {{ $t('cancel') }}</span>
				</van-button>
			</div>
			<div class="right">
				<van-button class="btn" block @click="betting" :class="{noActive:!isActive}">
					<span class="">{{ $t('betting') }}</span>
				</van-button>
			</div>
		</div>
	 </van-popup>
	<!--顶部弹窗-->
	<van-popup class="areBox" v-model:show="showPicker" round position="bottom" style="overflow: initial;">
		<div class="areList">
			<img class="close" src="@public/main/close.png" alt="" @click="()=>showPicker=false">
			<div class="items" v-for="(item, index) in columns" :key="index">
				<h1>{{item.text}}</h1>
				<div class="itemsC">
					<div v-for="(itemC, indexC) in item.info" :key="indexC" :class="{isActive:DefaultcityCode==itemC.code}" @click="onconfirm(itemC,item.value)">
						{{ $t('code' +itemC.nameCode) }}
					</div>
				</div>
			</div>
		</div>

	</van-popup>
	<!--预售规则-->
	<van-popup v-model:show="isShowPreSale" class="PreSaleRule" :close-on-click-overlay="false" round>
		<div class="PreSale">
			<div class="head">{{ t('presaleRules') }}</div>
			<div class="body">
				{{ $t('betPopTXT') }}
			</div>
			<div class="foot">
				<div class="btn" @click="knowPreSale">{{ t('iKonw') }}</div>
			</div>
		</div>
	</van-popup>
	<!--提示-->
	<van-popup v-model:show="istTips" class="Tips" :close-on-click-overlay="true">
		<div>
			<img v-if="msgcode == 'code402'" src="@public/home/AllLotteryGames/NewVietnam/success.png" />
			<img v-else src="@public/home/AllLotteryGames/NewVietnam/fail.png" />
			<div class="font36">{{ $t(msgcode) }}</div>
		</div>
	</van-popup>

	<Dialog v-model:show="msgShow" @confirm="onCloseMsg" :confirmText="t('confirm')" :showCancelBtn="false">
		<template #content>
			<div class="tipMsg">{{ msgcode?$t(msgcode):'' }}</div>
		</template>
	</Dialog>
</template>
<script setup lang="ts">
import { ref, nextTick, reactive, computed, watch,onUnmounted,readonly } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TimeLeft from '@/components/Home/AllLotteryGames/NewVietnam/TimeLeft.vue'
import TimeLeftF from '@/components/Home/AllLotteryGames/NewVietnam/TimeLeftF.vue'
import ColorsAndPlay from '@/components/Home/AllLotteryGames/NewVietnam/ColorsAndPlay.vue'
import NumberSelect from '@/components/Home/AllLotteryGames/NewVietnam/NumberSelect.vue'
import TasteSelect from '@/components/Home/AllLotteryGames/NewVietnam/TasteSelect.vue'
import Footer from '@/components/Home/AllLotteryGames/NewVietnam/Footer.vue'
import RecordNav from '@/components/Home/AllLotteryGames/NewVietnam/RecordNav.vue'
import GameRecord from '@/components/Home/AllLotteryGames/NewVietnam/GameRecord.vue' //游戏记录
import MyGameRecord from '@/components/Home/AllLotteryGames/NewVietnam/MyGameRecord.vue' //我的比赛
import WinningTips from '@/components/Home/AllLotteryGames/NewVietnam/WinningTips.vue'
import Dialog from '@/components/common/Dialog.vue'
import {
	xosoGetDayIssueNoList,
	xosoBetting,
	xosoGetXosoUserRecord,
	GetBalance,
	getXosoAreGamePlay,
	getXosoAreaOdd,
	GetFXosoIssueNoList,
	GetFXosoAreaPlay,GetFXosoAreaPlayOdd,GetFXosoResultPageList,GetFXosoRecordPageList,AddFXosoBetting,GetFXosoResult,GetFXosoUserResult
} from '@/api'
import {
	AwaitApiResult,AwaitWrap,
	currency,
	generateRondomNumbers,
	getSameDigitNumbers,
	getevenodd,
	getbigsmall,
	getall,
	checkDuplicateItems
} from '@/utils'
import type { WinGo } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { showFailToast,showToast } from 'vant'
import { validate, validateText } from '@/plugins/validate'
import dayjs from 'dayjs'
import { useUrlSearchParams,useDocumentVisibility } from '@vueuse/core'

const router = useRouter()
const Route = useRoute()
const { t } = useI18n()

//#region 定义
const isStop = ref(false)
const gVSs = computed(()=>{
	return currentInfo.value ? currentInfo.value?.type : Route.query?.type
})
const nameCode = ref(router.currentRoute.value.query.nameCode)
const areId=ref(Number(Route.query?.areId) || 1)
// 默认城市和code
const DefaultcityName = computed(()=>{
	return nameCode.value ? t('code' + nameCode.value) : ''
})
const DefaultcityCode = ref(Route.query?.code as string)
const numberselectRef = ref()
const currentInfo=ref() //当前期号信息
// 分页数据处理
interface PageQuery {
	bettingParentType: string
	areId: string
	startDate: string
	endDate: string
}
const pageQuery = reactive<PageQuery>({
	bettingParentType: '',
	areId: '',
	startDate: '',
	endDate: ''
})

const today = new Date()
// 获取昨天的日期
// const yesterday = new Date(today)
// yesterday.setDate(today.getDate() - 1) // 将当前日期减去1天
const formattedYesterday = `${dayjs(today).format('YYYY-MM-DD')} 00:00:00`
const formattedToday = `${dayjs(today).format('YYYY-MM-DD')} 23:59:59`
pageQuery.startDate = formattedYesterday
pageQuery.endDate = formattedToday

// 提示弹窗
const msgShow = ref(false)
// 城市列表
const columns = ref<any[]>([])
// 获取玩法列表
const gamCategoryList = ref<any[]>([])
const resultList = ref({}) //开奖结果
// 彩种index
const colortab = ref(0)
// 彩种id
const colorId = ref(1)
// 玩法index
const playtab = ref(0)
// 玩法id
const playId = ref(1)
// 玩法下注标识
const betType = ref(1)
// 选中玩法，封盘时间，开奖时间，城市，赔率，areid，截至时间，期号
const Defaultplayname = ref('')

// 截至日期
const expiredate = ref('')
// time分为时，分秒
const time = ref('00:00:00')
// 赔率
const odds = ref(1.995)
// 计算赔率
const calcodds = ref(1)
// 获取倍数的数组
const bettingMultiple = ref<any[]>([])
// 默认选中倍数
const multipletab = ref(0)
// 获取投注方式 1,选择号码 2,输入号码 3，快捷选号
const methodList = ref('')
// 默认选中  选择玩法：1，选择号码，2，输入号码，3，快捷选号
const activeTab = ref(1)
// 获取选择号码 个，十，百，千
const selectmethod = ref('')
// 获取随机选号组数
const randomList = ref<any[]>([])
// 是否包含三位长度的数据
const isthreenumber = ref(0)
// 玩法投注长度
const inputNum = ref(0)
// 随机选号是否显示
const randomtype = ref(0)
// 特殊选号是否显示
const specialtype = ref(0)
// 特殊选号配置
const speciaSelectNo = ref('')
// 百位号码
const hundred = ref()
// 随机组选择
const groupTab = ref(1000)
// 千位号码
const thousandnumList = ref<any[]>([])
//  百位号码
const hundrednumList = ref<any[]>([])
//  十位号码
const tennumList = ref<any[]>([])
//  个位号码
const indicualnumList = ref<any[]>([])
// 快捷选号号码
const quicknumList = ref<any[]>([])
// 趣味游戏list列表
const funplaylist = ref<any[]>([])
// 选中号码处理
const numbercon = ref('1000')
// 趣味玩法倍率
const funodds = ref(1)
// 封盘弹窗
const isShowMark = ref(false)
const isActive=computed(()=>{
	if(betAmount.value > Amount.value) return false
	if(count.value<=0) return false
	return true
})

// 随机数组数字
const intervalnumber = ref([
	'000/099',
	'100/199',
	'200/299',
	'300/399',
	'400/499',
	'500/599',
	'600/699',
	'700/799',
	'800/899',
	'900/999'
])
const threeinterval = ref('000/099')
// 随机选号区间选择
const intervalTab = ref(0)

// 顶部弹窗
const showPicker = ref(false)

// 获取玩法下标
const gameTabType = ref(1)
// 获取号码长度
const gamelength = ref(1)
// 初始金额
const initialAmount = ref(0)

// 总数量
const betNumber = ref(0)
// 默认倍率
const defaultOdds = ref(0)
// 动态组件展示
const gameComponent = ref('GameRecord')
// 动态组件
const GameRecordList:any = {
	GameRecord,
	MyGameRecord
}
// 默认倍数
const count = ref(1)
// 中奖提示组件
const WinningTipsRef = ref()
// 显示和隐藏购物车弹窗
const betShow = ref(false)
// 我同意预售规则
const checked = ref(true)
// 下注金额
const betAmount = ref(0)
// 钱包余额
const Amount = ref(0)
// 倒数定时器
const timeHandle = ref(0)
// 预售规则定义
const isShowPreSale = ref(false)
// 动态组件ref
const RecordComponent = ref()
// 投注成功提示
const istTips = ref(false)
// 成功还是失败
const msgcode = ref('')
// 输入号码处理
const inputselectnumber = ref('')
const apiFun=computed(()=>{
	if(gVSs.value == '1'){
		return xosoGetXosoUserRecord
	}else if(gVSs.value == '2'){
		return GetFXosoRecordPageList
	}
})

//#endregion

//#region 期号，开奖模块--------------------------
const formatDuration = (duration: number) => {
	const minutes = String(Math.floor((timeHandleF.value % 3600) / 60)).padStart(2, '0')
	const seconds = String(timeHandleF.value % 60).padStart(2, '0')
	return `${minutes}:${seconds}`
}
//封盘倒计时-私彩
const timeHandleF = ref()
const closingIntervalF = ref<NodeJS.Timeout | null>(null) //下注计时器
const timeF = ref('00:00')
const isShowPreparing = ref(false)
const startCountdownF=() => {
	closingIntervalF.value = setInterval(() => {
		if (timeHandleF.value <= 0) {
			timeF.value = '00:00'
			setTimeout(()=>{
				isShowPreparing.value=true
			},500)
			clearInterval(closingIntervalF.value as NodeJS.Timeout)
			getCityList() //获取新的期号信息
			setTimeout(() => {
				checkWinTheLotteryF(true) //5秒后，获取新的开奖结果
			}, 5000);
		} else {
			isShowPreparing.value=false
			timeF.value = formatDuration(timeHandleF.value)
			timeHandleF.value--
		}
	}, 1000)
}
// 封盘倒计时处理-官彩
const closingInterval = ref<NodeJS.Timeout | null>(null) //下注计时器
const startCountdown = (servicetime: number, closingtime: number) => {
	clearInterval(timeHandle.value)
	isShowMark.value = false
	timeHandle.value = (closingtime - servicetime) / 1000
	 closingInterval.value = setInterval(() => {
		if (timeHandle.value <= 0) {
			clearInterval(closingInterval.value as NodeJS.Timeout)
			time.value = '00:00:00'
			isShowMark.value = true
		} else {
			const hours = String(Math.floor(timeHandle.value / 3600)).padStart(2, '0')
			const minutes = String(Math.floor((timeHandle.value % 3600) / 60)).padStart(2, '0')
			const seconds = String(timeHandle.value % 60).padStart(2, '0')
			time.value = hours + ':' + minutes + ':' + seconds
			timeHandle.value--
		}
	}, 1000)
}

function toBack(){
	if(!currentInfo.value){
		 showToast({
			message: t('xosoTip5'),
			wordBreak: 'break-word'
		})
		setTimeout(function() {
			goPath('AllLotteryGames-XoSo')
		}, 2000);
	}
}

// 获取最新期号数据
const getCityList = async () => {
	let res;
	if(gVSs.value == '1'){
		const day = dayjs(Route.query.day as string).format('YYYY-MM-DD HH:mm:ss')
		res =  await AwaitApiResult<any>(xosoGetDayIssueNoList({ dateTime: day }))
	}else if(gVSs.value == '2'){
		res = await AwaitApiResult<any>(GetFXosoIssueNoList({are:areId.value,typeId:Number(DefaultcityCode.value)}))
	}
	if(res.data.length==0){
		toBack()
	}
	let thatDayList = res.data.find((el:any)=>el.day == Route.query.day) //筛选所选日期一天的数据，防止后端返回多天数据
	expiredate.value = thatDayList.day
	let currentAreIdList = thatDayList.areInfos.find((el:any)=>el?.areId == areId.value) //筛选当前区域
	const server = currentAreIdList?.serverTime
	currentInfo.value = currentAreIdList.areIssueNos.find((el:any)=>el.code==DefaultcityCode.value) //筛选当前城市/彩种的期号信息

	if(!currentInfo.value){
		toBack()
	}
	if(gVSs.value == '1'){
		const closure = currentAreIdList?.closingTime
		clearInterval(closingInterval.value as NodeJS.Timeout)
		startCountdown(new Date(server.replace(/-/g,'/')).getTime(), new Date(closure.replace(/-/g,'/')).getTime())
	}else if(gVSs.value == '2'){
		timeHandleF.value = (new Date(currentInfo.value.endTime.replace(/-/g,'/')).getTime() - new Date(server.replace(/-/g,'/')).getTime()) / 1000
		clearInterval(closingIntervalF.value as NodeJS.Timeout)
		startCountdownF()
	}
}

let setT:any = null
const lastIssueNo = ref('') //上期开奖结果
const allResultList = ref()
//最近一期开奖结果-私彩
const checkWinTheLotteryF = async (isCycle:Boolean=false) => {
	if(isStop.value || gVSs.value != '2') return
	let res;
	let isAgain = true //是否需要重新请求，要判断开奖结果期号是不是更新了
	//游戏记录状态下,最新开奖结果从游戏记录接口GetFXosoResultPageList拿
	if (gameComponent.value === 'GameRecord') {
		res = await AwaitApiResult<any>(GetFXosoResultPageList({
				pageSize: 10,
				pageNo: 1,
				areId: areId.value,
				typeId: Number(DefaultcityCode.value)
		}))
		if(res){
			if(res.data?.list?.length>0){
				if(lastIssueNo.value.trim().length==0 || lastIssueNo.value != res.data?.list[0]?.issueNumber){
					isAgain=false
					lastIssueNo.value = res.data?.list[0]?.issueNumber
				}
			}
			if (isAgain==true && isCycle) {
				clearTimeout(setT)
				setT = setTimeout(() => {
					checkWinTheLotteryF(true)
				}, 1000)
				return
			}
			resultList.value = res.data?.list[0]
			allResultList.value = res.data
			nextTick(() => {
				RecordComponent.value.getData(false,allResultList.value)
			})
		}

	}else if(gameComponent.value === 'MyGameRecord'){
		//我的比赛状态下,最新开奖结果从接口GetFXosoResult拿
		res = await AwaitApiResult<any>(GetFXosoResult({
				areId: areId.value,
				typeId: Number(DefaultcityCode.value)
		}))
		if(res){
			if(res.data && res.data.openingResult && res.data.openingResult.length>0){
				isAgain=false
				lastIssueNo.value = res.data?.issueNumber
				resultList.value = res.data
			}
		}
		if (isAgain==true && isCycle) {
			clearTimeout(setT)
			setT = setTimeout(() => {
				checkWinTheLotteryF(true)
			}, 1000)
			return
		}
	}
}

//#endregion

//#region  顶部下拉框模块---------------------------------
//填充顶部下拉列表
function getSelectData(){
	let xosoList = JSON.parse(sessionStorage.getItem('xosoList') || '')
	let data = []
	for (let i = 0; i < xosoList.areInfos.length; i++) {
		data.push({
			text: t('code' + xosoList.areInfos[i].areNameCode),
			value: xosoList.areInfos[i].areId,
			disabled: true,
			info:xosoList.areInfos[i].areIssueNos
		})
	}
	columns.value = data
}

// 确认选中
function onconfirm(item:any,val:number){
	if(DefaultcityCode.value==item.code){
		showPicker.value=false
		return
	}
	clearTimers()
	areId.value = val
	nameCode.value=item.nameCode
	DefaultcityCode.value = item.code
	colortab.value = 0
	playtab.value = 0
	colorId.value = gamCategoryList.value.length>0 ? gamCategoryList?.value[0]?.categoryId : 1
	showPicker.value = false
	changeUrl(item,val)
	currentInfo.value=item
	if(item.type == '2'){
		isShowMark.value = false
		checkWinTheLotteryF()
	}
	getCityList()
	getAreaPlayList()
	nextTick(() => {
		if(gameComponent.value === 'MyGameRecord'){
			RecordComponent.value.getData(true)
		}
	})
}
//重新选择城市或彩种后，更新地址栏
function changeUrl(item:any,val:any){
	const params = useUrlSearchParams('hash')
	params.code=item?.code
	params.nameCode=item?.nameCode
	params.type=item?.type
	params.areId = val
}
//#endregion

//#region 顶部彩种、彩种填充切换模块-------------------------
//根据城市id获取玩法列表
const getAreaPlayList = async () => {
	cleardata()
	clearselectarr()
	let res;
	if(gVSs.value == '1'){
		res = await AwaitApiResult<any>(getXosoAreGamePlay({ areaId: areId.value }))
	}else if(gVSs.value == '2'){
		res = await AwaitApiResult<any>(GetFXosoAreaPlay({ areaId: areId.value,typeId:Number(DefaultcityCode.value) }))
	}
	if(res){
		gamCategoryList.value = res.data?.areaConfigList[0]?.gameCategoryList
		localStorage.setItem('gameCategoryList', JSON.stringify(res.data.areaConfigList[0]?.gameCategoryList))
		Defaultplayname.value = gamCategoryList?.value[0]?.gamePlayList[0]?.playNameCode
		playId.value = gamCategoryList?.value[0]?.gamePlayList[0]?.playId
		colorId.value = gamCategoryList?.value[0]?.categoryId
		//清理下数据
		getOdd()
	}

}
// 切换彩种
const colorupdate = (id: number, index: number) => {
	clearselectarr()
	colortab.value = index
	colorId.value = id
	playtab.value = 0
	playId.value = gamCategoryList?.value[index].gamePlayList[0].playId
	betType.value = gamCategoryList.value[index].gamePlayList[0].betType
	Defaultplayname.value = gamCategoryList.value[index].gamePlayList[0].playNameCode
	intervalTab.value = 0
	//清理下数据
	getOdd()
}
// 切换玩法
const update = (id: number, index: number, name: string, bettype: number) => {
	playtab.value = index
	playId.value = id
	Defaultplayname.value = name
	betType.value = Number(bettype)
	intervalTab.value = 0
	//清理下数据
	getOdd()
	clearselectarr()
}
//根据玩法id获取赔率，封盘时间，开奖时间等数据
const getOdd = async () => {
	cleardata()
	let res;
	if(gVSs.value == '1'){
		res=await AwaitApiResult<any>(
		getXosoAreaOdd({areaId: areId.value,categoryId: colorId.value,playId: playId.value
		}))
	}else if(gVSs.value == '2'){
		res=await AwaitApiResult<any>(
			GetFXosoAreaPlayOdd({areaId: areId.value,categoryId: colorId.value,playId: playId.value
		}))
	}
	methodList.value = res.data?.betMethod
	selectmethod.value = res.data?.betScopeConfig
	isthreenumber.value = res.data?.isThreeNumber
	inputNum.value = res.data?.betNumber
	speciaSelectNo.value = res.data?.fastSpeciaSelectNo
	randomtype.value = res.data?.fastRandomType
	specialtype.value = res.data?.fastSpeciaType
	defaultOdds.value = res.data?.playOddInfo.defaultOdds
	odds.value = res.data?.playOddInfo.oddsOrAmount
	initialAmount.value = res.data?.playOddInfo.bettingAmount
	randomList.value = res.data?.fastRandomSelecNo?.split(',').map(Number)
	bettingMultiple.value = res.data?.playOddInfo.bettingMultiple?.split(',').map(Number)
	count.value = res.data?.playOddInfo.bettingMultiple?.split(',')[0]
	gamelength.value = res.data?.perBetNumber
	if (colorId.value == 8) {
		funplaylist.value = res.data?.funPlayOddList
	}
	JudgmentBetDisplay(res.data?.betMethod)
	JudgmentLongList(res.data?.betNumber)
	judgmentHundred(res.data?.isThreeNumber)
}
//#endregion

//#region 选号，下注模块-------------------------------------
// 判断下注列表 默认显示
const JudgmentBetDisplay = (method: string) => {
	if (method?.includes('1')) {
		activeTab.value = 1
	} else {
		if (colorId.value === 4 || colorId.value === 8) {
			activeTab.value == 1
		} else {
			activeTab.value = 3
		}
	}
}
//	选中号码
const selectvalue = (item: any, index: number) => {
	numbercon.value = item.oddTypeName
	funodds.value = item.oddsOrAmount
	quicknumList.value = [numbercon.value]
	CalcTotalAmount(3, inputNum.value)
}
//处理长度处理
const JudgmentLongList = (num: number) => {
	if (num == 10) {
		gameTabType.value = 1
	} else if (num == 8) {
		gameTabType.value = 2
	} else if (num == 4) {
		gameTabType.value = 3
	} else if (num == 3) {
		gameTabType.value = 4
	} else if (num == 2) {
		gameTabType.value = 5
	} else {
		gameTabType.value = 0
	}
}
// 判断百位的数组长度
const judgmentHundred = (threenumber: number) => {
	if (threenumber == 1) {
		hundred.value = threeinterval.value.split('/')[0][0].toString()
	}
}
// 切换数据，玩法数据滞空
const cleardata = () => {
	activeTab.value = 1
	odds.value = 0
	initialAmount.value = 0
	bettingMultiple.value = []
	methodList.value = ''
	selectmethod.value = ''
	randomList.value = []
	isthreenumber.value = 0
	inputNum.value = 0
	speciaSelectNo.value = ''
	randomtype.value = 0
	specialtype.value = 0
	groupTab.value = 1000
	hundred.value = ''
}
// 清理选中的数组
const clearselectarr = () => {
	thousandnumList.value = []
	hundrednumList.value = []
	tennumList.value = []
	indicualnumList.value = []
	quicknumList.value = []
	calcodds.value = 0
	numbercon.value = '1000'
	betAmount.value = 0
	betNumber.value = 0
	count.value = 1
	inputselectnumber.value = ''
	groupTab.value = 1000
	nextTick(() => {
		if (numberselectRef.value) {
			numberselectRef.value.cleardata()
		}
	})
}
// 输入号码显示
const inputblur = (selectNumber: string) => {
	inputselectnumber.value = selectNumber
	let parts = selectNumber.split(',')
	let numberstring = parts.flatMap((part) => part.split('|'))
	quicknumList.value = numberstring.map(String)
	CalcTotalAmount(activeTab.value, inputNum.value)
}
// 选择号码的方式处理
const getselect = (method: string, num: number, digit: number, methods: string) => {
	if (method == 'Thousand') {
		if (methods == 'all') {
			thousandnumList.value = getall(num, digit)
		} else if (methods == 'big') {
			thousandnumList.value = getbigsmall(num, digit, 'big', 0)
		} else if (methods == 'small') {
			thousandnumList.value = getbigsmall(num, digit, 'small', 0)
		} else if (methods == 'odd') {
			thousandnumList.value = getevenodd(num, digit, 'odd', 0)
		} else {
			thousandnumList.value = getevenodd(num, digit, 'even', 0)
		}
	} else if (method == 'hundred') {
		if (methods == 'all') {
			hundrednumList.value = getall(num, digit)
		} else if (methods == 'big') {
			hundrednumList.value = getbigsmall(num, digit, 'big', 0)
		} else if (methods == 'small') {
			hundrednumList.value = getbigsmall(num, digit, 'small', 0)
		} else if (methods == 'odd') {
			hundrednumList.value = getevenodd(num, digit, 'odd', 0)
		} else {
			hundrednumList.value = getevenodd(num, digit, 'even', 0)
		}
	} else if (method == 'ten') {
		if (methods == 'all') {
			tennumList.value = getall(num, digit)
		} else if (methods == 'big') {
			tennumList.value = getbigsmall(num, digit, 'big', 0)
		} else if (methods == 'small') {
			tennumList.value = getbigsmall(num, digit, 'small', 0)
		} else if (methods == 'odd') {
			tennumList.value = getevenodd(num, digit, 'odd', 0)
		} else {
			tennumList.value = getevenodd(num, digit, 'even', 0)
		}
	} else {
		if (methods == 'all') {
			indicualnumList.value = getall(num, digit)
		} else if (methods == 'big') {
			indicualnumList.value = getbigsmall(num, digit, 'big', 0)
		} else if (methods == 'small') {
			indicualnumList.value = getbigsmall(num, digit, 'small', 0)
		} else if (methods == 'odd') {
			indicualnumList.value = getevenodd(num, digit, 'odd', 0)
		} else {
			indicualnumList.value = getevenodd(num, digit, 'even', 0)
		}
	}
	CalcTotalAmount(activeTab.value, inputNum.value)
}
// 快捷选号的处理方式
const getquick = (digit: number, method: string) => {
	if (digit == 0) {
		if (method == 'even') {
			clearselectarr()
			quicknumList.value = getevenodd(0, 99, 'even', 2)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else if (method == 'big') {
			clearselectarr()
			quicknumList.value = getbigsmall(0, 99, 'big', 2)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else if (method == 'small') {
			clearselectarr()
			quicknumList.value = getbigsmall(0, 99, 'small', 2)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else if (method == 'odd') {
			clearselectarr()
			quicknumList.value = getevenodd(0, 99, 'odd', 2)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else {
			clearselectarr()
			quicknumList.value = getSameDigitNumbers(0, 99, 2)
			CalcTotalAmount(activeTab.value, inputNum.value)
		}
	} else {
		let start = Number(threeinterval.value.split('/')[0])
		let end = Number(threeinterval.value.split('/')[1])
		if (method == 'even') {
			clearselectarr()
			quicknumList.value = getevenodd(start, end, 'even', 3)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else if (method == 'big') {
			clearselectarr()
			quicknumList.value = getbigsmall(start, end, 'big', 3)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else if (method == 'small') {
			clearselectarr()
			quicknumList.value = getbigsmall(start, end, 'small', 3)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else if (method == 'odd') {
			clearselectarr()
			quicknumList.value = getevenodd(start, end, 'odd', 3)
			CalcTotalAmount(activeTab.value, inputNum.value)
		} else {
			clearselectarr()
			quicknumList.value = getSameDigitNumbers(start, end, 3)
			CalcTotalAmount(activeTab.value, inputNum.value)
		}
	}
}
// 快捷号码
const betQuickNum = (three: string, two: number, one: number) => {
	if (three == '') {
		let num = two + '' + one
		if (quicknumList.value.includes(num)) {
			quicknumList.value = quicknumList.value.filter(function (ele) {
				return ele != num
			})
		} else {
			quicknumList.value.push(num)
		}
	} else {
		let num = three + '' + two + '' + one
		if (quicknumList.value.includes(num)) {
			quicknumList.value = quicknumList.value.filter(function (ele) {
				return ele != num
			})
		} else {
			quicknumList.value.push(num)
		}
	}
	CalcTotalAmount(activeTab.value, inputNum.value)
}
// 选择号码
const betNum = (digits: string, ball: string) => {
	if (digits == 'Thousand') {
		if (thousandnumList.value.includes(ball)) {
			thousandnumList.value = thousandnumList.value.filter(function (ele) {
				return ele != ball
			})
		} else {
			thousandnumList.value.push(ball)
		}
	} else if (digits == 'Hundred') {
		if (hundrednumList.value.includes(ball)) {
			hundrednumList.value = hundrednumList.value.filter(function (ele) {
				return ele != ball
			})
		} else {
			hundrednumList.value.push(ball)
		}
	} else if (digits == 'ten') {
		if (tennumList.value.includes(ball)) {
			tennumList.value = tennumList.value.filter(function (ele) {
				return ele != ball
			})
		} else {
			tennumList.value.push(ball)
		}
	} else {
		if (indicualnumList.value.includes(ball)) {
			indicualnumList.value = indicualnumList.value.filter(function (ele) {
				return ele != ball
			})
		} else {
			indicualnumList.value.push(ball)
		}
	}
	CalcTotalAmount(activeTab.value, inputNum.value)
}
//选择号码，存入到购物车
const selectinterval = (item: string, index: number) => {
	intervalTab.value = index
	threeinterval.value = item
	groupTab.value = 1000
	hundred.value = threeinterval.value.split('/')[0][0].toString()
	clearselectarr()
}
// 随机选号
const selectgroup = (item: string, index: number, threenumber: number) => {
	groupTab.value = index
	if (threenumber == 0) {
		quicknumList.value = generateRondomNumbers(Number(item) * inputNum.value, 0, 99, threenumber)
		CalcTotalAmount(activeTab.value, inputNum.value)
	} else {
		let start = Number(threeinterval.value.split('/')[0])
		let end = Number(threeinterval.value.split('/')[1])
		quicknumList.value = generateRondomNumbers(Number(item), start, end, threenumber)
		CalcTotalAmount(activeTab.value, inputNum.value)
	}
}
// 处理彩种切换
const tabupdate = (id: number) => {
	activeTab.value = id
	clearselectarr()
}
// 关闭弹窗
const colseBet = () => {
	betShow.value = false
	clearselectarr()
}
// 是否同意预售规则
const checkboxChange = (e: any) => {}
// 预售规则点击事件
const knowPreSale = () => {
	isShowPreSale.value = false
	checked.value = true
}
// 关闭投注页面
const closeBet = () => {
	betShow.value = false
	count.value = 1
	CalcTotalAmount(activeTab.value, inputNum.value)
}
// 限制投注
const limitation = () => {
	const maxBetNum = gamCategoryList.value[colortab.value].gamePlayList[playtab.value].availableBetNumber //最大投注注数
	const maxBetAmount = gamCategoryList.value[colortab.value].gamePlayList[playtab.value].eachIssueBetMaxWinningAmount //该玩法最大投注金额
	if (betNumber.value > maxBetNum) {
		return showFailToast(t('xosoTip1', [maxBetNum]))
	} else {
		if (betAmount.value > maxBetAmount) {
			return showFailToast(t('xosoTip2', [maxBetAmount]))
		}
	}
	return true
}
// 弹窗及验证长度是否合适
const playBet = async () => {
	//选择号码
	const j = limitation()
	if (j !== true) return
	if (betNumber.value > 5000) return showFailToast(t('xosoTxt94'))
	if (activeTab.value == 1) {
		if (selectmethod.value?.includes('4')) {
			if (
				indicualnumList.value.length > 0 &&
				tennumList.value.length > 0 &&
				hundrednumList.value.length > 0 &&
				thousandnumList.value.length > 0
			) {
				betShow.value = true
			} else {
				showFailToast(t('xosoTxt95'))
			}
		} else if (selectmethod.value?.includes('3')) {
			if (indicualnumList.value.length > 0 && tennumList.value.length > 0 && hundrednumList.value.length > 0) {
				betShow.value = true
			} else {
				showFailToast(t('xosoTxt95'))
			}
		} else if (selectmethod.value?.includes('2')) {
			if (indicualnumList.value.length > 0 && tennumList.value.length > 0 && colorId.value != 4) {
				betShow.value = true
			} else if (tennumList.value.length > 0 && colorId.value == 4) {
				betShow.value = true
			} else {
				showFailToast(t('xosoTxt95'))
			}
		} else if (selectmethod.value?.includes('1')) {
			if (indicualnumList.value.length > 0) {
				betShow.value = true
			} else {
				showFailToast(t('xosoTxt95'))
			}
		} else {
			if (quicknumList.value.length > 0 && colorId.value == 8) {
				betShow.value = true
			} else {
				showFailToast(t('xosoTxt95'))
			}
		}
	} else if (activeTab.value == 3) {
		judgmentinputlength(inputNum.value, quicknumList.value)
	} else if (activeTab.value == 2) {
		if (!validate.inputrule.test(inputselectnumber.value)) {
			return showFailToast({
				message: t(validateText.inputtip),
				wordBreak: 'break-word'
			})
		}

		for (let i = 0; i < quicknumList.value.length; i++) {
			if (quicknumList.value[i].toString().length != gamelength.value) {
				return showFailToast(t('xosoTxt95'))
			}
		}
		if (checkDuplicateItems(quicknumList.value)) {
			return showFailToast(t('xosoTxt98'))
		}
		judgmentinputlength(inputNum.value, quicknumList.value)
	} else {
		if (colorId.value == 8 && quicknumList.value.length === 1) {
			betShow.value = true
		} else {
			showFailToast(t('xosoTxt95'))
		}
	}
	CalcTotalAmount(activeTab.value, inputNum.value)
}
// 判断是否正常显示
const judgmentinputlength = (input: number, quicklist: any) => {
	if (input == 1) {
		if (quicklist.length > 0) {
			betShow.value = true
		} else {
			showFailToast(t('xosoTxt95'))
		}
	} else if (input == 2) {
		if (quicklist.length % 2 == 0) {
			betShow.value = true
		} else {
			showFailToast(t('xosoTxt95'))
		}
	} else if (input == 3) {
		if (quicklist.length % 3 == 0) {
			betShow.value = true
		} else {
			showFailToast(t('xosoTxt95'))
		}
	} else if (input == 4) {
		if (quicklist.length % 4 == 0) {
			betShow.value = true
		} else {
			showFailToast(t('xosoTxt95'))
		}
	} else if (input == 8) {
		if (quicklist.length % 8 == 0) {
			betShow.value = true
		} else {
			showFailToast(t('xosoTxt95'))
		}
	} else if (input == 10) {
		if (quicklist.length % 10 == 0) {
			betShow.value = true
		} else {
			showFailToast(t('xosoTxt95'))
		}
	} else {
	}
}
// 下注
const timer = ref(null)
const betting = async () => {
	if (timer.value) {
		clearTimeout(timer.value)
	}
	timer.value = setTimeout(async () => {
		if(isShowPreparing.value){
			return showToast({
				message: t('xosoTip6'),
				wordBreak: 'break-word'
			})
		}
		if(!isActive.value) return
		const j = limitation()
		if (j !== true) return
		//先处理一个选择下注的问题
		let data = []
		let arraydata = ''
		if (activeTab.value == 1) {
			if (selectmethod.value.toString().includes('4')) {
				arraydata =
					thousandnumList.value.join('|') +
					',' +
					hundrednumList.value.join('|') +
					',' +
					tennumList.value.join('|') +
					',' +
					indicualnumList.value.join('|')
			} else if (selectmethod.value.toString().includes('3')) {
				arraydata = hundrednumList.value.join('|') + ',' + tennumList.value.join('|') + ',' + indicualnumList.value.join('|')
			} else if (selectmethod.value.toString().includes('2')) {
				if (colorId.value == 4) {
					arraydata = tennumList.value.join(',')
				} else {
					arraydata = tennumList.value.join('|') + ',' + indicualnumList.value.join('|')
				}
			} else {
				if (colorId.value == 4) {
					arraydata = indicualnumList.value.join(',')
					activeTab.value = 3
				} else if (colorId.value == 8) {
					arraydata = quicknumList.value[0] as any
				}
			}
		} else if ([2,3].includes(activeTab.value)) {
			if (inputNum.value == 1) {
				arraydata = quicknumList.value.join(',')
			} else if (inputNum.value == 2) {
				let secondArr = quicknumList.value.reduce((acc, curr, index) => {
					if (index % 2 === 0) {
						acc.push(curr + '|' + quicknumList.value[index + 1])
					}
					return acc
				}, [])
				arraydata = secondArr.join(',')
			} else if (inputNum.value == 3) {
				let threeArr = quicknumList.value.reduce((acc, curr, index) => {
					if (index % 3 === 0) {
						acc.push(curr + '|' + quicknumList.value[index + 1] + '|' + quicknumList.value[index + 2])
					}
					return acc
				}, [])
				arraydata = threeArr.join(',')
			} else if (inputNum.value == 4) {
				let fourArr = quicknumList.value.reduce((acc, curr, index) => {
					if (index % 4 === 0) {
						acc.push(
							curr +
								'|' +
								quicknumList.value[index + 1] +
								'|' +
								quicknumList.value[index + 2] +
								'|' +
								quicknumList.value[index + 3]
						)
					}
					return acc
				}, [])
				arraydata = fourArr.join(',')
			} else if (inputNum.value == 8) {
				let fourArr = quicknumList.value.reduce((acc, curr, index) => {
					if (index % 8 === 0) {
						acc.push(
							curr +
								'|' +
								quicknumList.value[index + 1] +
								'|' +
								quicknumList.value[index + 2] +
								'|' +
								quicknumList.value[index + 3] +
								'|' +
								quicknumList.value[index + 4] +
								'|' +
								quicknumList.value[index + 5] +
								'|' +
								quicknumList.value[index + 6] +
								'|' +
								quicknumList.value[index + 7]
						)
					}
					return acc
				}, [])
				arraydata = fourArr.join(',')
			} else {
				let fourArr = quicknumList.value.reduce((acc, curr, index) => {
					if (index % 10 === 0) {
						acc.push(
							curr +
								'|' +
								quicknumList.value[index + 1] +
								'|' +
								quicknumList.value[index + 2] +
								'|' +
								quicknumList.value[index + 3] +
								'|' +
								quicknumList.value[index + 4] +
								'|' +
								quicknumList.value[index + 5] +
								'|' +
								quicknumList.value[index + 6] +
								'|' +
								quicknumList.value[index + 7] +
								'|' +
								quicknumList.value[index + 8] +
								'|' +
								quicknumList.value[index + 9]
						)
					}
					return acc
				}, [])
				arraydata = fourArr.join(',')
			}
		} else {
			if (colorId.value === 8 && inputNum.value == 1) {
				arraydata = quicknumList.value[0] as any
				betNumber.value = inputNum.value
			}
		}
		if ([4,8].includes(colorId.value)) {
			activeTab.value = 3
		}
		if(arraydata.replace(',','').trim().length==0) return
		if(betNumber.value == 0) return
		data.push({
			bettingParentType: colorId.value,
			bettingType: betType.value,
			bettingFormat: activeTab.value,
			bettingContent: arraydata,
			totalBetting: betNumber.value,
			initialAmount: initialAmount.value,
			bettingMultiple: count.value,
			defaultOdds: defaultOdds.value
		})
		let [err, res]:[any,any]=[null,null]
		let issueNo = readonly(currentInfo.value?.issueNo)
		if(gVSs.value == '1'){
			[err, res] = await AwaitWrap<any>(
				xosoBetting({
					areId: areId.value,
					issueNo: currentInfo.value?.issueNo,
					xosoBettingData: data
				})
		)
		} else if(gVSs.value == '2'){
			[err, res] = await AwaitWrap<any>(
				AddFXosoBetting({
					areId: areId.value,
					typeId:Number(DefaultcityCode.value),
					issueNo: currentInfo.value?.issueNo,
					xosoBettingData: data
			}))
		}
		if (res) {
			if (colorId.value === 4) {
				activeTab.value = 1
			}
			betShow.value = false
			const msg = getMsgCode(res?.msgCode, res?.msg)
			msgcode.value = msg
			intervalTab.value = 0
			clearselectarr() //移除数据
			getWinsUserAmount() //请求成功
			//下注成功后在我的比赛tab下，重新调用一次记录接口
			if (gameComponent.value === 'MyGameRecord') {
				RecordComponent.value.getData()
			}
			//查询用户有没有中奖
			setTimeout(() => {
				getFXosoUserResult(issueNo)
			}, (Number(timeHandleF.value*1000)+5000))
		} else {
			betShow.value = false
			const msg = getMsgCode(res?.msgCode, res?.msg)
			msgcode.value = msg
		}
	}, 500) as any
}

// 1.5S关闭投注成功失败弹框
const setTip = () => {
	setTimeout(() => {
		if (istTips.value) {
			istTips.value = false
		}
	}, 1500)
}
// 投注提示
const getMsgCode = (code: number, msg: string) => {
	let msgTip = ''
	switch (code) {
		case 345: //单期最高下注
			msgTip = t('xosoTip2', [msg])
			msgShow.value = true
			break
		case 346: //同一期不可同时投注  大小
			msgTip = t('xosoTip3')
			msgShow.value = true
			break
		case 347: //同一期不可同时投注 单双
			msgTip = t('xosoTip3')
			msgShow.value = true
			break
		case 348: //不允许下注超过
			msgTip = t('xosoTip1', [msg])
			msgShow.value = true
			break
		case 349: //不同号
			msgTip = t('xosoTip4')
			msgShow.value = true
			break
		default:
			msgTip = 'code' + code
			istTips.value = true
			setTip()
			break
	}
	return msgTip
}
const onCloseMsg = () => {
	msgShow.value = false
}
let setGF:any = null
async function  getFXosoUserResult(issueNumber: string){
	if(isStop.value || gVSs.value != '2') return
	const res = await AwaitApiResult<any>(
		GetFXosoUserResult({
			issueNo:issueNumber
		}))
	if(res){
		//1；未结算，2-未中奖，3-已中奖
		const isLottery = res.data.status == 1
		if (isLottery) {
			clearTimeout(setGF)
			setGF = setTimeout(() => {
				getFXosoUserResult(issueNumber)
			}, 1000)
			return
		}
		WinningTipsRef.value.showMark(res.data)
		if (gameComponent.value === 'MyGameRecord') {
			RecordComponent.value.getData()
		}
	}
}
// 选中号码
// 改变输入框的值
const changeStep = (e: number) => {
	if (e <= 0) {
		// count.value = minValue.value
	} else if(e >=50000) {
		count.value = 50000
	} else {
		count.value = e
	}
	CalcTotalAmount(activeTab.value, inputNum.value)
}
//购买份数切换
const TaskCount = (item: number, index: number) => {
	multipletab.value = index
	count.value = item
	CalcTotalAmount(activeTab.value, inputNum.value)
}
//份数加减
const Stepper = (e: number) => {
	switch (e) {
		case 1:
			if (count.value > 1) {
				count.value--
				CalcTotalAmount(activeTab.value, inputNum.value)
			}
			break
		case 2:
			count.value++
			CalcTotalAmount(activeTab.value, inputNum.value)
			break
		default:
	}
}
// 计算总金额
const CalcTotalAmount = (method: number, length: any) => {
	if(length==0) return
	betNumber.value = calcbets(method, length)
	betAmount.value = betNumber.value * initialAmount.value * count.value * defaultOdds.value
	if (colorId.value === 8) {
		calcodds.value = funodds.value
	} else {
		calcodds.value = odds.value
	}
}
//计算注数
const calcbets = (method: number, length: number) => {
	let betnumber = 0
	if (method == 1) {
		let thlength = thousandnumList.value.length
		let hunlength = hundrednumList.value.length
		let tenlength = tennumList.value.length
		let indlength = indicualnumList.value.length
		if (selectmethod.value.toString().includes('4')) {
			betnumber = thlength * hunlength * tenlength * indlength
		} else if (selectmethod.value.toString().includes('3')) {
			betnumber = hunlength * tenlength * indlength
		} else if (selectmethod.value.toString().includes('2')) {
			if (colorId.value === 4) {
				betnumber = tenlength
			} else {
				betnumber = tenlength * indlength
			}
		} else if (selectmethod.value.toString().includes('1')) {
			betnumber = indlength
		} else {
			if (colorId.value === 8) {
				betnumber = 1
			}
		}
		return betnumber
	} else if (method == 3) {
		betnumber = Math.floor(quicknumList.value.length / length)
		return betnumber
	} else if (method == 2) {
		// 处理输入号码的验证
		if (quicknumList.value.length == 1 && quicknumList.value[0] == '1') {
			betnumber = 0
		} else {
			betnumber = Math.floor(quicknumList.value.length / length)
		}
		return betnumber
	}
	return betnumber
}
//#endregion

//返回上一页
const backGo = () => {
	router.go(-1)
}
// 跳转路由
const goPath = (name: string) => {
	router.push({ name,query:{id:Route.query?.id} })
}

// 获取用户余额
const getWinsUserAmount = async () => {
	const res = await AwaitApiResult<ObjResNull<WinGo.resGetWinsUserAmount>>(GetBalance())
	if (res) {
		Amount.value = res?.data.amount || 0
	}
}

function changeC(item:any){
	gameComponent.value = item
	if (gameComponent.value == 'GameRecord') {
		nextTick(() => {
			RecordComponent.value.getData()
		})
	}
}

getSelectData()
getCityList()
if(gVSs.value == '2'){
	checkWinTheLotteryF()
}
getAreaPlayList()
getWinsUserAmount()

function clearTimers(){
	clearInterval(closingInterval.value as NodeJS.Timeout)
	clearInterval(closingIntervalF.value as NodeJS.Timeout)
	clearTimeout(setT)
	clearTimeout(setGF)
}

onUnmounted(() => {
	isStop.value = true
	clearTimers()
})

const visibility = useDocumentVisibility()
watch(visibility, (current, previous) => {
	if (current === 'visible' && previous === 'hidden') {
		getCityList()
		if(gVSs.value == '2'){
			checkWinTheLotteryF()
		}
		getWinsUserAmount()
	}else{
		clearTimers()
	}
})
</script>
<style lang="scss" scoped>
@import '@/assets/styles/xoxs.scss';
:deep(.dialog__container-content) {
	margin-top: 10px;
	.tipMsg {
		font-size: 26px;
	}
}

.centercity {
	display: flex;
	flex-direction: row;
	font-size: 36px;
	color: var(--textW);
	font-weight: 500;
	justify-content: center;
	align-items: center;
}





</style>
