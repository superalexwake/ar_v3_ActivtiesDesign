<template>
	<div class="changLong__C">
		<template v-for="(item, index) in betlist">
			<div class="changLong__C-bet">
				<div class="changLong__C-bet-l">
					<div class="titel" :class="[iconType(item.type)]">{{ item.lotteryName }}</div>
					<div class="num">
						{{ item.issueNumber }}
						<span class="time">{{ `${item.time1}${item.time2}:${item.time3}${item.time4}` }}</span>
					</div>
					<div class="other">
						<div class="remark">{{ item.remark }}</div>
						<div :class="['gameResult', 'bg-' + item.gameResult]">{{ changegameResult(item.gameResult) }}</div>
						<div class="issue">{{ item.issue }}{{ $t('betIssues') }}</div>
					</div>
				</div>
				<div class="changLong__C-bet-r" :class="{ disable: item.passTime < ProhibitBuyTime }">
					<template v-if="item.gameType == 0">
						<div :class="{ active: item.action == 1 }" @click="bet(item, index, 1, $t('betBig'), 'big')">
							{{ $t('betBig') }}
						</div>
						<div :class="{ active: item.action == 2 }" @click="bet(item, index, 2, $t('betSmall'), 'small')">
							{{ $t('betSmall') }}
						</div>
					</template>
					<template v-if="item.gameType == 1">
						<div :class="{ active: item.action == 1 }" @click="bet(item, index, 1, $t('betRed'), 'red')">
							{{ $t('betRed') }}
						</div>
						<div :class="{ active: item.action == 2 }" @click="bet(item, index, 2, $t('betGreen'), 'green')">
							{{ $t('betGreen') }}
						</div>
						<div :class="{ active: item.action == 3 }" @click="bet(item, index, 3, $t('betViolet'), 'violet')">
							{{ $t('betViolet') }}
						</div>
					</template>
					<template v-if="item.gameType == 2">
						<div :class="{ active: item.action == 1 }" @click="bet(item, index, 1, $t('betOdd'), 'O')">
							{{ $t('betOdd') }}
						</div>
						<div :class="{ active: item.action == 2 }" @click="bet(item, index, 2, $t('betEven'), 'E')">
							{{ $t('betEven') }}
						</div>
					</template>
					<template v-if="item.gameType == 3">
						<div :class="{ active: item.action == 1 }" @click="bet(item, index, 1, $t('betWithSingle'), 'O')">
							{{ $t('betWithSingle') }}
						</div>
						<div :class="{ active: item.action == 2 }" @click="bet(item, index, 2, $t('betWithDouble'), 'E')">
							{{ $t('betWithDouble') }}
						</div>
					</template>
					<template v-if="item.gameType == 4">
						<div :class="{ active: item.action == 1 }" @click="bet(item, index, 1, $t('betWithBig'), 'H')">
							{{ $t('betWithBig') }}
						</div>
						<div :class="{ active: item.action == 2 }" @click="bet(item, index, 2, $t('betWithSmall'), 'L')">
							{{ $t('betWithSmall') }}
						</div>
					</template>
				</div>
			</div>
		</template>
	</div>
	<Popup
		:bettingPopupShow="bettingPopupShow"
		:selectInfo="selectInfo"
		:actionItem="actionItem"
		@clearBetting="clearBetting"
		@submitBetting="submitBetting"
	/>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, triggerRef, watch } from 'vue'
import { AwaitApiResult } from '@/utils'
import { game5DBetting, getLongDragon, k3GameBetting, winGoGameBetting } from '@/api'
import Popup from './BettingPopup.vue'
import { showToast } from 'vant'
import i18n from '@/languages'
import type { WinGo } from '@/types/api'
import { GlobalStore } from '@/stores'
const t = i18n.global.t

const ProhibitBuyTime = 5 // 倒计时设置
const bettingPopupShow = ref(false) // 投注弹框是否展示
const actionItem = ref<any>({}) // 选中的内容
const selectInfo = ref<any>({
	coin: 0, //下注金额
	count: 1, //下注倍数
	allCoin: 0, //下注总额
	gametype: 0, //类型 0 颜色 1数字 2大小
	typeid: 1, //台号1Min 3Min 5Min 10Min
	issuenumber: '2020', //期号
	selecttype: 1, //下注内容
	selectCon: ''
})
const betlist = shallowRef<any>([]) // 长龙投注列表
let timeHandle: any = null // 定时器
/**
 * 下注弹窗
 * @param e 当前选中obj
 * @param index list下标
 * @param action 选中的按钮
 * @param con 游戏名称
 * @param type 游戏类型
 */
