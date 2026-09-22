<template>
	<div id="home">
		<NavBar list="" :class="{ 'navbar-collapsed': isMenuSticky }">
			<template #left>
				<img style="height: 40px" :src="projectIcon" alt="" />
			</template>
			<template #right>
				<div class="content__right">
					<svg-icon
						v-if="apkStore.apk.value != ApkType.FullApk"
						@click.stop="onDown"
						name="down"
						class="home_down"
					></svg-icon>
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

			<!-- IntersectionObserver 哨兵：用于检测 MenuItem 是否吸顶（提前 NavBar 高度触发） -->
			<div ref="stickySentinel" class="sticky-sentinel" aria-hidden="true"></div>
			<!-- 游戏栏 -->
			<MenuItem :tab-list="tabs as any" v-model:current-menu="currentMenu" @tab-change="tabChange" />

			<div id="game_content"></div>
			<!-- 所有分类常驻显示，tab 切换为锚点跳转 -->
			<div v-for="item in allGameList" :key="item.gameType" :id="`section-${item.gameType}`">
				<AloneGame
					@go-all="handleGoAll"
					v-show="item.gameList.length > 0"
					:title="item.showTitle"
					:game-type="item.gameType"
					:game-list="item.gameList"
					:is-all="false"
					:is-show-more="true"
					:currentMenuType="currentMenu"
					:isShowBtn="true"
				/>
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
import { getSiteMessageList } from '@/api'
import type { MessageDataList } from '@/types/api'
import { AwaitApiResult, deepCopy } from '@/utils'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useRouter } from 'vue-router'
import MenuItem from '@/components/Home/blackRed096Home/MenuItem/index.vue'
import AloneGame from '@/components/Home/blackRed096Home/AloneGame/index.vue'
import Winning from '@/components/Home/Electronic/Winning/index.vue'
// // import InviteTurntable from '@/components/common/InviteTurntable.vue'
import Profit from '@/components/Home/Electronic/Profit/index.vue'
import { useI18n } from 'vue-i18n'
import Instructions from '@/components/Home/Electronic/Instructions/index.vue'
import { useHome } from '@/hooks'
import { useServer } from '@/hooks/useServe.hook'
const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
import { useApkState, ApkType } from '@/stores/apk'
const { onDown, getMessagesData, homeState, getAllGame, getGameType, projectIcon } = useHome()
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
// const tabsRef = ref()
const allGameList = reactive<AllGame>([])
const currentMenu = ref(0)
const apkStore = useApkState()

// 哨兵离开视口顶部时即认为 MenuItem 已吸顶；rootMargin 提前 20px 触发，让 NavBar 收起动画跑完
const isMenuSticky = ref(false)
const stickySentinel = ref<HTMLElement | null>(null)

useIntersectionObserver(
	stickySentinel,
	([entry]) => {
		isMenuSticky.value = !entry.isIntersecting
	},
	{ rootMargin: '-20px 0px 0px 0px' }
)

// 滚动联动 tab 高亮：监听每个 section，谁的顶部进入吸顶菜单下方那一带，谁就是当前 tab
const sectionEls = ref<HTMLElement[]>([])

// allGameList 渲染完后采集所有 section DOM
watch(
	() => allGameList.length,
	async (len) => {
		if (len === 0) return
		await nextTick()
		sectionEls.value = allGameList
			.map((s) => document.getElementById(`section-${s.gameType}`))
			.filter((el): el is HTMLElement => !!el)
	},
	{ flush: 'post' }
)

