<template>
	<div class="gameList">
		<van-skeleton :loading="loading">
			<template #template>
				<div class="slidebar_ske">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</template>
			<van-sidebar v-model="active" class="mySideBar" @change="onChange">
				<van-sidebar-item v-for="(item, index) in siderList" :key="index" :id="'gameType-' + item.key">
					<template #title>
						<div :class="{ whiteColor: index === active }" v-if="item.isShow">
							<div :style="{ backgroundImage: `url(${item.img})` }"></div>
							{{ item.title }}
						</div>
					</template>
				</van-sidebar-item>
			</van-sidebar>
		</van-skeleton>

		<!-- 首页右侧游戏渲染组件 -->
		<GameListGrid v-show="siderList[active]" :currentGame="currentGame" ref="gameListGridRef" />
	</div>
</template>

<script setup lang="ts">
import { GetGameCategoryList } from '@/api'
import { computed, nextTick, reactive, ref } from 'vue'
import GameListGrid from './GameListGrid.vue'
// import { onBeforeRouteLeave } from 'vue-router'
import type { HomeGameList } from '@/types/api'
import { AwaitApiResult } from '@/utils'
import { useI18n } from 'vue-i18n'
// import { useHomeStore } from '@/stores'

const { t } = useI18n()

const active = ref(0)

const gameListGridRef = ref()

const loading = ref(false)

const siderList = reactive<any[]>([])

const currentGame = computed(() => {
	return siderList[active.value]?.key ? siderList[active.value]?.key : ''
})

const getGameTypeList = async () => {
	const res = await AwaitApiResult<ObjResNull<HomeGameList[]>>(GetGameCategoryList())
	if (res) {
		res.data.forEach((item) => {
			if (item.state !== 1) return
			siderList.push({
				isShow: item.state === 1,
				title: t('code' + item.typeNameCode),
				img: item.categoryImg,
				key: item.categoryCode.toLocaleLowerCase()
			})
		})
		sessionStorage.setItem('gameMenu', JSON.stringify(siderList))
	}
}

// 点击左侧游戏类型
const onChange = (e: any) => {
	sessionStorage.setItem('clickedGameType', siderList[e].key)
}

const init = async () => {
	loading.value = true
	await getGameTypeList()
	const clickedGameType = sessionStorage.getItem('clickedGameType' || null)
	if (clickedGameType !== null) {
		const index = siderList.findIndex((item) => item.key === clickedGameType)
		if (index >= 0) {
			active.value = index
			nextTick(() => {
				onChange(index)
				const clickedElement = document.getElementById('gameType-' + clickedGameType)
				setTimeout(() => {
					if (clickedElement) {
						clickedElement.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							inline: 'center'
						})
					}
				}, 0)
			})
		}
	}
	loading.value = false
}

init()

defineExpose({
	gameListGridRef
})
</script>

<style lang="scss" scoped>
.gameList {
	display: flex;
	min-height: 1176px;
	margin-top: 30px;
	.whiteColor {
		color: #fff !important;
	}

	.mySideBar {
		flex-shrink: 0;
		flex-grow: 1;

		.van-sidebar-item {
			width: 140px;
			height: 134px;
			margin-bottom: 13px;
			padding: 0;
			font-weight: 500;
			background: url('@/assets/icons/home/gameListIcons/bg.png') no-repeat center center;
			background-size: 100% 100%;

			&--select {
				background-color: unset;
				background: url('@/assets/icons/home/gameListIcons/bgActive.png') no-repeat;
				background-size: 100% 100%;

				&::before {
					display: none;
				}
			}

			.van-badge__wrapper {
				display: block !important;
				& > div {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 26px;
					& > div {
						width: 80px;
						height: 90px;
						background-position: center center;
						background-size: 80px auto;
						background-repeat: no-repeat;
						// img {
						// 	display: block;
						// 	margin: auto;
						// 	width: 100px;
						// 	margin-bottom: -10px;
						// }
					}
				}
			}
		}
	}
}
::v-deep(.van-badge__wrapper) {
	display: block;
}
.slidebar_ske {
	display: flex;
	flex-direction: column;
	div {
		width: 140px;
		height: 134px;
		margin-bottom: 13px;
		padding: 0;
		font-weight: 500;
		background: url('@/assets/icons/home/gameListIcons/bg.png') no-repeat center center;
		background-size: 100% 100%;
	}
}
</style>
