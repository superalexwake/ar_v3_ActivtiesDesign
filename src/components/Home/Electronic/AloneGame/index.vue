<!--
 * @Author: Seven
 * @Date: 2023-04-18 09:28:41
 * @LastEditTime: 2024-03-23 16:07:58
 * @LastEditors: Seven
 * @Description: 单独游戏展示
-->
<template>
	<div class="aloneGame">
		<div class="header">
			<div :class="[sitWebName?'title2':'title']" v-if="isShowTitle">
				<i class="icons" :class="`icons-${gameType}`" />
				{{ title }}
				<div v-if="gameType !== 'bigaward'" @click="handleGoAll">
					<span class="all">ALL</span>
					<span class="len">{{ gameList.length }}</span>
				</div>
			</div>
			<div class="right_btn" v-if="isShowBtn">
				<van-icon name="arrow-left" :class="{active:swipeIndex==0}" @click="handleOffset('left')" />
				<van-icon name="arrow" :class="{active:swipeIndex===getGameList.length-1}" @click="handleOffset('right')" />
			</div>
		</div>
		<div v-if="gameType === 'flash'" class="flash_desc">{{ $t('flashDesc', [store.getProjectName]) }}</div>
		<div v-if="gameType === 'bigaward'" class="flash_desc awar_desc">
			{{ $t('awarDesc1') }} {{ $t('awarDesc2') }} <span class="amount" :class="[sitWebName&&'amount2']">{{ currency(getBigAward) }}</span>
		</div>
		<Swipe
			class="my-swipe"
			ref="swipeRef"
			:autoplay="['flash','lottery','sport','fish', 'bigaward', 'video'].includes(gameType) ?  9000 :'-'"
			@change="swipeChange"
			:lazy-render="false"
			:show-indicators="false"
		>
			<SwipeItem
				v-for="(item, x) in getGameList"
				:key="gameType + x"
				:class="{
					isShowAll: isAll,
					gys: gameType === 'slot' && isAll && currentMenuType === 0
				}"
			>
				<GameItem
					class="item_two"
					:game-type="gameType"
					:game-item="suc"
					v-for="(suc, index) in item"
					:key="getKeys(suc, index)"
					:type="getType"
					:is-width="isAll"
				/>
			</SwipeItem>
		</Swipe>
		<div class="look_all" v-if="isShowMore && gameList.length > 9" @click="handleGoAll">{{ t('viewAll') }}</div>
		<div class="look_all look_awar" v-if="gameType === 'bigaward'" @click="handleGoAwar">{{ $t('lookBigAward') }}</div>
		<div class="ChangLong" v-if="gameType === 'lottery'&&store.isShowLotteryDragon" :class="[projectName&&'game51']" @click="changlongEnter">
		</div>
	</div>
</template>
<script setup lang="ts">
import { currency } from '@/utils'
import GameItem from '../GameItem/index.vue'
import { computed, ref } from 'vue'
import { useEventBus } from '@/components/common/use'
import { Swipe, SwipeItem, type SwipeInstance } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { SettingStore, GlobalStore } from '@/stores'
import { useHome } from '@/hooks'
import { requireLoginAction } from '@/hooks/useLoginIntercept'
const {isAlowGame,goChangLong } = useHome()
const globalStore = GlobalStore()
const { t } = useI18n()
const projectName=import.meta.env.VITE_BASE_PROJECTNAME === 'ar023';
const sitWebName=import.meta.env.VITE_BASE_PROJECTNAME === 'ar019';
const eventBus = useEventBus()
const router = useRouter()
const emit = defineEmits(['goAll'])
const swipeRef = ref<SwipeInstance>()
const store = SettingStore()
// const gameData = computed<any>(() => homeState.allGameList)
// 定义组件props
interface Props {
	title: string // 标题
	isAll?: boolean // 是否展示全部游戏
	gameType: string // 游戏类型
	gameList: FishingAndMiniGameAndHot[] | OtherGame[] | Lottery[] // 游戏列表
	isShowMore?: boolean // 是否展示查看全部按钮
	currentMenuType?: number // 当前游戏类型
	isShowBtn?: boolean // 是否展点击切换示按钮
	isShowTitle?: boolean // 是否展示标题
}

// 电子类游戏
type FishingAndMiniGameAndHot = {
	vendorId: string // 供应商ID
	gameCode?: string // 游戏代码
	imgUrl?: string // 图片URL
	img?: string // 图片
	gameID?: string // 游戏ID
	gameNameEn?: string // 游戏英文名
}

