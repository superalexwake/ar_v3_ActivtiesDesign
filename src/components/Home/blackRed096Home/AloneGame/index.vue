<!--
 * @Description: ar096 版面专属 AloneGame，从 Electronic/AloneGame 复制后改造：
 *  1. 普通分类默认每页 6 个（2 排 × 3 列），原版每页 3 个（1 排）
 *  2. handleOffset 加边界守卫，到首/尾不再循环切换
-->
<template>
	<div class="aloneGame">
		<div class="header">
			<div :class="[sitWebName ? 'title2' : 'title']" v-if="isShowTitle">
				<i class="icons" :class="`icons-${gameType}`" />
				{{ title }}
				<div v-if="gameType !== 'bigaward'" @click="handleGoAll">
					<span class="all">ALL</span>
					<span class="len">{{ gameList.length }}</span>
				</div>
			</div>
			<div class="right_btn" v-if="isShowBtn">
				<van-icon name="arrow-left" :class="{ active: swipeIndex == 0 }" @click="handleOffset('left')" />
				<van-icon name="arrow" :class="{ active: swipeIndex === getGameList.length - 1 }" @click="handleOffset('right')" />
			</div>
		</div>
		<div v-if="gameType === 'flash'" class="flash_desc">{{ $t('flashDesc', [store.getProjectName]) }}</div>
		<div v-if="gameType === 'bigaward'" class="flash_desc awar_desc">
			{{ $t('awarDesc1') }} {{ $t('awarDesc2') }}
			<span class="amount" :class="[sitWebName && 'amount2']">{{ currency(getBigAward) }}</span>
		</div>
		<Swipe
			class="my-swipe"
			ref="swipeRef"
			:autoplay="['flash', 'lottery', 'sport', 'fish', 'bigaward', 'video'].includes(gameType) ? 9000 : '-'"
			@change="swipeChange"
			:lazy-render="false"
			:show-indicators="false"
		>
			<SwipeItem
				v-for="(item, x) in getGameList"
				:key="gameType + x"
				:class="{
					isShowAll: isAll,
					gys: gameType === 'slot' && isAll && currentMenuType === 0,
					'slot-grid': gameType === 'slot'
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
		<div class="look_all" v-if="isShowMore && gameList.length > 6" @click="handleGoAll">{{ t('viewAll') }}</div>
		<div class="look_all look_awar" v-if="gameType === 'bigaward'" @click="handleGoAwar">{{ $t('lookBigAward') }}</div>
		<div class="ChangLong" v-if="gameType === 'lottery' && store.isShowLotteryDragon" :class="[projectName && 'game51']" @click="changlongEnter"></div>
	</div>
</template>
<script setup lang="ts">
import { currency } from '@/utils'
import GameItem from '@/components/Home/Electronic/GameItem/index.vue'
import { computed, ref } from 'vue'
import { useEventBus } from '@/components/common/use'
import { Swipe, SwipeItem, type SwipeInstance } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { SettingStore } from '@/stores'
import { useHome } from '@/hooks'
import { requireLoginAction } from '@/hooks/useLoginIntercept'

const { isAlowGame, goChangLong } = useHome()
const { t } = useI18n()
const projectName = import.meta.env.VITE_BASE_PROJECTNAME === 'ar023'
const sitWebName = import.meta.env.VITE_BASE_PROJECTNAME === 'ar019'
const eventBus = useEventBus()
const router = useRouter()
const emit = defineEmits(['goAll'])
const swipeRef = ref<SwipeInstance>()
const store = SettingStore()

interface Props {
	title: string
	isAll?: boolean
	gameType: string
	gameList: FishingAndMiniGameAndHot[] | OtherGame[] | Lottery[]
	isShowMore?: boolean
	currentMenuType?: number
	isShowBtn?: boolean
	isShowTitle?: boolean
}

type FishingAndMiniGameAndHot = {
	vendorId: string
	gameCode?: string
	imgUrl?: string
	img?: string
	gameID?: string
	gameNameEn?: string
}

type OtherGame = {
	slotsTypeID: number
	slotsName: string
}

type Lottery = {
	name: string
	value: boolean
}

const props = withDefaults(defineProps<Props>(), {
	isAll: false,
	isShowMore: false,
	isShowBtn: false,
	isShowTitle: true
})

// 普通分类默认每页展示的游戏数量（3 列 × 2 排 = 6）
const DEFAULT_PAGE_SIZE = 6
// Slot 分类特殊：2 列 × 5 排 = 10 个/页（slot 卡片较宽，单排放 2 个更贴合视觉）
const SLOT_PAGE_SIZE = 10

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

const getBigAward = computed(() => store.getJackportMaxReswadAmount)

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
	}
	return '2'
})

// 将数组分割成多个等长子数组
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
 * 与 Electronic/AloneGame 区别：
 *  - 普通分类：每页 6 个（2 排），原版 3 个（1 排）
 *  - Slot 分类：每页 15 个（5 排），原版只在 currentMenu===0 时全展开
 */
const getGameList = computed(() => {
	if (props.isAll) {
		return chunk(props.gameList, props.gameList.length)
	}
	if (props.currentMenuType === 0 && (props.gameType === 'clicksTopList' || props.gameType === 'platformList')) {
		const list = props.gameList
		if (list.length > 6) return chunk(list, 6)
		return chunk(props.gameList, list.length)
	}
	if (props.gameType === 'slot') {
		return chunk(props.gameList, SLOT_PAGE_SIZE)
	}
	return chunk(props.gameList, DEFAULT_PAGE_SIZE)
})

/**
 * 左右切换：到首/尾不再循环（原版 Vant Swipe 默认 loop:true，置灰也能点回另一端）
 */
const handleOffset = (type: string): void => {
	const lastIndex = getGameList.value.length - 1
	if (type === 'left') {
		if (swipeIndex.value <= 0) return
		swipeRef.value?.prev()
	} else {
		if (swipeIndex.value >= lastIndex) return
		swipeRef.value?.next()
	}
}

const handleGoAwar = async () => {
	if (!(await requireLoginAction())) return
	router.push({ path: '/main/SuperJackpot' })
}

const swipeIndex = ref(0)
const swipeChange = (index: number) => {
	swipeIndex.value = index
}

const changlongEnter = async () => {
	if (!(await requireLoginAction())) return
	isAlowGame('', goChangLong)
}

const handleGoAll = async () => {
	if (props.gameType === 'bigaward' && !(await requireLoginAction())) return
	eventBus.emit('changeKeepAliveKey')
	if (props.gameType === 'clicksTopList' || props.gameType === 'platformList') {
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
		.title,
		.title2 {
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
				width: 140px;
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
				border-radius: 8px;
				text-align: center;
				line-height: 48px;
				&.active {
					opacity: 0.5;
					// ar096 专属：到边界时不再可点
					pointer-events: none;
					cursor: default;
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
			color: #f74747;
		}
		.amount2 {
			color: var(--main-color);
		}
	}
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
	margin-top: 24px;
	margin-bottom: 24px;
}
.my-swipe .van-swipe-item {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;
	height: 100%;
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
// Slot 分类：2 列 × 5 排
.my-swipe .slot-grid {
	grid-template-columns: repeat(2, 1fr);
}
.ChangLong {
	width: 100%;
	height: 160px;
	background: url('@/assets/icons/home/changlong96_bg.png') no-repeat center center;
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
