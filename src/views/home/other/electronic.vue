<template>
	<div id="home">
		<NavBar list="">
			<template #left>
				<img style="height: 40px" :src="projectIcon" alt="" />
			</template>
			<template #right>
				<div class="content__right">
					<svg-icon v-if="(apkStore.apk.value) != ApkType.FullApk" @click.stop="onDown" name="down" class="home_down"></svg-icon>
					<svg-icon @click="goToCustomer" name="server"></svg-icon>
				</div>
			</template>
		</NavBar>

		<!-- 未登录提示 -->
		<div class="content">
			<!-- 头部轮播图 -->
			<Swiper />

			<!-- 滚动通知栏 -->
			<NoticeBar key="home" :isHome="true" />

			<!-- 游戏栏 -->
			<Tabs @tab-change="tabChange" ref="tabsRef" :tab-list="tabs as any" v-model:current-menu="currentMenu" />

			<Slot v-show="tabs[currentMenu].type === 'slot'" key="slots" />
			<Video v-show="tabs[currentMenu].type === 'video'" key="video"></Video>
			<div id="game_content"></div>
			<!-- <GameItem type="2" :game-type="3" :game-item="test" /> -->
			<div v-show="!['slot', 'video'].includes(tabs[currentMenu].type)">
				<div v-for="item in allGameList" :key="item.gameType + currentMenu">
					<AloneGame @go-all="handleGoAll" v-show="getIsShow(item)" :title="item.showTitle"
						:game-type="item.gameType" :game-list="item.gameList" :key="item.gameType"
						:is-all="getIsAll(item.gameType)" :is-show-more="currentMenu !== 0"
						:currentMenuType="currentMenu" :isShowBtn="showBtn(item)" />
				</div>
			</div>

			<!-- 热门、彩票、游戏选项卡 -->

			<!-- 中奖信息 -->
			<Winning />

			<!-- 今日盈利排行榜 -->
			<Profit />

			<!-- 说明 -->
			<Instructions />
			<!-- 长龙-->
			<!-- <ChangLong /> -->
			<!--下载PWA应用-->
			<!-- 邀请转盘 -->
			<!-- <InviteTurntable /> -->
			<DownloadPWA />
			<Turntable />
</div>
	</div>
</template>

<script setup lang="ts">
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import Turntable from '@/components/common/Turntable.vue'
import { getSiteMessageList, } from '@/api'
import type { MessageDataList } from '@/types/api'
import { AwaitApiResult, deepCopy } from '@/utils'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Tabs from '@/components/Home/Electronic/Tabs/index.vue'
import AloneGame from '@/components/Home/Electronic/AloneGame/index.vue'
import Winning from '@/components/Home/Electronic/Winning/index.vue'
// // import InviteTurntable from '@/components/common/InviteTurntable.vue'
import Profit from '@/components/Home/Electronic/Profit/index.vue'
import { useI18n } from 'vue-i18n'
import Instructions from '@/components/Home/Electronic/Instructions/index.vue'
import { useHome } from '@/hooks'
import Slot from '@/components/Home/Electronic/Slot/index.vue'
import Video from '@/components/Home/Electronic/Video/index.vue'
import { useServer } from "@/hooks/useServe.hook";
const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
import { useApkState, ApkType } from '@/stores/apk'
const {
	onDown,
	getMessagesData,
	homeState,
	getAllGame,
	getGameType,
	projectIcon
} = useHome()
const { t, locale } = useI18n()

type AllGame = {
	isAll: boolean
	img: string
	isShow: boolean
	gameList: any[]
	gameType: string
	title: string
	showTitle: string
}[]

const router = useRouter()
const sitemsg = ref<MessageDataList[]>([])
const tabsRef = ref()
const allGameList = reactive<AllGame>([])
const currentMenu = ref(0)
const apkStore = useApkState()

const showBtn = (item: any) => {
	return currentMenu.value === 0 && item.gameType !== 'slot'
}

const getIsAll = (type: string) => {
	if (type === 'popular' && currentMenu.value === 0) {
		return true
	} else if (type === 'slot' && currentMenu.value === 0) {
		return true
	}
	if (currentMenu.value === 0) {
		return false
	}
	return true
}

const currentGame = computed(() => {
	let index = allGameList.findIndex((item) => item.gameType === tabs[currentMenu.value].type)
	return index < 0 ? -1 : index
})

const getIsShow = (item: { gameType: string; gameList: string | any[]; isShow: any }) => {
	if (item.gameType === 'bigaward' && currentGame.value === -1) {
		return item.isShow
	}
	return (currentMenu.value === 0 || allGameList[currentGame.value]?.gameType === item.gameType) && item.gameList.length > 0
}
const tabChange = (val: any) => {
	let { item } = val
	sessionStorage.setItem('currentMenu', item.type)
}

