<template>
	<div class="game_menu">
		<van-skeleton :loading="loading">
			<template #template>
				<div class="slidebar_ske">
					<div v-for=" in 8"></div>
				</div>
			</template>
			<div class="game_menu_list">
				<div
					class="gamen_item"
					:class="{ active: currentMenu === item.key }"
					v-for="item in gameMenu"
					:style="{ backgroundImage: `url(${item.img})` }"
					@click="handleChangeMenu(item)"
				>
					<span>{{ item.title }}</span>
				</div>
			</div>
		</van-skeleton>
	</div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { GlobalStore, useHomeStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const globalState = GlobalStore()
const homeStore = useHomeStore()
const { t } = useI18n()

const gameMenu = ref<any[]>([])
const loading = ref(false)
const currentMenu = computed(() => homeStore.currentMenu)
const isShowLoginTip = computed(() => {
	return !globalState.getToken
	// return true
})

const { getGameType, homeState } = useHome()

const getGameTypeList = async () => {
	loading.value = true
	await getGameType()
	homeState.gameTypeList.forEach((item) => {
		if (item.categoryCode === 'BigAward' || item.state !== 1) {
			return
		}
		gameMenu.value.push({
			isShow: item.state === 1,
			title: t('code' + item.typeNameCode),
			img: item.categoryImg,
			key: item.categoryCode.toLocaleLowerCase()
		})
	})
	sessionStorage.setItem('gameMenu', JSON.stringify(gameMenu.value))
	loading.value = false
}

const handleChangeMenu = (item: any) => {
	let loginTipHeight = !isShowLoginTip.value ? 100 : 0
	scrollToPosition(400 - loginTipHeight)

	sessionStorage.setItem('clickedGameType', item.key)
	homeStore.setCurrentMenu(item.key)
	homeStore.setCurrentTitle(item.title)
}

function scrollToPosition(position: number) {
	window.scrollTo({
		top: position,
		behavior: 'smooth' // 平滑滚动
	})
}

onMounted(async () => {
	await getGameTypeList()

	let clickedGameType = sessionStorage.getItem('clickedGameType')
	if (clickedGameType) {
		homeStore.setCurrentMenu(clickedGameType)
		homeStore.setCurrentTitle(gameMenu.value.find((item) => item.key === clickedGameType)?.title)
	} else if (!currentMenu.value) {
		homeStore.setCurrentMenu(gameMenu.value[0].key)
		homeStore.setCurrentTitle(gameMenu.value[0].title)
		loading.value = false
	}
})
</script>
<style lang="scss" scoped>
.game_menu {
	margin-bottom: 30px;
}
.slidebar_ske {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 30px 80px;
	margin: auto;
	div {
		width: 118px;
		height: 144px;
	}
}
::v-deep(.van-skeleton) {
	padding: 0;
}

.game_menu_list {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 30px 80px;
	margin: auto;
	.gamen_item {
		width: 118px;
		height: 144px;
		background-position: center top;
		background-repeat: no-repeat;
		background-size: 100%;
		position: relative;
		span {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			text-align: center;
			color: #707070;
			html:lang(ar) &{
				left: unset;
				right: 0;
			}
		}
	}
	.active {
		span {
			color: #171717;
		}
	}
}
</style>