const bet = (e: any, index: any, action: any, con: any, type: any) => {
	betlist.value[index].action = action //选中游戏
	actionItem.value = e //游戏种item
	selectInfo.value.selectCon = con //游戏内容
	selectInfo.value.coin = e.scopeList[0] //选中第一个金额
	selectInfo.value.typeid = e.type //游戏id
	selectInfo.value.gametype = e.bettingGameType
	if (e.type > 4 && e.type != 30) {
		if (type == 'big') {
			selectInfo.value.selecttype = 'H'
		} else if (type == 'small') {
			selectInfo.value.selecttype = 'L'
		} else {
			selectInfo.value.selecttype = type
		}
	} else {
		const map = {
			red: 10,
			green: 11,
			violet: 12,
			big: 13,
			small: 14
		}
		selectInfo.value.selecttype = map[type]
	}
	selectInfo.value.issuenumber = e.issueNumber
	bettingPopupShow.value = true
}
const GetLongDataLock = ref(false) // 调用锁
/**
 * 获取长龙投注列表
 */
const GetLongData = async () => {
	if (timeHandle) {
		clearInterval(timeHandle)
	}
	if (GetLongDataLock.value) {
		return
	}
	GetLongDataLock.value = true
	const res = await AwaitApiResult<ObjResNull<WinGo.resGetLongDragon>>(getLongDragon({
		gameType:-1
	}))
	GetLongDataLock.value = false
	if (!res) return
	const serviceTime = res.data.serviceTime
	betlist.value = res.data.list.map((item: any) => {
		let currentTime = new Date(serviceTime).getTime()
		let beginTime = new Date(item.startTime).getTime()
		let gameTime = (currentTime - beginTime) / 1000 //游戏时间 = 服务器时间 -游戏开始时间 如果大于
		if (gameTime > item.intervalM * 60) {
			gameTime = item.intervalM * 60
		}
		item.scopeList = item.scope.split('|').map((sc: string): number => Number(sc))
		// item.multipleList = item.betMultiple.split('|').map((sc: string): number => Number(sc))
		item.passTime = Math.floor(item.intervalM * 60 - gameTime) //游戏剩余的时间，秒
		item.time1 = 0
		item.time2 = Math.floor(item.passTime / 60)
		item.time3 = Math.floor((item.passTime % 60) / 10)
		item.time4 = Math.floor(item.passTime % 10)
		return item
	})
	timeHandle = setInterval(function () {
		subSubTime()
	}, 1000)
}
/**
 * 每秒钟处理参数，判断是否需要重新调用接口
 */
const subSubTime = () => {
	const length = betlist.value.length
	let hasGet = false
	for (let i = 0; i < length; i++) {
		let item = betlist.value[i]
		if (item.passTime < ProhibitBuyTime && item.issueNumber == actionItem.value.issueNumber) {
			clearBetting()
		}
		if (item.passTime > 0) {
			item.time2 = Math.floor(item.passTime / 60)
			item.time3 = Math.floor((item.passTime % 60) / 10)
			item.time4 = Math.floor(item.passTime % 10)
			item.passTime--
		} else {
			hasGet = false
			clearInterval(timeHandle)
			GetLongData()
			break
		}
		hasGet = item.time3 + item.time4 == 0
	}
	triggerRef(betlist)
	if (hasGet) {
		clearInterval(timeHandle)
		GetLongData()
	}
}

/**
 * 清理数据
 */
const clearBetting = () => {
	bettingPopupShow.value = false
	let index = betlist.value.findIndex((item: any) => JSON.stringify(item) == JSON.stringify(actionItem.value))
	if (index != -1) betlist.value[index].action = 0
	selectInfo.value.coin = actionItem.value.scopeList ? actionItem.value.scopeList[0] : 0
	selectInfo.value.count = 1
	actionItem.value = {}
}
/**
 * 提交调用接口
 */
const submitBetting = () => {
	const { typeid = 0 } = selectInfo.value
	if (!typeid) return
	if (typeid < 5 || typeid == 30) {
		WingetChack()
	} else if (typeid < 9) {
		DgetChack()
	} else {
		K3getChack()
	}
}
/**
 * 映射Icon class
 * @param type 游戏类型
 */
const iconType = (type: number) => {
	if (type < 5 || type == 30) {
		return 'winGo'
	} else if (type < 9) {
		return 'Fd'
	} else {
		return 'k3'
	}
}

// WinGo提交投注参数。
const WingetChack = async () => {
	const res = await AwaitApiResult<any>(
		winGoGameBetting({
			typeId: selectInfo.value.typeid,
			issuenumber: selectInfo.value.issuenumber,
			amount: selectInfo.value.coin,
			betCount: Number(selectInfo.value.count),
			gameType: selectInfo.value.gametype,
			selectType: selectInfo.value.selecttype
		})
	)
	if (res?.code === 0) {
		showToast(t('code' + res.msgCode))
		clearBetting()
	}
}