function goToCustomer() {
	// router.push({ name: 'CustomerService' })
	getSelfCustomerServiceLink()
}
/**
 * @description: 获取游戏数据
 * @return {*}
 */
const getGameList = async () => {
	await getGameTypeList()
	let activeMenu = sessionStorage.getItem('currentMenu')
	currentMenu.value = activeMenu ? tabs.findIndex((item) => item.type === activeMenu) : 0
	await getAllGame()
	const gamelist: any = deepCopy(homeState.allGameList)
	allGameList.forEach((item) => {
		if (item.gameType === 'clicksTopList') {
			item.gameList = gamelist['popular'].clicksTopList
		} else if (item.gameType === 'platformList') {
			item.gameList = gamelist['popular'].platformList
		} else if (item.gameType === 'bigaward') {
			item.gameList = gamelist['awardrecordlist'] || []
		} else if (item.gameType === 'video') {
			item.gameList = gamelist['popular'].clicksVideoTopList || []
		} else {
			item.gameList = gamelist[item.gameType]
		}
		if (!item.gameList) {
			item.isShow = false
		}
	})

	sessionStorage.setItem('allGameList', JSON.stringify(allGameList))
	sessionStorage.setItem('gameData', JSON.stringify(homeState.allGameList))
}

const handleGoAll = (type: number) => {
	router.push({
		name: 'AllGames',
		query: {
			type
		},
	})
}
const webSit = import.meta.env.VITE_PNGSTART;
const tabs = reactive<
	{
		title: string
		type: string
		isShow: boolean
		img: string
	}[]
>([
	{
		title: t('all'),
		type: 'all',
		img: webSit === 'ar081' ? 'all2' : 'all',
		isShow: true
	}
])

const getGameTypeList = async () => {
	await getGameType()
	homeState.gameTypeList.forEach((item) => {
		tabs.push({
			title: t('code' + item.typeNameCode + item.categoryCode),
			type: item.categoryCode.toLocaleLowerCase(),
			isShow:
				item.state === 1 &&
				item.categoryCode.toLocaleLowerCase() !== 'popular' &&
				item.categoryCode.toLocaleLowerCase() !== 'bigaward',
			img: item.categoryImg
		})
		if (item.categoryCode.toLocaleLowerCase() === 'popular') {
			allGameList.push({
				isAll: false,
				img: item.categoryImg,
				isShow: true,
				gameList: [],
				gameType: 'platformList',
				title: t('characteristical'),
				showTitle: t('characteristical')
			})
		}
		allGameList.push({
			isAll: false,
			img: item.categoryImg,
			isShow: item.state === 1,
			gameList: [],
			gameType:
				item.categoryCode.toLocaleLowerCase() === 'popular' ? 'clicksTopList' : item.categoryCode.toLocaleLowerCase(),
			title: t('code' + item.typeNameCode),
			showTitle: t('code' + item.typeNameCode + item.categoryCode)
		})
	})
}
const init = async () => {
	await getGameList()
	// 获取通知消息，判断是否已读
	await getMessagesData()
}
init()

// 获取系统消息
const getSiteMsg = async () => {
	const res = await AwaitApiResult(getSiteMessageList({ pageNo: 1, pageSize: 5 }))
	if (res) {
		sitemsg.value = res.data.list
	}
}
onMounted(getSiteMsg)
// 公告内容由后端按语言返回，切换语言后需重新拉取
watch(locale, getSiteMsg)
</script>

<style lang="scss" scoped>
:deep() .van-dialog {
	width: 622px;
	height: 930px;
	border-radius: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;

	&__content {
		position: relative;
		width: 100%;


	}

	&__footer {
		z-index: 100;
		position: fixed;
		bottom: 30px;
		display: flex;
		flex-grow: 1;
		gap: 20px;
		width: 90%;
	}

	.van-button__text {
		color: #fff;
		width: 80%;
		height: 70px;
		text-align: center;
		line-height: 70px;
		background: var(--main_gradient-color);
		border-radius: 80px;
		z-index: 100;
		font-weight: 700;
		font-size: 32px;
		font-style: normal;
		letter-spacing: 5px;
	}

}

.content__right {
	display: flex;
	gap: 20px;

	.homeIcon {
		width: 48px;
		height: 48px;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	svg {
		width: 48px;
		height: 48px
	}
}

#home {
	padding-bottom: 200px;

	.swiper_box {
		padding: 0;
		margin: 20px 0;
	}
}
</style>