// 三方的游戏
type OtherGame = {
	slotsTypeID: number // 游戏类型ID
	slotsName: string // 游戏类型名称
}

// 游戏类型为Lottery的游戏
type Lottery = {
	name: string // 游戏名称
	value: boolean // 布尔值
}

const props = withDefaults(defineProps<Props>(), {
	isAll: false,
	isShowMore: false,
	isShowBtn: false,
	isShowTitle: true
})

/**
 * @description: 获取key
 * @param {*} item
 * @param {*} index
 * @return {*}
 */
const getKeys = (item: FishingAndMiniGameAndHot | OtherGame | Lottery, index: number) => {
	switch (props.gameType) {
		case 'lottery':
			return (item as Lottery).name + '' + index
		case 'all':
		case 'clicksTopList':
		case 'platformList':
		case 'fish':
		case 'flash':
			return (item as FishingAndMiniGameAndHot).vendorId + '' + index
		default:
			return (item as OtherGame).slotsTypeID + '' + index
	}
}

const getBigAward = computed(() => {
	return store.getJackportMaxReswadAmount
})

/**
 * @description: 获取类型
 * @param {*} computed
 * @return {*}
 */
const getType = computed(() => {
	const gameType = props.gameType
	if (
		gameType === 'flash' ||
		gameType === 'slot' ||
		gameType === 'fish' ||
		gameType === 'clicksTopList' ||
		gameType === 'platformList'
	) {
		return '1'
	} else {
		return '2'
	}
})

// 实现将数组内的数据按照个数分割成多个数组
const chunk = (arr: any[], size: number) => {
	const result = []
	for (let x = 0; x < Math.ceil(arr.length / size); x++) {
		const start = x * size
		const end = start + size
		result.push(arr.slice(start, end))
	}
	return result
}

/**
 * @description: 获取游戏列表，根据游戏类型不同当前选取的菜单，分割成不同的数量数组
 * @param {*} computed
 * @return {*}
 */
const getGameList = computed(() => {
	if (props.isAll) {
		return chunk(props.gameList, props.gameList.length)
	}
	// 如果当前是选择全部，并且是热门游戏，计算出热门游戏的数组，如果大于15个，只取前15个，否则全部取出，然后分割成9个一组
	if (props.currentMenuType === 0 && (props.gameType === 'clicksTopList' || props.gameType === 'platformList')) {
		let gameList = props.gameList
		if (gameList.length > 6) {
			return chunk(gameList, 6)
		} else {
			return chunk(props.gameList, gameList.length)
		}
	} else if (props.currentMenuType === 0 && props.gameType === 'slot') {
		return chunk(props.gameList, props.gameList.length)
	}
	return chunk(props.gameList, 3)
	// if (props.currentMenuType === 0 && props.gameType === 'bigaward') {
	// 	return chunk(props.gameList.slice(0, 6), 3)
	// } else {
	// 	return chunk(props.gameList, 3)
	// }
})

/**
 * @description: 左右滚动游戏
 * @param {*} type
 * @return {*}
 */
const handleOffset = (type: string): void => {
	if (type === 'left') {
		swipeRef.value?.prev()
	} else {
		swipeRef.value?.next()
	}
}

const handleGoAwar = async () => {
	if (!(await requireLoginAction())) return
	router.push({
		path: '/main/SuperJackpot'
	})
}
const swipeIndex=ref(0);
const swipeChange = (index: number) => {
	swipeIndex.value=index;
}

// /**
//  * @description: 动态获取swipe的高度
//  * @param {*} computed
//  * @return {*}
//  */
// const swipeHeight = computed(() => {
// 	if (props.gameType === 'clicksTopList' || props.gameType === 'platformList') {
// 		return 'auto'
// 	} else if (props.gameType === 'slot') {
// 		return 660 / 2 + 'px'
// 	}
// })

