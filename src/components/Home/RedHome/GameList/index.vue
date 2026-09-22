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
import { computed, nextTick, reactive, ref } from 'vue'
import GameListGrid from './GameListGrid.vue'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks'

const { t } = useI18n()

const active = ref(0)

const loading = ref(false)

const siderList = reactive<any[]>([])

const currentGame = computed(() => {
	return siderList[active.value]?.key ? siderList[active.value]?.key : ''
})

const {getGameType, homeState} = useHome()

const getGameTypeList = async () => {
	await getGameType()
	if (homeState.gameTypeList.length > 0) {
		homeState.gameTypeList.forEach((item) => {
			if (item.state !== 1 || item.categoryCode ==="BigAward") return
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

</script>

<style lang="scss" scoped>
.gameList {
	display: flex;
	min-height: 1176px;
	margin: 30px 0 40px;
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
			background: url('@icon/home/bg.png') no-repeat center center;
			background-size: 100% 100%;

			&--select {
				background-color: unset;
				background: url('@icon/home/bgActive.png') no-repeat;
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
					color: var(--text_color_L2);
					& > div {
						width: 80px;
						height: 90px;
						background-position: center center;
						background-size: 80px auto;
						background-repeat: no-repeat;
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