// K3提交投注参数。
const K3getChack = async () => {
	let { coin, count, issuenumber, gametype, selecttype, typeid } = selectInfo.value
	const res = await AwaitApiResult(
		k3GameBetting({
			amount: coin, //下注金额
			betCount: Number(count), //投注份数
			gameType: gametype.toString(),
			selectType: selecttype,
			typeId: typeid,
			issuenumber: issuenumber
		})
	)
	if (res?.code === 0) {
		showToast(t('code' + res.msgCode))
		clearBetting()
	}
}
// FD提交投注参数。
const DgetChack = async () => {
	let { coin, count, issuenumber, gametype, selecttype, typeid } = selectInfo.value
	const params = {
		issuenumber: issuenumber,
		typeId: typeid,
		amount: coin,
		betCount: Number(count),
		gameType: gametype,
		selectType: selecttype
	}
	const res = await AwaitApiResult(game5DBetting(params))
	if (res?.code === 0) {
		showToast(t('code' + res.msgCode))
		clearBetting()
	}
}
/**
 * HL切换文案
 */
const changegameResult = (text: any) => {
	if (text == 'H') return 'B'
	if (text.trim() == 'L') {
		return 'S'
	}
	return text
}
onMounted(() => {
	GetLongData()
})
onBeforeUnmount(() => {
	clearInterval(timeHandle)
})

watch(
	() => GlobalStore().visibility,
	(newVal) => {
		GetLongData()
	}
)
</script>

<style lang="scss" scoped>
.changLong__C {
	padding: 24px 26px;

	:deep(.navbar__content) {
		.van-icon {
			color: var(--text_color_L4);
		}

		.navbar__content-center {
			color: var(--text_color_L4);
		}
	}

	:deep(.van-tabs__line) {
		width: calc(50% - 52px);
		background: var(--colorText-2);
	}

	:deep(.van-tabs__content) {
		padding: 24px 26px;
	}

	&-bet {
		height: 180px;
		width: 100%;
		background: var(--bg_color_L2);
		border-radius: 10px;
		display: flex;
		padding: 18px 14px;

		&-l {
			width: auto;
			flex: none;

			.titel {
				height: 40px;
				line-height: 40px;
				margin-bottom: 18px;
				color: var(--text_color_L1);
				font-size: 26px;
				padding-left: 82px;
				background-position: left;
				background-repeat: no-repeat;
				background-size: 60px 40px;
				html:lang(ar) &{
					background-position: right;

				}

				&.k3 {
					background-image: url('@/assets/icons/home/AllLotteryGames/changlong/icon-k3.png');
				}

				&.Fd {
					background-image: url('@/assets/icons/home/AllLotteryGames/changlong/icon-5d.png');
				}

				&.winGo {
					background-image: url('@/assets/icons/home/AllLotteryGames/changlong/icon-wg.png');
				}
			}

			.num {
				height: 30px;
				margin-bottom: 10px;
				font-size: 24px;
				color: var(--text_color_L2);

				.time {
					color: var(--norm_red-color);
				}
			}

			.other {
				height: 48px;
				line-height: 48px;
				display: flex;

				& > div {
					color: var(--text_color_L4);
					font-size: 24px;

					& + div {
						margin-left: 6px;
					}
				}

				.remark {
					color: var(--text_color_L1);
					background: var(--button_dis_color);
					padding: 0 14px;
				}

				.issue {
					background: var(--main-color);
					color: var(--text_color_L4);
					padding: 0 14px;
				}

				.gameResult {
					padding: 0 10px;

					&.bg-L,
					&.bg-O {
						background-color: var(--norm_secondary-color);
						color: var(--text_color_L4);
					}

					&.bg-red,
					&.bg-E {
						background-color: var(--norm_red-color);
						color: var(--text_color_L4);
					}

					&.bg-violet {
						background-color: var(--norm_Purple-color);
						color: var(--text_color_L4);
					}

					&.bg-green,
					&.bg-small,
					&.bg-H {
						background-color: var(--norm_bule-color);
						color: var(--text_color_L4);
					}
				}
			}
		}

		&-r {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			& > div {
				width: 100px;
				height: 60px;
				line-height: 60px;
				text-align: center;
				border: 0.5px solid var(--main-color);
				border-radius: 8px;
				font-size: 24px;
				color: var(--main-color);

				&.active {
					background: var(--main-color);
					color: var(--text_color_L4);
				}

				& + div {
					margin-left: 16px;
				}
			}

			&.disable {
				& > div {
					pointer-events: none;
					background-color: var(--button_dis_color);
					color: var(--text_color_L4);
					border: 0.5px solid var(--button_dis_color);

					&.active {
						background-color: var(--button_dis_color);
						color: var(--text_color_L4);
					}
				}
			}
		}

		& + div {
			margin-top: 16px;
		}
	}
}
</style>