// 跳转入口页面
const changlongEnter = async() => {
	if (!globalStore.token) {
		router.push({ name: 'login' })
		return
	}
	isAlowGame('',goChangLong)
}
const handleGoAll = async () => {
	if (props.gameType === 'bigaward' && !(await requireLoginAction())) return
	eventBus.emit('changeKeepAliveKey')
	if(props.gameType === 'clicksTopList' || props.gameType === 'platformList') {
		emit('goAll', 'popular')
		return
	}
	emit('goAll', props.gameType)
}
</script>
<style lang="scss" scoped>
.aloneGame {
	width: 100%;
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		.title, .title2 {
			font-size: 30px;
			display: flex;
			align-items: center;

			&.title {
				color: var(--text_color_L1);
			}

			&.title2 {
				color: var(--main-color);
			}

			.icons {
				display: block;
				width: 42px;
				height: 42px;
				margin-right: 14px;
				background: no-repeat center / contain;
			}

			@each $t in (all, bigaward, chess, clicksTopList, platformList, fish, flash, lottery, slot, sport, video, winning) {
				.icons-#{$t} { background-image: url('@public/electronic/#{$t}.png'); }
			}

			div {
				display: inline-block;
				width: 130px;
				height: 48px;
				background-color: var(--bg_color_L2);
				border-radius: 8px;
				font-size: 26px;
				line-height: 50px;
				cursor: pointer;
				margin-left: 10px;

				.all {
					color: var(--text_color_L3);
					margin-left: 20px;
				}

				.len {
					color: var(--text_color_L1);
					margin-left: 20px;
				}
			}
		}
		.right_btn {
			display: flex;
			align-items: center;
			i {
				width: 48px;
				height: 48px;
				margin-left: 10px;
				background: var(--main_gradient-color);
				color: var(--textW);
				font-size: 32px;
				border-radius:8px;
				text-align: center;
				line-height: 48px;
				&.active{
					opacity: 0.5;
				}
			}
		}
	}
	.flash_desc {
		font-size: 24px;
		color: var(--text_color_L1);
	}
	.awar_desc {
		.amount {
			color: #F74747;
		}
		.amount2 {
			color: var(--main-color);
		}
	}
	.three_item {
		width: 100%;
		height: 288px;
		overflow-x: hidden;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		position: relative;
		.contents {
			height: 218px;
			display: -webkit-box;
			white-space: nowrap;
			padding: 0;
			position: absolute;
			left: 0;
			top: 0;
			html:lang(ar) &{
				left: unset;
				right: 0;
			}
			.item {
				margin-right: 18px;
				display: inline-block;
			}
			// .item:nth-child(3n) {
			// 	margin-right: 0;
			// }
		}
	}
	.three_item3 {
		height: 218px;
		.contents3 {
			height: 218px;
		}
	}
	.three_item22 {
		height: 218px;
	}
	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background: transparent;
	}
	.all_item {
		.item_one {
			margin-bottom: 18px;
		}
		.item_two {
			margin: 0 auto 18px;
			display: flex;
			justify-content: center;
		}
	}
	.look_all {
		margin: 48px auto 48px;
		width: 288px;
		height: 60px;
		background: var(--main_gradient-color);
		box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
		border-radius: 30px;
		font-size: 24px;
		font-weight: 500;
		color: #fff;
		text-align: center;
		line-height: 60px; 
		cursor: pointer;
	}
	//.look_qian{
	//	display: flex;
	//	width: 100%;
	//	height: 70px;
	//	margin-top: 24px;
	//	padding: 20px 10px;
	//	border-radius: 50px;
	//	background: linear-gradient(180deg, #FE6868 -0.23%, #F74747 99.78%);
	//	//flex-direction: column;
	//	justify-content: center;
	//	align-items: center;
	//	color: var(--text_color_L4);
	//	text-align: center;
	//	font-family: 'Roboto';
	//	font-size: 24px;
	//	font-weight: 400;
	//}
	.look_awar {
		display: flex;
		width: 100%;
		height: 70px;
		margin-top: 24px;
		padding: 20px 10px;
		justify-content: center;
		align-items: center;
		border-radius: 50px;
		color: var(--Home-Hot-Slot-Slide-2-Nero, #001534);
		text-align: center;
		font-family: 'Roboto';
		font-size: 24px;
		font-weight: 400;
	}
}
.my-swipe {
	margin-top:24px;
	margin-bottom:24px;
}
.my-swipe .van-swipe-item {
	width: 100%;
	// height: v-bind(swipeHeight);
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;
	height: 100%;
	// justify-items: center;
	.item_one {
		height: 100%;
		margin-bottom: 18px;
	}
	.item_two {
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}
}
.my-swipe .isShowAll {
	height: auto;
}
.my-swipe .gys {
	grid-template-columns: repeat(2, 1fr);
	border-radius: 0;
}
.ChangLong {
	width: 100%;
	height: 160px;
	background: url('@/assets/icons/home/changlong_bg.png') no-repeat center center;
	background-size: contain;
	position: relative;
	padding-top: 18px;
	margin-bottom: 40px;
	cursor: pointer;
	&.game51 {
		background: url('@/assets/icons/home/changlong51_bg.jpg') no-repeat center center;
		background-size: contain;
	}
}
</style>
