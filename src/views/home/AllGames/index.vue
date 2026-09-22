<template>
	<div class="allGames__container">
		<NavBar :title="$t('all')" left-arrow @click-left="onClickLeft" />

		<van-sticky class="alGames__container-sticky">
			<NavTab
				:list="tabGameList"
				v-model:active="active"
				tabClassName="tabs"
				v-slot="{ item, index }"
				activeClassName="tab_active"
				ref="tabRefs"
			>
				<div class="tab_item" v-if="item.isShow" :class="{ tab_active: index === active }">
					<img v-lazy="item.img" />
					<span>{{ item.title }}</span>
				</div>
			</NavTab>
		</van-sticky>

		<div class="allGames__container-list" ref="allGamesContainer">
			<GamesList
				v-if="tabGameList.length > 0"
				:gameType="currentGameList.key"
				:title="currentGameList.title"
				:gameData="gameData[currentGameList.key]"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref,onActivated } from 'vue'
import { useRouter } from 'vue-router'
import GamesList from '@/components/Home/RedHome/AllGames/GameList.vue'
import { computed } from 'vue'
import NavTab from '@/components/FunTab/NavBar.vue'
import { useHome } from '@/hooks'
import { useI18n } from 'vue-i18n'

const { homeState, getGameType, getAllGame } = useHome()
const active = ref(0)
const allGamesContainer = ref<HTMLElement>(null as any)
const tabRefs = ref()

type GameList = {
	isShow: boolean
	title: string
	img: string
	key: string
}[]
const router = useRouter()
const { t } = useI18n()
const tabGameList = ref<GameList>([])
const gameData = ref<any>({})

function onClickLeft(): void {
	router.go(-1)
}



/**
 * @description: 当前游戏列表数据组装
 * @param {*} computed
 * @return {*}
 */
const currentGameList = computed(() => {
	return tabGameList.value[active.value]
})

onMounted(() => {

	init()
})
onActivated(()=>{
	init()
})
// 初始化当前游戏数据
const init = async() => {
	!homeState.gameTypeList.length && await getGameType();
	!homeState.allGameList && await getAllGame();
	tabGameList.value=[]
	homeState.gameTypeList.forEach((item) => {
		if (item.categoryCode === 'BigAward' || item.state !== 1) {
			return
		}
		tabGameList.value.push({
			isShow: item.state === 1,
			title: t('code' + item.typeNameCode),
			img: item.categoryImg,
			key: item.categoryCode.toLocaleLowerCase()
		})
	})
	gameData.value = homeState.allGameList||{};
	gameData.value.popular = [gameData.value?.popular.platformList, gameData.value?.popular.clicksTopList]
	const clickGameType: any = router.currentRoute.value.query.type || '';
	active.value = tabGameList.value.findIndex((item: any) => item.key + '' === clickGameType) || 0
}

</script>

<style>
:root {
	--van-tabs-card-height: auto;
}
</style>

<style lang="scss" scoped>
.allGames__container {
	overflow: hidden;
	.alGames__container-sticky {
		padding: 0 24px;
	}
	:deep(.van-nav-bar) {
		background-color: var(--bg_color_L2);

		.van-nav-bar__content {
			.van-nav-bar__left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}
		}
	}

	.tabs {
		background: transparent;
	}

	.tab_item {
		width: 190px;
		height: 100px;
		margin-inline: 5px;
		padding: 0;
		color: var(--text_color_L2) !important;
		border-radius: 10px;
		background: var(--bg_color_L2);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		img {
			height: 50px;
		}

		span {
			font-size: 24px;
		}
	}

	.tab_active {
		color: var(--text_color_L4)!important;
		background: var(--main_gradient-color);
	}
	::v-deep(.fun-tabs .fun-tab-item) {
		padding: 14px 0;
	}

	&-tabBar {
		padding-inline: 24px;

		:deep(.van-tabs__nav--card) {
			height: 140px;
			margin: 0;

			.van-tab--card {
				width: 190px;
				height: 100px;
				margin-inline: 5px;
				padding: 0;
				color: var(--text_color_L2) !important;
				border-radius: 10px;
				background: var(--bgDark-2, var(--bg_color_L2));
				box-shadow: var(--BoxShadowColor-42);

				& > span {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;

					img {
						width: 50px;
						height: auto;
					}

					span {
						font-size: 24px;
					}
				}

				&.van-tab--active {
					color: var(--textW) !important;
					background: var(--main_gradient-color);
					box-shadow: var(--BoxShadowColor-42);
				}
			}
		}
	}

	&-list {
		height: calc(100vh - 92px - 140px);
		overflow: auto;
	}
}
</style>