useIntersectionObserver(
	sectionEls as any,
	(entries) => {
		// 程序滚动期间忽略 spy（避免点 tab 时 currentMenu 被中间 section 覆盖）
		if (Date.now() < suppressSpyUntil) return
		// 取所有当前在"高亮带"内的 section，挑顶部最靠上的那个作为活跃项
		const intersecting = entries.filter((e) => e.isIntersecting)
		if (intersecting.length === 0) return
		const topmost = intersecting.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
		const id = (topmost.target as HTMLElement).id
		const gameType = id.replace(/^section-/, '')
		const tabIndex = tabs.findIndex((t) => t.type === gameType)
		if (tabIndex >= 0 && tabIndex !== currentMenu.value) {
			currentMenu.value = tabIndex
		}
	},
	// 高亮带：从吸顶菜单下方 92px 起 ~ 距视口顶部 15% 的范围
	{ rootMargin: '-92px 0px -85% 0px', threshold: 0 }
)

// 由 tab 点击触发的程序滚动期间临时屏蔽 scroll spy，避免经过中间 section 时 tab 闪跳
let suppressSpyUntil = 0

const tabChange = (val: any) => {
	const { item } = val

	// 所有 tab 统一按锚点滚动：找 section-{type}，留出吸顶 MenuItem 的高度
	nextTick(() => {
		const section = document.getElementById(`section-${item.type}`)
		const menu = document.querySelector('.menu_list') as HTMLElement | null
		if (!section || !menu) return
		const targetY = section.getBoundingClientRect().top + window.scrollY - menu.offsetHeight
		// 给 smooth scroll 留出 1s 时间窗口，期间忽略 scroll spy 的 tab 切换
		suppressSpyUntil = Date.now() + 1000
		window.scrollTo({ top: targetY, behavior: 'smooth' })
	})
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
	// 每次进入首页都从 Popular 开始，避免 tab 状态与滚动位置不同步
	currentMenu.value = 0
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
		}
	})
}
// tabs 跟 allGameList 都从 API 同步，确保 tab 跟 section 一一对应
const tabs = reactive<
	{
		title: string
		type: string
		isShow: boolean
		img: string
	}[]
>([])

const getGameTypeList = async () => {
	await getGameType()
	homeState.gameTypeList.forEach((item) => {
		// 接口未启用的分类直接跳过（接口少一个，前端就少一个）
		if (item.state !== 1) return
		// BigAward 不作为常规分类展示（与其它主题保持一致）
		if (item.categoryCode === 'BigAward') return

		const code = item.categoryCode.toLocaleLowerCase()
		// 翻译 key 与 ar013 保持一致：单拼 'code' + typeNameCode
		const title = t('code' + item.typeNameCode)

		// tab 图走本地 src/assets/{theme}/icons/home/tabHome/{code}.png（不用后端 CDN 图）
		if (code === 'popular') {
			// 第一个 tab 锚定到 platformList section
			tabs.push({
				title,
				type: 'platformList',
				isShow: true,
				img: 'popular'
			})
			// platformList = 平台位推荐
			allGameList.push({
				isAll: false,
				img: item.categoryImg,
				isShow: true,
				gameList: [],
				gameType: 'platformList',
				title: t('platRecom'),
				showTitle: t('platRecom')
			})
			// clicksTopList = 点击热门榜，保留 section 但不单独占 tab
			allGameList.push({
				isAll: false,
				img: item.categoryImg,
				isShow: true,
				gameList: [],
				gameType: 'clicksTopList',
				title,
				showTitle: title
			})
			return
		}

		tabs.push({
			title,
			type: code,
			isShow: true,
			img: code
		})
		allGameList.push({
			isAll: false,
			img: item.categoryImg,
			isShow: true,
			gameList: [],
			gameType: code,
			title,
			showTitle: title
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
// NavBar 滑出动画
:deep(.navbar-fixed) {
	transition: transform 0.25s ease;
}

// MenuItem 吸顶时让 NavBar 让位
.navbar-collapsed {
	:deep(.navbar-fixed) {
		transform: translate(-50%, -100%);
	}
}

// IntersectionObserver 哨兵：放在 MenuItem 正上方，1px 高即可，不影响布局
.sticky-sentinel {
	height: 1px;
	width: 100%;
	pointer-events: none;
}

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
	align-items: center;
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
		height: 48px;
	}

	.home_down {
		width: 36px;
		height: 36px;
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
