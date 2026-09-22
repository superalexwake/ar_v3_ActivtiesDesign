<template>
	<div class="home_menu">
		<div
			class="menu_item"
			:class="{ active: currentMenu === item.key }"
			v-for="(item, index) in homeMenu"
			:key="item.key"
			@click="handleChangeMenu(item, index)"
		>
			<img :class="item.key" v-lazy="item.img" alt="" />
			<span>{{ item.title }}</span>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { GetGameCategoryList } from '@/api'
import { useHomeStore } from '@/stores'
import type { HomeGameList } from '@/types/api'
import { AwaitApiResult } from '@/utils'
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventBus } from '@/components/common/use'
import { nextTick } from 'vue'

type GameMenu = {
	title: string
	img: string
	key: string
}

const props = withDefaults(
	defineProps<{
		currentMenu: string
		currentTitle: string
	}>(),
	{}
)
const eventBus = useEventBus()
const homeMenu = reactive<GameMenu[]>([])
const emit = defineEmits(['changeMenu', 'update:currentMenu', 'update:currentTitle'])
const { t } = useI18n()
const homeStore = useHomeStore()

const handleChangeMenu = (item: GameMenu, index: number) => {
	emit('update:currentMenu', item.key)
	emit('changeMenu', item.key)
	emit('update:currentTitle', item.title)
	sessionStorage.setItem('currentMenu', item.key)
}

/**
 * @description: 获取游戏大类列表
 * @return {*}
 */
const getGameTypeList = async () => {
	let data = homeStore.getHomeMenu
	if (!data || data.length < 1) {
		const res = await AwaitApiResult<ObjResNull<HomeGameList[]>>(GetGameCategoryList())
		if (res) {
			res.data.forEach((item) => {
				if (item.state !== 1) return
				if (item.categoryCode === 'BigAward') return
				homeMenu.push({
					title: t('code' + item.typeNameCode),
					img: item.categoryImg,
					key: item.categoryCode.toLocaleLowerCase()
				})
			})
		}

		homeStore.setHomeMenu(homeMenu)
	} else {
		homeMenu.push(...data)
	}
	if (props.currentMenu.length < 1) {
		handleChangeMenu(homeMenu[0], 0)
		emit('update:currentMenu', homeMenu[0].key)
		emit('update:currentTitle', homeMenu[0].title)
	}
	if (props.currentMenu && !props.currentTitle) {
		homeMenu.forEach((item) => {
			if (item.key === props.currentMenu) {
				emit('update:currentTitle', item.title)
			}
		})
	}
	eventBus.on('changeMenu', () => {
		nextTick(() => {
			emit('update:currentMenu', 'flash')
			emit('changeMenu', 'flash')
			emit('update:currentTitle', homeMenu.find((item) => item.key === 'flash')?.title)
			sessionStorage.setItem('currentMenu', 'flash')
			window.scrollTo({
				top: 0,
				behavior: 'smooth' // 平滑滚动
			})
		})
	})
}
getGameTypeList()

onMounted(() => {
	eventBus.off('changeMenu')
})
</script>
<style lang="scss" scoped>
.home_menu {
	margin-top: 32px;
	width: 100%;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 20px;
	margin-bottom: 60px;
	.menu_item {
		width: 120px;
		height: 158px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 35px;
		margin: auto;
		img {
			width: 120px;
			height: 120px;
			margin-bottom: 14px;
		}
		.lottery {
			background: linear-gradient(180deg, #8ca5ff 0%, #525cf4 100%);
			border-radius: 50%;
		}
		.slot {
			background: linear-gradient(180deg, #6fa0ff 0%, #7e58f9 100%);
			border-radius: 50%;
		}
		.fish {
			background: linear-gradient(180deg, #bc9aff 0%, #4132f7 100%);
			border-radius: 50%;
		}
		.sport {
			background: linear-gradient(180deg, #71c0ff 0%, #1949ee 100%);
			border-radius: 50%;
		}
		.chess {
			background: linear-gradient(180deg, #72c1ff 0%, #656ff0 100%);
			border-radius: 50%;
		}
		.video {
			background: linear-gradient(180deg, #7be2fa 0%, #1870ef 93.4%);
			border-radius: 50%;
		}
		.flash {
			background: linear-gradient(180deg, #3ed6a6 0%, #4b79fc 100%);
			border-radius: 50%;
		}
		.popular {
			background: linear-gradient(180deg, #ad85ff 0%, #4a82f5 100%);
			border-radius: 50%;
		}
		span {
			color: #333333;
			font-size: 24px;
			line-height: 24px;
			text-align: center;
		}
	}
	.active {
		img {
			background: linear-gradient(118.23deg, #ff8e89 26.37%, #ffc3a2 89.18%) !important;
			border-radius: 16px !important;
		}
		span {
			color: #fe6868;
		}
	}
}
</style>
